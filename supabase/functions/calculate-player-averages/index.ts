// calculate-player-averages — player_game_logs -> player_period_averages
//
// Replaces nba_queries_scripts/z-score.py. Three changes from that script,
// all load-bearing:
//
//  1. FRESHNESS GUARD. z-score.py recomputed over whatever logs existed, with
//     no staleness check. When the fetch died on 2026-03-11 it kept publishing
//     66-game "season" averages as complete, daily, for a month. This refuses
//     to write when the logs are behind what ESPN reports (assertFresh, in
//     ../_shared/freshness.ts).
//
//  2. ROLLING WINDOWS ANCHOR TO THE SEASON'S LAST GAME DAY, NOT today().
//     Anchoring to today() would produce empty 7/30/60-day windows when
//     recomputing a finished season, zeroing those rows — the same bug in
//     reverse. anchor = min(today, max(game_date) for the season).
//
//  3. STALE-ROW CLEANUP. Upsert only touches rows it writes: a player with
//     games in the PREVIOUS rolling window but none in the current one keeps
//     their old row — old stats, old dates. Verified in production today:
//     this left 242 stale rows behind, 83 of them a non-zero "last 7 days"
//     value from a window that had closed months earlier. After upserting
//     each period, every row for that (season, period_type) whose
//     period_end_date is not the current anchor is deleted. A player with no
//     games in a window ends up with no row for that window.
//
// Mirrors scripts/recompute-averages.ts, which was run against production
// today and verified to reproduce the site's live numbers; this function is
// the scheduled equivalent of that script (same modules: player_period_aggregates
// for aggregation, _shared/zscore.ts for standardisation) so a local run and a
// scheduled run cannot drift apart.
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { STATS_SEASON, REGULAR_SEASON_START, seasonDateRange } from "../_shared/season.ts";
import { type Averages, computeZScores, type PeriodType } from "../_shared/zscore.ts";
import { fetchScoreboard } from "../_shared/espn.ts";
import { addDays, assertFresh } from "../_shared/freshness.ts";

// Re-exported so callers/tests that still want them from this module can get
// them (e.g. `import { assertFresh } from "./index.ts"` per the task brief);
// the canonical definitions live in ../_shared/freshness.ts so they can be
// unit-tested without importing this module and triggering serve().
export { addDays, assertFresh };

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const espnHadGames = async (date: string) =>
  (await fetchScoreboard(date)).length > 0;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json().catch(() => ({}));
  const season: string = body.season ?? STATS_SEASON;

  const { data: runRow } = await supabase
    .from("stats_ingest_runs")
    .insert({ action: "calculate", status: "running" })
    .select("id")
    .single();
  const runId = runRow?.id;

  const finish = async (status: string, rows: number, err?: string) => {
    if (runId) {
      await supabase.from("stats_ingest_runs").update({
        status,
        finished_at: new Date().toISOString(),
        rows_written: rows,
        error: err ?? null,
      }).eq("id", runId);
    }
  };

  try {
    const seasonRange = seasonDateRange(season);
    const today = new Date().toISOString().slice(0, 10);
    if (season === STATS_SEASON && today < REGULAR_SEASON_START) {
      await finish("ok", 0);
      return new Response(JSON.stringify({ ok: true, season, skipped: "Regular season has not started" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: newest, error: nErr } = await supabase
      .from("player_game_logs")
      .select("game_date")
      .eq("season", season)
      .order("game_date", { ascending: false })
      .limit(1)
      .single();
    if (nErr || !newest) throw new Error(`no game logs for ${season}`);

    const newestLog: string = newest.game_date;
    await assertFresh(newestLog, today < seasonRange.end ? today : seasonRange.end, espnHadGames);

    // The anchor for the rolling windows: the season's newest game day, but
    // never later than today. In practice newestLog can never be after
    // today (games are only logged once played), so this is defensive —
    // but it is the rule the brief requires, and matches
    // scripts/recompute-averages.ts exactly.
    const anchor: string = newestLog < today ? newestLog : today;

    const periods: { type: PeriodType; start: string }[] = [
      { type: "season", start: seasonRange.start },
      { type: "60_days", start: addDays(anchor, -60) },
      { type: "30_days", start: addDays(anchor, -30) },
      { type: "7_days", start: addDays(anchor, -7) },
    ];

    const written: Record<string, number> = {};
    const cleared: Record<string, number> = {};

    for (const p of periods) {
      const { data: aggs, error: aErr } = await supabase.rpc(
        "player_period_aggregates",
        { p_season: season, p_start: p.start, p_end: anchor },
      );
      if (aErr) throw new Error(`aggregate ${p.type}: ${aErr.message}`);
      if (!aggs || aggs.length === 0) {
        written[p.type] = 0;
        cleared[p.type] = 0;
        continue;
      }

      const scored = computeZScores(aggs as Averages[], p.type);
      // `id` is omitted deliberately: all four stats tables default it to
      // gen_random_uuid(), and on upsert the existing row keeps its id.
      // `created_at` is omitted too — writing it would reset the original
      // creation time on every recompute. The Python scripts generated UUIDs
      // by hand; that was never necessary.
      // Sorted by name to match the retired pipeline's write order (and
      // scripts/recompute-averages.ts).
      const rows = scored
        .sort((a, b) => a.player_name.localeCompare(b.player_name))
        .map((r) => ({
          ...r,
          season,
          period_type: p.type,
          period_start_date: p.start,
          period_end_date: anchor,
          updated_at: new Date().toISOString(),
        }));

      for (let i = 0; i < rows.length; i += 250) {
        const { error } = await supabase
          .from("player_period_averages")
          .upsert(rows.slice(i, i + 250), {
            onConflict: "player_id,season,period_type",
          });
        if (error) throw new Error(`upsert ${p.type}: ${error.message}`);
      }
      written[p.type] = rows.length;

      // Stale-row cleanup: upsert only touches rows it writes. A player who
      // had games in the PREVIOUS rolling window but none in this one would
      // otherwise keep their old row — old stats, old dates, and for
      // 7_days/30_days/60_days a non-zero fantasy value from a window that
      // already closed. A player with no games in the window must end up
      // with NO row for that window.
      const { data: deleted, error: dErr } = await supabase
        .from("player_period_averages")
        .delete()
        .eq("season", season)
        .eq("period_type", p.type)
        .neq("period_end_date", anchor)
        .select("id");
      if (dErr) throw new Error(`stale cleanup ${p.type}: ${dErr.message}`);
      cleared[p.type] = deleted?.length ?? 0;
    }

    const total = Object.values(written).reduce((a, b) => a + b, 0);
    await finish("ok", total);

    return new Response(
      JSON.stringify({ ok: true, periods: written, cleared, anchor }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = String(e);
    console.error("[calculate-player-averages]", msg);
    await finish("failed", 0, msg);
    // Non-2xx on purpose: the old pipeline exited 0 on failure and nobody
    // noticed for a month.
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

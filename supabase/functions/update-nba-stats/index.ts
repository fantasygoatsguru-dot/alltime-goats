// update-nba-stats — orchestrator. This is what pg_cron calls.
//
// Returns non-2xx if any stage fails, so a failed cron run is visible in the
// pg_cron history and in stats_ingest_runs rather than silently green.
//
// FAILURE ALERTING BY EMAIL. The pipeline this replaces called bare exit()
// with status 0 on failure, so a fetch outage looked green in CI and ran for
// five weeks while the site served truncated season averages to users. A row
// in stats_ingest_runs that nobody opens is barely better than that — a
// human must be told. On any failure of the daily run (a stage returning
// non-2xx/ok:false, or an unexpected throw), this sends one alert email via
// Resend, using the exact call shape already in use by
// yesterday-top-performers/index.ts. The freshness guard tripping inside
// calculate-player-averages is not a crash — it's the system correctly
// refusing to publish over stale data — but it still means the site is
// going stale, so it also alerts, with a distinguishing subject line.
// A Resend outage must never mask a pipeline outage: the send is wrapped in
// its own try/catch and the original non-2xx response is always returned.
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { STATS_SEASON } from "../_shared/season.ts";
import { type Averages, computeZScores } from "../_shared/zscore.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_SENDER_EMAIL = Deno.env.get("RESEND_SENDER_EMAIL")!;
// A missing ALERT_EMAIL secret must not silently disable alerting, so fall
// back to the sender address rather than leaving `to` undefined.
const ALERT_EMAIL = Deno.env.get("ALERT_EMAIL") || RESEND_SENDER_EMAIL;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends the one alert email for a failed daily run. Never throws: a Resend
 * outage must not swallow the pipeline failure it's reporting, so every
 * failure mode here is caught and logged, not propagated.
 */
async function sendAlert(opts: {
  stage: string;
  message: string;
  season: string;
  isFreshnessBlock: boolean;
}) {
  const { stage, message, season, isFreshnessBlock } = opts;
  const timestamp = new Date().toISOString();

  const subject = isFreshnessBlock
    ? `[Fantasy Goats Guru] Stats pipeline BLOCKED — stale data guard tripped (${season})`
    : `[Fantasy Goats Guru] Stats pipeline FAILED — ${stage} (${season})`;

  const html = `
    <h2>${
    isFreshnessBlock
      ? "Stats pipeline blocked by freshness guard"
      : "Stats pipeline run failed"
  }</h2>
    <p><strong>Stage:</strong> ${escapeHtml(stage)}</p>
    <p><strong>Season:</strong> ${escapeHtml(season)}</p>
    <p><strong>UTC time:</strong> ${escapeHtml(timestamp)}</p>
    <p><strong>Error:</strong></p>
    <pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;">${
    escapeHtml(message)
  }</pre>
    ${
    isFreshnessBlock
      ? "<p>This is not a crash: update-nba-stats correctly refused to publish over stale data. The site's averages will keep going stale until this is resolved — check the ESPN fetch and consider running retrieve-nba-stats manually.</p>"
      : "<p>An unexpected failure occurred during the daily run. Check stats_ingest_runs and the function logs for detail.</p>"
  }
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Fantasy Goats Guru <${RESEND_SENDER_EMAIL}>`,
        to: [ALERT_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(
        "[update-nba-stats] alert email failed:",
        await res.text().catch(() => ""),
      );
    }
  } catch (e) {
    console.error("[update-nba-stats] alert email error:", String(e));
  }
}

async function invoke(fn: string, payload: unknown) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.ok === false) {
    throw new Error(`${fn} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

/**
 * Copies a completed season into the all-time tables.
 *
 * NOT a straight copy of player_period_averages: alltime_player_season_averages
 * is unique on (player_id, season, team_abbreviation) and stores per-team splits
 * for traded players, whereas player_period_averages holds one row per player on
 * their primary team. So the averages are re-aggregated grouped by team.
 *
 * Replaces alltime_migration_script.py, which read a local SQLite file at a
 * hardcoded path and could never run as a scheduled job.
 */
async function promoteSeason(season: string) {
  // 1. Game logs copy across directly.
  let offset = 0;
  const PAGE = 1000;
  let logRows = 0;
  while (true) {
    const { data, error } = await supabase
      .from("player_game_logs")
      .select("*")
      .eq("season", season)
      .range(offset, offset + PAGE - 1);
    if (error) throw new Error(`read logs: ${error.message}`);
    if (!data || data.length === 0) break;

    const rows = data.map(
      ({ id: _id, created_at: _c, updated_at: _u, ...r }) => r,
    );
    const { error: uErr } = await supabase
      .from("alltime_player_game_logs")
      .upsert(rows, { onConflict: "player_id,game_date,season" });
    if (uErr) throw new Error(`write alltime logs: ${uErr.message}`);

    logRows += rows.length;
    if (data.length < PAGE) break;
    offset += PAGE;
  }

  // 2. Season averages, re-aggregated per (player, team).
  const { data: aggs, error: aErr } = await supabase.rpc(
    "alltime_season_aggregates",
    { p_season: season },
  );
  if (aErr) throw new Error(`alltime aggregates: ${aErr.message}`);

  // z-scores are computed across the whole season cohort, as for any season.
  const scored = computeZScores((aggs ?? []) as Averages[], "season");
  // `id` and `created_at` omitted — see the note in calculate-player-averages.
  const avgRows = scored.map((r) => ({
    ...r,
    season,
    updated_at: new Date().toISOString(),
  }));

  for (let i = 0; i < avgRows.length; i += 250) {
    const { error } = await supabase
      .from("alltime_player_season_averages")
      .upsert(avgRows.slice(i, i + 250), {
        onConflict: "player_id,season,team_abbreviation",
      });
    if (error) throw new Error(`write alltime averages: ${error.message}`);
  }

  return { logRows, averageRows: avgRows.length };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "daily";
  const season: string = body.season ?? STATS_SEASON;

  if (action === "promote-season") {
    // Manual, human-triggered action — not the daily cron this alerting
    // exists to catch. Failures still return non-2xx so the caller sees
    // them directly; no alert email is sent for this path.
    try {
      const result = await promoteSeason(season);
      return new Response(JSON.stringify({ ok: true, season, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      const msg = String(e);
      console.error("[update-nba-stats] promote-season failed", msg);
      return new Response(JSON.stringify({ ok: false, error: msg }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // Daily cron path. Track which stage we're in so a failure can be
  // attributed correctly in both the response and the alert email.
  let stage = "retrieve-nba-stats";
  try {
    const retrieved = await invoke("retrieve-nba-stats", {
      action: "daily",
      season,
    });

    stage = "calculate-player-averages";
    const calculated = await invoke("calculate-player-averages", { season });

    return new Response(
      JSON.stringify({ ok: true, retrieved, calculated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = String(e);
    console.error("[update-nba-stats]", stage, msg);

    // The freshness guard in calculate-player-averages throws with this
    // exact prefix (../_shared/freshness.ts assertFresh) — not a crash, but
    // the site is going stale, so it gets its own subject line.
    const isFreshnessBlock = stage === "calculate-player-averages" &&
      /Refusing to publish/i.test(msg);

    await sendAlert({ stage, message: msg, season, isFreshnessBlock });

    return new Response(JSON.stringify({ ok: false, stage, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

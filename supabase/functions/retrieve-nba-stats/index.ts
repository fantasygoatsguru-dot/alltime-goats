// retrieve-nba-stats — ESPN -> player_game_logs
//
// Replaces nba_queries_scripts/main.py and backfill.py. Two behaviours:
//   { action: 'daily' }                  reconcile the last LOOKBACK_DAYS days
//   { action: 'backfill', from, to }     reconcile an explicit range
//
// Reconciliation, not "yesterday only": each run asks ESPN what games happened
// and fetches whatever the DB is missing, so a one-day outage self-heals.
//
// Name resolution is delegated to _shared/player-ids.ts (loadNameIndex /
// idx.resolve), NOT reimplemented here. That module is the one proven against
// production (scripts/backfill-season.ts: 5,922 rows, 4,944 names indexed, 35
// genuinely ambiguous names correctly rejected). A plain
// `player_name.toLowerCase()` compare silently drops every player whose NBA
// spelling carries a diacritic (Jokic, Doncic, Schroder, ...) — do not
// reintroduce that.
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { STATS_SEASON, seasonDateRange } from "../_shared/season.ts";
import {
  fetchBoxScore,
  fetchScoreboard,
  parseBoxScore,
  type RawLine,
} from "../_shared/espn.ts";
import {
  loadNameIndex,
  type NameIndex,
  type SupabaseLike,
} from "../_shared/player-ids.ts";

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

const LOOKBACK_DAYS = 10;
// One week per invocation keeps JSON parsing inside the 2s CPU budget.
const MAX_DAYS_PER_RUN = 7;

interface UnmappedEntry {
  name: string;
  espnAthleteId: number;
  date: string;
}

interface TeamMismatchEntry {
  name: string;
  playerId: number;
  espnTeam: string;
  knownTeams: string[];
  date: string;
}

function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  const d = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

// SupabaseLike (_shared/player-ids.ts) is a minimal hand-written interface,
// intentionally shaped after only how loadNameIndex actually chains calls:
// `.from(t).select(c)[.eq(...)].range(a, b)`. The real supabase-js client
// type is far richer and, because SupabaseQueryBuilder references itself
// recursively, structural comparison demands `eq`/`range` exist directly on
// `.from()`'s return too — which real supabase-js reserves for the builder
// returned by `.select()`. Runtime behaviour is unaffected (loadNameIndex
// never calls `.eq()`/`.range()` before `.select()`); this is a single,
// documented boundary cast, not a behavioural change.
// deno-lint-ignore no-explicit-any
function asNameIndexClient(sb: { from(table: string): any }): SupabaseLike {
  return {
    from: (table: string) =>
      sb.from(table) as unknown as ReturnType<SupabaseLike["from"]>,
  };
}

/** Distinct matchup strings already stored for a date; 2 per game. */
async function storedGameCount(
  season: string,
  dateStr: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("player_game_logs")
    .select("opponent")
    .eq("season", season)
    .eq("game_date", dateStr);
  if (error) throw new Error(`existing read failed: ${error.message}`);
  return new Set((data ?? []).map((r) => r.opponent)).size / 2;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "daily";
  const season: string = body.season ?? STATS_SEASON;

  const { data: runRow } = await supabase
    .from("stats_ingest_runs")
    .insert({ action: `retrieve:${action}`, status: "running" })
    .select("id")
    .single();
  const runId = runRow?.id;

  const finish = async (
    status: string,
    rows: number,
    dates: string[],
    unmapped: UnmappedEntry[],
    teamMismatches: TeamMismatchEntry[],
    error?: string,
  ) => {
    if (runId) {
      await supabase.from("stats_ingest_runs").update({
        status,
        finished_at: new Date().toISOString(),
        rows_written: rows,
        dates_covered: dates,
        // unmapped_players is jsonb with no fixed shape beyond "diagnostics
        // for this run" — team mismatches ride along here too since the
        // migration (Task 3, already applied) has no dedicated column for
        // them. Never guessed, never dropped silently.
        unmapped_players: { unmapped, teamMismatches },
        error: error ?? null,
      }).eq("id", runId);
    }
  };

  try {
    let dates: string[];
    if (action === "backfill") {
      if (!body.from || !body.to) {
        throw new Error("backfill requires 'from' and 'to' (YYYY-MM-DD)");
      }
      dates = dateRange(body.from, body.to);
      if (dates.length > MAX_DAYS_PER_RUN) {
        throw new Error(
          `range is ${dates.length} days; max ${MAX_DAYS_PER_RUN} per run ` +
            `(CPU budget). Split it.`,
        );
      }
    } else {
      const today = new Date();
      const from = new Date(today);
      from.setUTCDate(from.getUTCDate() - LOOKBACK_DAYS);
      dates = dateRange(
        from.toISOString().slice(0, 10),
        today.toISOString().slice(0, 10),
      );
    }

    const seasonRange = seasonDateRange(season);
    dates = dates.filter(date => date >= seasonRange.start && date <= seasonRange.end);

    const idx: NameIndex = await loadNameIndex(
      asNameIndexClient(supabase),
      season,
    );
    const unmapped: UnmappedEntry[] = [];
    const teamMismatches: TeamMismatchEntry[] = [];
    const touched: string[] = [];
    let written = 0;

    for (const dateStr of dates) {
      const games = await fetchScoreboard(dateStr);
      if (games.length === 0) continue;

      const stored = await storedGameCount(season, dateStr);
      if (stored >= games.length) continue; // already complete

      const rows: Record<string, unknown>[] = [];
      for (const g of games) {
        const summary = await fetchBoxScore(g.id);
        const lines: RawLine[] = parseBoxScore(summary, g.homeAbbr, g.awayAbbr);

        for (const l of lines) {
          const nbaId = idx.resolve(l.espnAthleteId, l.playerName);
          if (nbaId === undefined) {
            // Never invent an id: player_id is the join key to 65 seasons of
            // alltime_player_info. Report and skip.
            unmapped.push({
              name: l.playerName,
              espnAthleteId: l.espnAthleteId,
              date: dateStr,
            });
            continue;
          }

          // Team cross-check: a non-empty known-team set that does not
          // contain this row's team is normally a legitimate trade/buyout
          // (e.g. Ivica Zubac LAC -> IND at the deadline) — report it but
          // still write the row. An EMPTY known-team set means "nothing to
          // check" (tier 2/3 player, no team history this season), not a
          // mismatch.
          const known = idx.teams.get(nbaId);
          if (known && known.size > 0 && !known.has(l.teamAbbreviation)) {
            teamMismatches.push({
              name: l.playerName,
              playerId: nbaId,
              espnTeam: l.teamAbbreviation,
              knownTeams: [...known],
              date: dateStr,
            });
          }

          rows.push({
            season,
            player_id: nbaId,
            player_name: l.playerName,
            game_date: dateStr,
            team_abbreviation: l.teamAbbreviation,
            opponent: l.opponent,
            points: l.points,
            rebounds: l.rebounds,
            assists: l.assists,
            field_goals_attempted: l.fieldGoalsAttempted,
            field_goals_made: l.fieldGoalsMade,
            free_throws_attempted: l.freeThrowsAttempted,
            free_throws_made: l.freeThrowsMade,
            three_pointers_made: l.threePointersMade,
            blocks: l.blocks,
            turnovers: l.turnovers,
            steals: l.steals,
            minutes: l.minutes,
            fantasy_points: l.fantasyPoints,
          });
        }
      }

      if (rows.length > 0) {
        // Sorted by name to match the retired pipeline's write order (and
        // scripts/backfill-season.ts, which this mirrors).
        rows.sort((a, b) =>
          String(a.player_name).localeCompare(String(b.player_name))
        );
        const { error } = await supabase
          .from("player_game_logs")
          .upsert(rows, { onConflict: "player_id,game_date,season" });
        if (error) throw new Error(`upsert ${dateStr}: ${error.message}`);
        written += rows.length;
        touched.push(dateStr);
      }
    }

    await finish("ok", written, touched, unmapped, teamMismatches);

    return new Response(
      JSON.stringify({
        ok: true,
        rowsWritten: written,
        datesCovered: touched,
        unmapped,
        teamMismatches,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = String(e);
    console.error("[retrieve-nba-stats]", msg);
    await finish("failed", 0, [], [], [], msg);
    // Non-2xx on purpose: the old pipeline exited 0 on failure and nobody
    // noticed for a month.
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

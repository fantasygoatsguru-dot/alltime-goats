#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env
/**
 * Recomputes player_period_averages (season + rolling windows + z-scores) for a
 * season, from the game logs currently in the database.
 *
 * Aggregation happens in SQL (player_period_aggregates), standardisation in TS
 * (_shared/zscore.ts) — the same split the calculate-player-averages edge
 * function will use, and deliberately the same modules, so a local run and a
 * scheduled run cannot drift apart.
 *
 * ROLLING WINDOWS ANCHOR TO THE SEASON'S LAST GAME, NOT today(). The retired
 * z-score.py anchored to utcnow(); running that today, five months after the
 * season ended, would compute 7/30/60-day windows containing no games at all
 * and zero out those rows.
 *
 * Usage (dry run is the default — it never writes):
 *   deno run --allow-net --allow-read --allow-env scripts/recompute-averages.ts \
 *     --season 2025-26
 *   ...plus --commit  to actually upsert
 */
import { STATS_SEASON, seasonDateRange } from "../supabase/functions/_shared/season.ts";
import {
  type Averages,
  computeZScores,
  type PeriodType,
} from "../supabase/functions/_shared/zscore.ts";

const args = Deno.args;
const argOf = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? undefined : args[i + 1];
};
const SEASON = argOf("season") ?? STATS_SEASON;
const SEASON_START = argOf("season-start") ?? seasonDateRange(SEASON).start;
const COMMIT = args.includes("--commit");

const URL_ = Deno.env.get("VITE_SUPABASE_URL");
const KEY = Deno.env.get("SERVICE_ROLE_KEY");
if (!URL_ || !KEY) {
  console.error("Missing VITE_SUPABASE_URL / SERVICE_ROLE_KEY (set -a; . ./.env)");
  Deno.exit(2);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

function addDays(d: string, n: number): string {
  const x = new Date(`${d}T00:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
}

async function aggregates(
  season: string,
  start: string,
  end: string,
): Promise<Averages[]> {
  const res = await fetch(`${URL_}/rest/v1/rpc/player_period_aggregates`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({ p_season: season, p_start: start, p_end: end }),
  });
  if (!res.ok) throw new Error(`rpc: HTTP ${res.status} ${await res.text()}`);
  return await res.json();
}

// The anchor: the season's newest game day. For a live season this is
// effectively today; for a finished one it pins the rolling windows to the end
// of that season instead of to an empty present.
const lastRes = await fetch(
  `${URL_}/rest/v1/player_game_logs?season=eq.${SEASON}` +
    `&select=game_date&order=game_date.desc&limit=1`,
  { headers: H },
);
const anchor: string = (await lastRes.json())[0]?.game_date;
if (!anchor) throw new Error(`no game logs for ${SEASON}`);
const today = new Date().toISOString().slice(0, 10);
const effective = anchor < today ? anchor : today;

console.log(`${COMMIT ? "COMMIT" : "DRY RUN"}  season=${SEASON}`);
console.log(`anchor (season's last game day) = ${effective}`);
if (!COMMIT) console.log("(no writes; pass --commit to write)");
console.log();

const periods: { type: PeriodType; start: string }[] = [
  { type: "season", start: SEASON_START },
  { type: "60_days", start: addDays(effective, -60) },
  { type: "30_days", start: addDays(effective, -30) },
  { type: "7_days", start: addDays(effective, -7) },
];

for (const p of periods) {
  const aggs = await aggregates(SEASON, p.start, effective);
  if (aggs.length === 0) {
    console.log(`${p.type.padEnd(9)} ${p.start} -> ${effective}   NO DATA`);
    continue;
  }
  const scored = computeZScores(aggs, p.type);
  const qualified = scored.filter((r) => r.total_value !== 0);
  const top = [...qualified].sort((a, b) => b.total_value - a.total_value)[0];

  console.log(
    `${p.type.padEnd(9)} ${p.start} -> ${effective}  ` +
      `${String(scored.length).padStart(3)} players, ` +
      `${String(qualified.length).padStart(3)} qualified, ` +
      `maxGP ${String(Math.max(...aggs.map((a) => a.games_played))).padStart(2)}` +
      (top ? `  top: ${top.player_name} (${top.total_value})` : ""),
  );

  if (COMMIT) {
    // Sorted by name to match the retired pipeline's write order.
    // `id` and `created_at` are omitted deliberately: both default in Postgres,
    // and writing created_at would reset it on every recompute.
    const rows = scored
      .sort((a, b) => a.player_name.localeCompare(b.player_name))
      .map((r) => ({
        ...r,
        season: SEASON,
        period_type: p.type,
        period_start_date: p.start,
        period_end_date: effective,
        updated_at: new Date().toISOString(),
      }));

    for (let i = 0; i < rows.length; i += 250) {
      const res = await fetch(
        `${URL_}/rest/v1/player_period_averages` +
          `?on_conflict=player_id,season,period_type`,
        {
          method: "POST",
          headers: {
            ...H,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(rows.slice(i, i + 250)),
        },
      );
      if (!res.ok) {
        throw new Error(`upsert ${p.type}: HTTP ${res.status} ${await res.text()}`);
      }
    }

    // Clear stale rows. Upsert only touches rows it writes, so a player who had
    // games in the PREVIOUS rolling window but none in this one keeps their old
    // row untouched — old stats, old dates. The retired z-score.py had this flaw
    // too: it left 242 rows behind, 83 of them showing a non-zero "last 7 days"
    // value from a window that had ended weeks earlier. A player with no games
    // in the window must have no row for that window.
    const del = await fetch(
      `${URL_}/rest/v1/player_period_averages` +
        `?season=eq.${SEASON}&period_type=eq.${p.type}` +
        `&period_end_date=neq.${effective}`,
      { method: "DELETE", headers: { ...H, Prefer: "return=representation" } },
    );
    if (!del.ok) {
      throw new Error(`stale cleanup ${p.type}: HTTP ${del.status} ${await del.text()}`);
    }
    const removed = (await del.json()).length;
    if (removed > 0) console.log(`${" ".repeat(10)}cleared ${removed} stale rows`);
  }
}

console.log(`\n${COMMIT ? "Written." : "Dry run complete — nothing written."}`);

#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env
/**
 * One-off repair of missing player_game_logs.
 *
 * Why this is a local script and not an edge function: ESPN's Akamai returns 403
 * to Supabase's edge IPs for site.api.espn.com (verified 2026-09-04, and a
 * browser User-Agent makes no difference, so the block is IP-based). The same
 * host answers normally from a developer machine. This job runs once against a
 * finished season, so it has no business living in production infrastructure.
 *
 * Reads the name -> NBA player_id map out of the rows already stored for the
 * season, because player_id must stay an NBA.com id: it is the join key to
 * alltime_player_info, which holds 65 seasons of history. An ESPN athlete with
 * no match is REPORTED, never guessed.
 *
 * Usage (dry run is the default — it never writes):
 *   deno run --allow-net --allow-read --allow-env scripts/backfill-season.ts \
 *     --from 2026-03-11 --to 2026-04-12
 *
 *   ...same, plus --commit    to actually upsert
 */
import { STATS_SEASON, seasonDateRange } from "../supabase/functions/_shared/season.ts";
import {
  fetchBoxScore,
  fetchScoreboard,
  parseBoxScore,
} from "../supabase/functions/_shared/espn.ts";

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const args = Deno.args;
const argOf = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

const FROM = argOf("from");
const TO = argOf("to");
const SEASON = argOf("season") ?? STATS_SEASON;
const COMMIT = args.includes("--commit");
const seasonRange = seasonDateRange(SEASON);
if (FROM && TO && (FROM < seasonRange.start || TO > seasonRange.end || FROM > TO)) {
  throw new Error(`Backfill dates must fall within ${SEASON}; pass --season explicitly for historical data`);
}

if (!FROM || !TO) {
  console.error(
    "usage: backfill-season.ts --from YYYY-MM-DD --to YYYY-MM-DD " +
      "[--season YYYY-YY] [--commit]",
  );
  Deno.exit(2);
}

// ---------------------------------------------------------------------------
// Supabase (PostgREST directly — no client library needed for two calls)
// ---------------------------------------------------------------------------
const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing VITE_SUPABASE_URL or SERVICE_ROLE_KEY. Run with:\n" +
      "  set -a; . ./.env; set +a",
  );
  Deno.exit(2);
}

const rest = (path: string) => `${SUPABASE_URL}/rest/v1/${path}`;
const authHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

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

/**
 * Canonical form for name matching.
 *
 * The database stores NBA's spellings, which carry diacritics ("Nikola Jokić",
 * "Luka Dončić", "Dennis Schröder"); ESPN sends ASCII ("Nikola Jokic"). A naive
 * lowercase compare therefore fails to match some of the most valuable players
 * in the league — the first dry run left 48 players unmatched, Jokić and Dončić
 * among them. Also folds punctuation, since "P.J. Tucker"/"PJ Tucker" and
 * "Jaren Jackson Jr."/"Jaren Jackson Jr" differ only there.
 */
function foldName(name: string): string {
  return name
    .normalize("NFD") // split accented chars into base + combining mark
    .replace(/[̀-ͯ]/g, "") // drop the combining marks
    .toLowerCase()
    .replace(/[.'’`-]/g, "") // punctuation that varies between sources
    .replace(/\s+/g, " ")
    .trim();
}

interface NameIndex {
  /** folded name -> NBA player_id (only where unambiguous) */
  byName: Map<string, number>;
  /** folded names that map to more than one player_id — never auto-matched */
  ambiguous: Set<string>;
  /** player_id -> teams they already appear with this season */
  teams: Map<number, Set<string>>;
  /** player_id -> stored spelling, for reporting */
  spelling: Map<number, string>;
}

/**
 * Builds the name index from rows already stored for the season.
 *
 * Name is the only join available: ESPN publishes its own athlete ids, while
 * player_id here must stay an NBA.com id (it is the key into
 * alltime_player_info's 65 seasons). So the matching has to be defensive:
 *   - a folded name owned by two different player_ids is marked ambiguous and
 *     never auto-matched, because picking either one would silently attribute
 *     one player's stats to another;
 *   - the caller additionally checks the team, which catches the case of a
 *     genuinely new player whose name happens to fold onto an existing one.
 */
async function loadNameIndex(season: string): Promise<NameIndex> {
  const byName = new Map<string, number>();
  const ambiguous = new Set<string>();
  const teams = new Map<number, Set<string>>();
  const spelling = new Map<number, string>();

  const PAGE = 1000;
  let offset = 0;
  while (true) {
    const res = await fetch(
      rest(
        `player_game_logs?season=eq.${season}` +
          `&select=player_id,player_name,team_abbreviation` +
          `&limit=${PAGE}&offset=${offset}`,
      ),
      { headers: authHeaders },
    );
    if (!res.ok) throw new Error(`name map: HTTP ${res.status} ${await res.text()}`);
    const rows = (await res.json()) as {
      player_id: number;
      player_name: string;
      team_abbreviation: string;
    }[];
    if (rows.length === 0) break;

    for (const r of rows) {
      const key = foldName(r.player_name);
      const seen = byName.get(key);
      if (seen !== undefined && seen !== r.player_id) ambiguous.add(key);
      byName.set(key, r.player_id);
      spelling.set(r.player_id, r.player_name);
      if (!teams.has(r.player_id)) teams.set(r.player_id, new Set());
      teams.get(r.player_id)!.add(r.team_abbreviation);
    }
    if (rows.length < PAGE) break;
    offset += PAGE;
  }

  for (const key of ambiguous) byName.delete(key);

  // ---- Tier 2: alltime_player_info -------------------------------------
  // Players whose first appearance of the season falls inside the missing
  // window (returning from injury, buyout signings, 10-day deals) are absent
  // from tier 1 by definition. Most are established players with an NBA id
  // already on record — Max Strus, Taj Gibson, Markelle Fultz, Omer Yurtseven.
  //
  // This table spans 65 seasons, so same-name collisions are far likelier here
  // than within one season. Any folded name owned by more than one player_id is
  // dropped, not resolved by guessing at the most recent one.
  const histSeen = new Map<string, Set<number>>();
  const histName = new Map<string, string>();
  let offset2 = 0;
  while (true) {
    const res = await fetch(
      rest(
        `alltime_player_info?select=player_id,player_name` +
          `&limit=${PAGE}&offset=${offset2}`,
      ),
      { headers: authHeaders },
    );
    if (!res.ok) throw new Error(`alltime info: HTTP ${res.status}`);
    const rows = (await res.json()) as
      { player_id: number; player_name: string }[];
    if (rows.length === 0) break;
    for (const r of rows) {
      const key = foldName(r.player_name);
      if (!histSeen.has(key)) histSeen.set(key, new Set());
      histSeen.get(key)!.add(r.player_id);
      histName.set(key, r.player_name);
    }
    if (rows.length < PAGE) break;
    offset2 += PAGE;
  }

  let tier2 = 0, tier2Ambiguous = 0;
  for (const [key, ids] of histSeen) {
    if (byName.has(key) || ambiguous.has(key)) continue; // tier 1 wins
    if (ids.size > 1) {
      ambiguous.add(key);
      tier2Ambiguous++;
      continue;
    }
    const id = [...ids][0];
    byName.set(key, id);
    spelling.set(id, histName.get(key)!);
    // No team history for these — the team guard is skipped, which is correct:
    // a returning or newly-signed player's team is new by definition.
    if (!teams.has(id)) teams.set(id, new Set());
    tier2++;
  }
  console.log(
    `  tier 2 (alltime_player_info): +${tier2} names, ` +
      `${tier2Ambiguous} rejected as ambiguous`,
  );

  // ---- Tier 3: explicit overrides --------------------------------------
  // Resolved from nba_api's bundled offline static player list (no network
  // call to the blocked stats.nba.com). Only players absent from both tiers
  // above and confirmed one-to-one by full name.
  const OVERRIDES: Record<string, number> = {
    "alex antetokounmpo": 1630828,
    "cj huntley": 1643047,
  };
  for (const [key, id] of Object.entries(OVERRIDES)) {
    if (byName.has(key) || ambiguous.has(key)) continue;
    byName.set(key, id);
    if (!teams.has(id)) teams.set(id, new Set());
  }

  return { byName, ambiguous, teams, spelling };
}

/** Distinct matchup strings already stored for a date; 2 per game. */
async function storedGameCount(
  season: string,
  date: string,
): Promise<number> {
  const res = await fetch(
    rest(
      `player_game_logs?season=eq.${season}&game_date=eq.${date}&select=opponent`,
    ),
    { headers: authHeaders },
  );
  if (!res.ok) throw new Error(`existing: HTTP ${res.status} ${await res.text()}`);
  const rows = (await res.json()) as { opponent: string }[];
  return new Set(rows.map((r) => r.opponent)).size / 2;
}

async function upsert(rows: Record<string, unknown>[]): Promise<void> {
  const res = await fetch(
    rest("player_game_logs?on_conflict=player_id,game_date,season"),
    {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) throw new Error(`upsert: HTTP ${res.status} ${await res.text()}`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log(
  `${COMMIT ? "COMMIT" : "DRY RUN"}  season=${SEASON}  ${FROM} -> ${TO}`,
);
if (!COMMIT) console.log("(no writes will be made; pass --commit to write)\n");

const idx = await loadNameIndex(SEASON);
console.log(
  `name index: ${idx.byName.size} unambiguous names, ` +
    `${idx.ambiguous.size} ambiguous (excluded), for ${SEASON}\n`,
);
if (idx.ambiguous.size > 0) {
  console.log("AMBIGUOUS NAMES (two player_ids share one name — never matched):");
  for (const a of idx.ambiguous) console.log(`  ${a}`);
  console.log();
}

const dates = dateRange(FROM, TO);
const unmapped = new Map<string, { espnId: number; dates: Set<string> }>();
/** Matched by name, but the team is one the player has not appeared for. */
const teamMismatch: {
  name: string;
  playerId: number;
  espnTeam: string;
  knownTeams: string[];
  date: string;
}[] = [];
let totalRows = 0;
let totalGames = 0;
const perDate: { date: string; games: number; rows: number; skipped: number }[] = [];

for (const date of dates) {
  const games = await fetchScoreboard(date);
  if (games.length === 0) continue;

  const already = await storedGameCount(SEASON, date);
  if (already >= games.length) {
    console.log(`${date}  ${games.length} games — already complete, skipping`);
    continue;
  }

  const rows: Record<string, unknown>[] = [];
  let skipped = 0;

  for (const g of games) {
    const lines = parseBoxScore(await fetchBoxScore(g.id), g.homeAbbr, g.awayAbbr);
    for (const l of lines) {
      const nbaId = idx.byName.get(foldName(l.playerName));
      if (!nbaId) {
        skipped++;
        const e = unmapped.get(l.playerName) ??
          { espnId: l.espnAthleteId, dates: new Set<string>() };
        e.dates.add(date);
        unmapped.set(l.playerName, e);
        continue;
      }
      // Guard against a new player whose name folds onto an existing one:
      // if the team is not one this player_id has appeared for, the match is
      // suspect. Legitimate for a buyout signing or late trade, so it is
      // reported for review rather than silently dropped or silently kept.
      const known = idx.teams.get(nbaId)!;
      // A tier-2/3 player has no team history this season, so there is nothing
      // to check — absence of evidence, not a mismatch. Only compare when we
      // actually know where this player_id has played.
      if (known.size > 0 && !known.has(l.teamAbbreviation)) {
        teamMismatch.push({
          name: l.playerName,
          playerId: nbaId,
          espnTeam: l.teamAbbreviation,
          knownTeams: [...known],
          date,
        });
      }
      rows.push({
        season: SEASON,
        player_id: nbaId,
        player_name: l.playerName,
        game_date: date,
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

  // Flush per date so an interrupted run leaves a usable record of how far it
  // got — a 165-day scan that buffers everything and dies tells you nothing.
  if (!COMMIT) {
    try {
      Deno.writeTextFileSync(
        "/tmp/backfill-progress.txt",
        `${date} ${rows.length}\n`,
        { append: true },
      );
    } catch { /* progress file is best-effort */ }
  }

  if (COMMIT && rows.length > 0) {
    // Sorted by name to match the retired pipeline's write order.
    rows.sort((a, b) =>
      String(a.player_name).localeCompare(String(b.player_name))
    );
    for (let i = 0; i < rows.length; i += 500) {
      await upsert(rows.slice(i, i + 500));
    }
  }

  totalRows += rows.length;
  totalGames += games.length;
  perDate.push({ date, games: games.length, rows: rows.length, skipped });
  console.log(
    `${date}  ${String(games.length).padStart(2)} games  ` +
      `${String(rows.length).padStart(4)} rows` +
      (skipped ? `  (${skipped} unmapped, skipped)` : ""),
  );
}

console.log(`\n${"=".repeat(62)}`);
console.log(`dates with new data : ${perDate.length}`);
console.log(`games               : ${totalGames}`);
console.log(`rows ${COMMIT ? "written" : "that WOULD be written"} : ${totalRows}`);

if (unmapped.size > 0) {
  console.log(`\nUNMAPPED PLAYERS (${unmapped.size}) — skipped, never guessed:`);
  for (const [name, e] of [...unmapped].sort()) {
    console.log(
      `  ${name.padEnd(28)} espnId=${e.espnId}  ${e.dates.size} game(s)`,
    );
  }
  console.log(
    "\nResolve each to its NBA player_id, add it to nba_player_id_map " +
      "(or to player_game_logs), then re-run.",
  );
} else {
  console.log("\nUNMAPPED PLAYERS: none — every athlete resolved to an NBA id.");
}

if (teamMismatch.length > 0) {
  const byPlayer = new Map<string, typeof teamMismatch>();
  for (const t of teamMismatch) {
    const k = `${t.name}|${t.espnTeam}`;
    if (!byPlayer.has(k)) byPlayer.set(k, []);
    byPlayer.get(k)!.push(t);
  }
  console.log(
    `\nTEAM MISMATCHES (${byPlayer.size}) — name matched, team is new for that ` +
      `player_id.\nExpected for a late trade or buyout signing; a red flag if the ` +
      `name is common:`,
  );
  for (const [k, hits] of byPlayer) {
    const t = hits[0];
    console.log(
      `  ${t.name.padEnd(26)} id=${t.playerId}  ESPN says ${t.espnTeam}, ` +
        `known ${t.knownTeams.join("/")}  (${hits.length} game(s))`,
    );
  }
} else {
  console.log(
    "\nTEAM MISMATCHES: none — every matched player's team was already known.",
  );
}

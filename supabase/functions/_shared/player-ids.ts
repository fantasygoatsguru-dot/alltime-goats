// Player name -> NBA player_id resolution, shared between the local backfill
// script (scripts/backfill-season.ts) and the scheduled stats-ingest edge
// function so the two cannot drift apart.
//
// This is an extraction, not a rewrite: every rule here was earned by a real
// failure found while running scripts/backfill-season.ts against production
// (5,922 rows resolved correctly). Read the comments before "simplifying"
// anything away.
//
// deno-lint-ignore-file no-explicit-any

/**
 * Minimal shape of the supabase-js client this module needs: a `.from()`
 * that returns a chainable query builder ending in `.range()`, which
 * resolves to `{ data, error }`. Typed loosely (not the generated Database
 * type) so both the local script and edge functions can pass their own
 * `createClient()` result — and so the test stub below can satisfy it with a
 * plain object instead of pulling in the real client.
 */
export interface SupabaseLike {
  from(table: string): SupabaseQueryBuilder;
}

export interface SupabaseQueryBuilder {
  select(columns: string): SupabaseQueryBuilder;
  eq(column: string, value: unknown): SupabaseQueryBuilder;
  range(
    from: number,
    to: number,
  ): Promise<{ data: any[] | null; error: { message: string } | null }>;
}

/**
 * Canonical form for name matching.
 *
 * The database stores NBA's spellings, which carry diacritics ("Nikola Jokić",
 * "Luka Dončić", "Dennis Schröder"); ESPN sends ASCII ("Nikola Jokic"). A naive
 * lowercase compare therefore fails to match some of the most valuable players
 * in the league — the first dry run of the reference script left 48 players
 * unmatched, Jokić and Dončić among them, 17 total including three
 * superstars. Also folds punctuation, since "P.J. Tucker"/"PJ Tucker" and
 * "Jaren Jackson Jr."/"Jaren Jackson Jr" differ only there.
 */
export function foldName(name: string): string {
  return name
    .normalize("NFD") // split accented chars into base + combining mark
    .replace(/[̀-ͯ]/g, "") // drop the combining marks
    .toLowerCase()
    .replace(/[.'’`-]/g, "") // punctuation that varies between sources
    .replace(/\s+/g, " ")
    .trim();
}

export interface NameIndex {
  /** folded name -> NBA player_id (only where unambiguous) */
  byName: Map<string, number>;
  /** ESPN athlete id -> NBA player_id, from nba_player_id_map (tier 3) */
  byEspnId: Map<number, number>;
  /** folded names that map to more than one player_id — never auto-matched */
  ambiguous: Set<string>;
  /** player_id -> teams they already appear with this season (tier 1 only) */
  teams: Map<number, Set<string>>;
  /** player_id -> stored spelling, for reporting */
  spelling: Map<number, string>;
  /**
   * Resolve one ESPN athlete to an NBA player_id. Tries the espn_athlete_id
   * override first (tier 3 — stronger than any name match, since it is a
   * confirmed one-to-one mapping rather than an inference from spelling),
   * then falls back to the folded-name index. Returns undefined if neither
   * source has an unambiguous answer.
   */
  resolve(espnAthleteId: number, playerName: string): number | undefined;
}

const PAGE = 1000;

/** Pages through `table` via `.select(columns).range()`, collecting all rows. */
async function fetchAllRows(
  supabase: SupabaseLike,
  table: string,
  columns: string,
  eq?: [string, unknown],
): Promise<any[]> {
  const out: any[] = [];
  let offset = 0;
  while (true) {
    let query = supabase.from(table).select(columns);
    if (eq) query = query.eq(eq[0], eq[1]);
    const { data, error } = await query.range(offset, offset + PAGE - 1);
    if (error) {
      throw new Error(`${table}: ${error.message}`);
    }
    const rows = data ?? [];
    out.push(...rows);
    if (rows.length < PAGE) break;
    offset += PAGE;
  }
  return out;
}

/**
 * Builds the name index for a season.
 *
 * Tiered resolution, in priority order:
 *   1. player_game_logs for the season — authoritative, has teams.
 *   2. alltime_player_info — players whose first game of the season falls
 *      inside a gap (returning from injury, buyout signings, 10-day deals),
 *      so they are absent from tier 1 by definition. This table spans 65
 *      seasons, so same-name collisions ("chris wright", "tony mitchell")
 *      are far likelier here than within one season.
 *   3. nba_player_id_map — manual overrides, keyed by ESPN athlete id (an
 *      exact espn_athlete_id match is preferred over any name match, since
 *      it is stronger — a confirmed one-to-one mapping, not an inference).
 *
 * AMBIGUITY REJECTION IS THE CRITICAL RULE: any folded name owned by more
 * than one player_id within a tier is REMOVED from that tier's contribution
 * to byName, never resolved by guessing. Attributing one player's stats to
 * another is the worst failure this system can produce. Tier 1 wins over
 * tier 2 for the same folded name.
 *
 * Team tracking: tier 1 records which teams each player_id has appeared for
 * this season, so callers can flag a name match whose team is unknown for
 * that player (catches a new player whose name folds onto an existing one).
 * A tier-2/3 player has NO team history, and that is "nothing to check", NOT
 * a mismatch — callers must only compare when the known-team set is
 * non-empty.
 */
export async function loadNameIndex(
  supabase: SupabaseLike,
  season: string,
): Promise<NameIndex> {
  const byName = new Map<string, number>();
  const byEspnId = new Map<number, number>();
  const ambiguous = new Set<string>();
  const teams = new Map<number, Set<string>>();
  const spelling = new Map<number, string>();

  // ---- Tier 1: player_game_logs for the season --------------------------
  const tier1Rows = await fetchAllRows(
    supabase,
    "player_game_logs",
    "player_id,player_name,team_abbreviation",
    ["season", season],
  );

  for (const r of tier1Rows) {
    const key = foldName(r.player_name);
    const seen = byName.get(key);
    if (seen !== undefined && seen !== r.player_id) ambiguous.add(key);
    byName.set(key, r.player_id);
    spelling.set(r.player_id, r.player_name);
    if (!teams.has(r.player_id)) teams.set(r.player_id, new Set());
    teams.get(r.player_id)!.add(r.team_abbreviation);
  }
  for (const key of ambiguous) byName.delete(key);

  // ---- Tier 2: alltime_player_info ---------------------------------------
  const tier2Rows = await fetchAllRows(
    supabase,
    "alltime_player_info",
    "player_id,player_name",
  );

  const histSeen = new Map<string, Set<number>>();
  const histName = new Map<string, string>();
  for (const r of tier2Rows) {
    const key = foldName(r.player_name);
    if (!histSeen.has(key)) histSeen.set(key, new Set());
    histSeen.get(key)!.add(r.player_id);
    histName.set(key, r.player_name);
  }

  for (const [key, ids] of histSeen) {
    if (byName.has(key) || ambiguous.has(key)) continue; // tier 1 wins
    if (ids.size > 1) {
      ambiguous.add(key);
      continue;
    }
    const id = [...ids][0];
    byName.set(key, id);
    spelling.set(id, histName.get(key)!);
    // No team history for these — the team guard is skipped by callers, which
    // is correct: a returning or newly-signed player's team is new by
    // definition.
    if (!teams.has(id)) teams.set(id, new Set());
  }

  // ---- Tier 3: nba_player_id_map (manual overrides) ----------------------
  const tier3Rows = await fetchAllRows(
    supabase,
    "nba_player_id_map",
    "espn_athlete_id,nba_player_id,player_name",
  );

  for (const r of tier3Rows) {
    byEspnId.set(r.espn_athlete_id, r.nba_player_id);

    const key = foldName(r.player_name);
    if (byName.has(key) || ambiguous.has(key)) continue; // tier 1/2 win
    if (!teams.has(r.nba_player_id)) teams.set(r.nba_player_id, new Set());
    byName.set(key, r.nba_player_id);
    if (!spelling.has(r.nba_player_id)) spelling.set(r.nba_player_id, r.player_name);
  }

  function resolve(
    espnAthleteId: number,
    playerName: string,
  ): number | undefined {
    const byId = byEspnId.get(espnAthleteId);
    if (byId !== undefined) return byId;
    return byName.get(foldName(playerName));
  }

  return { byName, byEspnId, ambiguous, teams, spelling, resolve };
}

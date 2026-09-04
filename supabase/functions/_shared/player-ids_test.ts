import { assertEquals, assertNotEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
  foldName,
  loadNameIndex,
  type SupabaseLike,
  type SupabaseQueryBuilder,
} from "./player-ids.ts";

// ---------------------------------------------------------------------------
// Stub client — no network, no credentials. Reproduces just enough of
// supabase-js's chainable query builder for loadNameIndex to page through:
// `.from(table).select(cols)[.eq(col, val)].range(from, to)` -> {data, error}.
// ---------------------------------------------------------------------------
interface StubTables {
  player_game_logs?: Record<string, unknown>[];
  alltime_player_info?: Record<string, unknown>[];
  nba_player_id_map?: Record<string, unknown>[];
}

function stubClient(tables: StubTables): SupabaseLike {
  return {
    from(table: string): SupabaseQueryBuilder {
      const rows = (tables as Record<string, Record<string, unknown>[] | undefined>)[table] ?? [];
      let filtered = rows;
      const builder: SupabaseQueryBuilder = {
        select(_columns: string) {
          return builder;
        },
        eq(column: string, value: unknown) {
          filtered = filtered.filter((r) => r[column] === value);
          return builder;
        },
        range(from: number, to: number) {
          return Promise.resolve({ data: filtered.slice(from, to + 1), error: null });
        },
      };
      return builder;
    },
  };
}

// ---------------------------------------------------------------------------
// 1. foldName: diacritics and punctuation fold to the same key.
// ---------------------------------------------------------------------------
Deno.test("foldName - diacritics fold to ASCII equivalent", () => {
  assertEquals(foldName("Nikola Jokić"), foldName("Nikola Jokic"));
  assertEquals(foldName("Dennis Schröder"), foldName("Dennis Schroder"));
  assertEquals(foldName("Luka Dončić"), foldName("Luka Doncic"));
});

Deno.test("foldName - punctuation variants fold to the same key", () => {
  assertEquals(foldName("P.J. Tucker"), foldName("PJ Tucker"));
  assertEquals(foldName("Jaren Jackson Jr."), foldName("Jaren Jackson Jr"));
});

// ---------------------------------------------------------------------------
// 2. foldName must NOT collapse genuinely different names.
// ---------------------------------------------------------------------------
Deno.test("foldName - does not collapse Jokic and Jovic", () => {
  assertNotEquals(foldName("Nikola Jokić"), foldName("Nikola Jović"));
});

// ---------------------------------------------------------------------------
// 3. Tier 1 ambiguity: same folded name, two player_ids in player_game_logs
//    -> ambiguous, absent from byName.
// ---------------------------------------------------------------------------
Deno.test("loadNameIndex - tier 1 collision is rejected, not guessed", async () => {
  const client = stubClient({
    player_game_logs: [
      { player_id: 100, player_name: "Chris Wright", team_abbreviation: "BOS", season: "2025-26" },
      { player_id: 200, player_name: "Chris Wright", team_abbreviation: "LAL", season: "2025-26" },
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");
  const key = foldName("Chris Wright");

  assertEquals(idx.ambiguous.has(key), true);
  assertEquals(idx.byName.has(key), false);
});

// ---------------------------------------------------------------------------
// 4. Tier 2 ambiguity: same folded name, two player_ids in
//    alltime_player_info (no tier 1 rows at all) -> rejected.
// ---------------------------------------------------------------------------
Deno.test("loadNameIndex - tier 2 collision is rejected, not guessed", async () => {
  const client = stubClient({
    alltime_player_info: [
      { player_id: 300, player_name: "Tony Mitchell" },
      { player_id: 400, player_name: "Tony Mitchell" },
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");
  const key = foldName("Tony Mitchell");

  assertEquals(idx.ambiguous.has(key), true);
  assertEquals(idx.byName.has(key), false);
});

// ---------------------------------------------------------------------------
// 5. Tier 1 wins over tier 2 for the same folded name.
// ---------------------------------------------------------------------------
Deno.test("loadNameIndex - tier 1 wins over tier 2 for the same name", async () => {
  const client = stubClient({
    player_game_logs: [
      { player_id: 1, player_name: "Bob Test", team_abbreviation: "BOS", season: "2025-26" },
    ],
    alltime_player_info: [
      // Same folded name, different (older) player_id — must lose to tier 1.
      { player_id: 2, player_name: "Bob Test" },
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");
  assertEquals(idx.byName.get(foldName("Bob Test")), 1);
});

// ---------------------------------------------------------------------------
// 6. resolve() prefers an espn_athlete_id match over a name match when they
//    disagree.
// ---------------------------------------------------------------------------
Deno.test("resolve - prefers espn_athlete_id over a conflicting name match", async () => {
  const client = stubClient({
    player_game_logs: [
      { player_id: 111, player_name: "Some Guy", team_abbreviation: "BOS", season: "2025-26" },
    ],
    nba_player_id_map: [
      { espn_athlete_id: 555, nba_player_id: 999, player_name: "Some Guy" },
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");

  // The name index alone points at the tier-1 player...
  assertEquals(idx.byName.get(foldName("Some Guy")), 111);
  // ...but resolve() must prefer the stronger espn id match.
  assertEquals(idx.resolve(555, "Some Guy"), 999);
});

Deno.test("resolve - falls back to folded name when no espn id match", async () => {
  const client = stubClient({
    player_game_logs: [
      { player_id: 111, player_name: "Some Guy", team_abbreviation: "BOS", season: "2025-26" },
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");
  assertEquals(idx.resolve(999999, "Some Guy"), 111);
});

// ---------------------------------------------------------------------------
// 7. teams is populated from tier 1 rows and EMPTY (not absent) for a
//    tier-2-only player — "nothing to check", not a mismatch.
// ---------------------------------------------------------------------------
Deno.test("loadNameIndex - teams populated from tier 1, empty for tier-2-only player", async () => {
  const client = stubClient({
    player_game_logs: [
      { player_id: 1, player_name: "Bob Test", team_abbreviation: "BOS", season: "2025-26" },
    ],
    alltime_player_info: [
      { player_id: 2, player_name: "Bob Test" }, // loses to tier 1, not in teams
      { player_id: 5, player_name: "Taj Gibson" }, // tier-2-only
    ],
  });

  const idx = await loadNameIndex(client, "2025-26");

  assertEquals(idx.teams.get(1)?.has("BOS"), true);
  assertEquals(idx.teams.get(5)?.size, 0);
  assertEquals(idx.byName.get(foldName("Taj Gibson")), 5);
});

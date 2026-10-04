import { assertEquals, assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { getYahooGameId } from "./yahoo-season.ts";

Deno.test("Yahoo game lookup selects the requested NBA season and caches its ID", async () => {
  const endpoints: string[] = [];
  const request = (endpoint: string) => {
    endpoints.push(endpoint);
    return Promise.resolve({ fantasy_content: { games: {
      0: { game: { code: "nba", season: "2025", game_key: "466" } },
      1: { game: { code: "nba", season: "2026", game_key: "999" } },
      count: 2,
    } } });
  };
  assertEquals(await getYahooGameId(request), "999");
  assertEquals(await getYahooGameId(request), "999");
  assertEquals(endpoints, ["/games;game_codes=nba;seasons=2026"]);
});

Deno.test("missing Yahoo season never falls back to an older game", async () => {
  await assertRejects(() => getYahooGameId(() => Promise.resolve({ fantasy_content: { games: {
    0: { game: { code: "nba", season: "2026", game_key: "999" } },
  } } }), "2027"), Error, "unavailable for season 2027");
});

Deno.test("Yahoo metadata arrays and numeric season fields are supported", async () => {
  assertEquals(await getYahooGameId(() => Promise.resolve({ fantasy_content: { games: {
    0: { game: [{ code: "nba", season: 2028, game_key: "1001" }] },
  } } }), "2028"), "1001");
});

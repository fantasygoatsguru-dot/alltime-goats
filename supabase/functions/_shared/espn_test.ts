import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
  __setSleepForTests,
  buildMatchup,
  fetchScoreboard,
  normalizeAbbr,
  parseBoxScore,
} from "./espn.ts";

// Builds a minimal ESPN scoreboard "event" object, matching only the shape
// fetchScoreboard reads: competitions[0].type.abbreviation (the STD/ALLSTAR/
// CC discriminator), status.type.completed, and the two competitors.
function mockEvent(
  id: string,
  typeAbbr: string,
  homeAbbr: string,
  awayAbbr: string,
) {
  return {
    id,
    competitions: [
      {
        type: { abbreviation: typeAbbr },
        status: { type: { completed: true } },
        competitors: [
          { homeAway: "home", team: { abbreviation: homeAbbr } },
          { homeAway: "away", team: { abbreviation: awayAbbr } },
        ],
      },
    ],
  };
}

// Stubs globalThis.fetch to return a crafted scoreboard payload (no network
// access), runs fetchScoreboard against it, and restores the original fetch
// even if the call throws.
async function withStubbedScoreboard(
  events: unknown[],
  // deno-lint-ignore no-explicit-any
): Promise<any[]> {
  const originalFetch = globalThis.fetch;
  try {
    // deno-lint-ignore require-await
    globalThis.fetch = async (): Promise<Response> => {
      return new Response(JSON.stringify({ events }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };
    return await fetchScoreboard("2026-03-11");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function jsonResponse(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Runs fetchScoreboard against a scripted sequence of fetch outcomes (each
// either a Response or an Error to reject with — once the script runs out,
// the last outcome repeats). The backoff sleep is replaced with an
// immediate resolve so retry tests run in milliseconds, not seconds. Both
// fetch and the sleep hook are restored in a finally block. Returns the
// resolved games XOR the thrown error, plus how many times fetch was
// actually called.
async function withScriptedFetch(
  outcomes: Array<Response | Error>,
): Promise<
  { result?: unknown[]; error?: unknown; callCount: number }
> {
  const originalFetch = globalThis.fetch;
  let callCount = 0;

  __setSleepForTests(() => Promise.resolve());
  try {
    // deno-lint-ignore require-await
    globalThis.fetch = async (): Promise<Response> => {
      const outcome = outcomes[Math.min(callCount, outcomes.length - 1)];
      callCount++;
      if (outcome instanceof Error) throw outcome;
      return outcome;
    };

    try {
      const result = await fetchScoreboard("2026-03-11");
      return { result, callCount };
    } catch (error) {
      return { error, callCount };
    }
  } finally {
    globalThis.fetch = originalFetch;
    __setSleepForTests(null);
  }
}

const summary = JSON.parse(
  await Deno.readTextFile(
    new URL("./__fixtures__/espn-boxscore-401810793.json", import.meta.url),
  ),
);

Deno.test("normalizeAbbr maps ESPN spellings to the app's tricodes", () => {
  assertEquals(normalizeAbbr("WSH"), "WAS");
  assertEquals(normalizeAbbr("NY"), "NYK");
  assertEquals(normalizeAbbr("GS"), "GSW");
  assertEquals(normalizeAbbr("SA"), "SAS");
  assertEquals(normalizeAbbr("NO"), "NOP");
  assertEquals(normalizeAbbr("UTAH"), "UTA");
  assertEquals(normalizeAbbr("MIA"), "MIA");
});

Deno.test("buildMatchup reproduces the NBA MATCHUP string format", () => {
  assertEquals(buildMatchup("MIA", "WAS", true), "MIA vs. WAS");
  assertEquals(buildMatchup("CHI", "GSW", false), "CHI @ GSW");
});

Deno.test("parseBoxScore reproduces the stored NBA-sourced line exactly", () => {
  // WAS @ MIA, 2026-03-10. Cross-checked against the NBA-sourced row already
  // in player_game_logs: 42 min, 83 pts, 20-43 FG.
  const lines = parseBoxScore(summary, "MIA", "WAS");
  const bam = lines.find((l) => l.playerName === "Bam Adebayo")!;

  assertEquals(bam.teamAbbreviation, "MIA");
  assertEquals(bam.opponent, "MIA vs. WAS");
  assertEquals(bam.minutes, 42);
  assertEquals(bam.points, 83);
  assertEquals(bam.fieldGoalsMade, 20);
  assertEquals(bam.fieldGoalsAttempted, 43);
});

Deno.test("parseBoxScore normalizes the away team's abbreviation", () => {
  const lines = parseBoxScore(summary, "MIA", "WAS");
  const away = lines.filter((l) => l.teamAbbreviation === "WAS");
  // ESPN spells this WSH; nothing may leak through unnormalized.
  assertEquals(lines.some((l) => l.teamAbbreviation === "WSH"), false);
  assertEquals(away.length > 0, true);
  assertEquals(away[0].opponent, "WAS @ MIA");
});

Deno.test("parseBoxScore skips players who did not play", () => {
  const lines = parseBoxScore(summary, "MIA", "WAS");

  // Count every athlete ESPN listed, dressed or not.
  // deno-lint-ignore no-explicit-any
  const listed = (summary as any).boxscore.players
    .reduce(
      (n: number, t: { statistics: { athletes: unknown[] }[] }) =>
        n + (t.statistics?.[0]?.athletes?.length ?? 0),
      0,
    );

  // Some listed athletes are DNPs, so parsing must drop rows, not pass
  // everything through. (Asserting only that points are finite would be
  // vacuous — num() never returns NaN.)
  assertEquals(lines.length < listed, true);
  assertEquals(lines.length > 0, true);
  // A parsed line means the player was on the floor.
  assertEquals(lines.every((l) => l.minutes > 0), true);
});

Deno.test("fetchScoreboard sends an identifying User-Agent (ESPN 403s without one)", async () => {
  const originalFetch = globalThis.fetch;
  let capturedHeaders: HeadersInit | undefined;

  try {
    // deno-lint-ignore require-await
    globalThis.fetch = async (
      _input: string | URL | Request,
      init?: RequestInit,
    ): Promise<Response> => {
      capturedHeaders = init?.headers;
      return new Response(JSON.stringify({ events: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    await fetchScoreboard("2026-03-11");

    const headers = new Headers(capturedHeaders);
    assertEquals(headers.get("User-Agent"), "FantasyGoatsGuru/1.0");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("fetchScoreboard excludes ALLSTAR exhibitions (fake teams STARS/WORLD)", async () => {
  // Measured 2026-02-15: 4 ALLSTAR events, teams STARS/STRIPES/WORLD.
  // season.type/slug is "regular-season" on these exactly like a real game,
  // so this must be caught by competitions[0].type.abbreviation, not season.
  const games = await withStubbedScoreboard([
    mockEvent("1", "ALLSTAR", "STARS", "WORLD"),
  ]);
  assertEquals(games.length, 0);
});

Deno.test("fetchScoreboard excludes CC (NBA Cup Championship) even between two real NBA teams", async () => {
  // Measured 2025-12-16: Spurs at Knicks, neutralSite true, T-Mobile Arena
  // Las Vegas, type.abbreviation "CC". Both tricodes are real NBA teams, so
  // the NBA_TRICODES guard alone would NOT catch this — it must be excluded
  // by the type.abbreviation !== "STD" check.
  const games = await withStubbedScoreboard([
    mockEvent("2", "CC", "NYK", "SAS"),
  ]);
  assertEquals(games.length, 0);
});

Deno.test("fetchScoreboard includes a normal STD game between two real NBA teams", async () => {
  const games = await withStubbedScoreboard([
    mockEvent("3", "STD", "MIA", "WAS"),
  ]);
  assertEquals(games.length, 1);
  assertEquals(games[0].homeAbbr, "MIA");
  assertEquals(games[0].awayAbbr, "WAS");
});

Deno.test("fetchScoreboard excludes an STD event when a competitor's tricode is not a real NBA team", async () => {
  // Belt-and-braces: even if type.abbreviation somehow read "STD", a fake
  // team name (e.g. an exhibition roster) must still be rejected.
  const games = await withStubbedScoreboard([
    mockEvent("4", "STD", "WORLD", "WAS"),
  ]);
  assertEquals(games.length, 0);
});

Deno.test("espnFetch retries once after a transient network error, then succeeds", async () => {
  const { result, error, callCount } = await withScriptedFetch([
    new TypeError("network error"), // simulates a timeout/network failure
    jsonResponse(200, { events: [] }),
  ]);
  assertEquals(error, undefined);
  assertEquals(result, []);
  assertEquals(callCount, 2);
});

Deno.test("espnFetch retries on 5xx and succeeds once ESPN recovers", async () => {
  const { result, error, callCount } = await withScriptedFetch([
    jsonResponse(500),
    jsonResponse(500),
    jsonResponse(200, { events: [] }),
  ]);
  assertEquals(error, undefined);
  assertEquals(result, []);
  assertEquals(callCount, 3);
});

Deno.test("espnFetch does not retry a non-retryable 4xx like 403 (called exactly once)", async () => {
  const { result, error, callCount } = await withScriptedFetch([
    jsonResponse(403),
  ]);
  assertEquals(result, undefined);
  assertEquals(error instanceof Error, true);
  // A 403 is a policy decision, not a transient fault — retrying it would
  // just waste the attempt/time budget.
  assertEquals(callCount, 1);
});

Deno.test("espnFetch gives up after exactly MAX_ATTEMPTS on persistent failure", async () => {
  const { result, error, callCount } = await withScriptedFetch([
    new TypeError("network error"),
    new TypeError("network error"),
    new TypeError("network error"),
  ]);
  assertEquals(result, undefined);
  assertEquals(error instanceof Error, true);
  assertEquals(callCount, 3);
});

Deno.test("fantasy points use the pipeline's historic formula", () => {
  const lines = parseBoxScore(summary, "MIA", "WAS");
  const bam = lines.find((l) => l.playerName === "Bam Adebayo")!;
  const expected = Math.round(
    (bam.points + 1.2 * bam.rebounds + 1.5 * bam.assists +
      3 * bam.steals + 3 * bam.blocks - bam.turnovers) * 10,
  ) / 10;
  assertEquals(bam.fantasyPoints, expected);
});

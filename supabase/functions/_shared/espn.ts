// ESPN is the stats source. stats.nba.com stopped answering non-approved
// clients (TLS handshake completes, then no HTTP response), which is what
// killed the old Python pipeline on 2026-03-11.
//
// This repo already depends on ESPN: scripts/build-schedule.js generates
// public/data/schedule.json from it.

const BASE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";

// ESPN's Akamai front door 403s requests with no User-Agent, Deno's default
// UA, and spoofed browser UAs alike (browser UA + non-browser TLS is exactly
// what it filters on). An honest, identifying UA is required to get a 200 —
// this is not cosmetic. Do not remove it or swap in a curl/browser UA.
const USER_AGENT = "FantasyGoatsGuru/1.0";

// ESPN spells six teams differently from the tricodes used everywhere else.
const ABBR_FIXUP: Record<string, string> = {
  WSH: "WAS",
  NY: "NYK",
  GS: "GSW",
  SA: "SAS",
  NO: "NOP",
  UTAH: "UTA",
};

export function normalizeAbbr(espnAbbr: string): string {
  const up = espnAbbr.toUpperCase();
  return ABBR_FIXUP[up] ?? up;
}

/** Reproduces the NBA MATCHUP string the `opponent` column has always stored. */
export function buildMatchup(
  team: string,
  opponent: string,
  isHome: boolean,
): string {
  return isHome ? `${team} vs. ${opponent}` : `${team} @ ${opponent}`;
}

// No timeout on `fetch` means a single stalled connection can hang the
// caller forever. Measured: a full-season scan (165 dates) hung on
// 2026-03-29 with zero output for 25+ seconds before being killed manually,
// while an immediate manual request to the very same URL returned 200 in
// 398ms — ESPN was healthy throughout, only one connection stalled. In the
// scheduled edge function that same hang burns the entire wall-clock budget
// and the daily job dies having written nothing, silently — the same
// failure shape as the stats.nba.com outage this project repairs. Every
// ESPN request must carry a timeout and a bounded number of retries.
const FETCH_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;

// Test seam only: espn_test.ts overrides this to skip real waiting during
// backoff. Production always uses the real timer.
let sleep: (ms: number) => Promise<void> = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Test-only hook. Pass null to restore the real timer. */
export function __setSleepForTests(
  fn: ((ms: number) => Promise<void>) | null,
): void {
  sleep = fn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
}

function isRetryableStatus(status: number): boolean {
  // 429 and 5xx are transient; other 4xx (e.g. 403) are policy decisions —
  // retrying them just burns the attempt/time budget for nothing.
  return status === 429 || (status >= 500 && status < 600);
}

/**
 * Shared fetch wrapper for both ESPN endpoints: attaches the standard
 * headers, enforces FETCH_TIMEOUT_MS per attempt via AbortSignal.timeout,
 * and retries on a thrown error (timeout/network) or a retryable HTTP
 * status, with exponential backoff (500ms, then 1000ms) plus jitter.
 * A non-retryable HTTP response (2xx or a non-retryable 4xx) is returned
 * as-is on the first attempt, so callers' existing `!res.ok` handling is
 * unchanged. Only exhausting all retryable attempts throws here.
 */
async function espnFetch(url: string): Promise<Response> {
  let lastError: unknown;
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (res.ok || !isRetryableStatus(res.status)) {
        return res;
      }
      lastStatus = res.status;
      lastError = undefined;
    } catch (err) {
      lastError = err;
      lastStatus = undefined;
    }

    if (attempt < MAX_ATTEMPTS) {
      const backoffMs = attempt === 1 ? 500 : 1000;
      const jitterMs = Math.random() * 100;
      await sleep(backoffMs + jitterMs);
    }
  }

  const reason = lastError
    ? (lastError instanceof Error ? lastError.message : String(lastError))
    : `HTTP ${lastStatus}`;
  throw new Error(
    `ESPN request to ${url} failed after ${MAX_ATTEMPTS} attempts: ${reason}`,
  );
}

export interface EspnGame {
  id: string;
  homeAbbr: string;
  awayAbbr: string;
}

// Belt-and-braces guard against non-regular-season exhibitions leaking into
// player_game_logs (see fetchScoreboard). Exactly the 30 real NBA tricodes,
// in the app's normalized spelling (post normalizeAbbr).
export const NBA_TRICODES: ReadonlySet<string> = new Set([
  "ATL", "BOS", "BKN", "CHA", "CHI", "CLE", "DAL", "DEN", "DET", "GSW",
  "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK",
  "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS",
]);

export interface RawLine {
  espnAthleteId: number;
  playerName: string;
  teamAbbreviation: string;
  opponent: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  threePointersMade: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  fantasyPoints: number;
}

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** ESPN packs made/attempted into one "20-43" cell. */
function madeAttempted(v: string | undefined): [number, number] {
  if (!v || !v.includes("-")) return [0, 0];
  const [m, a] = v.split("-");
  return [num(m), num(a)];
}

export function parseBoxScore(
  summary: unknown,
  homeAbbr: string,
  awayAbbr: string,
): RawLine[] {
  // deno-lint-ignore no-explicit-any
  const teams = (summary as any)?.boxscore?.players ?? [];
  const out: RawLine[] = [];

  for (const team of teams) {
    const abbr = normalizeAbbr(team?.team?.abbreviation ?? "");
    const isHome = abbr === homeAbbr;
    const opponent = isHome ? awayAbbr : homeAbbr;
    const matchup = buildMatchup(abbr, opponent, isHome);

    const block = team?.statistics?.[0];
    if (!block?.keys || !block?.athletes) continue;

    const idx: Record<string, number> = {};
    block.keys.forEach((k: string, i: number) => (idx[k] = i));

    for (const a of block.athletes) {
      // DNPs carry no stats array; ESPN also flags them explicitly.
      if (a?.didNotPlay === true) continue;
      const s: string[] | undefined = a?.stats;
      if (!s || s.length === 0) continue;

      const [fgm, fga] = madeAttempted(s[idx["fieldGoalsMade-fieldGoalsAttempted"]]);
      const [ftm, fta] = madeAttempted(s[idx["freeThrowsMade-freeThrowsAttempted"]]);
      const [tpm] = madeAttempted(
        s[idx["threePointFieldGoalsMade-threePointFieldGoalsAttempted"]],
      );

      const points = num(s[idx["points"]]);
      const rebounds = num(s[idx["rebounds"]]);
      const assists = num(s[idx["assists"]]);
      const steals = num(s[idx["steals"]]);
      const blocks = num(s[idx["blocks"]]);
      const turnovers = num(s[idx["turnovers"]]);

      out.push({
        espnAthleteId: num(a?.athlete?.id),
        playerName: a?.athlete?.displayName ?? "",
        teamAbbreviation: abbr,
        opponent: matchup,
        minutes: num(s[idx["minutes"]]),
        points,
        rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        threePointersMade: tpm,
        fieldGoalsMade: fgm,
        fieldGoalsAttempted: fga,
        freeThrowsMade: ftm,
        freeThrowsAttempted: fta,
        fantasyPoints: Math.round(
          (points + 1.2 * rebounds + 1.5 * assists +
            3 * steals + 3 * blocks - turnovers) * 10,
        ) / 10,
      });
    }
  }

  return out;
}

/** dateStr is YYYY-MM-DD (US Eastern), matching how game_date is stored. */
export async function fetchScoreboard(dateStr: string): Promise<EspnGame[]> {
  const compact = dateStr.replaceAll("-", "");
  const res = await espnFetch(`${BASE}/scoreboard?dates=${compact}`);
  if (!res.ok) {
    throw new Error(`ESPN scoreboard ${dateStr}: HTTP ${res.status}`);
  }
  // deno-lint-ignore no-explicit-any
  const body: any = await res.json();
  const games: EspnGame[] = [];

  for (const ev of body?.events ?? []) {
    const comp = ev?.competitions?.[0];
    const cs = comp?.competitors ?? [];
    const home = cs.find((c: { homeAway: string }) => c.homeAway === "home");
    const away = cs.find((c: { homeAway: string }) => c.homeAway === "away");
    if (!home || !away) continue;
    // Only completed games; an in-progress game would write a partial line.
    if (comp?.status?.type?.completed !== true) continue;

    // Guard 1: season.type/slug does NOT distinguish exhibitions from real
    // games — All-Star games are labelled season.type=2,
    // slug="regular-season" exactly like a real game, so filtering on
    // season type silently fails. competitions[0].type.abbreviation is the
    // reliable discriminator: "STD" is a standard regular-season game;
    // "ALLSTAR" is the All-Star/Rising Stars exhibition (measured
    // 2026-02-15, 4 events, teams STARS/STRIPES/WORLD); "CC" is the NBA Cup
    // Championship (measured 2025-12-16, Spurs at Knicks, neutralSite true,
    // T-Mobile Arena Las Vegas) which does not count toward regular-season
    // stats — the retired NBA-API pipeline correctly stored zero rows for
    // that date, and we must match that. Anything not "STD" is skipped.
    if (comp?.type?.abbreviation !== "STD") continue;

    const homeAbbr = normalizeAbbr(home?.team?.abbreviation ?? "");
    const awayAbbr = normalizeAbbr(away?.team?.abbreviation ?? "");

    // Guard 2: belt-and-braces independent of Guard 1. Fake exhibition
    // teams (WORLD, STARS, STRIPES) are not real NBA tricodes, so even if
    // ESPN ever introduces a new exhibition type.abbreviation this still
    // catches it. Both sides must be real NBA teams.
    if (!NBA_TRICODES.has(homeAbbr) || !NBA_TRICODES.has(awayAbbr)) continue;

    games.push({
      id: String(ev.id),
      homeAbbr,
      awayAbbr,
    });
  }
  return games;
}

export async function fetchBoxScore(gameId: string): Promise<unknown> {
  const res = await espnFetch(`${BASE}/summary?event=${gameId}`);
  if (!res.ok) {
    throw new Error(`ESPN summary ${gameId}: HTTP ${res.status}`);
  }
  return await res.json();
}

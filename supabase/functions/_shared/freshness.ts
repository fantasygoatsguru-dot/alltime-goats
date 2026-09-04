// Shared freshness-guard primitives for calculate-player-averages.
//
// Pulled out of index.ts (rather than exported from it) so the guard can be
// unit-tested without importing a module that calls serve() at load time —
// serve() binds a listener as a side effect and would hang `deno test`.
// Both index.ts and freshness_test.ts import from here.

// How many game days the logs may lag before we refuse to publish.
export const STALENESS_TOLERANCE_DAYS = 2;

export function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * The logs must be current. Walk back from today looking for dates on which
 * games were actually played (per `hadGames`); if the newest stored log is
 * more than `tolerance` *game days* behind, refuse by throwing.
 *
 * A finished season has no recent games, so this passes naturally once the
 * season is over — which is what lets us recompute a past season months
 * later without the guard mistaking silence for an outage.
 *
 * `hadGames` is injected so the whole decision can be unit-tested without the
 * network. The deployed function passes a real ESPN-backed lookup; tests pass
 * a stub. A guard that has never been observed refusing is not a guard.
 */
export async function assertFresh(
  newestLog: string,
  today: string,
  hadGames: (date: string) => Promise<boolean>,
  tolerance = STALENESS_TOLERANCE_DAYS,
): Promise<void> {
  let cursor = today;
  let gameDaysSeen = 0;

  for (let i = 0; i < 14; i++) {
    if (await hadGames(cursor)) {
      if (cursor <= newestLog) return; // logs reach the latest real game day
      gameDaysSeen++;
      if (gameDaysSeen > tolerance) {
        throw new Error(
          `Refusing to publish: game logs end ${newestLog} but ESPN has ` +
            `${gameDaysSeen} completed game days since. Run retrieve-nba-stats first.`,
        );
      }
    }
    cursor = addDays(cursor, -1);
  }
  // No games in the last 14 days: offseason or a finished season. Fine.
}

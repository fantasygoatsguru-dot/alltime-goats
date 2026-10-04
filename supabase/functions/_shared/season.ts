export const STATS_SEASON = "2026-27";
export const REGULAR_SEASON_START = "2026-10-20";
export const ENTITLEMENT_SEASON = "2026-27";
export const YAHOO_SEASON = STATS_SEASON.split("-")[0];

export function seasonDateRange(season: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(season);
  if (!match || String(Number(match[1]) + 1).slice(-2) !== match[2]) {
    throw new Error(`Invalid NBA season: ${season}`);
  }
  return { start: `${match[1]}-07-01`, end: `${Number(match[1]) + 1}-06-30` };
}

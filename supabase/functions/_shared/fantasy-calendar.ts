export type FantasyWeeks = Record<string, { start: string; end: string }>;
type MatchupDates = { week_start?: string; week_end?: string };

export function easternDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function fantasyWeekForDate(weeks: FantasyWeeks, date: string) {
  const found = Object.entries(weeks).find(([, week]) => date >= week.start && date <= week.end);
  return found ? { number: Number(found[0]), ...found[1] } : null;
}

export function matchupDates(weeks: FantasyWeeks, matchup: MatchupDates = {}, now = new Date()) {
  const todayDateStr = easternDate(now);
  const dates = matchup.week_start && matchup.week_end
    ? { start: matchup.week_start, end: matchup.week_end }
    : fantasyWeekForDate(weeks, todayDateStr);
  if (!dates) throw new Error("No active fantasy matchup week for this date");
  const numDaysInWeek = Math.round((Date.parse(dates.end) - Date.parse(dates.start)) / 86400000) + 1;
  if (!Number.isFinite(numDaysInWeek) || numDaysInWeek < 1 || numDaysInWeek > 31) {
    throw new Error("Invalid fantasy matchup dates");
  }
  return {
    weekStart: new Date(`${dates.start}T12:00:00-05:00`),
    weekEnd: new Date(`${dates.end}T12:00:00-05:00`),
    currentDate: now,
    todayDateStr,
    numDaysInWeek,
  };
}

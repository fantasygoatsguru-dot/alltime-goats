import { matchupDates } from '../../supabase/functions/_shared/fantasy-calendar.ts';

let cachedWeeks;

export async function getFantasyWeeks() {
  if (cachedWeeks) return cachedWeeks;
  const response = await fetch('/data/weeks.json');
  if (!response.ok) throw new Error('Unable to load fantasy matchup calendar');
  const { weeks } = await response.json();
  if (!weeks || !Object.keys(weeks).length) throw new Error('Fantasy matchup calendar is empty');
  cachedWeeks = weeks;
  return weeks;
}

export async function getMatchupDates(matchup = {}) {
  if (matchup.week_start && matchup.week_end) return matchupDates({}, matchup);
  return matchupDates(await getFantasyWeeks(), matchup);
}

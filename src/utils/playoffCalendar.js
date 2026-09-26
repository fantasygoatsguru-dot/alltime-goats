// Yahoo's 2026-27 public leagues start their three-week playoffs in Week 20
// (March 15). Private leagues can choose a different starting week.
export const DEFAULT_PLAYOFF_START_WEEK = 20;

export const playoffRoundCount = (playoffTeams) => {
  const teams = Number(playoffTeams);
  return Number.isInteger(teams) && teams >= 2 ? Math.ceil(Math.log2(teams)) : 3;
};

export const playoffWeeksFor = (weeks, startWeek, roundCount) => {
  if (!weeks || !Number.isInteger(startWeek)) return [];
  const selected = Array.from({ length: roundCount }, (_, i) => {
    const number = startWeek + i;
    const week = weeks[number];
    return week?.start && week?.end ? { number, ...week } : null;
  });
  return selected.every(Boolean) ? selected : [];
};

export const playoffStartOptions = (weeks, roundCount) =>
  Object.keys(weeks || {})
    .map(Number)
    .filter((week) => playoffWeeksFor(weeks, week, roundCount).length === roundCount)
    .sort((a, b) => a - b);

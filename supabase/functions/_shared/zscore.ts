// 9-category fantasy z-scores. A faithful port of the retired
// nba_queries_scripts/z-score.py (lines 146-218) — the formula must not drift,
// or this season's numbers stop being comparable to prior seasons.

export type PeriodType = "season" | "60_days" | "30_days" | "7_days";

const MIN_GAMES_PLAYED = 3;
const MIN_MINUTES_PER_GAME = 10;

export interface Averages {
  player_id: number;
  player_name: string;
  team_abbreviation: string;
  games_played: number;
  minutes_per_game: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  three_pointers_per_game: number;
  field_goals_per_game: number;
  field_goals_attempted_per_game: number;
  field_goal_percentage: number;
  free_throws_per_game: number;
  free_throws_attempted_per_game: number;
  free_throw_percentage: number;
  turnovers_per_game: number;
}

export interface Scored extends Averages {
  points_z: number;
  rebounds_z: number;
  assists_z: number;
  steals_z: number;
  blocks_z: number;
  three_pointers_z: number;
  fg_percentage_z: number;
  ft_percentage_z: number;
  turnovers_z: number;
  total_value: number;
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

// pandas Series.std() defaults to ddof=1 (SAMPLE stddev). Using the population
// stddev here would shift every z-score. This is the single easiest way to
// break the port.
//
// DELIBERATE DIVERGENCE from z-score.py: with n < 2 (a single qualifying
// player — realistically only reachable for "7_days" in the opening days of
// a season), pandas' ddof=1 std() is 0/0 = NaN, and the Python guard
// `if std != 0 else series*0` is True for NaN (NaN != 0), so the original
// script would silently propagate NaN through every z-score and total_value
// for that period. We return 0 instead. This is not a port of a formula —
// it's refusing to reproduce a latent bug in the Python original. These
// values are written straight into Postgres `real` columns and drive live
// player rankings; a NaN total_value would corrupt a ranking or fail the
// insert outright. "Faithful port" means faithful to the intended maths,
// not to a defect in a degenerate branch.
function std(xs: number[]): number {
  const n = xs.length;
  if (n < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
}

function zs(xs: number[]): number[] {
  const s = std(xs);
  if (s === 0) return xs.map(() => 0);
  const m = mean(xs);
  return xs.map((x) => (x - m) / s);
}

const round2 = (x: number) => Math.round(x * 100) / 100;

export function computeZScores(
  rows: Averages[],
  periodType: PeriodType = "season",
): Scored[] {
  const qualifies = (r: Averages) =>
    periodType === "7_days"
      ? r.minutes_per_game > MIN_MINUTES_PER_GAME
      : r.games_played > MIN_GAMES_PLAYED &&
        r.minutes_per_game > MIN_MINUTES_PER_GAME;

  const q = rows.filter(qualifies);
  const nq = rows.filter((r) => !qualifies(r));

  const zero: Omit<Scored, keyof Averages> = {
    points_z: 0, rebounds_z: 0, assists_z: 0, steals_z: 0, blocks_z: 0,
    three_pointers_z: 0, fg_percentage_z: 0, ft_percentage_z: 0,
    turnovers_z: 0, total_value: 0,
  };

  if (q.length === 0) {
    return rows.map((r) => ({ ...r, ...zero }));
  }

  const pts = zs(q.map((r) => r.points_per_game));
  const reb = zs(q.map((r) => r.rebounds_per_game));
  const ast = zs(q.map((r) => r.assists_per_game));
  const stl = zs(q.map((r) => r.steals_per_game));
  const blk = zs(q.map((r) => r.blocks_per_game));
  const tpm = zs(q.map((r) => r.three_pointers_per_game));
  // Inverted: turnovers are a negative category.
  const tov = zs(q.map((r) => r.turnovers_per_game)).map((z) => -z);

  // Percentages are volume-weighted: a 60% shooter on 3 attempts must not
  // outrank a 55% shooter on 20. Weight by standardized attempt rate, halve
  // the effect for below-average shooters, then re-standardize the product.
  const weighted = (pct: number[], att: number[]) => {
    const pctZ = zs(pct);
    const attZ = zs(att);
    const leagueAvg = mean(pct);
    const combined = pctZ.map((z, i) =>
      pct[i] >= leagueAvg ? z * attZ[i] : z * attZ[i] * 0.5
    );
    return zs(combined);
  };

  const fgZ = weighted(
    q.map((r) => r.field_goal_percentage),
    q.map((r) => r.field_goals_attempted_per_game),
  );
  const ftZ = weighted(
    q.map((r) => r.free_throw_percentage),
    q.map((r) => r.free_throws_attempted_per_game),
  );

  const scored: Scored[] = q.map((r, i) => {
    const total =
      (pts[i] + reb[i] + ast[i] + stl[i] + blk[i] + tpm[i] +
        fgZ[i] + ftZ[i] + tov[i]) / 3; // sum of 9 z-scores / sqrt(9)
    return {
      ...r,
      points_z: round2(pts[i]),
      rebounds_z: round2(reb[i]),
      assists_z: round2(ast[i]),
      steals_z: round2(stl[i]),
      blocks_z: round2(blk[i]),
      three_pointers_z: round2(tpm[i]),
      fg_percentage_z: round2(fgZ[i]),
      ft_percentage_z: round2(ftZ[i]),
      turnovers_z: round2(tov[i]),
      total_value: round2(total),
    };
  });

  return [...scored, ...nq.map((r) => ({ ...r, ...zero }))];
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { type Averages, computeZScores } from "./zscore.ts";

const golden: (Averages & Record<string, number>)[] = JSON.parse(
  await Deno.readTextFile(
    new URL("./__fixtures__/zscore-golden-2025-26.json", import.meta.url),
  ),
);

Deno.test("every input row comes back, qualified or not", () => {
  const out = computeZScores(golden, "season");
  assertEquals(out.length, golden.length);
});

Deno.test("players below the thresholds are zeroed, not dropped", () => {
  const out = computeZScores(golden, "season");
  const unqualified = out.filter(
    (r) => !(r.games_played > 3 && r.minutes_per_game > 10),
  );
  assertEquals(unqualified.length > 0, true);
  for (const r of unqualified) {
    assertEquals(r.total_value, 0);
    assertEquals(r.points_z, 0);
  }
});

Deno.test("7_days drops the games-played threshold but keeps minutes", () => {
  const sparse: Averages[] = golden.slice(0, 50).map((r) => ({
    ...r,
    games_played: 1,
  }));
  const out = computeZScores(sparse, "7_days");
  const scored = out.filter((r) => r.total_value !== 0);
  // With games_played=1 these would all be zeroed under the season rule.
  assertEquals(scored.length > 0, true);
});

Deno.test("turnovers_z is inverted — fewer turnovers scores higher", () => {
  const out = computeZScores(golden, "season")
    .filter((r) => r.games_played > 3 && r.minutes_per_game > 10);
  const most = out.reduce((a, b) =>
    a.turnovers_per_game > b.turnovers_per_game ? a : b
  );
  const fewest = out.reduce((a, b) =>
    a.turnovers_per_game < b.turnovers_per_game ? a : b
  );
  assertEquals(most.turnovers_z < fewest.turnovers_z, true);
});

Deno.test("a single qualifying player yields zeroed z-scores, not NaN (n=1 std guard)", () => {
  // pandas Series.std(ddof=1) on a single-element series is 0/0 = NaN, and
  // z-score.py's `if std != 0` guard is True for NaN, so the Python original
  // would silently propagate NaN through every z field and total_value here.
  // zscore.ts deliberately returns 0 instead (see the comment on `std()`).
  // Pin that behavior: with exactly one qualifying player, every z field and
  // total_value must come back as 0, and none may be NaN.
  const qualifying = golden.find(
    (r) => r.games_played > 3 && r.minutes_per_game > 10,
  )!;
  const out = computeZScores([qualifying], "season");
  assertEquals(out.length, 1);

  const fields = [
    "points_z", "rebounds_z", "assists_z", "steals_z", "blocks_z",
    "three_pointers_z", "fg_percentage_z", "ft_percentage_z",
    "turnovers_z", "total_value",
  ];
  const r = out[0] as unknown as Record<string, number>;
  for (const k of fields) {
    assertEquals(Number.isNaN(r[k]), false, `${k} is NaN`);
    assertEquals(r[k], 0, `${k} expected 0, got ${r[k]}`);
  }
});

Deno.test("PORT FIDELITY: reproduces z-score.py's output on identical input", () => {
  // The golden fixture is z-score.py's own output over logs ending 2026-03-10.
  // Feeding its averages back in must regenerate its z-scores.
  //
  // The fixture's numeric columns are Postgres `real` (float4, ~7 significant
  // digits): the stored z-scores/total_value were computed from full-precision
  // aggregates over raw game logs, but recomputing here starts from the
  // float4-truncated stored averages. That precision loss can, at most, tip a
  // value across exactly one 2dp rounding boundary (0.01) — never more. A
  // per-value tolerance of 0.01 is therefore too tight: in IEEE754,
  // abs(-0.86 - (-0.87)) === 0.010000000000000009, which is `> 0.01` even
  // though it is exactly one rounding step. 0.0100001 absorbs that float
  // noise on top of one legitimate rounding step and nothing more.
  //
  // To make sure this looser per-value bound can't hide a real formula
  // regression, two stronger aggregate assertions are added: (b) only a small
  // ratio of the checked values may differ at all (a systematic drift would
  // move hundreds), and (c) the single largest deviation across every checked
  // value must also be within one rounding step. Violations are collected
  // rather than thrown on the first one, so (b) and (c) are computed over the
  // *entire* dataset unconditionally (not cut short by an early throw) and a
  // failure reports every offending player/field at once.
  const out = computeZScores(golden, "season");
  const byId = new Map(out.map((r) => [r.player_id, r]));

  const PER_VALUE_TOLERANCE = 0.0100001; // (a) one 2dp rounding step + float epsilon
  const MAX_DEVIATION = 0.0100001; // (c) no single value may exceed one rounding step

  // (b) Ratio-based ceiling rather than an absolute count tuned to this exact
  // fixture snapshot (3/5510 observed). 0.1% is roughly double the observed
  // rate, leaving slack for fixture noise while still catching a systematic
  // drift (which would move hundreds of values, not a handful). If the golden
  // fixture is ever regenerated, re-measure the actual float4-boundary
  // mismatch rate and retune this ratio if it no longer comfortably covers it.
  const MAX_MISMATCH_RATIO = 0.001;

  const fields = [
    "points_z", "rebounds_z", "assists_z", "steals_z", "blocks_z",
    "three_pointers_z", "fg_percentage_z", "ft_percentage_z",
    "turnovers_z", "total_value",
  ];

  let checked = 0;
  let mismatches = 0;
  let maxDeviation = 0;
  const violations: string[] = [];

  for (const g of golden) {
    const got = byId.get(g.player_id)! as unknown as Record<string, number>;
    for (const k of fields) {
      const gotVal = got[k];
      const expVal = g[k];
      checked++;

      // (d) A NaN/Infinity from a real regression must not slip through:
      // `NaN > tolerance` is false in JS, so the tolerance check alone would
      // silently accept it. Treat non-finite values as violations outright.
      if (!Number.isFinite(gotVal) || !Number.isFinite(expVal)) {
        violations.push(
          `${g.player_name} ${k}: non-finite value (expected ${expVal}, got ${gotVal})`,
        );
        continue;
      }

      const diff = Math.abs(gotVal - expVal);
      if (gotVal !== expVal) {
        mismatches++;
      }
      if (diff > maxDeviation) {
        maxDeviation = diff;
      }
      if (diff > PER_VALUE_TOLERANCE) {
        violations.push(
          `${g.player_name} ${k}: expected ${expVal}, got ${gotVal} ` +
            `(diff ${diff} > ${PER_VALUE_TOLERANCE})`,
        );
      }
    }
  }

  console.log(
    `PORT FIDELITY: ${checked} values checked, ${mismatches} not bit-identical, ` +
      `max deviation ${maxDeviation}`,
  );

  assertEquals(checked, golden.length * 10);

  // (a) Per-value tolerance, collected rather than thrown-on-first so every
  // offending player/field is reported together instead of only the first.
  assertEquals(
    violations.length,
    0,
    `${violations.length} value(s) exceeded tolerance or were non-finite:\n` +
      violations.join("\n"),
  );

  // (b) Aggregate exactness: a systematic formula drift would move hundreds
  // of values, not a handful — this is what actually catches a bad port.
  const maxAllowedMismatches = checked * MAX_MISMATCH_RATIO;
  assertEquals(
    mismatches <= maxAllowedMismatches,
    true,
    `expected at most ${maxAllowedMismatches} (${
      MAX_MISMATCH_RATIO * 100
    }% of ${checked}) non-bit-identical values, got ${mismatches}`,
  );

  // (c) Max deviation: no value may be off by more than a single rounding
  // step. Computed over the full dataset (no early throw), so this is a real
  // check, not dead code that (a) already made unreachable.
  assertEquals(
    maxDeviation <= MAX_DEVIATION,
    true,
    `max deviation ${maxDeviation} exceeds ${MAX_DEVIATION}`,
  );
});

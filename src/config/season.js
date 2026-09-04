// Season rollover happens gradually, not on a single day — each of these flips
// when ITS OWN data is ready, so they are deliberately separate constants
// rather than one CURRENT_SEASON. Flipping one must never drag the others.
//
//   STATS_SEASON     the season whose numbers are in player_period_averages.
//                    Flip only once enough games are played for z-scores to
//                    mean anything (~15-20 games in, usually late November).
//   CONTENT_SEASON   what the guides, titles and SEO copy are written for.
//                    Flips early — draft content ships before the season.
//   SCHEDULE_SEASON  what public/data/{schedule,weeks,playoffs}.json hold.
//                    Flips when those files are regenerated (August, once the
//                    NBA releases the schedule): node scripts/build-schedule.js
//
// The edge-function equivalents live in supabase/functions/_shared/season.ts —
// separate deploy unit, same idea. ENTITLEMENT_SEASON (which season a purchased
// pass unlocks) lives there and in PASS_SEASON in ./passes.js.

// The season whose stats the app reads and displays.
//
// ⚠️ FLIP THIS (and STATS_SEASON in supabase/functions/_shared/season.ts, which
// is a separate deploy unit) around late November 2026, once ~15-20 games of
// 2026-27 are played and z-scores mean something. Until then the daily pipeline
// reconciles a finished season and correctly writes nothing — that is expected,
// not a fault. Flipping the edge-function copy requires redeploying every
// function that imports it: retrieve-nba-stats, calculate-player-averages,
// update-nba-stats, weekly-matchup-projection, final-day-matchup-projection,
// yesterday-top-performers.
export const STATS_SEASON = '2025-26';

// Monday of fantasy week 1 for STATS_SEASON. Flips together with STATS_SEASON —
// week math over that season's game logs is anchored here.
// (2026-27 tips off Tue 20 Oct 2026, so its week 1 Monday is 2026-10-19.)
//
// ⚠️ When you flip this to 2026-27, fix getWeekFromDate/getCurrentWeek in
// utils/supabase.js too. They compute a week as floor(daysSinceAnchor / 7) + 1,
// which assumes every week is 7 days. That holds for 2025-26 but NOT for
// 2026-27: Yahoo merges the All-Star-break stub into a single 14-day W17
// (8-21 Feb 2027), so from W18 on those helpers would run one week ahead of
// public/data/weeks.json. Read the week boundaries from weeks.json instead.
export const STATS_SEASON_START = '2025-10-20';

// The season the guides, page titles and SEO copy are written for.
export const CONTENT_SEASON = '2026-27';

// The season loaded from the static schedule files in public/data/.
export const SCHEDULE_SEASON = '2026-27';

// Season constants for the edge functions. Mirrors src/config/season.js on the
// front end — separate deploy unit, same idea: each constant flips when ITS OWN
// data is ready, so a rollover is gradual rather than one big switch.
//
// Changing one of these requires redeploying the functions that import it:
//   supabase functions deploy <name>

// The season whose numbers are in player_period_averages. Flip only once enough
// games are played for z-scores to mean anything (~15-20 games, late November),
// together with STATS_SEASON in src/config/season.js.
// Used by: weekly-matchup-projection, final-day-matchup-projection,
//          yesterday-top-performers
export const STATS_SEASON = "2025-26";

// The season a purchased pass unlocks. Sold ahead of the season it covers, so
// this leads STATS_SEASON by design. Keep in sync with PASS_SEASON in
// src/config/passes.js.
// Used by: polar-webhook
export const ENTITLEMENT_SEASON = "2026-27";

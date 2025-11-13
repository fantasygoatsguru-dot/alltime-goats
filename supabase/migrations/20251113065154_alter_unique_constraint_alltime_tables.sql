-- ===========================================
-- Migration: Alter unique constraint to include team_abbreviation
-- ===========================================

-- Drop the old unique constraint
ALTER TABLE public.alltime_player_season_averages
DROP CONSTRAINT IF EXISTS unique_alltime_player_season;

-- Add a new unique constraint including team_abbreviation
ALTER TABLE public.alltime_player_season_averages
ADD CONSTRAINT unique_alltime_player_season
UNIQUE (player_id, season, team_abbreviation);

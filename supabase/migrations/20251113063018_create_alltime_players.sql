-- =====================================================
-- All-Time NBA Statistics Migration
-- =====================================================

-- ===========================================
-- TABLE: alltime_player_game_logs
-- ===========================================
CREATE TABLE IF NOT EXISTS public.alltime_player_game_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    player_name TEXT NOT NULL,
    game_date DATE NOT NULL,
    team_abbreviation TEXT NOT NULL,
    opponent TEXT,
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    field_goals_attempted INTEGER DEFAULT 0,
    field_goals_made INTEGER DEFAULT 0,
    free_throws_attempted INTEGER DEFAULT 0,
    free_throws_made INTEGER DEFAULT 0,
    three_pointers_made INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    minutes REAL DEFAULT 0,
    fantasy_points REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_alltime_player_game UNIQUE (player_id, game_date, season)
);

-- Indexes for alltime_player_game_logs
CREATE INDEX IF NOT EXISTS idx_alltime_game_logs_player_id ON public.alltime_player_game_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_alltime_game_logs_season ON public.alltime_player_game_logs(season);
CREATE INDEX IF NOT EXISTS idx_alltime_game_logs_game_date ON public.alltime_player_game_logs(game_date);
CREATE INDEX IF NOT EXISTS idx_alltime_game_logs_season_player ON public.alltime_player_game_logs(season, player_id);

-- ===========================================
-- TABLE: alltime_player_season_averages
-- ===========================================
CREATE TABLE IF NOT EXISTS public.alltime_player_season_averages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    player_name TEXT NOT NULL,
    team_abbreviation TEXT NOT NULL,
    games_played INTEGER DEFAULT 0,
    minutes_per_game REAL DEFAULT 0,
    points_per_game REAL DEFAULT 0,
    rebounds_per_game REAL DEFAULT 0,
    assists_per_game REAL DEFAULT 0,
    steals_per_game REAL DEFAULT 0,
    blocks_per_game REAL DEFAULT 0,
    three_pointers_per_game REAL DEFAULT 0,
    field_goals_per_game REAL DEFAULT 0,
    field_goals_attempted_per_game REAL DEFAULT 0,
    field_goal_percentage REAL DEFAULT 0,
    free_throws_per_game REAL DEFAULT 0,
    free_throws_attempted_per_game REAL DEFAULT 0,
    free_throw_percentage REAL DEFAULT 0,
    turnovers_per_game REAL DEFAULT 0,
    points_z REAL DEFAULT 0,
    rebounds_z REAL DEFAULT 0,
    assists_z REAL DEFAULT 0,
    steals_z REAL DEFAULT 0,
    blocks_z REAL DEFAULT 0,
    three_pointers_z REAL DEFAULT 0,
    fg_percentage_z REAL DEFAULT 0,
    ft_percentage_z REAL DEFAULT 0,
    turnovers_z REAL DEFAULT 0,
    total_value REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_alltime_player_season UNIQUE (player_id, season)
);

-- Indexes for alltime_player_season_averages
CREATE INDEX IF NOT EXISTS idx_alltime_season_averages_player_id ON public.alltime_player_season_averages(player_id);
CREATE INDEX IF NOT EXISTS idx_alltime_season_averages_season ON public.alltime_player_season_averages(season);
CREATE INDEX IF NOT EXISTS idx_alltime_season_averages_total_value ON public.alltime_player_season_averages(total_value DESC);

-- ===========================================
-- Trigger function to update updated_at timestamp
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_alltime_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_alltime_player_game_logs_updated_at
    BEFORE UPDATE ON public.alltime_player_game_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_alltime_stats_updated_at();

CREATE TRIGGER update_alltime_player_season_averages_updated_at
    BEFORE UPDATE ON public.alltime_player_season_averages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_alltime_stats_updated_at();

-- ===========================================
-- Row-Level Security (RLS) Policies
-- ===========================================
ALTER TABLE public.alltime_player_game_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alltime_player_season_averages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view alltime player game logs"
    ON public.alltime_player_game_logs
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view alltime player season averages"
    ON public.alltime_player_season_averages
    FOR SELECT
    USING (true);

-- Service role full access
CREATE POLICY "Service role can manage alltime player game logs"
    ON public.alltime_player_game_logs
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage alltime player season averages"
    ON public.alltime_player_season_averages
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ===========================================
-- Documentation
-- ===========================================
COMMENT ON TABLE public.alltime_player_game_logs IS 'Historical individual game statistics for NBA players';
COMMENT ON TABLE public.alltime_player_season_averages IS 'Historical season averages and z-scores for NBA players';

COMMENT ON COLUMN public.alltime_player_game_logs.fantasy_points IS 'Calculated fantasy points for the game';
COMMENT ON COLUMN public.alltime_player_season_averages.total_value IS 'Aggregate z-score value across all categories';
COMMENT ON COLUMN public.alltime_player_season_averages.points_z IS 'Z-score for points per game compared to league';

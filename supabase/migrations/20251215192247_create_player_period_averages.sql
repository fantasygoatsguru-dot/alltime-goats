-- =====================================================
-- Player Period Averages Table Migration
-- =====================================================
-- This table stores calculated averages and z-scores for players
-- over different time periods (season, last 60 days, last 30 days, last 7 days)

CREATE TABLE IF NOT EXISTS player_period_averages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    player_name TEXT NOT NULL,
    team_abbreviation TEXT NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('season', '60_days', '30_days', '7_days')),
    period_start_date TEXT,
    period_end_date TEXT,
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
    -- Z-scores for fantasy value comparison
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
    
    -- Unique constraint for season/player/period combination
    CONSTRAINT unique_player_season_period UNIQUE (player_id, season, period_type)
);

-- Indexes for player_period_averages
CREATE INDEX IF NOT EXISTS idx_player_period_averages_player_id ON player_period_averages(player_id);
CREATE INDEX IF NOT EXISTS idx_player_period_averages_season ON player_period_averages(season);
CREATE INDEX IF NOT EXISTS idx_player_period_averages_period_type ON player_period_averages(period_type);
CREATE INDEX IF NOT EXISTS idx_player_period_averages_total_value ON player_period_averages(total_value DESC);
CREATE INDEX IF NOT EXISTS idx_player_period_averages_season_period ON player_period_averages(season, period_type);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_player_period_averages_updated_at
    BEFORE UPDATE ON player_period_averages
    FOR EACH ROW
    EXECUTE FUNCTION update_nba_stats_updated_at();

-- Row Level Security (RLS)
ALTER TABLE player_period_averages ENABLE ROW LEVEL SECURITY;

-- Public read access (data is public sports statistics)
CREATE POLICY "Anyone can view player period averages"
    ON player_period_averages FOR SELECT
    USING (true);

-- Service role can manage all data
CREATE POLICY "Service role can manage period averages"
    ON player_period_averages FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Comments for documentation
COMMENT ON TABLE player_period_averages IS 'Player averages and z-scores for different time periods (season, 60 days, 30 days, 7 days)';
COMMENT ON COLUMN player_period_averages.period_type IS 'Time period type: season, 60_days, 30_days, or 7_days';
COMMENT ON COLUMN player_period_averages.period_start_date IS 'Start date of the calculation period';
COMMENT ON COLUMN player_period_averages.period_end_date IS 'End date of the calculation period';
COMMENT ON COLUMN player_period_averages.total_value IS 'Aggregate z-score value across all categories';



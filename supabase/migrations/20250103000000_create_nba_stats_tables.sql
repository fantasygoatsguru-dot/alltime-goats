-- =====================================================
-- NBA Statistics Tables Migration
-- =====================================================

-- Table 1: player_game_logs
-- Stores individual game statistics for each player
CREATE TABLE IF NOT EXISTS player_game_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    player_name TEXT NOT NULL,
    game_date TEXT NOT NULL,
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
    
    -- Unique constraint to prevent duplicate game logs
    CONSTRAINT unique_player_game UNIQUE (player_id, game_date, season)
);

-- Indexes for player_game_logs
CREATE INDEX IF NOT EXISTS idx_player_game_logs_player_id ON player_game_logs(player_id);
CREATE INDEX IF NOT EXISTS idx_player_game_logs_season ON player_game_logs(season);
CREATE INDEX IF NOT EXISTS idx_player_game_logs_game_date ON player_game_logs(game_date);
CREATE INDEX IF NOT EXISTS idx_player_game_logs_season_player ON player_game_logs(season, player_id);

-- Table 2: player_season_averages
-- Stores calculated season averages and z-scores for each player
CREATE TABLE IF NOT EXISTS player_season_averages (
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
    
    -- Unique constraint for season/player combination
    CONSTRAINT unique_player_season UNIQUE (player_id, season)
);

-- Indexes for player_season_averages
CREATE INDEX IF NOT EXISTS idx_player_season_averages_player_id ON player_season_averages(player_id);
CREATE INDEX IF NOT EXISTS idx_player_season_averages_season ON player_season_averages(season);
CREATE INDEX IF NOT EXISTS idx_player_season_averages_total_value ON player_season_averages(total_value DESC);

-- Table 3: yahoo_nba_mapping
-- Maps NBA API player IDs to Yahoo Fantasy IDs
CREATE TABLE IF NOT EXISTS yahoo_nba_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nba_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    yahoo_id INTEGER,
    team TEXT,
    position TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for yahoo_nba_mapping
CREATE INDEX IF NOT EXISTS idx_yahoo_nba_mapping_nba_id ON yahoo_nba_mapping(nba_id);
CREATE INDEX IF NOT EXISTS idx_yahoo_nba_mapping_yahoo_id ON yahoo_nba_mapping(yahoo_id);
CREATE INDEX IF NOT EXISTS idx_yahoo_nba_mapping_name ON yahoo_nba_mapping(name);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nba_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to all tables
CREATE TRIGGER update_player_game_logs_updated_at
    BEFORE UPDATE ON player_game_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_nba_stats_updated_at();

CREATE TRIGGER update_player_season_averages_updated_at
    BEFORE UPDATE ON player_season_averages
    FOR EACH ROW
    EXECUTE FUNCTION update_nba_stats_updated_at();

CREATE TRIGGER update_yahoo_nba_mapping_updated_at
    BEFORE UPDATE ON yahoo_nba_mapping
    FOR EACH ROW
    EXECUTE FUNCTION update_nba_stats_updated_at();

-- Row Level Security (RLS)
ALTER TABLE player_game_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_season_averages ENABLE ROW LEVEL SECURITY;
ALTER TABLE yahoo_nba_mapping ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (data is public sports statistics)
CREATE POLICY "Anyone can view player game logs"
    ON player_game_logs FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view player season averages"
    ON player_season_averages FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view yahoo nba mapping"
    ON yahoo_nba_mapping FOR SELECT
    USING (true);

-- Service role can manage all data
CREATE POLICY "Service role can manage game logs"
    ON player_game_logs FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage season averages"
    ON player_season_averages FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role can manage mapping"
    ON yahoo_nba_mapping FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Comments for documentation
COMMENT ON TABLE player_game_logs IS 'Individual game statistics for NBA players';
COMMENT ON TABLE player_season_averages IS 'Season averages and z-scores for NBA players';
COMMENT ON TABLE yahoo_nba_mapping IS 'Mapping between NBA API IDs and Yahoo Fantasy IDs';

COMMENT ON COLUMN player_game_logs.fantasy_points IS 'Calculated fantasy points for the game';
COMMENT ON COLUMN player_season_averages.total_value IS 'Aggregate z-score value across all categories';
COMMENT ON COLUMN player_season_averages.points_z IS 'Z-score for points per game compared to league';


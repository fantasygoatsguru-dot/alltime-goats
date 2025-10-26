-- Create table for storing Yahoo OAuth tokens
CREATE TABLE IF NOT EXISTS yahoo_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'bearer',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_yahoo_tokens_user_id ON yahoo_tokens(user_id);
CREATE INDEX idx_yahoo_tokens_expires_at ON yahoo_tokens(expires_at);

-- Create table for storing Yahoo Fantasy matchup data
CREATE TABLE IF NOT EXISTS yahoo_matchups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    league_id TEXT NOT NULL,
    matchup_week INTEGER NOT NULL,
    team1_key TEXT NOT NULL,
    team1_name TEXT NOT NULL,
    team2_key TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    matchup_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, league_id, matchup_week)
);

-- Create indexes for matchup lookups
CREATE INDEX idx_yahoo_matchups_user_id ON yahoo_matchups(user_id);
CREATE INDEX idx_yahoo_matchups_league_id ON yahoo_matchups(league_id);
CREATE INDEX idx_yahoo_matchups_week ON yahoo_matchups(matchup_week);

-- Create table for caching Yahoo Fantasy player data
CREATE TABLE IF NOT EXISTS yahoo_fantasy_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_key TEXT UNIQUE NOT NULL,
    player_name TEXT NOT NULL,
    team_key TEXT,
    team_name TEXT,
    position_type TEXT,
    eligible_positions TEXT[],
    stats JSONB,
    season TEXT NOT NULL DEFAULT '2025-26',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for player lookups
CREATE INDEX idx_yahoo_fantasy_players_key ON yahoo_fantasy_players(player_key);
CREATE INDEX idx_yahoo_fantasy_players_name ON yahoo_fantasy_players(player_name);
CREATE INDEX idx_yahoo_fantasy_players_season ON yahoo_fantasy_players(season);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_yahoo_tokens_updated_at
    BEFORE UPDATE ON yahoo_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yahoo_matchups_updated_at
    BEFORE UPDATE ON yahoo_matchups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yahoo_fantasy_players_updated_at
    BEFORE UPDATE ON yahoo_fantasy_players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE yahoo_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE yahoo_matchups ENABLE ROW LEVEL SECURITY;
ALTER TABLE yahoo_fantasy_players ENABLE ROW LEVEL SECURITY;

-- Create policies for yahoo_tokens
CREATE POLICY "Users can view their own tokens"
    ON yahoo_tokens FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own tokens"
    ON yahoo_tokens FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own tokens"
    ON yahoo_tokens FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policies for yahoo_matchups
CREATE POLICY "Users can view their own matchups"
    ON yahoo_matchups FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own matchups"
    ON yahoo_matchups FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own matchups"
    ON yahoo_matchups FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policies for yahoo_fantasy_players (public read for cached data)
CREATE POLICY "Anyone can view player data"
    ON yahoo_fantasy_players FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage player data"
    ON yahoo_fantasy_players FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');


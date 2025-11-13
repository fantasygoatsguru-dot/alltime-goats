-- =====================================================
-- All-Time NBA Player Info Migration
-- =====================================================

-- ===========================================
-- TABLE: alltime_player_info
-- ===========================================
CREATE TABLE IF NOT EXISTS public.alltime_player_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id INTEGER NOT NULL UNIQUE,
    player_name TEXT NOT NULL,
    birthdate DATE,
    nationality TEXT,
    college TEXT,
    height TEXT,
    weight INTEGER,
    season_experience INTEGER DEFAULT 0,
    jersey TEXT,
    position TEXT,
    from_year INTEGER,
    to_year INTEGER,
    team_name TEXT,
    team_abbreviation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Indexes for faster lookup
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_alltime_player_info_player_id ON public.alltime_player_info(player_id);
CREATE INDEX IF NOT EXISTS idx_alltime_player_info_name ON public.alltime_player_info(player_name);
CREATE INDEX IF NOT EXISTS idx_alltime_player_info_team ON public.alltime_player_info(team_abbreviation);

-- ===========================================
-- Trigger function to update updated_at timestamp
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_alltime_player_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger
CREATE TRIGGER update_alltime_player_info_updated_at
    BEFORE UPDATE ON public.alltime_player_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_alltime_player_info_updated_at();

-- ===========================================
-- Row-Level Security (RLS) Policies
-- ===========================================
ALTER TABLE public.alltime_player_info ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view player info)
CREATE POLICY "Anyone can view alltime player info"
    ON public.alltime_player_info
    FOR SELECT
    USING (true);

-- Service role full access
CREATE POLICY "Service role can manage alltime player info"
    ON public.alltime_player_info
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ===========================================
-- Documentation
-- ===========================================
COMMENT ON TABLE public.alltime_player_info IS 'Static biographical and career metadata for NBA players (e.g., height, nationality, career span)';
COMMENT ON COLUMN public.alltime_player_info.player_id IS 'Unique numeric identifier for the player';
COMMENT ON COLUMN public.alltime_player_info.birthdate IS 'Date of birth of the player';
COMMENT ON COLUMN public.alltime_player_info.nationality IS 'Player nationality or country of origin';
COMMENT ON COLUMN public.alltime_player_info.height IS 'Player height in feet/inches or cm';
COMMENT ON COLUMN public.alltime_player_info.weight IS 'Player weight in pounds';
COMMENT ON COLUMN public.alltime_player_info.season_experience IS 'Total seasons played';
COMMENT ON COLUMN public.alltime_player_info.from_year IS 'First season played';
COMMENT ON COLUMN public.alltime_player_info.to_year IS 'Last season played';
COMMENT ON COLUMN public.alltime_player_info.team_name IS 'Most recent or primary team name';
COMMENT ON COLUMN public.alltime_player_info.team_abbreviation IS 'Abbreviated team code (e.g., LAL, BOS, CHI)';

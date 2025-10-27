-- =====================================================
-- Migration to Allow Anonymous Inserts to player_season_averages
-- =====================================================

-- Create RLS policy to allow anonymous users to insert into player_season_averages
CREATE POLICY "Anonymous users can insert into player_season_averages"
    ON player_season_averages FOR INSERT
    TO anon
    WITH CHECK (true);

-- Comment for documentation
COMMENT ON POLICY "Anonymous users can insert into player_season_averages" ON player_season_averages
    IS 'Allows anonymous users to insert records into the player_season_averages table';    
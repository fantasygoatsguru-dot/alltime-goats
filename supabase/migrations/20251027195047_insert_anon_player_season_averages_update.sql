-- Create RLS policy to allow anonymous users to update player_season_averages
CREATE POLICY "Anonymous users can update player_season_averages"
    ON player_season_averages FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

COMMENT ON POLICY "Anonymous users can update player_season_averages" ON player_season_averages
    IS 'Allows anonymous users to update records in the player_season_averages table';
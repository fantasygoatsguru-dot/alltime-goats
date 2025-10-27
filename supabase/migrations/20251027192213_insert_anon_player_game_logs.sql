-- =====================================================
-- Migration to Allow Anonymous Inserts to player_game_logs
-- =====================================================

-- Create RLS policy to allow anonymous users to insert into player_game_logs
CREATE POLICY "Anonymous users can insert into player_game_logs"
    ON player_game_logs FOR INSERT
    TO anon
    WITH CHECK (true);

-- Comment for documentation
COMMENT ON POLICY "Anonymous users can insert into player_game_logs" ON player_game_logs
    IS 'Allows anonymous users to insert records into the player_game_logs table';
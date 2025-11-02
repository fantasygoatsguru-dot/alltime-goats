-- Fix fantasy_chat_messages table: Change user_id from UUID to TEXT
-- This migration fixes the issue where user_id was incorrectly defined as UUID
-- Yahoo user IDs are TEXT strings (e.g., GWASQZPEY3BTQW7JSFYBX2VUEQ), not UUIDs
-- This matches the pattern used in other tables: user_profiles, yahoo_tokens, etc.

-- Step 1: Drop the foreign key constraint if it exists
ALTER TABLE IF EXISTS fantasy_chat_messages
DROP CONSTRAINT IF EXISTS fk_user;

-- Step 2: Drop existing RLS policies FIRST (before altering column type)
-- PostgreSQL requires dropping policies that reference a column before altering its type
DROP POLICY IF EXISTS "Users can view their own chat messages" ON fantasy_chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON fantasy_chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON fantasy_chat_messages;

-- Step 3: Drop the existing index on user_id (will recreate after type change)
DROP INDEX IF EXISTS idx_fantasy_chat_user_league;

-- Step 4: Change user_id column type from UUID to TEXT
-- This uses USING to convert any existing UUID values to TEXT
-- Since this is a new feature, the table should be empty, but this handles any edge cases
ALTER TABLE IF EXISTS fantasy_chat_messages
ALTER COLUMN user_id TYPE TEXT USING 
    CASE 
        WHEN user_id IS NULL THEN NULL 
        ELSE user_id::text 
    END;

-- Step 5: Recreate the index with TEXT type
CREATE INDEX IF NOT EXISTS idx_fantasy_chat_user_league 
ON fantasy_chat_messages(user_id, league_id, created_at DESC);

-- Step 6: Recreate RLS policies using USING (true)
-- Now that the column type is changed, we can recreate the policies
-- Security is enforced at the application level in the edge function
-- This matches the pattern used in user_profiles and other tables
CREATE POLICY "Users can view their own chat messages"
    ON fantasy_chat_messages
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own chat messages"
    ON fantasy_chat_messages
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can delete their own chat messages"
    ON fantasy_chat_messages
    FOR DELETE
    USING (true);

-- Step 7: Add comment to document the column type
COMMENT ON COLUMN fantasy_chat_messages.user_id IS 'Yahoo user ID in TEXT format (e.g., GWASQZPEY3BTQW7JSFYBX2VUEQ). This is a Yahoo identifier, not a Supabase auth UUID.';


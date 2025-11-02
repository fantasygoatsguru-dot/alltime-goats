-- Create table for fantasy chat messages
CREATE TABLE IF NOT EXISTS fantasy_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    league_id TEXT NOT NULL,
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_fantasy_chat_user_league ON fantasy_chat_messages(user_id, league_id, created_at DESC);
CREATE INDEX idx_fantasy_chat_created_at ON fantasy_chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE fantasy_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own messages
CREATE POLICY "Users can view their own chat messages"
    ON fantasy_chat_messages
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own messages
CREATE POLICY "Users can insert their own chat messages"
    ON fantasy_chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own chat messages"
    ON fantasy_chat_messages
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE fantasy_chat_messages IS 'Stores chat conversation history for fantasy basketball AI assistant';


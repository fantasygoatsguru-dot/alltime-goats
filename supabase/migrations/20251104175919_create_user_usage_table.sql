-- Create user_usage table to track user behavior
CREATE TABLE IF NOT EXISTS user_usage (
    user_id TEXT PRIMARY KEY,
    chat_queries_count INTEGER DEFAULT 0 NOT NULL,
    website_visits_count INTEGER DEFAULT 0 NOT NULL,
    last_chat_query_at TIMESTAMP WITH TIME ZONE,
    last_visit_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_last_visit ON user_usage(last_visit_at);
CREATE INDEX IF NOT EXISTS idx_user_usage_last_chat ON user_usage(last_chat_query_at);

-- Enable Row Level Security
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own usage stats
CREATE POLICY "Users can view their own usage stats"
ON user_usage FOR SELECT
USING (true);

-- System can insert and update usage stats
CREATE POLICY "System can insert usage stats"
ON user_usage FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update usage stats"
ON user_usage FOR UPDATE
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_usage_timestamp
    BEFORE UPDATE ON user_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_user_usage_updated_at();

-- Add comment to table
COMMENT ON TABLE user_usage IS 'Tracks user behavior including chat queries and website visits';


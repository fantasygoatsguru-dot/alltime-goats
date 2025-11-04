-- Create mailing_list table to store unique user emails with their details
CREATE TABLE IF NOT EXISTS mailing_list (
    email TEXT PRIMARY KEY,
    manager_nickname TEXT,
    is_current_user BOOLEAN DEFAULT FALSE,
    league_id TEXT,
    league_name TEXT,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mailing_list_league_id ON mailing_list(league_id);
CREATE INDEX IF NOT EXISTS idx_mailing_list_last_seen ON mailing_list(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_mailing_list_is_current_user ON mailing_list(is_current_user);

-- Enable Row Level Security
ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow system/admin to view all emails
CREATE POLICY "Allow read access to mailing list"
ON mailing_list FOR SELECT
USING (true);

-- Allow system to insert and update
CREATE POLICY "System can insert to mailing list"
ON mailing_list FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update mailing list"
ON mailing_list FOR UPDATE
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mailing_list_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_seen_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at and last_seen_at
CREATE TRIGGER update_mailing_list_timestamp
    BEFORE UPDATE ON mailing_list
    FOR EACH ROW
    EXECUTE FUNCTION update_mailing_list_updated_at();

-- Add comment to table
COMMENT ON TABLE mailing_list IS 'Stores unique user emails from fantasy leagues for mailing purposes';
COMMENT ON COLUMN mailing_list.email IS 'Unique email address (primary key)';
COMMENT ON COLUMN mailing_list.manager_nickname IS 'Manager nickname from Yahoo Fantasy';
COMMENT ON COLUMN mailing_list.is_current_user IS 'Whether this email belongs to the league owner (is_owned_by_current_login)';
COMMENT ON COLUMN mailing_list.league_id IS 'Most recent league ID where this email was found';
COMMENT ON COLUMN mailing_list.league_name IS 'Most recent league name where this email was found';
COMMENT ON COLUMN mailing_list.last_seen_at IS 'Last time this email was seen in any league';


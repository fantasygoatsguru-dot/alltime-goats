-- Add user profile fields to yahoo_tokens table
ALTER TABLE yahoo_tokens
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS given_name TEXT,
ADD COLUMN IF NOT EXISTS family_name TEXT,
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS locale TEXT;

-- Add comment to document the new fields
COMMENT ON COLUMN yahoo_tokens.email IS 'User email address from Yahoo profile';
COMMENT ON COLUMN yahoo_tokens.name IS 'User full name from Yahoo profile';
COMMENT ON COLUMN yahoo_tokens.given_name IS 'User first name from Yahoo profile';
COMMENT ON COLUMN yahoo_tokens.family_name IS 'User last name from Yahoo profile';
COMMENT ON COLUMN yahoo_tokens.nickname IS 'User nickname/display name from Yahoo profile';
COMMENT ON COLUMN yahoo_tokens.profile_picture IS 'URL to user profile picture from Yahoo';
COMMENT ON COLUMN yahoo_tokens.locale IS 'User locale/language preference';


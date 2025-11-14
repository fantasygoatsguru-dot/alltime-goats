-- Add columns for promotion filtering to mailing_list table
ALTER TABLE mailing_list ADD COLUMN IF NOT EXISTS avoid_promotions BOOLEAN DEFAULT FALSE;
ALTER TABLE mailing_list ADD COLUMN IF NOT EXISTS promotion_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE mailing_list ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Add indexes for faster filtering queries
CREATE INDEX IF NOT EXISTS idx_mailing_list_avoid_promotions ON mailing_list(avoid_promotions);
CREATE INDEX IF NOT EXISTS idx_mailing_list_promotion_sent ON mailing_list(promotion_sent);
CREATE INDEX IF NOT EXISTS idx_mailing_list_is_admin ON mailing_list(is_admin);

-- Add comments
COMMENT ON COLUMN mailing_list.avoid_promotions IS 'When true, user will not receive promotional emails';
COMMENT ON COLUMN mailing_list.promotion_sent IS 'Tracks if promotion email has been sent to this user';
COMMENT ON COLUMN mailing_list.is_admin IS 'Marks admin users';


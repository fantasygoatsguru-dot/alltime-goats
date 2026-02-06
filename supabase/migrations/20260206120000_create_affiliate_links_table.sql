CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_active_order
ON affiliate_links(is_active, sort_order)
WHERE is_active = true;

ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active affiliate links"
ON affiliate_links FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can manage affiliate links"
ON affiliate_links FOR ALL
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_affiliate_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_links_timestamp
    BEFORE UPDATE ON affiliate_links
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_links_updated_at();

COMMENT ON TABLE affiliate_links IS 'Editable affiliate offer links shown in the affiliate offers button (max 3 on frontend).';

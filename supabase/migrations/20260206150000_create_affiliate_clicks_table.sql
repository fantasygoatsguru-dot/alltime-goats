CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link_id ON affiliate_clicks(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a click (anonymous tracking)"
ON affiliate_clicks FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated and service role can read click stats"
ON affiliate_clicks FOR SELECT
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

COMMENT ON TABLE affiliate_clicks IS 'Tracks clicks on affiliate links; no login required. Use SELECT for analytics.';

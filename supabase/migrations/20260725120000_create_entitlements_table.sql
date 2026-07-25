-- Entitlements: paid Draft/Season/Combo passes, sold as one-time seasonal
-- purchases (not subscriptions) via LemonSqueezy.
--
-- Keyed on auth_user_id (Supabase Auth), not the legacy Yahoo user_id, per
-- the account-layer split introduced in 20260721120000_add_auth_user_link.sql:
-- Supabase Auth is "who you are" and owns entitlements; Yahoo is just a
-- per-tool data-source connection. A "combo" row satisfies both a 'draft'
-- and a 'season' check in application code — it is not expanded into two rows.

CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pass_type TEXT NOT NULL CHECK (pass_type IN ('draft', 'season', 'combo')),
    season TEXT NOT NULL, -- e.g. '2026-27'
    source TEXT NOT NULL DEFAULT 'lemonsqueezy',
    external_order_id TEXT, -- LemonSqueezy order id, for webhook idempotency
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent duplicate inserts if a webhook delivery is retried.
CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_external_order_id
    ON public.entitlements(external_order_id)
    WHERE external_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_entitlements_auth_user_id ON public.entitlements(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_lookup ON public.entitlements(auth_user_id, season, pass_type);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Users can read only their own entitlements. Writes happen exclusively via
-- the LemonSqueezy webhook edge function using the service role key, which
-- bypasses RLS, so no INSERT/UPDATE policy is granted to end users here.
CREATE POLICY "Users can view their own entitlements"
    ON public.entitlements
    FOR SELECT
    USING (auth.uid() = auth_user_id);

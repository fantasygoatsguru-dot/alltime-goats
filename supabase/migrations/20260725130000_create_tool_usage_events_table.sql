-- Tracks free (non-pass) usage of premium-gated tools, so occasional users
-- can keep trying tools without a pass while frequent users hit a weekly cap
-- and get pushed toward buying a Season Pass.
--
-- One row per (user, tool, day): visiting the same tool repeatedly in one day
-- only ever counts once, so refreshes/re-navigation can't burn the quota.
-- Weekly usage is computed by the client as distinct rows since the most
-- recent Monday (calendar week, not the NBA-schedule fantasy week used
-- elsewhere in the app — this is a generic trial cadence, not schedule data).

CREATE TABLE IF NOT EXISTS public.tool_usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL,
    used_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_usage_events_dedupe
    ON public.tool_usage_events(auth_user_id, tool_id, used_on);

CREATE INDEX IF NOT EXISTS idx_tool_usage_events_user_week
    ON public.tool_usage_events(auth_user_id, used_on);

ALTER TABLE public.tool_usage_events ENABLE ROW LEVEL SECURITY;

-- Recorded client-side at the moment a signed-in user actually views a
-- gated tool without a pass, so both read and insert are scoped to the
-- caller's own rows via their Supabase Auth session.
CREATE POLICY "Users can view their own tool usage"
    ON public.tool_usage_events
    FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can record their own tool usage"
    ON public.tool_usage_events
    FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

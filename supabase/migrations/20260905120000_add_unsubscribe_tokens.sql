-- Unsubscribe tokens for the four email senders.
--
-- Until now every outbound email — the promotional blast to `mailing_list` and
-- the three recurring jobs that mail `user_profiles` — shipped with no way for
-- a recipient to opt out. The opt-out columns existed (mailing_list.avoid_promotions,
-- user_profiles.send_weekly_projections, user_profiles.send_news) but nothing in
-- any email could set them, so the only way off a list was for the operator to
-- flip a boolean by hand.
--
-- These tokens are the per-recipient secret in the unsubscribe URL. They identify
-- WHO is unsubscribing; the `l` query param on the unsubscribe function says WHICH
-- list. A UUID rather than the email address so that addresses do not leak into
-- server logs, browser history, or Referer headers.
--
-- Note on the backfill: gen_random_uuid() is VOLATILE, so Postgres cannot use the
-- fast path that stores a single shared default for pre-existing rows. It rewrites
-- the table and evaluates the default per row, which is exactly what we need — every
-- existing row gets its own distinct token. The unique indexes below are also the
-- assertion that this actually happened: if every row somehow received the same
-- value, index creation fails and the migration aborts rather than shipping a token
-- that unsubscribes the entire list.

ALTER TABLE public.mailing_list
    ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_mailing_list_unsubscribe_token
    ON public.mailing_list(unsubscribe_token);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_unsubscribe_token
    ON public.user_profiles(unsubscribe_token);

COMMENT ON COLUMN public.mailing_list.unsubscribe_token IS
    'Per-recipient secret for the unsubscribe link. Sets avoid_promotions via the unsubscribe edge function.';

COMMENT ON COLUMN public.user_profiles.unsubscribe_token IS
    'Per-recipient secret for the unsubscribe link. Sets send_weekly_projections or send_news via the unsubscribe edge function.';

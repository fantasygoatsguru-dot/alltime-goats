-- Per-campaign send tracking for promotion-email.
--
-- The old promo tracked delivery with a single boolean, promotion_sent, which is
-- already TRUE for everyone who got last season's "Introducing Fantasy Goats Guru"
-- mail, and a boolean cannot tell one campaign from the next. Instead each row
-- records the key of the last campaign it received; promotion-email skips rows
-- whose value equals its CAMPAIGN constant and stamps each row right after the
-- send succeeds. A new campaign is then a code change only.
--
-- promotion-email reads and writes this column on every run, so the function
-- fails (and sends nothing) until this is pushed.
--
-- promotion_sent is left in place, no longer written, as the record of the
-- first campaign.

ALTER TABLE public.mailing_list
    ADD COLUMN IF NOT EXISTS last_campaign_sent TEXT;

CREATE INDEX IF NOT EXISTS idx_mailing_list_last_campaign_sent
    ON public.mailing_list(last_campaign_sent);

COMMENT ON COLUMN public.mailing_list.last_campaign_sent IS
    'Key of the last promotional campaign mailed to this address (e.g. rankings-guide-2026-27). Set by the promotion-email edge function.';

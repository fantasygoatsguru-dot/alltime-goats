-- Site users on mailing_list, so promotions can go to them first.
--
-- mailing_list was filled from Yahoo league rosters: league-mates of people who
-- connected, not the people who connected. As of 2026-10-04 only 108 of its
-- 6,558 addresses belong to someone who actually used the site, and 572 of the
-- 680 site users (yahoo_tokens ∪ user_profiles) are not on it at all.
--
-- This adds is_site_user, flags the existing overlap, and inserts the missing
-- site users so the promotion-email function (SITE_USERS_ONLY) can mail them
-- with the same unsubscribe and campaign tracking as every other row.
--
-- Why not mailing_list.is_current_user: yahoo-fantasy-api splices the caller's
-- own team out before the loop that upserts mailing_list, so it only ever writes
-- false, and a league-mate's load overwrites the row again. It is not reliable.
-- is_site_user is never written by that upsert, so it cannot be clobbered.
--
-- This is a snapshot. People who connect after this runs are not added; re-run
-- the INSERT below before a future campaign if they should be included.

ALTER TABLE public.mailing_list
    ADD COLUMN IF NOT EXISTS is_site_user BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_mailing_list_is_site_user
    ON public.mailing_list(is_site_user);

COMMENT ON COLUMN public.mailing_list.is_site_user IS
    'Address belongs to someone who connected Yahoo on the site (yahoo_tokens / user_profiles), not just a league-mate. Never written by the yahoo-fantasy-api roster upsert.';

-- The timestamp trigger stamps last_seen_at on every UPDATE. last_seen_at means
-- "last seen in a Yahoo league", so a bookkeeping update must not move it.
ALTER TABLE public.mailing_list DISABLE TRIGGER update_mailing_list_timestamp;

WITH site_users AS (
    SELECT lower(trim(email)) AS email FROM public.yahoo_tokens WHERE nullif(trim(email), '') IS NOT NULL
    UNION
    SELECT lower(trim(email)) FROM public.user_profiles WHERE nullif(trim(email), '') IS NOT NULL
)
UPDATE public.mailing_list m
SET is_site_user = TRUE
FROM site_users s
WHERE lower(trim(m.email)) = s.email;

ALTER TABLE public.mailing_list ENABLE TRIGGER update_mailing_list_timestamp;

-- One row per site user not already on the list (matched case-insensitively,
-- since mailing_list.email is a case-sensitive primary key).
--
-- manager_nickname takes the Yahoo given name where there is one: it is what
-- the email greeting uses, and "Hi Dana," beats a league handle.
--
-- avoid_promotions: anyone who turned off news emails in user_profiles is
-- treated as not wanting promotions either. They opted out of a different list,
-- but mailing them a promo the week after is how a sender earns a spam report.
INSERT INTO public.mailing_list (email, manager_nickname, is_site_user, avoid_promotions)
SELECT DISTINCT ON (s.email)
    s.email,
    coalesce(nullif(trim(yt.given_name), ''), nullif(trim(yt.nickname), ''), nullif(trim(up.name), '')),
    TRUE,
    coalesce(up.send_news = FALSE, FALSE)
FROM (
    SELECT lower(trim(email)) AS email FROM public.yahoo_tokens WHERE nullif(trim(email), '') IS NOT NULL
    UNION
    SELECT lower(trim(email)) FROM public.user_profiles WHERE nullif(trim(email), '') IS NOT NULL
) s
LEFT JOIN public.yahoo_tokens yt ON lower(trim(yt.email)) = s.email
LEFT JOIN public.user_profiles up ON lower(trim(up.email)) = s.email
WHERE NOT EXISTS (
    SELECT 1 FROM public.mailing_list m WHERE lower(trim(m.email)) = s.email
)
-- Prefer the most recently refreshed Yahoo row, and an opted-out profile over
-- an opted-in one, when an address appears more than once.
ORDER BY s.email, (up.send_news = FALSE) DESC NULLS LAST, yt.updated_at DESC NULLS LAST;

-- The same rule for site users who were already on the list.
ALTER TABLE public.mailing_list DISABLE TRIGGER update_mailing_list_timestamp;

UPDATE public.mailing_list m
SET avoid_promotions = TRUE
FROM public.user_profiles up
WHERE lower(trim(up.email)) = lower(trim(m.email))
  AND up.send_news = FALSE
  AND m.avoid_promotions IS DISTINCT FROM TRUE;

ALTER TABLE public.mailing_list ENABLE TRIGGER update_mailing_list_timestamp;

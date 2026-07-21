-- Auth foundation, Phase 1 + 2: link legacy Yahoo-keyed identities to Supabase Auth.
--
-- Context: today every user is keyed by a TEXT user_id = the Yahoo OpenID `sub`
-- (yahoo_tokens.user_id, user_profiles.user_id, yahoo_matchups.user_id, etc.).
-- Supabase Auth is currently unused. We are ADDING an account layer, not migrating
-- one: this migration only adds a nullable link column + a bridge, and never
-- rewrites or deletes an existing row, so no existing user is affected.
--
-- Live data at authoring time (2026-07-21): yahoo_tokens has email on 651/651 rows
-- and user_profiles on 563/568, so the email bridge below auto-links almost everyone
-- the moment they first sign in with Supabase Auth (Google or email magic link) —
-- both of which prove control of the email address, so matching on it is safe.

-- ── Phase 1: link columns ────────────────────────────────────────────────────
-- ON DELETE SET NULL: deleting a Supabase account unlinks the legacy row rather
-- than cascading away a user's Yahoo tokens / profile / history.

ALTER TABLE public.yahoo_tokens
    ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_yahoo_tokens_auth_user_id ON public.yahoo_tokens(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);

-- ── Phase 2: auto-bridge by email on first Supabase sign-in ───────────────────
-- Runs server-side when a new auth.users row is created. Case-insensitively
-- matches the verified sign-in email against the email Yahoo already gave us and
-- links any still-unlinked legacy rows. New users with no Yahoo history simply
-- match nothing. This links existing rows only; it never creates rows here.

CREATE OR REPLACE FUNCTION public.link_legacy_identities_by_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.email IS NULL THEN
        RETURN NEW;
    END IF;

    UPDATE public.yahoo_tokens
       SET auth_user_id = NEW.id
     WHERE auth_user_id IS NULL
       AND email IS NOT NULL
       AND lower(email) = lower(NEW.email);

    UPDATE public.user_profiles
       SET auth_user_id = NEW.id
     WHERE auth_user_id IS NULL
       AND email IS NOT NULL
       AND lower(email) = lower(NEW.email);

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_link_legacy ON auth.users;
CREATE TRIGGER on_auth_user_created_link_legacy
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.link_legacy_identities_by_email();

-- ── One-time backfill for accounts created before this migration ──────────────
-- Harmless if there are none yet (Supabase Auth is currently unused).
UPDATE public.yahoo_tokens t
   SET auth_user_id = u.id
  FROM auth.users u
 WHERE t.auth_user_id IS NULL
   AND t.email IS NOT NULL
   AND lower(t.email) = lower(u.email);

UPDATE public.user_profiles p
   SET auth_user_id = u.id
  FROM auth.users u
 WHERE p.auth_user_id IS NULL
   AND p.email IS NOT NULL
   AND lower(p.email) = lower(u.email);

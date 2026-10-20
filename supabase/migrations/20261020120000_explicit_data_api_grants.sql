-- Explicit Data API grants for every table in public.
--
-- From 2026-10-30 Supabase stops granting anon / authenticated / service_role
-- access to new tables in public automatically. Until now every table here got
-- those grants from the schema's default privileges, so no migration ever wrote
-- a GRANT. Existing tables on the live project keep theirs, but anything that
-- rebuilds the schema from these migrations (supabase db reset, preview
-- branches, a new project) would create every table with no API access, and
-- supabase-js would fail with "permission denied".
--
-- This writes the grants down. On the live project it is a no-op: as of
-- 2026-10-20 all 24 tables below already hold these privileges (plus
-- REFERENCES/TRIGGER/TRUNCATE, which PostgREST never uses). Access is still
-- decided per row by each table's RLS policies; these grants only let the
-- request reach the policies.
--
-- From now on, a migration that creates a table in public must grant on it in
-- the same file (see CLAUDE.md).

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.affiliate_clicks,
  public.affiliate_links,
  public.alltime_player_game_logs,
  public.alltime_player_info,
  public.alltime_player_season_averages,
  public.blog_mailing_list,
  public.entitlements,
  public.fantasy_chat_messages,
  public.knowledge,
  public.mailing_list,
  public.nba_player_id_map,
  public.player_game_logs,
  public.player_period_averages,
  public.player_season_averages,
  public.post_comments,
  public.post_likes,
  public.stats_ingest_runs,
  public.tool_usage_events,
  public.user_profiles,
  public.user_usage,
  public.yahoo_fantasy_players,
  public.yahoo_matchups,
  public.yahoo_nba_mapping,
  public.yahoo_tokens
TO anon, authenticated;

GRANT ALL ON TABLE
  public.affiliate_clicks,
  public.affiliate_links,
  public.alltime_player_game_logs,
  public.alltime_player_info,
  public.alltime_player_season_averages,
  public.blog_mailing_list,
  public.entitlements,
  public.fantasy_chat_messages,
  public.knowledge,
  public.mailing_list,
  public.nba_player_id_map,
  public.player_game_logs,
  public.player_period_averages,
  public.player_season_averages,
  public.post_comments,
  public.post_likes,
  public.stats_ingest_runs,
  public.tool_usage_events,
  public.user_profiles,
  public.user_usage,
  public.yahoo_fantasy_players,
  public.yahoo_matchups,
  public.yahoo_nba_mapping,
  public.yahoo_tokens
TO service_role;

-- knowledge.id is a serial; inserting a row needs the sequence too.
GRANT USAGE, SELECT, UPDATE ON SEQUENCE public.knowledge_id_seq
TO anon, authenticated, service_role;

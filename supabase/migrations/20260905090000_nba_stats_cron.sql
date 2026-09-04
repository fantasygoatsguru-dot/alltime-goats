-- Daily NBA stats refresh: pg_cron -> update-nba-stats.
--
-- Created DORMANT (active = false) on purpose. The 2026-27 season tips off on
-- 2026-10-20; until then a daily run would reconcile a finished season and
-- correctly do nothing. Activate it in October:
--
--     select cron.alter_job(
--       (select jobid from cron.job where jobname = 'nba-stats-daily'),
--       active := true
--     );
--
-- Use cron.alter_job, NOT `update cron.job set active = ...`. The migration
-- role has no direct UPDATE privilege on cron.job (SQLSTATE 42501, "permission
-- denied for table job"); alter_job is SECURITY DEFINER and is the supported
-- API. A direct UPDATE here aborted the whole migration on first push.
--
-- To check it afterwards:
--     select jobname, status, start_time, return_message
--     from cron.job_run_details
--     where jobid = (select jobid from cron.job where jobname = 'nba-stats-daily')
--     order by start_time desc limit 10;
--
-- 08:30 UTC is after every US game has finished, including a 10pm PT tip on the
-- west coast. It also sits 2h before the existing "Yesterdays top performers"
-- job (08:35 UTC in its own row) had historically run, so the stats it emails
-- are refreshed first.
--
-- NOTE ON THE EXISTING JOBS: cron.job id 1 is named "Retrieve NBA stats" but
-- actually posts to weekly-matchup-projection. That stale name cost real
-- debugging time when the stats pipeline died in March 2026 — someone looking
-- for the stats job found it, saw it scheduled, and moved on. Renaming it is
-- left to the operator; this migration only adds the correctly-named job.
--
-- The bearer token: the existing cron rows embed a literal service-role JWT in
-- their command text, which puts the key in cron.job in plaintext. This job
-- reads it from a database setting instead. Set it once, as superuser:
--
--     alter database postgres set app.service_role_key = '<service role key>';
--
-- If that setting is absent, current_setting(..., true) returns NULL, the
-- Authorization header is malformed, the function returns 401, and the failure
-- is visible in cron.job_run_details rather than silently doing nothing.

select cron.schedule(
  'nba-stats-daily',
  '30 8 * * *',
  $$
  select net.http_post(
    url := 'https://fqrnmcnvrrujiutstkgb.supabase.co/functions/v1/update-nba-stats',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object('action', 'daily')
  );
  $$
);

-- Dormant until the season starts. cron.schedule() always creates a job as
-- active, so this second call is what makes it dormant.
select cron.alter_job(
  (select jobid from cron.job where jobname = 'nba-stats-daily'),
  active := false
);

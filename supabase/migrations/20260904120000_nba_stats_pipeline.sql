-- NBA stats pipeline rebuild.
--
-- Aggregation moves into SQL because edge functions get 2s of CPU per request.
-- Pulling ~26k game logs into JS to group them would blow that budget; returning
-- ~550 pre-averaged rows per period does not.

-- ---------------------------------------------------------------------------
-- Per-player averages for a date window. Mirrors calculate_averages() in the
-- retired z-score.py (lines 100-140), including "primary team = most games".
-- ---------------------------------------------------------------------------
create or replace function player_period_aggregates(
  p_season text,
  p_start  date,
  p_end    date
)
returns table (
  player_id                      integer,
  player_name                    text,
  team_abbreviation              text,
  games_played                   integer,
  minutes_per_game               double precision,
  points_per_game                double precision,
  rebounds_per_game              double precision,
  assists_per_game               double precision,
  steals_per_game                double precision,
  blocks_per_game                double precision,
  three_pointers_per_game        double precision,
  field_goals_per_game           double precision,
  field_goals_attempted_per_game double precision,
  field_goal_percentage          double precision,
  free_throws_per_game           double precision,
  free_throws_attempted_per_game double precision,
  free_throw_percentage          double precision,
  turnovers_per_game             double precision
)
language sql
stable
security definer
set search_path = public
as $$
  with logs as (
    select *
    from player_game_logs
    where season = p_season
      and game_date::date between p_start and p_end
  ),
  primary_team as (
    select l.player_id, l.team_abbreviation
    from (
      select player_id,
             team_abbreviation,
             row_number() over (
               partition by player_id
               order by count(*) desc, team_abbreviation
             ) as rn
      from logs
      group by player_id, team_abbreviation
    ) l
    where l.rn = 1
  )
  select
    a.player_id,
    a.player_name,
    pt.team_abbreviation,
    a.games_played,
    a.mpg, a.ppg, a.rpg, a.apg, a.spg, a.bpg, a.tpg,
    a.fgm, a.fga,
    case when a.fga > 0 then round((a.fgm / a.fga)::numeric, 3)::double precision else 0 end,
    a.ftm, a.fta,
    case when a.fta > 0 then round((a.ftm / a.fta)::numeric, 3)::double precision else 0 end,
    a.topg
  from (
    select
      player_id,
      max(player_name)                    as player_name,
      count(*)::integer                   as games_played,
      avg(minutes)::double precision      as mpg,
      avg(points)::double precision       as ppg,
      avg(rebounds)::double precision     as rpg,
      avg(assists)::double precision      as apg,
      avg(steals)::double precision       as spg,
      avg(blocks)::double precision       as bpg,
      avg(three_pointers_made)::double precision       as tpg,
      avg(field_goals_made)::double precision          as fgm,
      avg(field_goals_attempted)::double precision     as fga,
      avg(free_throws_made)::double precision          as ftm,
      avg(free_throws_attempted)::double precision     as fta,
      avg(turnovers)::double precision                 as topg
    from logs
    group by player_id
  ) a
  join primary_team pt on pt.player_id = a.player_id;
$$;

comment on function player_period_aggregates(text, date, date) is
  'Per-player per-game averages over a date window. Consumed by the calculate-player-averages edge function, which adds z-scores.';

-- ---------------------------------------------------------------------------
-- Same, but grouped by (player, team) — alltime_player_season_averages is
-- unique on (player_id, season, team_abbreviation) and stores per-team splits
-- for traded players (2023-24: 630 rows across 553 players).
-- ---------------------------------------------------------------------------
create or replace function alltime_season_aggregates(p_season text)
returns table (
  player_id                      integer,
  player_name                    text,
  team_abbreviation              text,
  games_played                   integer,
  minutes_per_game               double precision,
  points_per_game                double precision,
  rebounds_per_game              double precision,
  assists_per_game               double precision,
  steals_per_game                double precision,
  blocks_per_game                double precision,
  three_pointers_per_game        double precision,
  field_goals_per_game           double precision,
  field_goals_attempted_per_game double precision,
  field_goal_percentage          double precision,
  free_throws_per_game           double precision,
  free_throws_attempted_per_game double precision,
  free_throw_percentage          double precision,
  turnovers_per_game             double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    player_id,
    max(player_name),
    team_abbreviation,
    count(*)::integer,
    avg(minutes)::double precision,
    avg(points)::double precision,
    avg(rebounds)::double precision,
    avg(assists)::double precision,
    avg(steals)::double precision,
    avg(blocks)::double precision,
    avg(three_pointers_made)::double precision,
    avg(field_goals_made)::double precision,
    avg(field_goals_attempted)::double precision,
    case when avg(field_goals_attempted) > 0
         then round((avg(field_goals_made) / avg(field_goals_attempted))::numeric, 3)::double precision
         else 0 end,
    avg(free_throws_made)::double precision,
    avg(free_throws_attempted)::double precision,
    case when avg(free_throws_attempted) > 0
         then round((avg(free_throws_made) / avg(free_throws_attempted))::numeric, 3)::double precision
         else 0 end,
    avg(turnovers)::double precision
  from player_game_logs
  where season = p_season
  group by player_id, team_abbreviation;
$$;

-- ---------------------------------------------------------------------------
-- ESPN athlete id -> NBA player id. ESPN is the new source but player_id must
-- stay an NBA.com id: it is the join key to alltime_player_info, which holds
-- 65 seasons of history.
-- ---------------------------------------------------------------------------
create table if not exists nba_player_id_map (
  espn_athlete_id integer primary key,
  nba_player_id   integer not null,
  player_name     text    not null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_nba_player_id_map_nba
  on nba_player_id_map (nba_player_id);

comment on table nba_player_id_map is
  'ESPN athlete id -> NBA player id. Seeded by name from player_game_logs; unmapped athletes are reported in stats_ingest_runs, never guessed.';

-- ---------------------------------------------------------------------------
-- Run log. The old pipeline had none, which is why a fetch outage went
-- unnoticed for a month while the site served truncated averages.
-- ---------------------------------------------------------------------------
create table if not exists stats_ingest_runs (
  id                uuid primary key default gen_random_uuid(),
  action            text        not null,
  status            text        not null check (status in ('running','ok','failed','skipped')),
  started_at        timestamptz not null default now(),
  finished_at       timestamptz,
  rows_written      integer     not null default 0,
  dates_covered     text[],
  unmapped_players  jsonb       not null default '[]'::jsonb,
  error             text
);

create index if not exists idx_stats_ingest_runs_started
  on stats_ingest_runs (started_at desc);

comment on table stats_ingest_runs is
  'Audit trail for the NBA stats pipeline. A failed or partial run must be visible here.';

alter table nba_player_id_map  enable row level security;
alter table stats_ingest_runs  enable row level security;
-- No policies: these are service-role-only. The front end never reads them.

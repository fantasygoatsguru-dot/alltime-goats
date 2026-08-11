import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Chip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ROUNDS, PLAYERS, PRIOR_SEASON } from '../config/top-150-2026-27';

// Name matching against the database — the projection is authored by hand, so
// accents and punctuation have to be normalised away before comparing.
const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const pct = (v) => (v === null || v === undefined ? '–' : `${(v * 100).toFixed(1)}%`);
const num = (v, d = 1) => (v === null || v === undefined ? '–' : v.toFixed(d));

function StatPill({ label, value, muted = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 0.5,
        px: 0.9,
        py: 0.35,
        borderRadius: 1,
        bgcolor: muted ? '#f4f6f8' : '#eef3fb',
        border: '1px solid',
        borderColor: muted ? '#e6e9ee' : '#dce6f5',
      }}
    >
      <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: 0.4, color: '#8b95a3' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f2340', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
    </Box>
  );
}

function PlayerCard({ player, prior }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.75, sm: 2.25 },
        bgcolor: '#fff',
        border: '1px solid #e6e9ee',
        borderRadius: 2,
      }}
    >
      {/* Rank */}
      <Box
        sx={{
          flex: '0 0 auto',
          width: 44,
          height: 44,
          borderRadius: 1.5,
          bgcolor: '#0f2340',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: player.rank >= 100 ? '1rem' : '1.15rem',
        }}
      >
        {player.rank}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.05rem', letterSpacing: -0.3 }}>
            {player.name}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#78828f', letterSpacing: 0.5 }}>
            {player.team}
          </Typography>
        </Box>

        {/* Last season's actual line — evidence under the projection. */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1.25 }}>
          {prior ? (
            <>
              <StatPill label="GP" value={prior.games_played ?? '–'} muted />
              <StatPill label="PTS" value={num(prior.points_per_game)} />
              <StatPill label="3PM" value={num(prior.three_pointers_per_game)} />
              <StatPill label="REB" value={num(prior.rebounds_per_game)} />
              <StatPill label="AST" value={num(prior.assists_per_game)} />
              <StatPill label="STL" value={num(prior.steals_per_game)} />
              <StatPill label="BLK" value={num(prior.blocks_per_game)} />
              <StatPill label="TO" value={num(prior.turnovers_per_game)} />
              <StatPill label="FG" value={pct(prior.field_goal_percentage)} />
              <StatPill label="FT" value={pct(prior.free_throw_percentage)} />
              <StatPill label="VALUE" value={num(prior.total_value, 2)} muted />
            </>
          ) : (
            <Typography sx={{ fontSize: '0.74rem', color: '#a1673c', bgcolor: '#fdf3e8', border: '1px solid #f3e0c9', px: 1, py: 0.4, borderRadius: 1, fontWeight: 600 }}>
              No {PRIOR_SEASON} games — projected from prior seasons
            </Typography>
          )}
        </Box>

        <Typography sx={{ color: '#2c3440', fontSize: '0.94rem', lineHeight: 1.6 }}>{player.note}</Typography>
      </Box>
    </Box>
  );
}

function RoundHeader({ round, lastPick }) {
  return (
    <Box sx={{ mt: 4, mb: 2, pt: 2, borderTop: '2px solid #dfe5ee' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f2340', letterSpacing: -0.4 }}>
          {round.name}
        </Typography>
        <Chip
          label={`Picks ${round.from}–${Math.min(round.to, lastPick)}`}
          size="small"
          sx={{ bgcolor: '#eef3fb', color: '#2f80ed', fontWeight: 800, fontSize: '0.68rem', height: 20 }}
        />
      </Box>
      <Typography sx={{ color: '#5a6472', fontSize: '0.88rem', lineHeight: 1.55, maxWidth: 760 }}>
        {round.blurb}
      </Typography>
    </Box>
  );
}

/**
 * The projected top 150 — an authored ranking (see config/top-150-2026-27.js)
 * with one paragraph per player explaining the placement, shown alongside that
 * player's actual prior-season line pulled live from the database and grouped
 * into rounds of a 12-team draft.
 *
 * Rows past `freeLimit` are blurred behind an unlock prompt, the same freemium
 * teaser the punt boards use.
 */
export default function ProjectionList({
  players = PLAYERS,
  rounds = ROUNDS,
  priorSeason = PRIOR_SEASON,
  freeLimit = 48, // four full rounds
  previewRows = 3,
  unlocked = false,
}) {
  const [priorByName, setPriorByName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('player_period_averages')
          .select(
            'player_name, games_played, points_per_game, three_pointers_per_game, rebounds_per_game, assists_per_game, steals_per_game, blocks_per_game, turnovers_per_game, field_goal_percentage, free_throw_percentage, total_value'
          )
          .eq('season', priorSeason)
          .eq('period_type', 'season');
        if (error) throw error;
        if (active) setPriorByName(new Map((data || []).map((r) => [norm(r.player_name), r])));
      } catch (e) {
        console.error('ProjectionList fetch failed:', e);
        // The projection still reads fine without last season's numbers.
        if (active) setPriorByName(new Map());
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [priorSeason]);

  // Group the ranking into rounds of a 12-team draft, so the list reads the way
  // it is used rather than as 150 undifferentiated rows.
  const grouped = useMemo(
    () =>
      rounds
        .map((round) => ({
          round,
          players: players.filter((p) => p.rank >= round.from && p.rank <= round.to),
        }))
        .filter((g) => g.players.length),
    [players, rounds]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const priorFor = (name) => priorByName?.get(norm(name));
  const visibleTo = unlocked ? players.length : freeLimit;
  const lockedPreview = unlocked ? [] : players.slice(freeLimit, freeLimit + previewRows);

  return (
    <Box>
      {grouped.map(({ round, players: roundPlayers }) => {
        const free = roundPlayers.filter((p) => p.rank <= visibleTo);
        if (!free.length) return null;
        return (
          <Box key={round.id}>
            <RoundHeader round={round} lastPick={players.length} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {free.map((p) => (
                <PlayerCard key={p.rank} player={p} prior={priorFor(p.name)} />
              ))}
            </Box>
          </Box>
        );
      })}

      {/* Everything past the free limit — blurred behind the unlock prompt. */}
      {lockedPreview.length > 0 && (
        <Box sx={{ position: 'relative', mt: 1.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
            {lockedPreview.map((p) => (
              <PlayerCard key={p.rank} player={p} prior={priorFor(p.name)} />
            ))}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.25,
              background: 'linear-gradient(180deg, rgba(245,246,248,0.45) 0%, rgba(245,246,248,0.96) 65%)',
              borderRadius: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#0f2340', fontSize: 28 }} />
            <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.02rem', textAlign: 'center' }}>
              Picks {freeLimit + 1}–{players.length}, with the write-up on every player
            </Typography>
            <Typography sx={{ color: '#667', fontSize: '0.85rem', textAlign: 'center', maxWidth: 380 }}>
              The first {freeLimit} — four full rounds — are free. The rest of the board — where drafts are actually won — comes with a
              Draft Pass.
            </Typography>
            <Button
              component={RouterLink}
              to="/pricing"
              sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
            >
              Unlock the full 150
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

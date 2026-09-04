import React, { useMemo } from 'react';
import { Box, Typography, Button, CircularProgress, Chip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { ROUNDS, PLAYERS, PRIOR_SEASON } from '../config/top-150-2026-27';
import { usePriorSeasonStats } from '../hooks/usePriorSeasonStats';
import PlayerNoteCard from './PlayerNoteCard';

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
 *
 * `renderInterstitial` is an optional node factory dropped between rounds — the
 * caller uses it for an ad. It is deliberately a prop rather than an import:
 * this component knows where its natural breaks are, and the guide page knows
 * what is allowed to go in one. The round boundary is the right seam because
 * it already carries a rule and a header, so an insert there reads as a break
 * in the list rather than an interruption of it.
 */
export default function ProjectionList({
  players = PLAYERS,
  rounds = ROUNDS,
  priorSeason = PRIOR_SEASON,
  freeLimit = 48, // four full rounds
  previewRows = 3,
  unlocked = false,
  renderInterstitial,
}) {
  const { statsFor, loading } = usePriorSeasonStats(priorSeason);

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

  const visibleTo = unlocked ? players.length : freeLimit;
  const lockedPreview = unlocked ? [] : players.slice(freeLimit, freeLimit + previewRows);

  return (
    <Box>
      {grouped.map(({ round, players: roundPlayers }, gi) => {
        const free = roundPlayers.filter((p) => p.rank <= visibleTo);
        if (!free.length) return null;
        return (
          <Box key={round.id}>
            {/* Between rounds only — never above the first, which would put an
                ad between the board's own lead paragraph and its first pick. */}
            {gi > 0 && renderInterstitial?.(gi)}
            <RoundHeader round={round} lastPick={players.length} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {free.map((p) => (
                <PlayerNoteCard key={p.rank} player={p} prior={statsFor(p.name)} />
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
              <PlayerNoteCard key={p.rank} player={p} prior={statsFor(p.name)} />
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
              The first {freeLimit} — four full rounds — are free. The rest of the board, where drafts are actually
              won, comes with a Draft Pass.
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

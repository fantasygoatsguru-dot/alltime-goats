import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { PRIOR_SEASON } from '../config/top-150-2026-27';
import { usePriorSeasonStats } from '../hooks/usePriorSeasonStats';
import PlayerNoteCard from './PlayerNoteCard';

/**
 * An unranked list of player write-ups — the sleepers and busts guides. Same
 * card as the projected top 150, minus the rank badge and round grouping, with
 * an accent colour that carries the verdict (green for buy, red for avoid).
 *
 * Entries past `freeLimit` are blurred behind the usual unlock prompt.
 */
export default function PlayerNotes({
  players = [],
  accent = '#2e9e53',
  priorSeason = PRIOR_SEASON,
  freeLimit = 6,
  previewRows = 2,
  unlocked = false,
  lockedLabel = 'the rest of the list',
}) {
  const { statsFor, loading } = usePriorSeasonStats(priorSeason);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const free = unlocked ? players : players.slice(0, freeLimit);
  const lockedPreview = unlocked ? [] : players.slice(freeLimit, freeLimit + previewRows);
  const remaining = players.length - freeLimit;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {free.map((p) => (
          <PlayerNoteCard key={p.name} player={p} prior={statsFor(p.name)} accent={accent} />
        ))}
      </Box>

      {lockedPreview.length > 0 && (
        <Box sx={{ position: 'relative', mt: 1.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
            {lockedPreview.map((p) => (
              <PlayerNoteCard key={p.name} player={p} prior={statsFor(p.name)} accent={accent} />
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
              {remaining} more, with the full write-up on each
            </Typography>
            <Typography sx={{ color: '#667', fontSize: '0.85rem', textAlign: 'center', maxWidth: 380 }}>
              The first {freeLimit} are free. A Draft Pass unlocks {lockedLabel}.
            </Typography>
            <Button
              component={RouterLink}
              to="/pricing"
              sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
            >
              Unlock the full list
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

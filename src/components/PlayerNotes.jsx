import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { PRIOR_SEASON } from '../config/top-150-2026-27';
import { usePriorSeasonStats } from '../hooks/usePriorSeasonStats';
import PlayerNoteCard from './PlayerNoteCard';
import { GATED_CLASS } from '../config/guides-content';

/**
 * An unranked list of player write-ups — the sleepers and busts guides. Same
 * card as the projected top 150, minus the rank badge and round grouping, with
 * an accent colour that carries the verdict (green for buy, red for avoid).
 *
 * Entries past `freeLimit` are blurred behind the usual unlock prompt.
 *
 * `renderInterstitial` is an optional node factory dropped every
 * `interstitialEvery` cards — the caller uses it for an ad. There is no round
 * structure to hang it on here, so it goes on a straight count. Six, not four:
 * these lists were ungated for draft season and went from 6 cards to 15, and at
 * four the sleepers guide carried five ad units on the page we are actively
 * trying to rank. Six gives it two, roughly one per two screens.
 */
export default function PlayerNotes({
  players = [],
  accent = '#2e9e53',
  priorSeason = PRIOR_SEASON,
  freeLimit = null,
  previewRows = 2,
  unlocked = false,
  lockedLabel = 'the rest of the list',
  // What opens the remainder: a paid Draft Pass, or just a free account. The
  // prompt has to name the right one — telling a reader to buy something they
  // can have for free is the most expensive copy error on the page.
  unlockWith = 'pass',
  onRequireSignIn,
  renderInterstitial,
  interstitialEvery = 6,
}) {
  const { statsFor, loading } = usePriorSeasonStats(priorSeason);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  // A null/absent freeLimit means the list is ungated — every entry is free and
  // no unlock prompt is drawn. The sleepers and busts guides do NOT ship that
  // way: both set a freeLimit (6 and 5) and are unlocked by a free account
  // rather than by the pass. See their playerNotes in config/guides-content.js.
  const gated = !unlocked && Number.isFinite(freeLimit);
  const free = gated ? players.slice(0, freeLimit) : players;
  const lockedPreview = gated ? players.slice(freeLimit, freeLimit + previewRows) : [];
  const remaining = gated ? players.length - freeLimit : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {free.map((p, i) => (
          <React.Fragment key={p.name}>
            {i > 0 && i % interstitialEvery === 0 && renderInterstitial?.(i)}
            <PlayerNoteCard player={p} prior={statsFor(p.name)} accent={accent} />
          </React.Fragment>
        ))}
      </Box>

      {lockedPreview.length > 0 && (
        <Box className={GATED_CLASS} sx={{ position: 'relative', mt: 1.5 }}>
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
              {remaining} more, with the full pass on each
            </Typography>
            <Typography sx={{ color: '#667', fontSize: '0.85rem', textAlign: 'center', maxWidth: 380 }}>
              {unlockWith === 'login'
                ? `The first ${freeLimit} are free to everyone. A free account unlocks ${lockedLabel} — no payment.`
                : `The first ${freeLimit} are free. A Draft Pass unlocks ${lockedLabel}.`}
            </Typography>
            {unlockWith === 'login' ? (
              <Button
                onClick={() => onRequireSignIn?.()}
                sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
              >
                Sign in to read the rest — free
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/pricing"
                sx={{ mt: 0.5, textTransform: 'none', fontWeight: 700, bgcolor: '#0f2340', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b3a63' } }}
              >
                Unlock the full list
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

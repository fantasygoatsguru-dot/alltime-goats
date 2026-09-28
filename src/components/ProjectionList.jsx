import React, { useMemo } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
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
 * The projected 2026-27 top 150 — an authored projection anchored in the
 * corrected 2025-26 production, with each player's actual prior-season line
 * pulled live from the database and grouped
 * into rounds of a 12-team draft.
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

  return (
    <Box>
      {grouped.map(({ round, players: roundPlayers }, gi) => (
        <Box key={round.id}>
          {/* Between rounds only — never above the first, which would put an
              ad between the board's own lead paragraph and its first pick. */}
          {gi > 0 && renderInterstitial?.(gi)}
          <RoundHeader round={round} lastPick={players.length} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {roundPlayers.map((p) => (
              <PlayerNoteCard key={p.rank} player={p} prior={statsFor(p.name)} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

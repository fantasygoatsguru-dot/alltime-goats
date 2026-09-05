import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { supabase, CURRENT_SEASON } from '../utils/supabase';
import { CATEGORIES, categoryByKey } from '../config/guides-content';
import { GATED_CLASS } from '../config/guides-content';

// Same colour ramp the Rankings tool uses, so the numbers read identically
// across the app.
const zBackground = (value) => {
  if (value === null || value === undefined) return 'transparent';
  const max = 3;
  const clamped = Math.max(-max, Math.min(max, value));
  const normalized = (clamped + max) / (2 * max);
  const hue = normalized * 120;
  const strength = Math.abs(clamped) / max;
  return `hsla(${hue}, ${30 + strength * 50}%, ${85 - strength * 35}%, 0.5)`;
};

/**
 * Live z-score board for a guide. Two modes:
 *
 *  - punt (`puntKey` set) — removes that category from the total and re-sorts,
 *    striking the column through. The visual signature of the punt guides.
 *  - pure (`puntKey` null) — all nine categories count, so the order is the
 *    straight 9-cat ranking. Used by the Top 150.
 *
 * `season` is the season the numbers come from (preseason that is last year's,
 * not the one the guide is written for), and `minGames` drops small-sample
 * players who would otherwise ride a hot twenty games into the top 50.
 *
 * Free rows render fully; rows past `freeLimit` are blurred behind an unlock
 * prompt. `unlocked` (the caller's Draft Pass check — Guide.jsx passes
 * useEntitlements().hasPass('draft')) drops the gate entirely and renders all
 * `limit` rows, the same contract <ProjectionList> and <PlayerNotes> use.
 * Without it this table showed a pass holder the same blurred teaser as a
 * stranger, and told everyone the fix was "a Goats account" — a gate that did
 * not exist and would not have unlocked anything if it had.
 */
export default function RankingTable({
  puntKey = null,
  season = CURRENT_SEASON,
  limit = 150,
  minGames = 0,
  freeLimit = 20,
  previewRows = 4,
  unlocked = false,
}) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const punt = categoryByKey[puntKey];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('player_period_averages')
          .select('*')
          .eq('season', season)
          .eq('period_type', 'season');
        if (minGames > 0) query = query.gte('games_played', minGames);

        const { data, error: err } = await query
          .order('total_value', { ascending: false })
          .limit(limit);
        if (err) throw err;
        if (active) setPlayers(data || []);
      } catch (e) {
        console.error('RankingTable fetch failed:', e);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [season, limit, minGames]);

  // Re-rank with the punted category removed from the z-score total.
  const ranked = useMemo(() => {
    if (!players.length) return [];
    const included = CATEGORIES.filter((c) => c.key !== puntKey).map((c) => c.zKey);
    const sqrtN = Math.sqrt(included.length);

    const withAdjusted = players.map((p, idx) => {
      const sum = included.reduce((acc, z) => acc + (p[z] || 0), 0);
      return { ...p, originalRank: idx + 1, adjusted: sum / sqrtN };
    });

    return withAdjusted
      .sort((a, b) => b.adjusted - a.adjusted)
      .map((p, idx) => ({ ...p, adjustedRank: idx + 1, rankChange: p.originalRank - (idx + 1) }));
  }, [players, puntKey]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error || !ranked.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', color: '#888' }}>
        <Typography variant="body2">Rankings are being calculated — check back shortly.</Typography>
      </Box>
    );
  }

  // A pass holder sees the whole board, and so does everyone else when the
  // caller passes no `freeLimit` — a null/absent limit means no gate at all,
  // matching <ProjectionList> and <PlayerNotes>. Otherwise: `freeLimit` rows
  // and a blurred peek at the next few.
  const gated = !unlocked && Number.isFinite(freeLimit);
  const freeRows = gated ? ranked.slice(0, freeLimit) : ranked;
  const lockedRows = gated ? ranked.slice(freeLimit, freeLimit + previewRows) : [];

  const headCellSx = {
    bgcolor: '#0f2340',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.68rem',
    letterSpacing: 0.3,
    py: 1,
    px: 0.75,
    whiteSpace: 'nowrap',
  };

  const renderRow = (p, locked = false) => (
    <TableRow
      key={p.id ?? `${p.player_id}-${locked ? 'l' : 'f'}`}
      sx={{
        '&:hover': locked ? {} : { bgcolor: 'rgba(47,128,237,0.06)' },
      }}
    >
      <TableCell align="center" sx={{ py: 0.75, fontWeight: 700, color: '#0f2340', fontSize: '0.8rem' }}>
        {p.adjustedRank}
        {/* Movement is only meaningful against the unpunted board. */}
        {puntKey && p.rankChange !== 0 && (
          <Typography
            component="span"
            sx={{ ml: 0.4, fontSize: '0.62rem', fontWeight: 600, color: p.rankChange > 0 ? '#2e9e5b' : '#c0392b' }}
          >
            {p.rankChange > 0 ? `↑${p.rankChange}` : `↓${Math.abs(p.rankChange)}`}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ py: 0.75, fontWeight: 600, color: '#1a1a1a', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
        {p.player_name}
      </TableCell>
      <TableCell align="center" sx={{ py: 0.75, color: '#666', fontSize: '0.72rem', fontWeight: 600 }}>
        {p.team_abbreviation}
      </TableCell>
      <TableCell align="center" sx={{ py: 0.75, fontWeight: 800, color: '#0f2340', fontSize: '0.82rem' }}>
        {p.adjusted.toFixed(2)}
      </TableCell>
      {CATEGORIES.map((c) => {
        const punted = c.key === puntKey;
        const z = p[c.zKey];
        return (
          <TableCell
            key={c.key}
            align="center"
            sx={{
              py: 0.75,
              px: 0.5,
              fontSize: '0.72rem',
              fontVariantNumeric: 'tabular-nums',
              bgcolor: punted ? '#f4f4f4' : zBackground(z),
              color: punted ? '#c0392b' : '#222',
              textDecoration: punted ? 'line-through' : 'none',
              opacity: punted ? 0.5 : 1,
            }}
          >
            {z === null || z === undefined ? '–' : z.toFixed(1)}
          </TableCell>
        );
      })}
    </TableRow>
  );

  return (
    <Box sx={{ border: '1px solid #e2e6ec', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={headCellSx}>#</TableCell>
                <TableCell sx={headCellSx}>Player</TableCell>
                <TableCell align="center" sx={headCellSx}>Team</TableCell>
                <TableCell align="center" sx={{ ...headCellSx, bgcolor: '#16325c' }}>Value</TableCell>
                {CATEGORIES.map((c) => (
                  <TableCell
                    key={c.key}
                    align="center"
                    sx={{
                      ...headCellSx,
                      color: c.key === puntKey ? '#ff8a80' : '#fff',
                      textDecoration: c.key === puntKey ? 'line-through' : 'none',
                    }}
                  >
                    {c.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {freeRows.map((p) => renderRow(p))}

              {/* Locked teaser rows — blurred behind the unlock prompt. */}
              {lockedRows.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4 + CATEGORIES.length} sx={{ p: 0, position: 'relative' }}>
                    <Box className={GATED_CLASS} sx={{ position: 'relative' }}>
                      <Box sx={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
                        <Table size="small" sx={{ minWidth: 720 }}>
                          <TableBody>{lockedRows.map((p) => renderRow(p, true))}</TableBody>
                        </Table>
                      </Box>
                      {/* The whole overlay is the CTA. It used to be inert
                          text, so the one place a reader is actively wanting
                          more rows offered nowhere to go. */}
                      <Box
                        component={RouterLink}
                        to="/pricing"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          textDecoration: 'none',
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.92) 60%)',
                          transition: 'background .18s ease',
                          '&:hover': {
                            background:
                              'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.97) 60%)',
                          },
                        }}
                      >
                        <LockOutlinedIcon sx={{ color: '#0f2340', fontSize: 22 }} />
                        <Typography sx={{ fontWeight: 700, color: '#0f2340', fontSize: '0.9rem' }}>
                          {punt ? `See the full ${punt.name.toLowerCase()}-adjusted board` : 'See the full board'}
                        </Typography>
                        <Typography sx={{ color: '#667', fontSize: '0.78rem' }}>
                          Top {freeLimit} free · unlock all {limit} with a Draft Pass
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderTop: '1px solid #eef1f4',
          bgcolor: '#fafbfc',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: '#7a8290' }}>
          Live z-scores, {season} season ·{' '}
          {punt ? (
            <>
              <strong style={{ color: '#c0392b' }}>{punt.label}</strong> removed from Value
            </>
          ) : (
            <>all nine categories counted{minGames > 0 ? ` · ${minGames}+ games played` : ''}</>
          )}
        </Typography>
        <Button
          component={RouterLink}
          to="/rankings"
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: '#2f80ed',
            border: '1px solid #2f80ed',
            borderRadius: 2,
            px: 2,
            '&:hover': { bgcolor: 'rgba(47,128,237,0.08)' },
          }}
        >
          Open in the Rankings tool →
        </Button>
      </Box>
    </Box>
  );
}

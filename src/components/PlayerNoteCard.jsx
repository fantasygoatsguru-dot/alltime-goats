import React from 'react';
import { Box, Typography } from '@mui/material';
import { PRIOR_SEASON } from '../config/top-150-2026-27';

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

/**
 * One player's write-up: the authored paragraph on top of that player's real
 * prior-season line. Shared by the projected top 150 (which passes `rank`) and
 * the sleepers / busts guides (which pass a `tag` instead).
 */
export default function PlayerNoteCard({ player, prior, accent = '#0f2340' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.75, sm: 2.25 },
        bgcolor: '#fff',
        border: '1px solid #e6e9ee',
        borderLeft: player.rank ? '1px solid #e6e9ee' : `4px solid ${accent}`,
        borderRadius: 2,
      }}
    >
      {player.rank ? (
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
      ) : null}

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <Typography sx={{ fontWeight: 800, color: '#0f2340', fontSize: '1.05rem', letterSpacing: -0.3 }}>
            {player.name}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#78828f', letterSpacing: 0.5 }}>
            {player.team}
          </Typography>
          {player.tag && (
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: 0.3,
                color: accent,
                bgcolor: `${accent}14`,
                border: `1px solid ${accent}33`,
                px: 0.9,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              {player.tag}
            </Typography>
          )}
        </Box>

        {/* Last season's actual line — the evidence under the write-up. */}
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
            <Typography
              sx={{
                fontSize: '0.74rem',
                color: '#a1673c',
                bgcolor: '#fdf3e8',
                border: '1px solid #f3e0c9',
                px: 1,
                py: 0.4,
                borderRadius: 1,
                fontWeight: 600,
              }}
            >
              No {PRIOR_SEASON} games — projected from prior seasons
            </Typography>
          )}
        </Box>

        <Typography sx={{ color: '#2c3440', fontSize: '0.94rem', lineHeight: 1.6 }}>{player.note}</Typography>
      </Box>
    </Box>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabase';
import { HISTORICAL_STATS_SEASON } from '../config/season';
import { CATEGORIES } from '../config/guides-content';
import RadarView from './RadarView';

const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Overlays each supplied team on one radar, using live per-category z-scores
 * averaged across the team's roster.
 *
 * teams: [{ name, roster: string[], color }]
 */
export default function TeamRadar({ teams = [] }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('player_period_averages')
          .select('player_name, points_z, three_pointers_z, rebounds_z, assists_z, steals_z, blocks_z, fg_percentage_z, ft_percentage_z, turnovers_z')
          .eq('season', HISTORICAL_STATS_SEASON)
          .eq('period_type', 'season')
          .order('total_value', { ascending: false })
          .limit(600);
        if (error) throw error;
        if (active) setRows(data || []);
      } catch (e) {
        console.error('TeamRadar fetch failed:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const byName = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(norm(r.player_name), r));
    return m;
  }, [rows]);

  const series = useMemo(() => {
    return teams.map((t) => {
      const matched = (t.roster || []).map((n) => byName.get(norm(n))).filter(Boolean);
      const values = {};
      CATEGORIES.forEach((c) => {
        const vals = matched.map((p) => p[c.zKey]).filter((v) => v !== null && v !== undefined);
        values[c.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      });
      return { name: `${t.name}${matched.length ? '' : ' (no data)'}`, color: t.color, values };
    });
  }, [teams, byName]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={26} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #e2e6ec', borderRadius: 2, p: { xs: 1.5, md: 3 } }}>
      <Typography sx={{ fontWeight: 800, color: '#0f2340', textAlign: 'center', fontSize: '1.05rem', mb: 0.5 }}>
        Team strengths & weaknesses
      </Typography>
      <Typography sx={{ color: '#7a8290', textAlign: 'center', fontSize: '0.78rem', mb: 1 }}>
        Average z-score per category · the circle is league average (0) · both builds dent at{' '}
        <strong style={{ color: '#c0392b' }}>BLK</strong>
      </Typography>
      <RadarView series={series} />
    </Box>
  );
}

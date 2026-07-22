import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { CATEGORIES } from '../config/guides-content';

// Spoke order: guard cats, then percentages, then the big-man cats last, so a
// punt-blocks build reads as a contiguous dent at BLK/REB.
const RADAR_ORDER = ['pts', '3pm', 'ast', 'stl', 'ft', 'fg', 'to', 'blk', 'reb'];
const catByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Presentational radar. `series` is [{ name, color, values: {catKey: number} }].
 * Values are clamped to `domain`; z = 0 is the league-average ring.
 */
export default function RadarView({ series = [], height = 400, domain = [-2, 3], showLegend = true }) {
  const data = useMemo(
    () =>
      RADAR_ORDER.map((key) => {
        const row = { skill: catByKey[key]?.label || key };
        series.forEach((s) => {
          row[s.name] = Number(clamp(s.values?.[key] ?? 0, domain[0], domain[1]).toFixed(2));
        });
        return row;
      }),
    [series, domain],
  );

  return (
    <Box sx={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="72%" data={data}>
          <PolarGrid stroke="#dfe3e8" strokeDasharray="4 4" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#3a4451', fontWeight: 700 }} />
          <PolarRadiusAxis angle={90} domain={domain} tick={{ fill: '#9aa1ab', fontSize: 10 }} stroke="#dfe3e8" />
          {series.map((s) => (
            <Radar
              key={s.name}
              name={s.name}
              dataKey={s.name}
              stroke={s.color}
              strokeDasharray={s.strokeDasharray}
              fill={s.color}
              fillOpacity={s.fillOpacity ?? 0.3}
              animationDuration={600}
            />
          ))}
          <RechartsTooltip
            contentStyle={{ border: '1px solid #2f80ed', borderRadius: 8, fontSize: 12 }}
            formatter={(value, name) => [`z ${Number(value).toFixed(2)}`, name]}
          />
          {showLegend && <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />}
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

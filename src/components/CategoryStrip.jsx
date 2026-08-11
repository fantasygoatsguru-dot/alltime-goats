import React from 'react';
import { Box } from '@mui/material';
import { CATEGORIES, categoryByKey } from '../config/guides-content';

// Shade ramps: dark (most extreme) → light (mild). Rank a category within its
// group and step through the ramp, so the profile reads as a red→green
// heat scale rather than two flat colours. The punted category is always the
// darkest red, struck through — the running visual signature of the section.
const GREENS = ['#0d5a2b', '#15773c', '#209150', '#41a86a']; // strong → mild
const REDS   = ['#6e1113', '#8f221f', '#b23b34', '#cf5b53']; // punted/severe → mild
const NEUTRAL = { border: '#dfe3e8', bg: '#eef0f2', text: '#9aa1ab' };

const shadeAt = (ramp, i) => ramp[Math.min(i, ramp.length - 1)];

/**
 * The nine-category profile strip, shaded on a red→green scale by how the
 * build performs in each category. Ordering of `strengths` / `weaknesses`
 * (strongest first) drives the depth of the shade.
 */
export default function CategoryStrip({ puntKey, strengths = [], weaknesses = [], size = 'md' }) {
  const dims =
    size === 'sm'
      ? { w: 30, h: 24, font: '0.6rem', gap: 0.4 }
      : { w: 42, h: 34, font: '0.72rem', gap: 0.6 };

  // Weaknesses other than the punt, in order — they get the lighter reds.
  const otherWeaknesses = weaknesses.filter((k) => k !== puntKey);

  // No punt and no profile (the pure rankings guides): every category carries
  // equal weight, so show each in its own identity colour rather than a row of
  // grey, which would read as an empty state.
  const evenProfile = !puntKey && !strengths.length && !weaknesses.length;

  const toneFor = (key) => {
    if (evenProfile) return { bg: categoryByKey[key].color, text: '#fff' };
    if (key === puntKey) return { bg: REDS[0], text: '#fff', punted: true };

    const sIdx = strengths.indexOf(key);
    if (sIdx !== -1) return { bg: shadeAt(GREENS, sIdx), text: '#fff' };

    const wIdx = otherWeaknesses.indexOf(key);
    if (wIdx !== -1) return { bg: shadeAt(REDS, wIdx + 1), text: '#fff' }; // start one step lighter than the punt

    return { bg: NEUTRAL.bg, text: NEUTRAL.text, neutral: true };
  };

  return (
    <Box sx={{ display: 'flex', gap: dims.gap, flexWrap: 'wrap' }}>
      {CATEGORIES.map((c) => {
        const tone = toneFor(c.key);
        return (
          <Box
            key={c.key}
            sx={{
              width: dims.w,
              height: dims.h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              fontSize: dims.font,
              fontWeight: 800,
              letterSpacing: 0.2,
              border: '1.5px solid',
              borderColor: tone.neutral ? NEUTRAL.border : 'rgba(0,0,0,0.18)',
              bgcolor: tone.bg,
              color: tone.text,
              textDecoration: tone.punted ? 'line-through' : 'none',
            }}
          >
            {c.label}
          </Box>
        );
      })}
    </Box>
  );
}

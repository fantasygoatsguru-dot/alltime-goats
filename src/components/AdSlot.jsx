import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PUBLISHER_ID } from '../config/ads';
import { useEntitlements } from '../hooks/useEntitlements';

/**
 * One AdSense unit. Renders nothing for anyone holding a pass — ad-free is a
 * paid perk — and nothing while entitlements are still resolving, so a paying
 * user never gets a flash of ads.
 *
 * Two AdSense quirks this handles:
 *
 *  - `push({})` fills the FIRST unfilled <ins> in the DOM, and pushing against
 *    an <ins> that already has an ad throws. The push is therefore guarded by
 *    both a per-route ref and the `data-adsbygoogle-status` attribute AdSense
 *    stamps on a used element (which also makes React 18 StrictMode's double
 *    effect harmless).
 *  - On client-side navigation React reuses the same <ins> node, which AdSense
 *    will refuse to refill. Keying the wrapper on the pathname forces a fresh
 *    element per route so a new ad is requested.
 *
 * Pushing before the loader script arrives is fine: `window.adsbygoogle` is a
 * queue the script drains once it loads.
 */
export default function AdSlot({
  slot,
  format = 'auto',
  layout,
  fullWidthResponsive = true,
  minHeight = 100,
  sx = {},
}) {
  // In-article and in-feed units are "fluid": AdSense picks the shape from the
  // surrounding content, so they take data-ad-layout instead of a size, and
  // must NOT carry data-full-width-responsive or a min-height — either one
  // fights the layout AdSense chose.
  const fluid = Boolean(layout) || format === 'fluid';
  const { hasAnyPass, loading } = useEntitlements();
  const { pathname } = useLocation();
  const insRef = useRef(null);
  const pushedFor = useRef(null);

  useEffect(() => {
    if (loading || hasAnyPass || !slot) return;
    const ins = insRef.current;
    if (!ins) return;
    if (pushedFor.current === pathname) return;
    if (ins.getAttribute('data-adsbygoogle-status')) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedFor.current = pathname;
    } catch (e) {
      // An ad blocker, or a double push — neither should break the page.
      console.warn('AdSense push failed:', e?.message || e);
    }
  }, [loading, hasAnyPass, slot, pathname]);

  if (loading || hasAnyPass || !slot) return null;

  return (
    <Box key={pathname} sx={{ my: 3, textAlign: 'center', ...sx }}>
      <Typography
        component="span"
        sx={{
          display: 'block',
          fontSize: '0.62rem',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: '#a8b0bb',
          mb: 0.5,
        }}
      >
        Advertisement
      </Typography>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={fluid ? { display: 'block', textAlign: 'center' } : { display: 'block', minHeight }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={fluid ? 'fluid' : format}
        {...(fluid
          ? { 'data-ad-layout': layout }
          : { 'data-full-width-responsive': String(fullWidthResponsive) })}
        {/* Marks requests from `npm run dev` as test traffic. AdSense does not
            serve real ads to localhost anyway, and this keeps your own dev
            loads from counting as impressions against the account. */
        ...(import.meta.env.DEV ? { 'data-adtest': 'on' } : {})}
      />
    </Box>
  );
}

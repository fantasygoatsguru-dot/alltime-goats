import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import { PUBLISHER_ID, AD_SLOTS, STICKY_AD_PATHS } from '../config/ads';
import { useEntitlements } from '../hooks/useEntitlements';

const DISMISS_KEY = 'sticky_ad_dismissed';
const BAR_H = { xs: 60, md: 90 }; // mobile 60px keeps it well under the 30%-of-
                                  // viewport ceiling the Better Ads Standards set

/**
 * Bottom-anchored banner, the same shape as Google's own anchor ad — but as a
 * manual unit, because Auto Ads has been returning `unfilled` on this account
 * while manual units serve.
 *
 * Three things make it behave rather than annoy:
 *
 *  - It hides itself when the ad does not fill. AdSense collapses the <ins> but
 *    leaves our chrome behind, which would show an empty bar on a page with no
 *    ad; a MutationObserver on `data-ad-status` removes the whole thing.
 *  - It is dismissible, remembered for the session.
 *  - It only renders on pages where ads make sense (STICKY_AD_PATHS) — never on
 *    the pricing page or the Yahoo tools, which are where passes get sold.
 *
 * Pass holders never see it: <AdSense> does not even load the tag for them.
 */
export default function StickyAdBanner({ slot = AD_SLOTS.stickyBottom }) {
  const { hasAnyPass, loading } = useEntitlements();
  const { pathname } = useLocation();
  const insRef = useRef(null);
  const pushedFor = useRef(null);
  const [dismissed, setDismissed] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(DISMISS_KEY) === '1'
  );
  const [unfilled, setUnfilled] = useState(false);

  const allowed = STICKY_AD_PATHS.some((p) =>
    p.endsWith('*') ? pathname.startsWith(p.slice(0, -1)) : pathname === p
  );
  const active = !loading && !hasAnyPass && !dismissed && allowed && !!slot;

  // Request an ad, and watch for AdSense reporting back that it had none.
  useEffect(() => {
    if (!active) return;
    const ins = insRef.current;
    if (!ins) return;

    setUnfilled(false);

    if (pushedFor.current !== pathname && !ins.getAttribute('data-adsbygoogle-status')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedFor.current = pathname;
      } catch (e) {
        console.warn('Sticky ad push failed:', e?.message || e);
      }
    }

    const observer = new MutationObserver(() => {
      if (ins.getAttribute('data-ad-status') === 'unfilled') setUnfilled(true);
    });
    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    return () => observer.disconnect();
  }, [active, pathname]);

  // Keep the bar from covering the last of the page content.
  useEffect(() => {
    const on = active && !unfilled;
    document.body.style.paddingBottom = on ? '96px' : '';
    return () => {
      document.body.style.paddingBottom = '';
    };
  }, [active, unfilled]);

  if (!active || unfilled) return null;

  return (
    <Box
      key={pathname}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        // Above page content, below MUI dialogs/drawers (1200+) so it can never
        // trap a modal or the mobile nav behind it.
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255,255,255,0.97)',
        borderTop: '1px solid #e2e6ec',
        boxShadow: '0 -2px 12px rgba(15,35,64,0.10)',
        minHeight: BAR_H,
        px: 1,
      }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: 970, height: '100%' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
        {...(import.meta.env.DEV ? { 'data-adtest': 'on' } : {})}
      />
      <IconButton
        aria-label="Close advertisement"
        size="small"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(DISMISS_KEY, '1');
          } catch {
            /* private mode — dismissal just won't persist */
          }
        }}
        sx={{
          position: 'absolute',
          top: -13,
          right: 8,
          width: 26,
          height: 26,
          bgcolor: '#fff',
          border: '1px solid #d7dde5',
          color: '#5a6472',
          '&:hover': { bgcolor: '#f1f4f8' },
        }}
      >
        <CloseIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </Box>
  );
}

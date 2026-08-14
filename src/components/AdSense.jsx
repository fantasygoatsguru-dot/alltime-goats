import { useEffect } from 'react';
import { useEntitlements } from '../hooks/useEntitlements';

// Google AdSense publisher id. Kept here rather than in index.html so the tag
// can be loaded conditionally — see the note in index.html.
const PUBLISHER_ID = 'ca-pub-8056587893315589';
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
const SCRIPT_ID = 'adsense-loader';

// Applied to <html> for paying users. Auto Ads inject their own containers, so
// if a purchase happens in a session that already loaded the tag, this hides
// what is already on screen until the next page load.
const AD_FREE_CLASS = 'ad-free';

/**
 * Loads AdSense Auto Ads — but only for visitors without a pass.
 *
 * Ads are the free tier's trade-off, so the tag must never load for someone who
 * paid. That means three things:
 *
 *  1. Nothing is injected while entitlements are still loading, so a paying
 *     user never gets a flash of ads before we know who they are.
 *  2. The tag is injected once and never removed — AdSense does not support
 *     being torn down, and reloading it would violate its terms. A purchase
 *     mid-session instead adds `.ad-free` to <html>, and the redirect to
 *     /purchase-success is a full page load that never loads the tag again.
 *  3. Signed-out visitors resolve to "no pass" immediately, so the common case
 *     still loads ads on first paint.
 */
export default function AdSense() {
  const { hasAnyPass, loading } = useEntitlements();

  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;

    if (hasAnyPass) {
      root.classList.add(AD_FREE_CLASS);
      return;
    }

    root.classList.remove(AD_FREE_CLASS);

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    script.crossOrigin = 'anonymous';
    script.onerror = () => console.warn('AdSense failed to load (ad blocker?)');
    document.head.appendChild(script);
  }, [hasAnyPass, loading]);

  return null;
}

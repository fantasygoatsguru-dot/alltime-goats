// Google AdSense configuration.
//
// Ads are the free tier's trade-off: the loader is injected at runtime, only for
// visitors without a pass (src/components/AdSense.jsx), and every unit renders
// through <AdSlot> (src/components/AdSlot.jsx), which returns null for anyone
// holding a pass. Nothing ad-related belongs in index.html — a tag there runs
// before React and cannot be conditioned on entitlements.

export const PUBLISHER_ID = 'ca-pub-8056587893315589';

// data-ad-slot values from AdSense → Ads → By ad unit. Keys are ours; the names
// in the comments are the unit names in the dashboard, which is how reporting
// is broken down — keep them in sync.
export const AD_SLOTS = {
  guideInline: '2980687407', // "guide-inline-1" — responsive display, inside guide articles
};

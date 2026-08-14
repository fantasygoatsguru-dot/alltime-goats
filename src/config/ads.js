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
  guideInline: '2980687407', // "guide-inline-1"  — responsive display, in-page
  stickyBottom: '9841609221', // "sticky-bottom"  — the anchored bottom banner
};

// Pages the sticky banner may appear on. Deliberately excludes the Yahoo tools
// and /pricing: those are where passes get sold, and a pass is worth thousands
// of ad impressions, so nothing may compete with them. '*' suffix = prefix match.
export const STICKY_AD_PATHS = [
  '/rankings', // biggest audience on the site, and free — ads here also give the
               // pass a visible "remove ads" benefit. Watch pass conversions.
  '/nba-playoffs',
  '/nba-regular-season',
  '/games',
  '/seasons',
  '/teams',
  '/table',
  '/season-games',
  '/posts',
  '/post/*',
];

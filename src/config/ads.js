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
  // "guide-in-article-1" — fluid/in-article. The format AdSense designed for
  // running inside article prose, and what every unit inside a guide body uses.
  // Deliberately reused for all three placements in a guide: one unit id can
  // serve any number of positions. Split it only if you want per-position
  // numbers in AdSense reporting, which needs one unit per position.
  guideInArticle: '3231344124',
  stickyBottom: '9841609221', // "sticky-bottom"  — the anchored bottom banner

  // "guide-inline-1" — the plain display block that used to sit mid-guide,
  // replaced by guideInArticle above. Kept only so the id is documented if it
  // shows up in old reporting; nothing references it. Safe to archive in
  // AdSense and delete from here.
  guideInline: '2980687407',
};

// Pages the sticky banner may appear on. Deliberately excludes the Yahoo tools
// and /pricing: those are where passes get sold, and a pass is worth thousands
// of ad impressions, so nothing may compete with them. '*' suffix = prefix match.
export const STICKY_AD_PATHS = [
  '/guides',   // the landing page ('/' redirects here) and the only ad on it —
               // exact match on purpose, since the individual guides carry
               // their own in-article units and do not need a banner too.
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

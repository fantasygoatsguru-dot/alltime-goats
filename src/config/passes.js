// LemonSqueezy pass definitions. Checkout URLs are LemonSqueezy's public
// "Share" links (not secret) for the store fantasygoatsguru.lemonsqueezy.com.
// Keep pass ids in sync with the pass_type values the lemonsqueezy-webhook
// edge function writes to the entitlements table.

// The season these passes unlock. Deliberately separate from CURRENT_SEASON
// in src/utils/supabase.js (which tracks the season whose *stats* are being
// displayed) — entitlements are sold ahead of the season they cover. Keep in
// sync with CURRENT_SEASON in supabase/functions/lemonsqueezy-webhook/index.ts.
export const PASS_SEASON = '2026-27';

export const PASSES = [
  {
    id: 'draft',
    name: 'Draft Pass',
    price: 15,
    tagline: 'Win your draft',
    description: 'Draft-day prep: expert rankings, tiers, and projections to build a championship roster from pick one.',
    features: [
      'Full 9-cat z-score player rankings',
      'Tiered draft board',
      'Season-long player projections',
    ],
    checkoutUrl: 'https://fantasygoatsguru.lemonsqueezy.com/checkout/buy/3a535e1e-4d4c-43fd-807c-3a80029ec9aa',
  },
  {
    id: 'season',
    name: 'Season Pass',
    price: 15,
    tagline: 'Manage like a pro',
    description: 'In-season tools: weekly matchup projections, head-to-head breakdowns, and team strength analysis.',
    features: [
      'Weekly matchup projections',
      'Unlimited tool usage',
      'Category breakdown',
      'Team playoff & season strength',
    ],
    checkoutUrl: 'https://fantasygoatsguru.lemonsqueezy.com/checkout/buy/81b72409-98e0-4476-a900-208fa50620be',
  },
  {
    id: 'combo',
    name: 'Combo',
    price: 20,
    tagline: 'Best value — save $10',
    description: 'Everything in Draft Pass and Season Pass, bundled together for the full season.',
    features: [
      'Everything in Draft Pass',
      'Everything in Season Pass',
      'Save $10 vs. buying separately',
    ],
    checkoutUrl: 'https://fantasygoatsguru.lemonsqueezy.com/checkout/buy/244c88b7-e275-4678-b0b8-1249a05007bd',
    highlight: true,
  },
];

// Appends the signed-in user's Supabase auth id (and email) as LemonSqueezy
// checkout custom data, which the lemonsqueezy-webhook function reads back
// out of meta.custom_data.auth_user_id to know who to credit.
export function buildCheckoutUrl(baseUrl, { authUserId, email }) {
  const url = new URL(baseUrl);
  url.searchParams.set('checkout[custom][auth_user_id]', authUserId);
  if (email) url.searchParams.set('checkout[email]', email);
  return url.toString();
}

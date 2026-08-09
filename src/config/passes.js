// Polar pass definitions. Checkout URLs are Polar Checkout Links (one per
// pass, each with a static `pass_type` set as metadata in the Polar
// dashboard). Keep pass ids in sync with the pass_type values the
// polar-webhook edge function writes to the entitlements table.

// The season these passes unlock. Deliberately separate from CURRENT_SEASON
// in src/utils/supabase.js (which tracks the season whose *stats* are being
// displayed) — entitlements are sold ahead of the season they cover. Keep in
// sync with CURRENT_SEASON in supabase/functions/polar-webhook/index.ts.
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
    checkoutUrl: 'https://buy.polar.sh/polar_cl_w4Wddss5tVDYzdMLzwGLB4zAilHsr8BAwy2312OP8NL',
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
    checkoutUrl: 'https://buy.polar.sh/polar_cl_dWy4HqGrBFeUh6S3ITV2HfmdZhMbkEcCmnrVl3cpqYD',
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
    checkoutUrl: 'https://buy.polar.sh/polar_cl_Fnd1vxC3zzI15aW4TPZbB0SGtZXeVC551fFWV3YAJ7H',
    highlight: true,
  },
];

// Appends the signed-in user's Supabase auth id (and email) to the Polar
// checkout link, which the polar-webhook function reads back out of
// order.metadata.reference_id (auth id) to know who to credit; pass_type
// itself comes from the static metadata set on each checkout link.
export function buildCheckoutUrl(baseUrl, { authUserId, email }) {
  const url = new URL(baseUrl);
  url.searchParams.set('reference_id', authUserId);
  if (email) url.searchParams.set('customer_email', email);
  return url.toString();
}

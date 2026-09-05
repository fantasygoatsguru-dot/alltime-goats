// Polar pass definitions. Checkout URLs are Polar Checkout Links (one per
// pass, each with a static `pass_type` set as metadata in the Polar
// dashboard). Keep pass ids in sync with the pass_type values the
// polar-webhook edge function writes to the entitlements table.

// The season these passes unlock. Deliberately separate from STATS_SEASON in
// config/season.js (the season whose *stats* are displayed) — entitlements are
// sold ahead of the season they cover. Keep in sync with ENTITLEMENT_SEASON in
// supabase/functions/_shared/season.ts, which the webhooks write to the
// entitlements table.
export const PASS_SEASON = '2026-27';

export const PASSES = [
  {
    id: 'draft',
    name: 'Draft Pass',
    price: 15,
    tagline: 'Win your draft',
    description:
      'The punt builds in full: for each one, a draft board re-ranked with that category out of the maths, the players to target round by round, and the rosters that show what the finished team looks like.',
    // Keep this list to what a buyer actually receives TODAY, and nothing else.
    //
    // For 2026-27 the sleepers and busts lists moved OFF this pass and behind a
    // free account (requiresLogin in config/guides-content.js), so they must not
    // be sold here — a features list naming something the reader can have for
    // nothing is the fastest way to make the whole list untrustworthy.
    //
    // That leaves the punt guides carrying the pass, which was always the plan.
    // The honest state of it: punt-blocks and the projected top 150 stay free
    // and indexable for draft-season acquisition, and every OTHER punt build is
    // what is being bought. That list is only as good as how many of
    // PLANNED_GUIDES actually ship — if a build is not written by draft season,
    // this description is writing a cheque the pass cannot cash.
    features: [
      'Every punt build, each with its own re-ranked draft board',
      'Round-by-round draft targets, with the case for every player',
      'The archetypes and example rosters behind each build',
      'Ad-free browsing',
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
      'Ad-free browsing',
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
      'Ad-free browsing',
      'Save $10 vs. buying separately',
      'New punt guides included as they ship',
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

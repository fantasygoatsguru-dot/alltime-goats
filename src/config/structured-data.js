// Single source of truth for JSON-LD structured data.
// Consumed by BOTH scripts/prerender.js (baked into static HTML) and the
// client-side <StructuredData /> component (kept in sync on SPA navigation).
//
// NOTE: No aggregateRating / review markup is included here. Self-serving or
// fabricated ratings violate Google's structured-data policy and risk a manual
// action, so they must never be added back.

import { getSEODataByPath } from './seo-routes.js';

const BASE = 'https://fantasygoats.guru';
const LOGO =
  'https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/goat_1.png';

const organization = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Fantasy Goats Guru',
  url: BASE,
  logo: LOGO,
  description: 'Fantasy basketball analytics and league history platform',
  sport: 'Basketball',
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fantasy Goats Guru',
  url: BASE,
};

// FAQ content. These questions/answers are ALSO rendered visibly in the
// collapsed SEOContent block (see SEOContent.jsx) — Google requires marked-up
// FAQ text to be present on the page. Keep the two in sync via this shared source.
const FAQ = {
  '/nba-playoffs': [
    {
      question: 'When do the fantasy basketball playoffs start?',
      answer:
        'Most fantasy basketball leagues begin their playoffs around week 19–21 of the season and run through week 24, aligning with the final weeks of the NBA regular season in March and April.',
    },
    {
      question: 'Which NBA teams are best for the fantasy playoffs?',
      answer:
        'The teams that play the most games — ideally 3 to 4 — during your league’s championship weeks. More games means more chances for your players to accumulate stats and win categories. Sort the grid by week to find them.',
    },
    {
      question: 'What is a fantasy basketball playoff schedule?',
      answer:
        'It shows how many games each NBA team plays during your fantasy league’s playoff weeks. Rostering players on high-game teams during championship week is one of the biggest edges in fantasy basketball playoffs.',
    },
  ],
  '/nba-regular-season': [
    {
      question: 'How many games are in an NBA regular season?',
      answer:
        'Each NBA team plays 82 games. The regular season runs from late October through mid-April, spanning roughly 24 weeks.',
    },
    {
      question: 'How many games does each NBA team play per week?',
      answer:
        'Usually 3 to 4, though it varies — some weeks feature 4 games while lighter weeks have only 2. Streaming players on 4-game teams is a core fantasy basketball strategy.',
    },
    {
      question: 'What is a fantasy basketball schedule grid?',
      answer:
        'A week-by-week view of how many games each NBA team plays, so you can target the weeks and teams that maximize the number of games your lineup plays.',
    },
  ],
};

export const getFaq = (pathname) => {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return FAQ[clean] || null;
};

const buildWebApplication = (clean, title, description) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: title,
  description,
  url: `${BASE}${clean === '/' ? '/' : clean}`,
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
});

const buildBreadcrumb = (clean) => {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BASE}/`,
    },
  ];
  const parts = clean.split('/').filter(Boolean);
  parts.forEach((part, i) => {
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: part
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      item: `${BASE}/${parts.slice(0, i + 1).join('/')}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
};

const buildFaqPage = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

// Returns the full array of schema objects for a given route.
export const getStructuredData = (pathname) => {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const { title, description } = getSEODataByPath(clean);

  const schemas = [organization];
  if (clean === '/') schemas.push(website);
  schemas.push(buildWebApplication(clean, title, description));
  if (clean !== '/') schemas.push(buildBreadcrumb(clean));

  const faq = getFaq(clean);
  if (faq) schemas.push(buildFaqPage(faq));

  return schemas;
};

export default getStructuredData;

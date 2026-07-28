import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seoRoutes, { getPublicRoutes } from '../src/config/seo-routes.js';
import { getSEOContent } from '../src/config/seo-content.js';
import { getStructuredData, getFaq } from '../src/config/structured-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://fantasygoats.guru';
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

// The raw Vite build output is our template for every route.
const template = fs.readFileSync(indexPath, 'utf-8');

// ── helpers ─────────────────────────────────────────────────────────
const escapeAttr = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Replace the first <title>…</title>
const setTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

// Replace the content of a <meta name="..."> tag
const setMetaName = (html, name, content) => {
  const re = new RegExp(
    `(<meta\\s+name=["']${name}["']\\s+content=)["'][\\s\\S]*?["']`
  );
  return re.test(html)
    ? html.replace(re, `$1"${escapeAttr(content)}"`)
    : html;
};

// Replace the content of a <meta property="og:..."> tag
const setMetaProp = (html, prop, content) => {
  const re = new RegExp(
    `(<meta\\s+property=["']${prop}["']\\s+content=)["'][\\s\\S]*?["']`
  );
  return re.test(html)
    ? html.replace(re, `$1"${escapeAttr(content)}"`)
    : html;
};

const setCanonical = (html, href) =>
  html.replace(
    /(<link\s+rel=["']canonical["']\s+href=)["'][\s\S]*?["']/,
    `$1"${escapeAttr(href)}"`
  );

// Shared crawlable navigation — gives every prerendered page internal links.
const navHtml = `
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Fantasy Basketball Tools</a></li>
    <li><a href="/my-team">Fantasy Team Analyzer</a></li>
    <li><a href="/matchup">Fantasy Basketball Matchup Analyzer</a></li>
    <li><a href="/matchup-projection">Weekly Matchup Projection</a></li>
    <li><a href="/rankings">Fantasy Basketball Rankings</a></li>
    <li><a href="/guides">Fantasy Basketball Strategy Guides</a></li>
    <li><a href="/nba-regular-season">NBA Fantasy Schedule Grid</a></li>
    <li><a href="/nba-playoffs">NBA Fantasy Playoff Schedule</a></li>
    <li><a href="/teams">All-Time NBA Teams</a></li>
    <li><a href="/seasons">All-Time NBA Seasons</a></li>
    <li><a href="/games">All-Time NBA Games</a></li>
    <li><a href="/about">About Fantasy Goats Guru</a></li>
  </ul>
</nav>`;

// Build the crawlable SEO body block for a given route.
const buildSeoBlock = (route) => {
  const seo = getSEOContent(route.path);
  const heading = seo?.title || route.title.split('|')[0].trim();
  const body = seo?.content || `<p>${route.description}</p>`;

  // Visible FAQ text must accompany FAQPage schema — bake it in too so it
  // matches what the SEOContent component renders on the live page.
  const faq = getFaq(route.path);
  const faqHtml = faq
    ? `<section>
<h3>Frequently Asked Questions</h3>
${faq.map((f) => `<h4>${f.question}</h4>\n<p>${f.answer}</p>`).join('\n')}
</section>`
    : '';

  return `
<h1>${heading}</h1>
${body}
${faqHtml}
${navHtml}
`;
};

// ── generate one HTML file per public route ─────────────────────────
const routes = getPublicRoutes();
let count = 0;

for (const route of routes) {
  const canonical = `${BASE_URL}${route.path === '/' ? '/' : route.path}`;

  let html = template;
  html = setTitle(html, route.title);
  html = setMetaName(html, 'description', route.description);
  html = setCanonical(html, canonical);
  html = setMetaProp(html, 'og:title', route.title);
  html = setMetaProp(html, 'og:description', route.description);
  html = setMetaProp(html, 'og:url', canonical);

  // Twitter tags (added client-side normally) — bake them too.
  html = setMetaName(html, 'twitter:title', route.title);
  html = setMetaName(html, 'twitter:description', route.description);

  const seoBlock = buildSeoBlock(route);

  // Crawlable copy for search engines, kept out of the React root so it
  // doesn't clash with hydration. Offscreen + a <noscript> fallback.
  const hiddenSeo = `<div id="seo-content" style="position:absolute;left:-9999px;top:-9999px;">${seoBlock}</div>`;
  const noscript = `<noscript><div style="padding:20px;max-width:1200px;margin:0 auto;">${seoBlock}</div></noscript>`;

  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"></div>\n${hiddenSeo}`
  );
  html = html.replace(/<body>/, `<body>\n${noscript}`);

  // Bake JSON-LD structured data into <head> (same id the client component
  // reuses on navigation, so there is never a duplicate). Escape "</" to avoid
  // prematurely closing the script tag.
  const schemas = getStructuredData(route.path);
  const ldJson = JSON.stringify(schemas).replace(/<\//g, '<\\/');
  const ldScript = `<script type="application/ld+json" id="structured-data">${ldJson}</script>`;
  html = html.replace('</head>', `  ${ldScript}\n</head>`);

  // Write to the right location: '/' -> dist/index.html, others -> dist/<path>.html
  // (NOT dist/<path>/index.html — that shape makes Netlify treat the route as a
  // directory and auto-301 the bare path to a trailing slash, which fights the
  // no-slash canonical/sitemap URLs and gets flagged in GSC as "Page with
  // redirect". A flat <path>.html is served for the extensionless request with
  // no redirect at all.)
  const outPath =
    route.path === '/'
      ? indexPath
      : path.join(distPath, `${route.path.replace(/^\//, '')}.html`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  count++;
  console.log(`  ✓ ${route.path.padEnd(22)} -> ${path.relative(distPath, outPath)}`);
}

console.log(`✅ Prerendered ${count} routes with per-page title/meta/H1/content`);

// ── generate sitemap.xml from the same route config ─────────────────
// Built from seo-routes.js so it can never drift out of sync again — the
// static, hand-maintained sitemap was silently missing new routes (e.g.
// /guides), leaving them "unknown to Google". Overwrites the copy Vite
// placed in dist/ from public/.
//
// SITEMAP_EXTRA: auth-"enhanced" tools that are usable (and indexable)
// without signing in, so they're excluded from prerender via requiresAuth
// but should still be discoverable in the sitemap.
const SITEMAP_EXTRA = ['/matchup'];
const today = new Date().toISOString().slice(0, 10);

const sitemapEntries = [
  ...getPublicRoutes().filter((r) => !r.alias),
  ...SITEMAP_EXTRA
    .map((p) => seoRoutes.find((r) => r.path === p))
    .filter(Boolean),
];

const urlXml = (r) => {
  const loc = `${BASE_URL}${r.path === '/' ? '/' : r.path}`;
  const image =
    r.path === '/'
      ? `
    <image:image>
      <image:loc>https://fqrnmcnvrrujiutstkgb.supabase.co/storage/v1/object/public/avatars/goat_1.png</image:loc>
      <image:title>Fantasy Goats Guru Logo</image:title>
    </image:image>`
      : '';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${(r.priority ?? 0.7).toFixed(1)}</priority>${image}
  </url>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapEntries.map(urlXml).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);
console.log(`🗺️  Generated sitemap.xml with ${sitemapEntries.length} URLs`);

// ── IndexNow: notify Bing/Yandex/etc. of the current URL set ─────────
// Reuses the exact list the sitemap is built from so the two can never
// drift. Ownership is proven by the key file served at
// `${BASE_URL}/${INDEXNOW_KEY}.txt` (see public/). Only pings on Netlify
// production builds, and never fails the deploy on a network error.
const INDEXNOW_KEY = 'ce61a9a3019daed33a7f22175b55f9eb';
const host = new URL(BASE_URL).host;

async function submitToIndexNow() {
  if (process.env.CONTEXT && process.env.CONTEXT !== 'production') {
    console.log(`⏭️  IndexNow skipped (build context: ${process.env.CONTEXT})`);
    return;
  }
  if (!process.env.NETLIFY && !process.env.INDEXNOW_FORCE) {
    console.log('⏭️  IndexNow skipped (not a Netlify build; set INDEXNOW_FORCE=1 to override)');
    return;
  }

  const urlList = sitemapEntries.map(
    (r) => `${BASE_URL}${r.path === '/' ? '/' : r.path}`
  );

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
    // 200 = accepted, 202 = accepted/pending verification. Both are success.
    if (res.ok) {
      console.log(`📣 IndexNow submitted ${urlList.length} URLs (HTTP ${res.status})`);
    } else {
      console.warn(`⚠️  IndexNow returned HTTP ${res.status} — continuing build`);
    }
  } catch (err) {
    console.warn(`⚠️  IndexNow submission failed (${err.message}) — continuing build`);
  }
}

await submitToIndexNow();

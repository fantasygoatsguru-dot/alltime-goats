import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRoutes } from '../src/config/seo-routes.js';
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
    <li><a href="/matchup-projection">Weekly Matchup Projection</a></li>
    <li><a href="/rankings">Fantasy Basketball Rankings</a></li>
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

  // Write to the right location: '/' -> dist/index.html, others -> dist/<path>/index.html
  const outPath =
    route.path === '/'
      ? indexPath
      : path.join(distPath, route.path.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  count++;
  console.log(`  ✓ ${route.path.padEnd(22)} -> ${path.relative(distPath, outPath)}`);
}

console.log(`✅ Prerendered ${count} routes with per-page title/meta/H1/content`);

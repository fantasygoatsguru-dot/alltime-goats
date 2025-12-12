import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the base index.html
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Add comprehensive SEO content for search engines
const seoContent = `
<h1>Fantasy Goats Guru - Fantasy Basketball League History</h1>
<p>Explore the legendary history of your fantasy basketball league. Track stats, player stories, and epic rivalries.</p>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home - Fantasy League History</a></li>
    <li><a href="/my-team">My Fantasy Team - Team Stats & Analysis</a></li>
    <li><a href="/matchup-projection">Weekly Matchup Projection - Fantasy Basketball Predictions</a></li>
    <li><a href="/season-games">Top Season Games - Best Fantasy Performances 2025-26</a></li>
    <li><a href="/rankings">Fantasy Basketball Rankings - Player Rankings & Stats</a></li>
    <li><a href="/nba-regular-season">NBA Regular Season Schedule - Games by Week</a></li>
    <li><a href="/nba-playoffs">NBA Playoff Schedule - Playoff Games Analysis</a></li>
    <li><a href="/teams">All-Time NBA Teams - Historical Team Stats</a></li>
    <li><a href="/seasons">All-Time NBA Seasons - Historical Season Stats</a></li>
    <li><a href="/games">All-Time NBA Games - Historical Game Logs</a></li>
    <li><a href="/about">About Fantasy Goats Guru</a></li>
  </ul>
</nav>
<section>
  <h2>Fantasy Basketball Tools</h2>
  <p>Fantasy Goats Guru provides comprehensive fantasy basketball tools including team analysis, matchup projections, player rankings, and historical NBA statistics. Make data-driven decisions with AI-powered projections and detailed analytics.</p>
</section>
`;

// Add noscript tag for search engines
const noscriptTag = `<noscript><div style="padding: 20px; max-width: 1200px; margin: 0 auto;">${seoContent}</div></noscript>`;
html = html.replace(/<body>/, `<body>\n${noscriptTag}`);

// Add hidden SEO content for crawlers
const hiddenSeoContent = `<div id="seo-content" style="position: absolute; left: -9999px; top: -9999px;">${seoContent}</div>`;
html = html.replace(/<div id="root"><\/div>/, `<div id="root"></div>\n${hiddenSeoContent}`);

// Write the updated index.html
fs.writeFileSync(indexPath, html);

console.log('✅ SEO content added to index.html');


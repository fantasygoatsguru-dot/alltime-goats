import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublicRoutes } from '../src/config/seo-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get routes to prerender from shared config (only public routes)
const routes = getPublicRoutes();

// Read the base index.html
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// Generate static content snippets for each route (for SEO crawlers)
const getStaticContent = (route) => {
  const contentMap = {
    '/': `
      <h1>Fantasy Goats Guru - Fantasy Basketball League History</h1>
      <p>Explore the legendary history of your fantasy basketball league. Track stats, player stories, and epic rivalries.</p>
      <nav>
        <a href="/my-team">My Fantasy Team</a>
        <a href="/matchup-projection">Matchup Projection</a>
        <a href="/rankings">Player Rankings</a>
        <a href="/season-games">Top Season Games</a>
        <a href="/teams">All-Time Teams</a>
      </nav>
    `,
    '/my-team': `
      <h1>My Fantasy Team - Team Stats & Analysis</h1>
      <p>View your fantasy basketball team stats, player analysis, and team strength. Compare your roster against league averages and optimize your lineup.</p>
      <section>
        <h2>Team Overview</h2>
        <p>Analyze your team's performance across all fantasy basketball categories including points, rebounds, assists, steals, blocks, and shooting percentages.</p>
      </section>
    `,
    '/matchup-projection': `
      <h1>Weekly Matchup Projection - Fantasy Basketball Predictions</h1>
      <p>Get weekly fantasy basketball matchup projections. Compare teams, predict category winners, and plan your lineup strategy with AI-powered projections.</p>
      <section>
        <h2>Matchup Analysis</h2>
        <p>View projected statistics for your upcoming fantasy matchup and make informed decisions about your lineup.</p>
      </section>
    `,
    '/season-games': `
      <h1>Top Season Games - Best Fantasy Performances 2025-26</h1>
      <p>Discover the best fantasy basketball performances of the 2025-26 season. Filter by player, team, and stats to find the highest-scoring games.</p>
      <section>
        <h2>Top Performances</h2>
        <p>Browse the highest-scoring fantasy basketball games of the season with detailed stat breakdowns.</p>
      </section>
    `,
    '/rankings': `
      <h1>Fantasy Basketball Rankings - Player Rankings & Stats</h1>
      <p>View fantasy basketball player rankings and statistics. Compare players across categories and find the best fantasy performers.</p>
      <section>
        <h2>Player Rankings</h2>
        <p>Comprehensive rankings of NBA players for fantasy basketball across all statistical categories.</p>
      </section>
    `,
    '/nba-regular-season': `
      <h1>NBA Regular Season Schedule - Games by Week</h1>
      <p>View the complete NBA regular season schedule week by week. Track game counts for all 30 NBA teams and plan your fantasy lineup.</p>
      <section>
        <h2>Weekly Schedule</h2>
        <p>Plan your fantasy basketball strategy with detailed NBA team schedules throughout the regular season.</p>
      </section>
    `,
    '/nba-playoffs': `
      <h1>NBA Playoff Schedule - Playoff Games Analysis</h1>
      <p>Analyze NBA playoff schedules. View game counts by week and optimize your fantasy playoff roster based on team schedules.</p>
      <section>
        <h2>Playoff Schedule</h2>
        <p>Track NBA playoff games and optimize your fantasy roster for the postseason.</p>
      </section>
    `,
    '/teams': `
      <h1>All-Time NBA Teams - Historical Team Stats</h1>
      <p>Explore all-time NBA team statistics and rankings. Compare legendary teams across eras and view historical performance data.</p>
      <section>
        <h2>NBA Team History</h2>
        <p>Comprehensive statistics and rankings for NBA teams throughout history.</p>
      </section>
    `,
    '/seasons': `
      <h1>All-Time NBA Seasons - Historical Season Stats</h1>
      <p>Explore historical NBA season statistics, legendary performances, and season-by-season breakdowns across all time.</p>
      <section>
        <h2>NBA Season History</h2>
        <p>Detailed season-by-season NBA statistics and historical performance data.</p>
      </section>
    `,
    '/table': `
      <h1>All-Time NBA Seasons - Historical Season Stats</h1>
      <p>Explore historical NBA season statistics, legendary performances, and season-by-season breakdowns across all time.</p>
      <section>
        <h2>NBA Season Data</h2>
        <p>Detailed season-by-season NBA statistics and historical performance data.</p>
      </section>
    `,
    '/games': `
      <h1>All-Time NBA Games - Historical Game Logs</h1>
      <p>View all-time NBA game logs and historical matchups. Discover the greatest performances game-by-game in NBA history.</p>
      <section>
        <h2>NBA Game History</h2>
        <p>Comprehensive game-by-game statistics and historical NBA matchup data.</p>
      </section>
    `,
    '/about': `
      <h1>About Fantasy Goats Guru</h1>
      <p>Learn about Fantasy Goats Guru - the ultimate tool for fantasy basketball league history, player comparisons, and matchup analysis.</p>
      <section>
        <h2>Our Mission</h2>
        <p>Fantasy Goats Guru helps fantasy basketball managers make data-driven decisions with comprehensive statistics, AI-powered projections, and historical analysis.</p>
      </section>
    `,
    '/privacy-policy': `
      <h1>Privacy Policy - Fantasy Goats Guru</h1>
      <p>Read our privacy policy to learn how we protect your data and respect your privacy on Fantasy Goats Guru.</p>
      <section>
        <h2>Your Privacy Matters</h2>
        <p>We are committed to protecting your personal information and being transparent about data usage.</p>
      </section>
    `,
  };
  
  return contentMap[route.path] || contentMap['/'];
};

// Generate prerendered HTML for each route
routes.forEach(route => {
  const canonical = `https://fantasygoats.guru${route.path === '/' ? '' : route.path}`;
  
  // Get static content for this route
  const staticContent = getStaticContent(route);
  
  // Replace meta tags with route-specific values
  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${route.description}"`)
    .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${canonical}"`)
    .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${route.title}"`)
    .replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${route.description}"`)
    .replace(/<meta property="og:url" content=".*?"/, `<meta property="og:url" content="${canonical}"`)
    .replace(/<meta name="twitter:title" content=".*?"/, `<meta name="twitter:title" content="${route.title}"`)
    .replace(/<meta name="twitter:description" content=".*?"/, `<meta name="twitter:description" content="${route.description}"`)
    .replace(/<meta name="twitter:url" content=".*?"/, `<meta name="twitter:url" content="${canonical}"`);
  
  // Add noscript tag with static content for search engines
  const noscriptTag = `<noscript><div style="padding: 20px; max-width: 1200px; margin: 0 auto;">${staticContent}</div></noscript>`;
  
  // Insert noscript content right after <body> tag
  html = html.replace(/<body>/, `<body>\n${noscriptTag}`);
  
  // Also add hidden content in the root div for better SEO (visible to crawlers, hidden from users)
  const seoContent = `<div id="seo-content" style="position: absolute; left: -9999px; top: -9999px;">${staticContent}</div>`;
  html = html.replace(/<div id="root"><\/div>/, `<div id="root"></div>\n${seoContent}`);
  
  // Create directory if needed
  if (route.path !== '/') {
    const routePath = path.join(distPath, route.path);
    if (!fs.existsSync(routePath)) {
      fs.mkdirSync(routePath, { recursive: true });
    }
    fs.writeFileSync(path.join(routePath, 'index.html'), html);
    console.log(`✓ Generated: ${route.path}/index.html`);
  } else {
    fs.writeFileSync(indexPath, html);
    console.log(`✓ Updated: index.html`);
  }
});

console.log('\n✅ Prerendering complete!');
console.log(`📄 Generated ${routes.length} static HTML pages with SEO content`);


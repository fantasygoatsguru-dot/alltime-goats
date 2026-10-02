// Shared SEO configuration for all routes
// Used by both prerender script and SEOHead component

export const seoRoutes = [
  {
    path: '/',
    title: 'Fantasy Basketball Tools & Player Rankings | Fantasy Goats Guru',
    description: 'Advanced fantasy basketball tools including player rankings, matchup analysis, schedule tools, and punt strategy calculator. Dominate your league with data-driven insights.',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    path: '/my-team',
    title: 'Fantasy Basketball Team Analyzer | Free 9-Cat Roster Grader',
    description: 'Grade your fantasy basketball roster in seconds. This free team analyzer scores every player with 9-category z-scores, exposes your category strengths and weaknesses, and shows how your team stacks up against the league — no signup required to try it.',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/matchup-projection',
    title: 'Fantasy Basketball Matchup Projection | Weekly Category Predictions',
    description: 'Get weekly fantasy basketball matchup projections. Compare teams, predict category winners, and plan your lineup strategy with AI-powered projections.',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/matchup',
    title: 'Fantasy Basketball Matchup Analyzer & Team Comparison | Fantasy Goats Guru',
    description: 'Compare fantasy basketball teams and players head-to-head. Analyze weekly matchups, evaluate trades, and predict category winners with advanced statistics.',
    changefreq: 'daily',
    priority: 0.9,
    // Indexable. Yahoo is an *enhancement* here, not a gate: Matchup.jsx has no
    // early return on isAuthenticated — it renders <YahooConnectionSection> as
    // an inline prompt and the page works without it, exactly like /rankings.
    // It was flagged requiresAuth, which kept the site's single most-visited
    // page (7.7k views) out of the sitemap and out of the prerender, so it
    // passed no internal link equity to anything.
    //
    // The genuinely gated routes below keep the flag: /my-league-*, /playoffs
    // and /chat need a connected league to render anything, and /profile and
    // /purchase-success are private by nature.
  },
  {
    path: '/season-games',
    title: 'Top Season Games | Best Fantasy Performances 2025-26 | Fantasy Goats Guru',
    description: 'Discover the best fantasy basketball performances of the 2025-26 season. Filter by player, team, and stats to find the highest-scoring games.',
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    path: '/rankings',
    title: 'Fantasy Basketball Rankings 2026–27 | 9-Cat Z-Score & Punt Strategy',
    description: 'Advanced fantasy basketball rankings with Z-scores across 9 categories. Analyze punt strategies, filter by position and team, and find undervalued players for 2026–27.',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/chat',
    title: 'AI Fantasy Basketball Assistant | Get Expert Advice | Fantasy Goats Guru',
    description: 'Get AI-powered fantasy basketball advice. Ask questions about players, strategies, matchups, and get instant expert recommendations.',
    changefreq: 'weekly',
    priority: 0.7,
    requiresAuth: true, // Not in sitemap
  },
  {
    path: '/nba-regular-season',
    title: 'NBA Fantasy Schedule Grid 2026–27 | Games Per Week by Team',
    description: 'NBA regular season fantasy schedule grid: 82 games per team across 24 weeks. View weekly game counts for all 30 NBA teams and stream the best matchups every week.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/nba-playoffs',
    title: 'NBA Fantasy Basketball Playoff Schedule 2026–27 | Games Per Week',
    description: 'Free fantasy basketball playoff schedule grid for 2026–27 — see exactly how many games all 30 NBA teams play during championship weeks 19–24, sort by week, and stack your roster with games when your title is on the line. No login required.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/my-league-regular-season',
    title: 'My League Regular Season | Fantasy Schedule Analysis | Fantasy Goats Guru',
    description: 'View your fantasy league regular season schedule. Track weekly games and team strength across the entire season.',
    changefreq: 'weekly',
    priority: 0.8,
    requiresAuth: true, // Not in sitemap
  },
  {
    path: '/my-league-playoffs',
    title: 'My League Playoffs | Fantasy Playoff Schedule | Fantasy Goats Guru',
    description: 'Analyze your fantasy league playoff schedule. Calculate playoff strength with z-scores and optimize your roster for the playoffs.',
    changefreq: 'weekly',
    priority: 0.8,
    requiresAuth: true, // Not in sitemap
  },
  {
    path: '/playoffs',
    title: 'Fantasy Basketball Playoff Schedule | Playoff Schedule Analysis Tool',
    description: 'Analyze your fantasy basketball playoff schedule. View NBA team schedules, calculate playoff strength, and optimize your roster for fantasy basketball playoffs.',
    changefreq: 'weekly',
    priority: 0.7,
    requiresAuth: true, // Legacy route, not in sitemap
  },
  {
    path: '/teams',
    title: 'All-Time NBA Teams | Historical Team Stats | Fantasy Goats Guru',
    description: 'Explore all-time NBA team statistics and rankings. Compare legendary teams across eras and view historical performance data.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/seasons',
    title: 'All-Time NBA Seasons | Historical Season Stats | Fantasy Goats Guru',
    description: 'Explore historical NBA season statistics, legendary performances, and season-by-season breakdowns across all time.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/table',
    title: 'All-Time NBA Seasons | Historical Season Stats | Fantasy Goats Guru',
    description: 'Explore historical NBA season statistics, legendary performances, and season-by-season breakdowns across all time.',
    changefreq: 'monthly',
    priority: 0.7,
    alias: '/seasons', // Same content as /seasons
  },
  {
    path: '/games',
    title: 'All-Time NBA Games | Historical Game Logs | Fantasy Goats Guru',
    description: 'View all-time NBA game logs and historical matchups. Discover the greatest performances game-by-game in NBA history.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/about',
    title: 'About Fantasy Goats Guru | Fantasy Basketball Analytics',
    description: 'Learn about Fantasy Goats Guru - the ultimate tool for fantasy basketball league history, player comparisons, and matchup analysis.',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: '/guides',
    title: 'Fantasy Basketball Strategy Guides 2026-27 | Rankings & Punt Strategy',
    description: 'Fantasy basketball strategy guides for 2026-27, with a projected top 150 refreshed against corrected 2025-26 stats, sleepers and busts, and punt builds with live re-ranked boards.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/guides/top-150',
    title: 'Top 150 Fantasy Basketball Rankings 2026-27 | 9-Cat Projections',
    description: '2026-27 fantasy basketball top 150 projections refreshed with corrected 2025-26 nine-category stats, with player stat lines, games played and category contributions.',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/guides/sleepers',
    title: 'Fantasy Basketball Sleepers 2026-27 | 9-Cat Value Picks',
    description: 'Fifteen fantasy basketball sleepers for 2026-27, each with the 9-category case for why he beats his draft price — plus last season\'s real per-game line.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/guides/busts',
    title: 'Fantasy Basketball Busts 2026-27 | Players to Avoid in 9-Cat',
    description: 'Twelve fantasy basketball busts for 2026-27 — the players whose 9-category production will not cover their draft price, and exactly which category gives the value back.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/guides/punt-ft',
    title: 'Punt FT% Strategy 2026-27 | Live Draft Board | Fantasy Goats Guru',
    description: 'The complete punt FT% build for 2026-27 fantasy basketball: why conceding the line buys you the best big men in the league, and a live draft board re-ranked with free throw percentage removed.',
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/guides/punt-assists',
    title: 'Punt Assists Strategy 2026-27 | Live Draft Board | Fantasy Goats Guru',
    description: 'Build a 2026-27 punt assists team around scoring, defense and efficient wings. Draft targets, example teams and a live board with assists removed.',
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/guides/punt-blocks',
    title: 'Punt Blocks Strategy 2026-27 | Live Draft Board | Fantasy Goats Guru',
    description: 'The complete punt blocks build for 2026-27 fantasy basketball: strategy, strengths and weaknesses, and a live draft board re-ranked with blocks removed from the z-score total.',
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Fantasy Goats Guru',
    description: 'Read our privacy policy to learn how we protect your data and respect your privacy on Fantasy Goats Guru.',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    title: 'Terms of Service | Fantasy Goats Guru',
    description: 'The terms governing your use of Fantasy Goats Guru fantasy basketball tools, statistics, and content.',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/pricing',
    title: 'Draft Pass, Season Pass & Combo | Fantasy Goats Guru Premium',
    description: 'Unlock premium fantasy basketball tools with a Draft Pass, Season Pass, or Combo bundle. Weekly matchup projections, head-to-head breakdowns, team strength analysis, and every sleeper and bust case for 2026-27.',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/purchase-success',
    title: 'Thank You | Fantasy Goats Guru',
    description: 'Your Fantasy Goats Guru pass purchase is complete.',
    changefreq: 'yearly',
    priority: 0.1,
    requiresAuth: true, // Not in sitemap
  },
  {
    path: '/profile',
    title: 'My Profile | Fantasy Goats Guru',
    description: 'Manage your Fantasy Goats Guru profile and preferences.',
    changefreq: 'monthly',
    priority: 0.4,
    requiresAuth: true, // Not in sitemap
  },
];

// Helper function to get SEO data by path
export const getSEODataByPath = (pathname) => {
  // Remove trailing slash for matching
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  
  const route = seoRoutes.find(r => r.path === cleanPath);
  
  if (route) {
    return {
      title: route.title,
      description: route.description,
    };
  }
  
  // Default fallback
  return {
    title: 'Fantasy Goats Guru | Fantasy League History & Legends',
    description: 'Explore the legendary history of your fantasy league. Track stats, player stories, and epic rivalries on Fantasy Goats Guru.',
  };
};

// Get only public routes (for prerendering and sitemap)
export const getPublicRoutes = () => {
  return seoRoutes.filter(route => !route.requiresAuth);
};

// Export default for easier import
export default seoRoutes;

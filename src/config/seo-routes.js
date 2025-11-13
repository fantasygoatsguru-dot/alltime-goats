// Shared SEO configuration for all routes
// Used by both prerender script and SEOHead component

export const seoRoutes = [
  {
    path: '/',
    title: 'Fantasy Goats Guru | Fantasy League History & Legends',
    description: 'Explore the legendary history of your fantasy league. Track stats, player stories, and epic rivalries on Fantasy Goats Guru.',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    path: '/my-team',
    title: 'My Fantasy Team | Team Stats & Analysis | Fantasy Goats Guru',
    description: 'View your fantasy basketball team stats, player analysis, and team strength. Compare your roster against league averages and optimize your lineup.',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/matchup-projection',
    title: 'Weekly Matchup Projection | Fantasy Basketball Predictions | Fantasy Goats Guru',
    description: 'Get weekly fantasy basketball matchup projections. Compare teams, predict category winners, and plan your lineup strategy with AI-powered projections.',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/matchup',
    title: 'Fantasy Matchup Analyzer | Compare Teams & Players | Fantasy Goats Guru',
    description: 'Compare fantasy basketball teams and players side-by-side. Analyze matchups, track weekly results, and project future performance with advanced statistics.',
    changefreq: 'daily',
    priority: 0.9,
    requiresAuth: true, // Not in sitemap
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
    title: 'Fantasy Basketball Rankings | Player Rankings & Stats | Fantasy Goats Guru',
    description: 'View fantasy basketball player rankings and statistics. Compare players across categories and find the best fantasy performers.',
    changefreq: 'weekly',
    priority: 0.8,
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
    title: 'NBA Regular Season Schedule | Games by Week | Fantasy Goats Guru',
    description: 'View the complete NBA regular season schedule week by week. Track game counts for all 30 NBA teams and plan your fantasy lineup.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/nba-playoffs',
    title: 'NBA Playoff Schedule | Playoff Games Analysis | Fantasy Goats Guru',
    description: 'Analyze NBA playoff schedules. View game counts by week and optimize your fantasy playoff roster based on team schedules.',
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
    path: '/privacy-policy',
    title: 'Privacy Policy | Fantasy Goats Guru',
    description: 'Read our privacy policy to learn how we protect your data and respect your privacy on Fantasy Goats Guru.',
    changefreq: 'yearly',
    priority: 0.3,
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


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = () => {
  const location = useLocation();
  const baseUrl = 'https://fantasygoats.guru';
  
  useEffect(() => {
    const updateMetaTags = () => {
      let title = 'Fantasy Goats Guru | Fantasy League History & Legends';
      let description = 'Explore the legendary history of your fantasy league. Track stats, player stories, and epic rivalries on Fantasy Goats Guru.';
      let canonical = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;
      
      switch (location.pathname) {
        // League Section
        case '/my-team':
          title = 'My Fantasy Team | Team Stats & Analysis | Fantasy Goats Guru';
          description = 'View your fantasy basketball team stats, player analysis, and team strength. Compare your roster against league averages and optimize your lineup.';
          break;
        case '/matchup-projection':
          title = 'Weekly Matchup Projection | Fantasy Basketball Predictions | Fantasy Goats Guru';
          description = 'Get weekly fantasy basketball matchup projections. Compare teams, predict category winners, and plan your lineup strategy with AI-powered projections.';
          break;
        case '/matchup':
          title = 'Fantasy Matchup Analyzer | Compare Teams & Players | Fantasy Goats Guru';
          description = 'Compare fantasy basketball teams and players side-by-side. Analyze matchups, track weekly results, and project future performance with advanced statistics.';
          break;
        
        // Rankings Section
        case '/season-games':
          title = 'Top Season Games | Best Fantasy Performances 2025-26 | Fantasy Goats Guru';
          description = 'Discover the best fantasy basketball performances of the 2025-26 season. Filter by player, team, and stats to find the highest-scoring games.';
          break;
        case '/rankings':
          title = 'Fantasy Basketball Rankings | Player Rankings & Stats | Fantasy Goats Guru';
          description = 'View fantasy basketball player rankings and statistics. Compare players across categories and find the best fantasy performers.';
          break;
        
        // AI Helper
        case '/chat':
          title = 'AI Fantasy Basketball Assistant | Get Expert Advice | Fantasy Goats Guru';
          description = 'Get AI-powered fantasy basketball advice. Ask questions about players, strategies, matchups, and get instant expert recommendations.';
          break;
        
        // Schedule Section
        case '/nba-regular-season':
          title = 'NBA Regular Season Schedule | Games by Week | Fantasy Goats Guru';
          description = 'View the complete NBA regular season schedule week by week. Track game counts for all 30 NBA teams and plan your fantasy lineup.';
          break;
        case '/nba-playoffs':
          title = 'NBA Playoff Schedule | Playoff Games Analysis | Fantasy Goats Guru';
          description = 'Analyze NBA playoff schedules. View game counts by week and optimize your fantasy playoff roster based on team schedules.';
          break;
        case '/my-league-regular-season':
          title = 'My League Regular Season | Fantasy Schedule Analysis | Fantasy Goats Guru';
          description = 'View your fantasy league regular season schedule. Track weekly games and team strength across the entire season.';
          break;
        case '/my-league-playoffs':
          title = 'My League Playoffs | Fantasy Playoff Schedule | Fantasy Goats Guru';
          description = 'Analyze your fantasy league playoff schedule. Calculate playoff strength with z-scores and optimize your roster for the playoffs.';
          break;
        case '/playoffs':
          title = 'Fantasy Basketball Playoff Schedule | Playoff Schedule Analysis Tool';
          description = 'Analyze your fantasy basketball playoff schedule. View NBA team schedules, calculate playoff strength, and optimize your roster for fantasy basketball playoffs.';
          break;
        
        // Alltime Section
        case '/teams':
          title = 'All-Time NBA Teams | Historical Team Stats | Fantasy Goats Guru';
          description = 'Explore all-time NBA team statistics and rankings. Compare legendary teams across eras and view historical performance data.';
          break;
        case '/seasons':
        case '/table':
          title = 'All-Time NBA Seasons | Historical Season Stats | Fantasy Goats Guru';
          description = 'Explore historical NBA season statistics, legendary performances, and season-by-season breakdowns across all time.';
          break;
        case '/games':
          title = 'All-Time NBA Games | Historical Game Logs | Fantasy Goats Guru';
          description = 'View all-time NBA game logs and historical matchups. Discover the greatest performances game-by-game in NBA history.';
          break;
        
        // Static Pages
        case '/about':
          title = 'About Fantasy Goats Guru | Fantasy Basketball Analytics';
          description = 'Learn about Fantasy Goats Guru - the ultimate tool for fantasy basketball league history, player comparisons, and matchup analysis.';
          break;
        case '/privacy-policy':
          title = 'Privacy Policy | Fantasy Goats Guru';
          description = 'Read our privacy policy to learn how we protect your data and respect your privacy on Fantasy Goats Guru.';
          break;
        
        default:
          break;
      }
      
      // Update title
      document.title = title;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
      
      // Update canonical
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
      
      // Update OG tags
      const updateOGTag = (property, content) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
      };
      
      updateOGTag('og:title', title);
      updateOGTag('og:description', description);
      updateOGTag('og:url', canonical);
      
      // Update Twitter tags
      const updateTwitterTag = (name, content) => {
        let twitterTag = document.querySelector(`meta[name="${name}"]`);
        if (!twitterTag) {
          twitterTag = document.createElement('meta');
          twitterTag.setAttribute('name', name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.setAttribute('content', content);
      };
      
      updateTwitterTag('twitter:title', title);
      updateTwitterTag('twitter:description', description);
    };
    
    updateMetaTags();
  }, [location.pathname]);
  
  return null;
};

export default SEOHead;


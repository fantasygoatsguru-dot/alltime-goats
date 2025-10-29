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
        case '/matchup':
          title = 'Fantasy Matchup Analyzer | Compare Teams & Players | Fantasy Goats Guru';
          description = 'Compare fantasy basketball teams and players side-by-side. Analyze matchups, track weekly results, and project future performance with advanced statistics.';
          break;
        case '/seasons':
        case '/table':
          title = 'Fantasy League History & Season Stats | Fantasy Goats Guru';
          description = 'Explore historical fantasy league statistics, season-by-season breakdowns, and legendary player performances across all time.';
          break;
        case '/games':
          title = 'Fantasy Game Logs & Historical Games | Fantasy Goats Guru';
          description = 'View detailed game logs, historical matchups, and player performances game-by-game in your fantasy league history.';
          break;
        case '/about':
          title = 'About Fantasy Goats Guru | Fantasy Basketball Analytics';
          description = 'Learn about Fantasy Goats Guru - the ultimate tool for fantasy basketball league history, player comparisons, and matchup analysis.';
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


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEODataByPath } from '../config/seo-routes';

const SEOHead = () => {
  const location = useLocation();
  const baseUrl = 'https://fantasygoats.guru';
  
  useEffect(() => {
    const updateMetaTags = () => {
      // Get SEO data from shared config
      const { title, description } = getSEODataByPath(location.pathname);
      const canonical = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;
      
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


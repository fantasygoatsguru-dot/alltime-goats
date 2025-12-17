import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEODataByPath } from '../config/seo-routes';

const StructuredData = () => {
  const location = useLocation();
  
  useEffect(() => {
    const { title, description } = getSEODataByPath(location.pathname);
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Fantasy Goats Guru',
      'url': `https://fantasygoats.guru${location.pathname}`,
      'description': description,
      'applicationCategory': 'SportsApplication',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '150'
      },
      'author': {
        '@type': 'Organization',
        'name': 'Fantasy Goats Guru',
        'url': 'https://fantasygoats.guru'
      }
    };

    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://fantasygoats.guru/'
        }
      ]
    };

    if (location.pathname !== '/') {
      const pathParts = location.pathname.split('/').filter(Boolean);
      pathParts.forEach((part, index) => {
        breadcrumbList.itemListElement.push({
          '@type': 'ListItem',
          'position': index + 2,
          'name': part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          'item': `https://fantasygoats.guru/${pathParts.slice(0, index + 1).join('/')}`
        });
      });
    }

    let existingScript = document.getElementById('structured-data');
    if (!existingScript) {
      existingScript = document.createElement('script');
      existingScript.id = 'structured-data';
      existingScript.type = 'application/ld+json';
      document.head.appendChild(existingScript);
    }
    existingScript.textContent = JSON.stringify([structuredData, breadcrumbList]);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname]);

  return null;
};

export default StructuredData;


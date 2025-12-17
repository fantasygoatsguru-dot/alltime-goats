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

    // FAQ Schema for pages with question-intent queries
    const faqSchemas = {
      '/nba-regular-season': {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How many games are in an NBA regular season?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Each NBA team plays 82 games in the regular season. The NBA regular season typically runs from late October through mid-April, spanning approximately 24 weeks.'
            }
          },
          {
            '@type': 'Question',
            'name': 'When is the NBA regular season?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The NBA regular season typically runs from late October through mid-April. The 2025-26 season follows this schedule, with teams playing 82 games across approximately 24 weeks.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How many games does each NBA team play per week?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'NBA teams typically play 3-4 games per week during the regular season, though this varies by week. Some weeks feature 4 games while lighter weeks may have only 2-3 games. This schedule variation is important for fantasy basketball strategy.'
            }
          }
        ]
      },
      '/nba-playoffs': {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'When do NBA playoffs start for fantasy basketball?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'NBA playoffs typically begin in mid-April. Most fantasy basketball leagues align their playoffs with the NBA playoff schedule, usually starting around week 19-21 of the fantasy season.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How do NBA playoffs affect fantasy basketball?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'NBA playoffs affect fantasy basketball by reducing games per week (2-3 instead of 3-4), increasing rest risks for star players, and creating schedule imbalances. Teams with more games during fantasy playoff weeks provide more value.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is a fantasy basketball playoff schedule?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'A fantasy basketball playoff schedule shows which NBA teams play the most games during your fantasy league\'s playoff weeks. Teams with 4+ games provide more statistical volume and are more valuable for fantasy playoffs.'
            }
          }
        ]
      },
      '/seasons': {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How many NBA seasons have there been?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The NBA has had 78 completed seasons from 1946-47 through 2024-25. The 2025-26 season is the 79th NBA season. The league was originally called the Basketball Association of America (BAA) before becoming the NBA in 1949.'
            }
          }
        ]
      }
    };

    const faqSchema = faqSchemas[location.pathname];

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
    
    const schemas = [structuredData, breadcrumbList];
    if (faqSchema) {
      schemas.push(faqSchema);
    }
    
    existingScript.textContent = JSON.stringify(schemas);

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


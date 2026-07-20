import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStructuredData } from '../config/structured-data';

// Keeps the #structured-data JSON-LD in sync on client-side navigation.
// The initial payload is baked into each page's static HTML by
// scripts/prerender.js; this reuses that same <script> element (by id) and
// updates it when the route changes, so there is never a duplicate.
const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    const schemas = getStructuredData(location.pathname);

    let script = document.getElementById('structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas);
  }, [location.pathname]);

  return null;
};

export default StructuredData;

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

// Generate prerendered HTML for each route
routes.forEach(route => {
  const canonical = `https://fantasygoats.guru${route.path === '/' ? '' : route.path}`;
  
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
console.log(`📄 Generated ${routes.length} static HTML pages`);


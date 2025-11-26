import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Altere este domínio para o seu domínio real
const DOMAIN = 'https://techverseapp.vercel.app';

// Rotas públicas do seu site (acessíveis sem autenticação)
const publicRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/landing', priority: '1.0', changefreq: 'monthly' },
  { path: '/otimizacao', priority: '0.9', changefreq: 'monthly' },
  { path: '/ranking-cpu', priority: '0.9', changefreq: 'weekly' },
  { path: '/donate', priority: '0.9', changefreq: 'monthly' },
  { path: '/noticias', priority: '0.9', changefreq: 'weekly' },
  { path: '/promocoes', priority: '0.8', changefreq: 'weekly' },
  { path: '/atualizacoes', priority: '0.8', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'never' },
];

// Gera o XML do sitemap
function generateSitemap() {
  // Data atual no formato ISO 8601 completo
  const lastmod = new Date().toISOString();

  const urls = publicRoutes.map(route => {
    return `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

  return sitemap;
}

// Salva o sitemap
function saveSitemap() {
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  const sitemapContent = generateSitemap();

  // Cria diretório public se não existir
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`✓ Sitemap gerado com sucesso em: ${sitemapPath}`);
  console.log(`✓ URL base: ${DOMAIN}`);
  console.log(`✓ Total de URLs: ${publicRoutes.length}`);
}

// Gera robots.txt também
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /clientes
Disallow: /ordens-servico
Disallow: /catalogo-servicos
Disallow: /inventario
Disallow: /kits
Disallow: /exportar-dados
Disallow: /financeiro

Sitemap: ${DOMAIN}/sitemap.xml
`;

  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
  console.log(`✓ Robots.txt gerado com sucesso em: ${robotsPath}`);
}

saveSitemap();
generateRobotsTxt();

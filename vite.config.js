import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Configuração do Sitemap
const DOMAIN = 'https://techverseapp.vercel.app'
const publicRoutes = [
  { path: '/landing', priority: '1.0', changefreq: 'monthly' },
  { path: '/otimizacao', priority: '0.9', changefreq: 'monthly' },
  { path: '/donate', priority: '0.9', changefreq: 'monthly' },
  { path: '/noticias', priority: '0.9', changefreq: 'weekly' },
  { path: '/promocoes', priority: '0.8', changefreq: 'weekly' },
  { path: '/atualizacoes', priority: '0.8', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'never' }
]

// Plugin personalizado para gerar sitemap
function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    writeBundle() {
      // Gera sitemap.xml
      const urls = publicRoutes.map(route => {
        return `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
      }).join('\n')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

      // Gera robots.txt
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
`

      // Salva arquivos na pasta dist
      try {
        // Obtém o diretório de saída do Vite
        const outDir = path.resolve(process.cwd(), 'dist')
        
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf-8')
        fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt, 'utf-8')
        
        console.log('✅ Sitemap e Robots.txt gerados automaticamente!')
        console.log(`✅ Total de URLs: ${publicRoutes.length}`)
        console.log(`✅ URL base: ${DOMAIN}`)
      } catch (error) {
        console.warn('⚠️  Aviso: Não foi possível gerar sitemap automáticamente:', error.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    sitemapPlugin(), // Plugin personalizado para sitemap
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TechVerse - Gestão de Assistência Técnica',
        short_name: 'TechVerse',
        description: 'Sistema completo para gestão de assistência técnica',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
interface ProductItem {
  slug: string
  updatedAt?: string
}

interface CategoryItem {
  slug: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const apiBase = config.public.apiBase

  const staticPaths = ['/', '/search', '/board', '/compare']

  const [trending, topSelling, categories] = await Promise.all([
    $fetch<ProductItem[]>(`${apiBase}/products/trending`).catch(() => []),
    $fetch<ProductItem[]>(`${apiBase}/products/top-selling`).catch(() => []),
    $fetch<CategoryItem[]>(`${apiBase}/categories`).catch(() => []),
  ])

  const productSlugs = new Set([
    ...trending.map((p) => p.slug),
    ...topSelling.map((p) => p.slug),
  ])

  const urls = [
    ...staticPaths.map((path) => ({ loc: `${siteUrl}${path}`, priority: path === '/' ? '1.0' : '0.8' })),
    ...categories.map((c) => ({ loc: `${siteUrl}/categories/${c.slug}`, priority: '0.7' })),
    ...[...productSlugs].map((slug) => ({ loc: `${siteUrl}/products/${slug}`, priority: '0.6' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>daily</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})

interface ProductItem {
  slug: string
}

interface CategoryItem {
  slug: string
}

interface SearchPage {
  items: ProductItem[]
  meta: { totalPages: number }
}

interface SitemapEntry {
  loc: string
  priority: string
  changefreq: string
  lastmod?: string
}

function todayIso() {
  return new Date().toISOString().split('T')[0]
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function fetchAllProductSlugs(apiBase: string) {
  const slugs = new Set<string>()
  let page = 1
  let totalPages = 1
  const maxPages = 50

  while (page <= totalPages && page <= maxPages) {
    const res = await $fetch<SearchPage>(`${apiBase}/products/search`, {
      query: { page, limit: 100, sort: 'newest' },
    }).catch(() => null)

    if (!res?.items?.length) break

    for (const item of res.items) {
      if (item.slug) slugs.add(item.slug)
    }

    totalPages = res.meta?.totalPages ?? 1
    page += 1
  }

  return [...slugs]
}

interface BoardPostItem {
  id: string
}

interface BoardPostList {
  items: BoardPostItem[]
  total: number
  totalPages: number
}

async function fetchBoardPostIds(apiBase: string) {
  const ids = new Set<string>()
  let page = 1
  let totalPages = 1
  const maxPages = 10

  while (page <= totalPages && page <= maxPages) {
    const res = await $fetch<BoardPostList>(`${apiBase}/board/posts`, {
      query: { sort: 'hot', page, limit: 50 },
    }).catch(() => null)

    if (!res?.items?.length) break

    for (const item of res.items) {
      if (item.id) ids.add(item.id)
    }

    totalPages = res.totalPages ?? 1
    page += 1
  }

  return [...ids]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const apiBase = config.public.apiBase
  const lastmod = todayIso()

  const staticPages: Array<{ path: string, priority: string, changefreq: string }> = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/search', priority: '0.8', changefreq: 'weekly' },
    { path: '/board', priority: '0.8', changefreq: 'daily' },
    { path: '/leaderboard', priority: '0.5', changefreq: 'weekly' },
  ]

  const [categories, productSlugs, boardPostIds] = await Promise.all([
    $fetch<CategoryItem[]>(`${apiBase}/categories`).catch(() => []),
    fetchAllProductSlugs(apiBase),
    fetchBoardPostIds(apiBase),
  ])

  const urls: SitemapEntry[] = [
    ...staticPages.map((page) => ({
      loc: `${siteUrl}${page.path}`,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod,
    })),
    ...categories.map((c) => ({
      loc: `${siteUrl}/categories/${c.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod,
    })),
    ...boardPostIds.map((id) => ({
      loc: `${siteUrl}/board/posts/${id}`,
      priority: '0.55',
      changefreq: 'weekly',
      lastmod,
    })),
    ...productSlugs.map((slug) => ({
      loc: `${siteUrl}/products/${slug}`,
      priority: '0.6',
      changefreq: 'daily',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})

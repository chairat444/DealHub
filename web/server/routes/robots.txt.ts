export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth/
Disallow: /wishlist
Disallow: /notifications

Sitemap: ${siteUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return body
})

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const body = `User-agent: *
Allow: /
Disallow: /auth/
Disallow: /compare
Disallow: /wishlist
Disallow: /notifications
Disallow: /settings
Disallow: /profile

Sitemap: ${siteUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return body
})

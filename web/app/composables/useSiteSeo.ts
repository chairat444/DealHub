import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export const SITE = {
  name: 'DealHub TH',
  shortName: 'DealHub',
  defaultTitle: 'DealHub TH - เทียบราคาสินค้าจาก Shopee, Lazada, TikTok Shop',
  defaultDescription:
    'แพลตฟอร์มเทียบราคาสินค้าออนไลน์ รวบรวมสินค้าจาก Shopee, Lazada, TikTok Shop เปรียบเทียบราคา ดูประวัติราคา และรับแจ้งเตือนเมื่อราคาลด',
  themeColor: '#EE4D2D',
  locale: 'th_TH',
} as const

export interface SiteSeoOptions {
  title?: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string | null | undefined>
  path?: MaybeRefOrGetter<string>
  noindex?: boolean
  /** ใช้ title เต็ม ไม่ต่อ suffix */
  titleFull?: boolean
  jsonLd?: MaybeRefOrGetter<Record<string, unknown> | Record<string, unknown>[] | undefined>
}

function resolveUrl(base: string, path: string) {
  return path.startsWith('http') ? path : `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

export function useSiteSeo(options: SiteSeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.siteUrl as string

  const pageTitle = computed(() => {
    const t = toValue(options.title)
    if (options.titleFull) return t || SITE.defaultTitle
    return t || SITE.shortName
  })

  const fullTitle = computed(() => {
    if (options.titleFull) return pageTitle.value
    const t = toValue(options.title)
    return t ? `${t} | ${SITE.name}` : SITE.defaultTitle
  })

  const description = computed(() => toValue(options.description) || SITE.defaultDescription)

  const ogImage = computed(() => {
    const img = toValue(options.image)
    if (img) return resolveUrl(siteUrl, img)
    return resolveUrl(siteUrl, '/og-image.svg')
  })

  const canonical = computed(() => {
    const path = toValue(options.path) ?? route.path
    return resolveUrl(siteUrl, path)
  })

  const robots = options.noindex ? 'noindex, nofollow' : 'index, follow'

  useHead({
    title: pageTitle,
    titleTemplate: options.titleFull ? '' : `%s | ${SITE.name}`,
    link: [{ rel: 'canonical', href: canonical }],
  })

  useSeoMeta({
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    ogType: 'website',
    ogSiteName: SITE.name,
    ogLocale: SITE.locale,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,
    robots,
  })

  const jsonLd = computed(() => toValue(options.jsonLd))

  useHead({
    script: computed(() => {
      const data = jsonLd.value
      if (!data) return []
      const items = Array.isArray(data) ? data : [data]
      return items.map((item) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(item),
      }))
    }),
  })
}

export function buildProductJsonLd(product: {
  name: string
  slug: string
  imageUrl?: string
  description?: string
  brand?: string
  lowestPrice?: number
  rating?: number
  reviewCount?: number
}, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description || product.name,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: product.lowestPrice
      ? {
          '@type': 'AggregateOffer',
          lowPrice: product.lowestPrice,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/products/${product.slug}`,
        }
      : undefined,
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
  }
}

export function buildWebsiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: siteUrl,
    description: SITE.defaultDescription,
    inLanguage: 'th',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildCategoryJsonLd(category: {
  name: string
  slug: string
  description?: string
}, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `สินค้าหมวด${category.name} เปรียบเทียบราคาจาก Shopee, Lazada, TikTok Shop`,
    url: `${siteUrl}/categories/${category.slug}`,
    inLanguage: 'th',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: siteUrl,
    },
  }
}

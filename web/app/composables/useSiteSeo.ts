import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { SEO } from '~/constants/seo'
import { HOME_FAQ } from '~/constants/faq'

export const SITE = {
  name: SEO.siteName,
  shortName: SEO.shortName,
  defaultTitle: SEO.defaultTitle,
  defaultDescription: SEO.defaultDescription,
  homeTitle: SEO.homeTitle,
  homeDescription: SEO.homeDescription,
  homeKeywords: SEO.homeKeywords,
  themeColor: SEO.themeColor,
  locale: SEO.locale,
  ogImageAlt: SEO.ogImageAlt,
  ogImagePath: SEO.ogImagePath,
} as const

export interface SiteSeoOptions {
  title?: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
  keywords?: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string | null | undefined>
  path?: MaybeRefOrGetter<string>
  noindex?: MaybeRefOrGetter<boolean>
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
  const keywords = computed(() => toValue(options.keywords))

  const ogImage = computed(() => {
    const img = toValue(options.image)
    if (img) return resolveUrl(siteUrl, img)
    return resolveUrl(siteUrl, SITE.ogImagePath)
  })

  const canonical = computed(() => {
    const path = toValue(options.path) ?? route.path
    return resolveUrl(siteUrl, path)
  })

  const robots = computed(() =>
    toValue(options.noindex)
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )

  useHead({
    title: pageTitle,
    titleTemplate: options.titleFull ? '' : `%s | ${SITE.name}`,
    htmlAttrs: { lang: 'th' },
    link: [{ rel: 'canonical', href: canonical }],
  })

  useSeoMeta({
    description,
    keywords,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage,
    ogImageAlt: SITE.ogImageAlt,
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
  const productUrl = `${siteUrl.replace(/\/$/, '')}/products/${product.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: productUrl,
    image: product.imageUrl,
    description: product.description || product.name,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: product.lowestPrice
      ? {
          '@type': 'AggregateOffer',
          lowPrice: product.lowestPrice,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          url: productUrl,
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

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  siteUrl: string,
) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${base}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  }
}

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}/og-image.svg`,
    description: SITE.defaultDescription,
    sameAs: [],
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
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildWebPageJsonLd(siteUrl: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: siteUrl,
    inLanguage: 'th',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: siteUrl,
    },
  }
}

export function buildItemListJsonLd(
  siteUrl: string,
  name: string,
  products: Array<{ name: string; slug: string; lowestPrice?: number | null }>,
) {
  if (!products.length) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/products/${product.slug}`,
      ...(product.lowestPrice
        ? {
            item: {
              '@type': 'Product',
              name: product.name,
              url: `${siteUrl}/products/${product.slug}`,
              offers: {
                '@type': 'Offer',
                price: product.lowestPrice,
                priceCurrency: 'THB',
              },
            },
          }
        : {}),
    })),
  }
}

export function buildFaqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  if (!items.length) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildHomePageJsonLd(
  siteUrl: string,
  products: Array<{ name: string; slug: string; lowestPrice?: number | null }>,
) {
  const schemas: Record<string, unknown>[] = [
    buildOrganizationJsonLd(siteUrl),
    buildWebsiteJsonLd(siteUrl),
    buildWebPageJsonLd(siteUrl, SITE.homeTitle, SITE.homeDescription),
  ]

  const itemList = buildItemListJsonLd(siteUrl, 'สินค้าขายดีและมาแรงบน DealHub TH', products)
  if (itemList) schemas.push(itemList)

  const faqPage = buildFaqPageJsonLd(HOME_FAQ)
  if (faqPage) schemas.push(faqPage)

  return schemas
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

export function buildDiscussionForumPostingJsonLd(
  post: {
    id: string
    title: string
    body?: string | null
    excerpt?: string | null
    createdAt: string
    authorName: string
    upvotes: number
    commentCount: number
  },
  siteUrl: string,
) {
  const base = siteUrl.replace(/\/$/, '')
  const url = `${base}/board/posts/${post.id}`
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: post.title,
    text: post.body || post.excerpt || post.title,
    datePublished: post.createdAt,
    author: { '@type': 'Person', name: post.authorName },
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', name: SITE.name, url: base },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.upvotes,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.commentCount,
      },
    ],
  }
}

export function buildBoardPageJsonLd(siteUrl: string, title: string, description: string) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${base}/board`,
    inLanguage: 'th',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: base },
    about: {
      '@type': 'Thing',
      name: 'ชุมชนผู้ช้อปออนไลน์',
      description: 'พื้นที่พูดคุย รีวิวสินค้า และแชร์ดีล',
    },
  }
}

export function buildLeaderboardPageJsonLd(siteUrl: string, title: string, description: string) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${base}/leaderboard`,
    inLanguage: 'th',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: base },
  }
}

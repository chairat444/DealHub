<template>
  <div class="bg-page text-content pb-16 md:pb-0">
    <div class="page-container py-3">
      <HomeHero :top-product="topSelling?.[0]" />

      <HomeFeaturedProducts
        v-if="featuredProducts.length"
        :products="featuredProducts"
      />

      <HomeCategorySection :categories="categories || []" />

      <HomeDealsZone
        v-if="hasDealsContent"
        :flash-products="flashSaleProducts"
        :trending-products="trendingProducts"
        :best-sellers="bestSellers"
      />

      <div class="deals-board-divider my-4 flex items-center gap-3" aria-hidden="true">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-shopee/30 to-transparent" />
        <span class="text-xs font-bold text-shopee dark:text-[rgb(var(--accent-display))] px-2 flex items-center gap-1">
          💬 ชุมชนผู้ช้อป
        </span>
        <div class="flex-1 h-px bg-gradient-to-l from-transparent via-shopee/30 to-transparent" />
      </div>

      <HomeBoardSpotlight />
    </div>

    <HomeMobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import type { Category, Product } from '~/types'
import { HOME_PRODUCT_LIMITS } from '~/constants/home'
import { getDiscountPercent } from '~/composables/useProductHelpers'

const { apiFetch } = useApi()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

const apiLimit = Math.max(
  HOME_PRODUCT_LIMITS.trending,
  HOME_PRODUCT_LIMITS.flashSale,
  HOME_PRODUCT_LIMITS.bestSellers,
  HOME_PRODUCT_LIMITS.featured,
)

const [{ data: categories }, { data: trending }, { data: topSelling }] = await Promise.all([
  useAsyncData('home-categories', () => apiFetch<Category[]>('/categories').catch(() => [])),
  useAsyncData('home-trending', () =>
    apiFetch<Product[]>(`/products/trending?limit=${apiLimit}`).catch(() => []),
  ),
  useAsyncData('home-top-selling', () =>
    apiFetch<Product[]>(`/products/top-selling?limit=${apiLimit}`).catch(() => []),
  ),
])

const featuredProducts = computed(() =>
  (topSelling.value || []).slice(0, HOME_PRODUCT_LIMITS.featured),
)

const trendingProducts = computed(() =>
  (trending.value || []).slice(0, HOME_PRODUCT_LIMITS.trending),
)

const flashSaleProducts = computed(() => {
  const items = trending.value || []
  const discounted = items
    .filter((p) => getDiscountPercent(p) > 0)
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
  const pool = discounted.length >= HOME_PRODUCT_LIMITS.flashSale ? discounted : items
  return pool.slice(0, HOME_PRODUCT_LIMITS.flashSale)
})

const bestSellers = computed(() =>
  (topSelling.value || []).slice(0, HOME_PRODUCT_LIMITS.bestSellers),
)

const hasDealsContent = computed(() =>
  flashSaleProducts.value.length > 0
  || trendingProducts.value.length > 0
  || bestSellers.value.length > 0,
)

const seoProductList = computed(() => {
  const seen = new Set<string>()
  const merged = [...(topSelling.value || []), ...(trending.value || [])]
  return merged.filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  }).slice(0, 12)
})

useSiteSeo({
  titleFull: true,
  title: SITE.homeTitle,
  description: SITE.homeDescription,
  keywords: SITE.homeKeywords,
  path: '/',
  jsonLd: computed(() => buildHomePageJsonLd(siteUrl, seoProductList.value)),
})
</script>

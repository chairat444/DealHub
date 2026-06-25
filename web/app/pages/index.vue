<template>
  <div class="bg-page text-content pb-16 md:pb-0">
    <div class="page-container py-3">
      <HomeHero :top-product="topSelling?.[0]" />

      <HomeFeaturedProducts
        v-if="featuredProducts.length"
        :products="featuredProducts"
      />

      <HomeCategorySection :categories="categories || []" />

      <!-- สินค้ามาแรง + Flash Sale แยกกัน ไม่ต้องสลับแท็บ -->
      <HomeTrendingSection
        v-if="trendingProducts.length"
        :products="trendingProducts"
      />

      <HomeFlashSaleSection
        v-if="flashSaleProducts.length"
        :products="flashSaleProducts"
      />

      <!-- Desktop: ขายดี + Board คู่กัน -->
      <div class="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-3 mb-2.5">
        <HomeBestSellerPanel
          v-if="topSelling?.length"
          :products="topSelling.slice(0, 5)"
        />
        <HomeBoardCommunity compact />
      </div>
    </div>

    <HomeMobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import type { Category, Product } from '~/types'
import { getDiscountPercent } from '~/composables/useProductHelpers'

const { apiFetch } = useApi()
const config = useRuntimeConfig()

useSiteSeo({
  titleFull: true,
  title: SITE.defaultTitle,
  description: SITE.defaultDescription,
  jsonLd: buildWebsiteJsonLd(config.public.siteUrl as string),
})

const [{ data: categories }, { data: trending }, { data: topSelling }] = await Promise.all([
  useAsyncData('home-categories', () => apiFetch<Category[]>('/categories').catch(() => [])),
  useAsyncData('home-trending', () => apiFetch<Product[]>('/products/trending').catch(() => [])),
  useAsyncData('home-top-selling', () => apiFetch<Product[]>('/products/top-selling').catch(() => [])),
])

const HOME_SECTION_LIMIT = 6

const featuredProducts = computed(() => (topSelling.value || []).slice(0, 3))
const trendingProducts = computed(() => (trending.value || []).slice(0, HOME_SECTION_LIMIT))
const flashSaleProducts = computed(() => {
  const items = trending.value || []
  const discounted = items.filter(p => getDiscountPercent(p) > 0)
  const pool = discounted.length >= 3 ? discounted : items
  return pool.slice(0, HOME_SECTION_LIMIT)
})
</script>

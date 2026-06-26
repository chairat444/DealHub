<template>
  <div class="container mx-auto px-4 py-6">
    <nav class="text-sm text-content-muted mb-4">
      <NuxtLink to="/" class="hover:text-shopee">หน้าแรก</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/search" class="hover:text-shopee">หมวดหมู่</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-content">{{ category?.name || 'หมวดหมู่' }}</span>
    </nav>

    <header class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-content mb-2">
        {{ category?.icon }} {{ category?.name || 'หมวดหมู่' }}
      </h1>
      <p v-if="category?.description" class="text-content-muted text-base leading-relaxed max-w-3xl">
        {{ category.description }}
      </p>
      <p v-else class="text-content-muted text-base">
        เปรียบเทียบราคาสินค้าหมวด{{ category?.name }} จาก Shopee, Lazada, TikTok Shop
      </p>
      <p v-if="category?._count?.products" class="text-sm text-content-muted mt-2">
        {{ category._count.products }} สินค้าในหมวดนี้
      </p>
      <ShareButtons
        v-if="category"
        class="mt-4"
        compact
        :title="`${category.name} — เทียบราคา DealHub TH`"
        :text="seoDescription"
        :path="`/categories/${slug}`"
        label="แชร์หมวดนี้"
      />
    </header>

    <AdSlot placement="CATEGORY_TOP" wrapper-class="mb-6" />

    <div v-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>
    <template v-else>
      <div v-if="results?.items?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <ProductCard v-for="product in results.items" :key="product.id" :product="product" />
      </div>
      <div v-else class="text-center py-20 text-content-muted">ไม่พบสินค้าในหมวดหมู่นี้</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AdSlot from '~/components/AdSlot.vue'
import type { Category, PaginatedResponse, Product } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()
const config = useRuntimeConfig()
const slug = route.params.slug as string

const { data: category } = await useAsyncData(
  `cat-${slug}`,
  () => apiFetch<Category>(`/categories/${slug}`).catch(() => null),
)

const { data: results, pending } = await useAsyncData(
  `cat-products-${slug}`,
  () => apiFetch<PaginatedResponse<Product>>('/products/search', { query: { category: slug, limit: 20 } }).catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } })),
)

const seoTitle = computed(() =>
  category.value?.name
    ? `${category.value.name} — เทียบราคา Shopee Lazada TikTok`
    : 'หมวดหมู่สินค้า',
)

const seoDescription = computed(() => {
  if (category.value?.description) return category.value.description
  if (category.value?.name) {
    return `สินค้าหมวด${category.value.name} เปรียบเทียบราคาจาก Shopee, Lazada, TikTok Shop`
  }
  return 'เลือกดูสินค้าตามหมวดหมู่และเปรียบเทียบราคา'
})

useSiteSeo({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  path: () => `/categories/${slug}`,
  jsonLd: computed(() => {
    if (!category.value) return undefined
    const site = config.public.siteUrl as string
    return [
      buildCategoryJsonLd(category.value, site),
      buildBreadcrumbJsonLd([
        { name: 'หน้าแรก', path: '/' },
        { name: 'หมวดหมู่', path: '/search' },
        { name: category.value.name, path: `/categories/${slug}` },
      ], site),
    ]
  }),
})
</script>

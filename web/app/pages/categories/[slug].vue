<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      {{ category?.icon }} {{ category?.name || 'หมวดหมู่' }}
    </h1>
    <p v-if="category?.description" class="text-gray-500 text-sm mb-6">{{ category.description }}</p>

    <div v-if="pending" class="text-center py-20 text-gray-400">กำลังโหลด...</div>
    <template v-else>
      <div v-if="results?.items?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <ProductCard v-for="product in results.items" :key="product.id" :product="product" />
      </div>
      <div v-else class="text-center py-20 text-gray-500">ไม่พบสินค้าในหมวดหมู่นี้</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Category, PaginatedResponse, Product } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()
const slug = route.params.slug as string

const { data: category } = await useAsyncData(
  `cat-${slug}`,
  () => apiFetch<Category>(`/categories/${slug}`).catch(() => null),
)

const { data: results, pending } = await useAsyncData(
  `cat-products-${slug}`,
  () => apiFetch<PaginatedResponse<Product>>('/products/search', { query: { category: slug, limit: 20 } }).catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } })),
)

useSeoMeta({
  title: () => `${category.value?.name || 'หมวดหมู่'} - DealHub TH`,
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        ผลการค้นหา
        <span v-if="query" class="text-[#EE4D2D]">"{{ query }}"</span>
      </h1>
      <p v-if="results?.meta" class="text-gray-500 text-sm mt-1">
        พบ {{ results.meta.total }} รายการ
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <select v-model="sort" @change="refetch" class="input-field w-auto text-sm">
        <option value="sold">ขายดี</option>
        <option value="rating">คะแนนสูงสุด</option>
        <option value="price_asc">ราคาต่ำ-สูง</option>
        <option value="price_desc">ราคาสูง-ต่ำ</option>
        <option value="newest">ใหม่ล่าสุด</option>
      </select>
      <select v-model="marketplace" @change="refetch" class="input-field w-auto text-sm">
        <option value="">ทุกแพลตฟอร์ม</option>
        <option value="SHOPEE">Shopee</option>
        <option value="LAZADA">Lazada</option>
        <option value="TIKTOK_SHOP">TikTok Shop</option>
      </select>
    </div>

    <!-- Results -->
    <div v-if="pending" class="text-center py-20 text-gray-400">กำลังค้นหา...</div>
    <div v-else-if="!results?.items?.length" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-gray-500">ไม่พบสินค้าที่ค้นหา</p>
    </div>
    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <ProductCard
          v-for="product in results.items"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div v-if="results.meta.totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button
          v-for="p in results.meta.totalPages"
          :key="p"
          @click="page = p; refetch()"
          :class="['px-4 py-2 rounded-sm text-sm', page === p ? 'bg-[#EE4D2D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50']"
        >
          {{ p }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PaginatedResponse, Product } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()

const query = computed(() => (route.query.q as string) || '')
const sort = ref((route.query.sort as string) || 'sold')
const marketplace = ref((route.query.marketplace as string) || '')
const page = ref(1)

const { data: results, pending, refresh: refetch } = await useAsyncData(
  'search',
  () => apiFetch<PaginatedResponse<Product>>('/products/search', {
    query: {
      q: query.value,
      sort: sort.value,
      marketplace: marketplace.value || undefined,
      page: page.value,
      limit: 20,
    },
  }).catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } })),
  { watch: [query] },
)

useSeoMeta({
  title: () => `ค้นหา "${query.value}" - DealHub TH`,
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-content">
        ผลการค้นหา
        <span v-if="query" class="text-[#EE4D2D]">"{{ query }}"</span>
      </h1>
      <p v-if="results?.meta" class="text-content-muted text-base mt-1">
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

    <AdSlot placement="SEARCH_TOP" wrapper-class="mb-6" />

    <!-- Results -->
    <div v-if="pending" class="text-center py-20 text-content-muted">กำลังค้นหา...</div>
    <div v-else-if="!results?.items?.length" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-content-muted">ไม่พบสินค้าที่ค้นหา</p>
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
          :class="['px-4 py-2 rounded-sm text-sm', page === p ? 'bg-[#EE4D2D] text-white' : 'bg-surface text-content-muted hover:bg-surface-muted border border-line']"
        >
          {{ p }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AdSlot from '~/components/AdSlot.vue'
import type { PaginatedResponse, Product } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()

const query = computed(() => (route.query.q as string) || '')

/** Index only bare /search — parameterized results are thin/duplicate for crawlers */
const hasSearchParams = computed(() =>
  Object.keys(route.query).some((key) => {
    const value = route.query[key]
    if (Array.isArray(value)) return value.some((v) => String(v).trim() !== '')
    return value != null && String(value).trim() !== ''
  }),
)

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

useSiteSeo({
  title: () => (query.value ? `ค้นหา "${query.value}"` : 'ค้นหาสินค้า'),
  description: () =>
    query.value
      ? `ผลการค้นหา "${query.value}" เปรียบเทียบราคาจาก Shopee, Lazada, TikTok Shop`
      : 'ค้นหาและเปรียบเทียบราคาสินค้าจาก Shopee, Lazada, TikTok Shop',
  path: '/search',
  noindex: () => hasSearchParams.value,
})
</script>

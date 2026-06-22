<template>
  <div>
    <!-- Hero Banner -->
    <section class="bg-gradient-to-r from-[#EE4D2D] to-[#FF6633] text-white">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <div class="max-w-2xl">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            เทียบราคาสินค้าจากทุกแพลตฟอร์ม
          </h1>
          <p class="text-lg text-orange-100 mb-6">
            รวบรวมสินค้าจาก Shopee, Lazada, TikTok Shop เปรียบเทียบราคา ดูประวัติราคา และรับแจ้งเตือนเมื่อราคาลด
          </p>
          <form @submit.prevent="handleSearch" class="flex max-w-lg">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาสินค้าที่ต้องการ..."
              class="flex-1 px-4 py-3 rounded-l-sm text-gray-900 focus:outline-none"
            />
            <button type="submit" class="bg-[#D73211] hover:bg-[#c02a0d] px-8 py-3 rounded-r-sm font-medium transition-colors">
              ค้นหา
            </button>
          </form>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8 space-y-10">
      <!-- Categories -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4">🛍️ หมวดหมู่สินค้า</h2>
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/categories/${cat.slug}`"
            class="card p-4 text-center hover:border-[#EE4D2D] border border-transparent transition-colors"
          >
            <div class="text-3xl mb-2">{{ cat.icon }}</div>
            <div class="text-sm font-medium text-gray-700">{{ cat.name }}</div>
          </NuxtLink>
        </div>
      </section>

      <!-- Trending -->
      <ProductGrid
        v-if="trending?.length"
        title="สินค้ามาแรง"
        icon="🔥"
        :products="trending"
        view-all-link="/search?sort=sold"
      />

      <!-- Top Selling -->
      <ProductGrid
        v-if="topSelling?.length"
        title="สินค้าขายดี"
        icon="🏆"
        :products="topSelling"
        view-all-link="/search?sort=sold"
      />

      <!-- Features -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card p-6 text-center">
          <div class="text-4xl mb-3">💰</div>
          <h3 class="font-bold text-gray-800 mb-2">เทียบราคา</h3>
          <p class="text-sm text-gray-500">เปรียบเทียบราคาจาก Shopee, Lazada, TikTok Shop ในที่เดียว</p>
        </div>
        <div class="card p-6 text-center">
          <div class="text-4xl mb-3">📊</div>
          <h3 class="font-bold text-gray-800 mb-2">ประวัติราคา</h3>
          <p class="text-sm text-gray-500">ดูกราฟราคาย้อนหลัง รู้ว่าตอนนี้ราคาถูกหรือแพง</p>
        </div>
        <div class="card p-6 text-center">
          <div class="text-4xl mb-3">🔔</div>
          <h3 class="font-bold text-gray-800 mb-2">แจ้งเตือนราคา</h3>
          <p class="text-sm text-gray-500">ตั้งแจ้งเตือนเมื่อราคาลดถึงที่ต้องการ</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Product } from '~/types'

const router = useRouter()
const { apiFetch } = useApi()
const searchQuery = ref('')

useSeoMeta({
  title: 'DealHub TH - เทียบราคาสินค้าจาก Shopee, Lazada, TikTok Shop',
  description: 'แพลตฟอร์มเทียบราคาสินค้าออนไลน์ รวบรวมสินค้าจาก Shopee, Lazada, TikTok Shop',
})

const [{ data: categories }, { data: trending }, { data: topSelling }] = await Promise.all([
  useAsyncData('categories', () => apiFetch<Category[]>('/categories').catch(() => [])),
  useAsyncData('trending', () => apiFetch<Product[]>('/products/trending').catch(() => [])),
  useAsyncData('top-selling', () => apiFetch<Product[]>('/products/top-selling').catch(() => [])),
])

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}
</script>

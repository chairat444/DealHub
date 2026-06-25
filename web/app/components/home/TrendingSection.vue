<template>
  <section class="section-card px-4 py-4 mb-2.5">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-shopee" />
        <h2 class="text-xl font-bold text-content">สินค้ามาแรง</h2>
        <span class="text-xs bg-shopee text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
          อัปเดตสด
        </span>
      </div>
      <NuxtLink to="/search?sort=sold" class="text-sm text-shopee font-semibold hover:underline">
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <HomeFlashProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        image-fill
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import type { Product } from '~/types'

defineProps<{
  products: Product[]
}>()
</script>

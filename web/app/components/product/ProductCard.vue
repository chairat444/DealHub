<template>
  <NuxtLink :to="`/products/${product.slug}`" class="card block overflow-hidden group">
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="product.imageUrl || '/placeholder-product.svg'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div v-if="product.isTrending" class="absolute top-2 left-2 badge-shopee">
        🔥 มาแรง
      </div>
      <div v-if="product.isTopSelling" class="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">
        ขายดี
      </div>
    </div>
    <div class="p-3">
      <h3 class="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#EE4D2D] transition-colors">
        {{ product.name }}
      </h3>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="product.lowestPrice" class="text-[#EE4D2D] font-bold text-lg">
          {{ formatPrice(product.lowestPrice) }}
        </span>
        <span v-if="product.listings && product.listings.length > 1" class="text-xs text-gray-400">
          จาก {{ product.listings.length }} ร้าน
        </span>
      </div>
      <div class="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
        <span v-if="product.rating" class="flex items-center gap-0.5">
          ⭐ {{ product.rating }}
        </span>
        <span v-if="product.soldCount">ขายแล้ว {{ formatSold(product.soldCount) }}</span>
      </div>
      <div v-if="product.listings" class="mt-2 flex gap-1 flex-wrap">
        <span
          v-for="listing in product.listings.slice(0, 3)"
          :key="listing.id"
          :class="['text-xs px-1.5 py-0.5 rounded', marketplaceColor(listing.marketplace)]"
        >
          {{ marketplaceLabel(listing.marketplace) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{ product: Product }>()

const formatSold = (count: number) => {
  if (count >= 10000) return `${(count / 1000).toFixed(1)}k`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return count.toString()
}
</script>

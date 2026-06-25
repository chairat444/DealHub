<template>
  <NuxtLink :to="`/products/${product.slug}`" class="card block overflow-hidden group">
    <div class="relative aspect-square product-image-frame overflow-hidden">
      <ProductImage
        :src="product.imageUrl"
        :alt="product.name"
        :category-slug="product.category?.slug"
        container-class="aspect-square"
        img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-if="product.isTrending" class="absolute top-2 left-2 badge-shopee">
        🔥 มาแรง
      </div>
      <div v-if="product.isTopSelling" class="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-0.5 rounded">
        ขายดี
      </div>
    </div>
    <div class="p-3.5">
      <h3 class="text-base text-content line-clamp-2 min-h-[3rem] group-hover:text-[#EE4D2D] transition-colors leading-snug">
        {{ product.name }}
      </h3>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="product.lowestPrice" class="text-[#EE4D2D] font-bold text-xl">
          {{ formatPrice(product.lowestPrice) }}
        </span>
        <span v-if="product.listings && product.listings.length > 1" class="text-sm text-content-muted">
          จาก {{ product.listings.length }} ร้าน
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2 text-sm text-content-muted">
        <span v-if="product.rating" class="flex items-center gap-0.5">
          ⭐ {{ product.rating }}
        </span>
        <span v-if="product.soldCount">ขายแล้ว {{ formatSold(product.soldCount) }}</span>
      </div>
      <div v-if="product.listings" class="mt-2 flex gap-1 flex-wrap">
        <span
          v-for="listing in product.listings.slice(0, 3)"
          :key="listing.id"
          :class="['text-sm px-2 py-0.5 rounded', marketplaceColor(listing.marketplace)]"
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

<template>
  <section class="mb-2.5">
    <div class="flex items-center justify-between mb-3 px-0.5">
      <div class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-accent" />
        <h2 class="text-lg font-bold text-content">สินค้ามาแรง</h2>
        <span class="text-[10px] badge-shopee font-bold px-2 py-0.5 rounded-full animate-pulse">
          LIVE
        </span>
      </div>
      <NuxtLink to="/search?sort=sold" class="text-xs text-accent font-semibold hover:underline">
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.slug}`"
        class="snap-start shrink-0 w-[168px] sm:w-[185px] card overflow-hidden hover:border-shopee/50 hover:shadow-md transition-all group"
      >
        <div class="relative h-[168px] product-image-frame overflow-hidden">
          <ProductImage
            :src="product.imageUrl"
            :alt="product.name"
            :category-slug="product.category?.slug"
            container-class="absolute inset-0"
            img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <span
            v-if="product.isTrending"
            class="absolute top-2 left-2 badge-shopee text-[9px] px-1.5 py-0.5 rounded z-10"
          >
            🔥 มาแรง
          </span>
          <span
            v-if="getDiscount(product)"
            class="absolute top-2 right-2 badge-discount text-[9px] px-1.5 py-0.5 rounded z-10"
          >
            -{{ getDiscount(product) }}%
          </span>
        </div>

        <div class="p-3">
          <h3 class="text-xs font-medium text-content line-clamp-2 min-h-[32px] leading-snug group-hover:text-accent">
            {{ product.name }}
          </h3>
          <div class="mt-2 text-lg font-bold text-accent">
            {{ product.lowestPrice ? formatPrice(product.lowestPrice) : '—' }}
          </div>
          <div v-if="product.listings?.length" class="mt-1.5 flex gap-1">
            <span
              v-for="listing in product.listings.slice(0, 2)"
              :key="listing.id"
              class="text-[9px] px-1 py-px rounded font-semibold bg-surface-muted text-content-muted"
            >
              {{ marketplaceLabel(listing.marketplace) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import type { Product } from '~/types'
import { getDiscountPercent } from '~/composables/useProductHelpers'

defineProps<{
  products: Product[]
}>()

function getDiscount(product: Product) {
  return getDiscountPercent(product)
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

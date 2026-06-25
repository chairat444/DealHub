<template>
  <section class="mb-2.5">
    <div class="flex items-end justify-between mb-3 px-0.5">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-[#FFD600] text-[#c13515] text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
            Hot Pick
          </span>
          <h2 class="text-xl font-bold text-content">สินค้าแนะนำวันนี้</h2>
        </div>
        <p class="text-sm text-content-muted mt-1">คัดสรรสินค้าขายดี ราคาดีที่สุดจากทุกแพลตฟอร์ม</p>
      </div>
      <NuxtLink to="/search?sort=sold" class="text-sm text-shopee font-semibold hover:underline shrink-0">
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
      <NuxtLink
        v-for="(product, index) in products"
        :key="product.id"
        :to="`/products/${product.slug}`"
        class="group relative bg-surface rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        :class="index === 0 ? 'border-shopee md:row-span-1 ring-2 ring-shopee/20' : 'border-line hover:border-shopee/50'"
      >
        <div
          v-if="index === 0"
          class="absolute top-3 left-3 z-10 bg-shopee text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
        >
          <Crown class="w-3 h-3" />
          #1 ขายดีสุด
        </div>

        <div class="relative aspect-square overflow-hidden">
          <ProductImage
            :src="product.imageUrl"
            :alt="product.name"
            :category-slug="product.category?.slug"
            container-class="absolute inset-0"
            img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-if="getDiscount(product)"
            class="absolute bottom-2 right-2 bg-[#d4006a] text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow z-10"
          >
            ลด {{ getDiscount(product) }}%
          </div>
        </div>

        <div class="p-4">
          <h3
            class="font-semibold text-content line-clamp-2 leading-snug group-hover:text-shopee transition-colors"
            :class="index === 0 ? 'text-base' : 'text-sm md:text-base'"
          >
            {{ product.name }}
          </h3>

          <div class="mt-2 flex items-baseline gap-2">
            <span
              v-if="product.lowestPrice"
              class="font-bold text-shopee"
              :class="index === 0 ? 'text-2xl' : 'text-xl'"
            >
              {{ formatPrice(product.lowestPrice) }}
            </span>
            <span
              v-if="getOriginalPrice(product)"
              class="text-sm text-content-muted line-through"
            >
              {{ formatPrice(getOriginalPrice(product)!) }}
            </span>
          </div>

          <div class="mt-2 flex items-center justify-between gap-2">
            <div v-if="product.listings?.length" class="flex gap-1 flex-wrap">
              <span
                v-for="listing in product.listings.slice(0, 3)"
                :key="listing.id"
                class="text-xs px-2 py-0.5 rounded font-semibold"
                :class="platClass(listing.marketplace)"
              >
                {{ marketplaceLabel(listing.marketplace) }}
              </span>
            </div>
            <span v-if="product.soldCount" class="text-sm text-content-muted shrink-0">
              ขาย {{ formatSoldCount(product.soldCount) }}
            </span>
          </div>

          <div
            class="mt-3 text-center text-sm font-bold py-2.5 rounded-lg transition-colors"
            :class="index === 0 ? 'bg-shopee text-white group-hover:bg-[#d73211]' : 'bg-shopee/10 dark:bg-shopee/20 text-shopee group-hover:bg-shopee group-hover:text-white'"
          >
            เทียบราคาทุก Platform
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Crown } from 'lucide-vue-next'
import type { Product } from '~/types'
import { formatSoldCount, getDiscountPercent, getLowestListing } from '~/composables/useProductHelpers'

defineProps<{
  products: Product[]
}>()

function getDiscount(product: Product) {
  return getDiscountPercent(product)
}

function getOriginalPrice(product: Product) {
  return getLowestListing(product)?.originalPrice ?? null
}

function platClass(marketplace: string) {
  const map: Record<string, string> = {
    SHOPEE: 'bg-[#FEF0ED] dark:bg-shopee/20 text-shopee',
    LAZADA: 'bg-[#FFF3E0] dark:bg-orange-900/30 text-[#F57C00] dark:text-orange-300',
    TIKTOK_SHOP: 'bg-[#F3E5F5] dark:bg-purple-900/30 text-[#7B1FA2] dark:text-purple-300',
  }
  return map[marketplace] || 'bg-surface-muted text-content-muted'
}
</script>

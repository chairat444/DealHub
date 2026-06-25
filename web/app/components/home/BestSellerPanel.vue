<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :class="embedded
      ? 'px-4 py-4 bg-surface-muted/40 dark:bg-surface-muted/20 h-full flex flex-col'
      : 'section-card px-4 py-4 mb-2.5'"
    :aria-labelledby="embedded ? 'best-sellers-heading' : undefined"
  >
    <div class="flex items-center justify-between mb-3 shrink-0">
      <h3 id="best-sellers-heading" class="text-lg font-bold text-accent flex items-center gap-2 flex-wrap">
        <Trophy class="w-5 h-5 shrink-0" aria-hidden="true" />
        {{ HOME_HEADINGS.bestSellers }}
        <span class="text-xs font-normal text-content-muted">({{ products.length }} อันดับ)</span>
      </h3>
      <NuxtLink
        v-if="!embedded"
        to="/search?sort=sold"
        class="text-sm text-accent flex items-center gap-0.5 hover:underline shrink-0"
      >
        ดูทั้งหมด
        <ChevronRight class="w-3 h-3" />
      </NuxtLink>
    </div>

    <!-- อันดับ 1 — รูปใหญ่เติมพื้นที่ -->
    <NuxtLink
      v-if="topProduct"
      :to="`/products/${topProduct.slug}`"
      class="block mb-3 group"
      :class="embedded ? 'flex-1 min-h-[200px] flex flex-col' : 'shrink-0'"
    >
      <div
        class="relative rounded-xl overflow-hidden product-image-frame border border-shopee/20"
        :class="embedded ? 'flex-1 min-h-[200px]' : 'aspect-[4/3]'"
      >
        <ProductImage
          :src="topProduct.imageUrl"
          :alt="`${topProduct.name} — สินค้าขายดีอันดับ 1`"
          :category-slug="topProduct.category?.slug"
          container-class="absolute inset-0"
          img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span class="absolute top-2 left-2 badge-hot text-xs px-2 py-1 rounded-md shadow">
          #1 ขายดีสุด
        </span>
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8">
          <p class="text-white text-sm font-semibold line-clamp-2 leading-snug">{{ topProduct.name }}</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span v-if="topProduct.lowestPrice" class="text-white text-lg font-bold">
              {{ formatPrice(topProduct.lowestPrice) }}
            </span>
            <span v-if="topProduct.soldCount" class="text-white/80 text-xs">
              ขาย {{ formatSoldCount(topProduct.soldCount) }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- อันดับ 2+ -->
    <div class="flex flex-col gap-0.5 shrink-0">
      <NuxtLink
        v-for="(product, index) in restProducts"
        :key="product.id"
        :to="`/products/${product.slug}`"
        class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface dark:hover:bg-surface transition-colors"
      >
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
          :class="rankClass(index + 1)"
          :aria-label="`อันดับ ${index + 2}`"
        >
          {{ index + 2 }}
        </div>
        <div class="w-10 h-10 rounded-md shrink-0 overflow-hidden product-image-frame">
          <ProductImage
            :src="product.imageUrl"
            :alt="`${product.name} — สินค้าขายดีอันดับ ${index + 2}`"
            :category-slug="product.category?.slug"
            container-class="w-10 h-10"
            img-class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs text-content line-clamp-2 leading-snug">{{ product.name }}</div>
          <div class="flex items-baseline gap-1.5 flex-wrap mt-0.5">
            <span v-if="product.lowestPrice" class="text-sm font-bold text-accent">
              {{ formatPrice(product.lowestPrice) }}
            </span>
            <span v-if="product.soldCount" class="text-[11px] text-content-muted">
              ขาย {{ formatSoldCount(product.soldCount) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <NuxtLink
      v-if="embedded"
      to="/search?sort=sold"
      class="mt-2 shrink-0 block text-center text-sm text-accent font-semibold hover:underline py-1"
    >
      ดูสินค้าขายดีทั้งหมด →
    </NuxtLink>
  </component>
</template>

<script setup lang="ts">
import { ChevronRight, Trophy } from 'lucide-vue-next'
import type { Product } from '~/types'
import { formatSoldCount } from '~/composables/useProductHelpers'
import { HOME_HEADINGS } from '~/constants/seo'

const props = withDefaults(defineProps<{
  products: Product[]
  embedded?: boolean
}>(), {
  embedded: false,
})

const topProduct = computed(() => props.products[0] ?? null)
const restProducts = computed(() => props.products.slice(1))

function rankClass(rank: number) {
  if (rank === 1) return 'bg-[#FFD700] dark:bg-amber-900/50 text-[#856404] dark:text-amber-300'
  if (rank === 2) return 'bg-[#C0C0C0] dark:bg-gray-600/40 text-gray-600 dark:text-gray-300'
  if (rank === 3) return 'bg-[#CD7F32] dark:bg-orange-900/40 text-[#5a3000] dark:text-orange-300'
  return 'bg-surface-muted text-content-muted'
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="bg-surface rounded-lg border border-line overflow-hidden hover:border-shopee hover:shadow-md transition-all block"
  >
    <div
      class="product-image-frame relative overflow-hidden"
      :class="imageFill ? 'aspect-square' : 'h-[150px] sm:h-[165px]'"
    >
      <ProductImage
        :src="product.imageUrl"
        :alt="product.name"
        :category-slug="product.category?.slug"
        container-class="absolute inset-0"
        img-class="w-full h-full object-cover"
      />

      <span
        v-if="badgeLabel"
        class="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded z-10"
        :class="badgeClass"
      >
        {{ badgeLabel }}
      </span>

      <button
        type="button"
        class="absolute top-2 right-2 text-white/80 hover:text-white z-10 drop-shadow"
        @click.prevent
      >
        <Heart class="w-5 h-5" />
      </button>
    </div>

    <div class="px-3 pt-2.5 pb-3">
      <h3 class="text-sm md:text-base text-content line-clamp-2 min-h-[2.75rem] leading-snug">
        {{ product.name }}
      </h3>

      <div class="mt-2 flex items-baseline gap-2 flex-wrap">
        <span v-if="product.lowestPrice" class="text-lg font-bold text-accent">
          {{ formatPrice(product.lowestPrice) }}
        </span>
        <span v-if="originalPrice" class="text-sm text-content-muted line-through">
          {{ formatPrice(originalPrice) }}
        </span>
        <span
          v-if="discount"
          class="text-xs bg-[#FEF0ED] dark:bg-shopee/20 text-shopee px-1.5 py-0.5 rounded font-semibold"
        >
          -{{ discount }}%
        </span>
      </div>

      <div v-if="product.listings?.length" class="mt-2 flex gap-1 flex-wrap">
        <span
          v-for="listing in product.listings.slice(0, 3)"
          :key="listing.id"
          class="text-xs px-2 py-0.5 rounded font-semibold"
          :class="platClass(listing.marketplace)"
        >
          {{ marketplaceLabel(listing.marketplace) }}
        </span>
      </div>

      <p v-if="product.soldCount" class="text-sm text-content-muted mt-1.5">
        ขายแล้ว {{ formatSoldCount(product.soldCount) }} ชิ้น
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import type { Product } from '~/types'
import { formatSoldCount, getDiscountPercent, getLowestListing } from '~/composables/useProductHelpers'

const props = withDefaults(defineProps<{
  product: Product
  imageFill?: boolean
  flash?: boolean
}>(), {
  imageFill: false,
  flash: false,
})

const listing = computed(() => getLowestListing(props.product))
const originalPrice = computed(() => listing.value?.originalPrice ?? null)
const discount = computed(() => getDiscountPercent(props.product))

const badgeLabel = computed(() => {
  if (props.flash && discount.value) return `-${discount.value}%`
  if (discount.value && discount.value >= 40) return `-${discount.value}%`
  if (props.product.isTrending) return 'มาแรง'
  return null
})

const badgeClass = computed(() => {
  if (discount.value && discount.value >= 40) return 'badge-discount'
  if (props.product.isTrending) return 'bg-shopee dark:bg-shopee/35 dark:text-[rgb(var(--accent-display))]'
  return 'bg-[#26aa99] dark:bg-teal-900/40 dark:text-teal-300'
})

function platClass(marketplace: string) {
  const map: Record<string, string> = {
    SHOPEE: 'bg-[#FEF0ED] dark:bg-shopee/20 text-shopee',
    LAZADA: 'bg-[#FFF3E0] dark:bg-orange-900/30 text-[#F57C00] dark:text-orange-300',
    TIKTOK_SHOP: 'bg-[#F3E5F5] dark:bg-purple-900/30 text-[#7B1FA2] dark:text-purple-300',
  }
  return map[marketplace] || 'bg-surface-muted text-content-muted'
}
</script>

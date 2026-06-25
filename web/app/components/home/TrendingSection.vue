<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :class="embedded
      ? 'px-4 py-4 lg:border-r border-line'
      : 'section-card px-4 py-4 mb-2.5'"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-accent" aria-hidden="true" />
        <h3 id="trending-heading" class="text-lg font-bold text-content">{{ HOME_HEADINGS.trending }}</h3>
        <span class="text-xs badge-shopee font-bold px-2 py-0.5 rounded-full animate-pulse">
          อัปเดตสด
        </span>
      </div>
      <NuxtLink
        v-if="!embedded"
        to="/search?sort=sold"
        class="text-sm text-accent font-semibold hover:underline"
      >
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3">
      <HomeFlashProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        image-fill
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import type { Product } from '~/types'
import { HOME_HEADINGS } from '~/constants/seo'

withDefaults(defineProps<{
  products: Product[]
  embedded?: boolean
}>(), {
  embedded: false,
})
</script>

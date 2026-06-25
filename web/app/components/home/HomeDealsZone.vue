<template>
  <section
    class="section-card overflow-hidden mb-2.5"
    aria-labelledby="deals-zone-heading"
  >
    <div class="deals-zone-header px-4 py-4 border-b border-line">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 id="deals-zone-heading" class="text-xl font-bold text-content flex items-center gap-2">
            <ShoppingBag class="w-6 h-6 text-accent" aria-hidden="true" />
            {{ HOME_HEADINGS.dealsZone }}
          </h2>
          <p class="text-sm text-content-muted mt-1">
            {{ HOME_HEADINGS.dealsZoneSub }}
          </p>
        </div>
        <NuxtLink
          to="/search?sort=sold"
          class="text-sm text-accent font-semibold hover:underline shrink-0"
        >
          ดูสินค้าทั้งหมด →
        </NuxtLink>
      </div>
    </div>

    <HomeFlashSaleSection
      v-if="flashProducts.length"
      embedded
      :products="flashProducts"
    />

    <div
      v-if="trendingProducts.length || bestSellers.length"
      class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] border-t border-line items-stretch"
    >
      <HomeTrendingSection
        v-if="trendingProducts.length"
        embedded
        :products="trendingProducts"
      />
      <div v-if="bestSellers.length" class="flex flex-col min-h-full">
        <HomeBestSellerPanel
          embedded
          :products="bestSellers"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import type { Product } from '~/types'
import { HOME_HEADINGS } from '~/constants/seo'

defineProps<{
  flashProducts: Product[]
  trendingProducts: Product[]
  bestSellers: Product[]
}>()
</script>

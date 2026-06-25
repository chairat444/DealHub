<template>
  <section class="section-card px-4 py-4 mb-2.5 dark:bg-surface">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h2 class="text-xl font-bold text-shopee flex items-center gap-2 flex-wrap">
        <Zap class="w-5 h-5" />
        Flash Sale
        <span class="text-sm font-normal text-content-muted">สิ้นสุดใน</span>
        <span class="flex items-center gap-1">
          <span class="bg-shopee text-white rounded-md px-2.5 py-1.5 text-base font-bold tabular-nums">{{ hours }}</span>
          <span class="text-shopee font-bold text-lg">:</span>
          <span class="bg-shopee text-white rounded-md px-2.5 py-1.5 text-base font-bold tabular-nums">{{ minutes }}</span>
          <span class="text-shopee font-bold text-lg">:</span>
          <span class="bg-shopee text-white rounded-md px-2.5 py-1.5 text-base font-bold tabular-nums animate-pulse">{{ seconds }}</span>
        </span>
      </h2>
      <NuxtLink to="/search?sort=sold" class="text-sm text-shopee font-semibold hover:underline shrink-0">
        ดูทั้งหมด →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <HomeFlashProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        image-fill
        flash
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import type { Product } from '~/types'
import { useCountdown } from '~/composables/useProductHelpers'

defineProps<{
  products: Product[]
}>()

const { hours, minutes, seconds } = useCountdown(2 * 3600 + 47 * 60 + 33)
</script>

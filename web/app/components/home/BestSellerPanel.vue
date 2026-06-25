<template>
  <section class="section-card px-4 py-4 mb-2.5 h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-accent flex items-center gap-2">
        <Trophy class="w-6 h-6" />
        ขายดีประจำเดือน
      </h2>
      <NuxtLink to="/search?sort=sold" class="text-sm text-accent flex items-center gap-0.5 hover:underline">
        ดูทั้งหมด
        <ChevronRight class="w-3 h-3" />
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-1.5">
      <NuxtLink
        v-for="(product, index) in products"
        :key="product.id"
        :to="`/products/${product.slug}`"
        class="flex items-center gap-3 p-2.5 rounded-md hover:bg-surface-muted transition-colors"
      >
        <div
          class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          :class="rankClass(index)"
        >
          {{ index + 1 }}
        </div>
        <div class="w-12 h-12 rounded-md shrink-0 overflow-hidden">
          <ProductImage
            :src="product.imageUrl"
            :alt="product.name"
            :category-slug="product.category?.slug"
            container-class="w-12 h-12"
            img-class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm md:text-base text-content truncate">{{ product.name }}</div>
          <div v-if="product.lowestPrice" class="text-base font-bold text-accent">
            {{ formatPrice(product.lowestPrice) }}
          </div>
          <div v-if="product.soldCount" class="text-sm text-content-muted">
            ขาย {{ formatSoldCount(product.soldCount) }} ชิ้น
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, Trophy } from 'lucide-vue-next'
import type { Product } from '~/types'
import { formatSoldCount } from '~/composables/useProductHelpers'

defineProps<{
  products: Product[]
}>()

function rankClass(index: number) {
  if (index === 0) return 'bg-[#FFD700] dark:bg-amber-900/50 text-[#856404] dark:text-amber-300'
  if (index === 1) return 'bg-[#C0C0C0] dark:bg-gray-600/40 text-gray-600 dark:text-gray-300'
  if (index === 2) return 'bg-[#CD7F32] dark:bg-orange-900/40 text-[#5a3000] dark:text-orange-300'
  return 'bg-surface-muted text-content-muted'
}
</script>

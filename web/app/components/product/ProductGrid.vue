<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span v-if="icon">{{ icon }}</span>
        {{ title }}
      </h2>
      <NuxtLink v-if="viewAllLink" :to="viewAllLink" class="text-[#EE4D2D] text-sm hover:underline">
        ดูทั้งหมด →
      </NuxtLink>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{
  title: string
  products: Product[]
  icon?: string
  viewAllLink?: string
}>()
</script>

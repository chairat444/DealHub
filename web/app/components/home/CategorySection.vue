<template>
  <section class="section-card px-4 py-3.5 mb-2.5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-shopee flex items-center gap-2">
        <LayoutGrid class="w-5 h-5" />
        หมวดหมู่สินค้า
      </h2>
      <NuxtLink to="/search" class="text-sm text-shopee flex items-center gap-0.5 hover:underline">
        ดูทั้งหมด
        <ChevronRight class="w-3 h-3" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
      <NuxtLink
        v-for="cat in displayCategories"
        :key="cat.slug"
        :to="cat.slug === 'more' ? '/search' : `/categories/${cat.slug}`"
        :title="cat.description || cat.name"
        class="flex flex-col items-center gap-1.5 py-3 px-1 rounded-md hover:bg-shopee/10 dark:hover:bg-shopee/20 transition-colors"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          :style="{ background: cat.bg }"
        >
          {{ cat.icon }}
        </div>
        <span class="text-sm text-content-muted text-center leading-tight">{{ cat.name }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, LayoutGrid } from 'lucide-vue-next'
import type { Category } from '~/types'

const props = defineProps<{
  categories: Category[]
}>()

const categoryStyles: Record<string, { bg: string }> = {
  electronics: { bg: '#FEF0ED' },
  fashion: { bg: '#FFF3E0' },
  beauty: { bg: '#FCE4EC' },
  'home-living': { bg: '#E8F5E9' },
  sports: { bg: '#E3F2FD' },
}

const displayCategories = computed(() => {
  const fromApi = props.categories.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    icon: cat.icon || '📦',
    bg: categoryStyles[cat.slug]?.bg || '#F5F5F5',
  }))

  const extras = [
    { slug: 'toys', name: 'ของเล่น', icon: '🧸', bg: '#F3E5F5' },
    { slug: 'food', name: 'อาหาร', icon: '🍜', bg: '#E0F2F1' },
    { slug: 'books', name: 'หนังสือ', icon: '📚', bg: '#FFF9C4' },
    { slug: 'pets', name: 'สัตว์เลี้ยง', icon: '🐾', bg: '#FFEBEE' },
    { slug: 'more', name: 'อื่นๆ', icon: '⋯', bg: '#F5F5F5' },
  ]

  return [...fromApi, ...extras].slice(0, 10)
})
</script>

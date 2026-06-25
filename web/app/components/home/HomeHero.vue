<template>
  <section class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 mb-2.5">
    <!-- Hero main -->
    <div class="hero-banner rounded-xl p-8 lg:p-10 min-h-[260px] lg:min-h-[300px] flex flex-col justify-end relative overflow-hidden">
      <div class="hero-banner-accent absolute right-0 top-0 bottom-0 w-[55%] [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)]" />

      <span class="relative z-10 inline-flex items-center gap-1.5 badge-hot text-sm px-3 py-1 rounded-md w-fit mb-3">
        <Zap class="w-3.5 h-3.5" />
        Flash Deal วันนี้เท่านั้น
      </span>
      <h1 class="relative z-10 text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-lg">
        {{ HOME_HEADINGS.heroH1 }}
      </h1>
      <p class="relative z-10 text-white/90 text-base sm:text-lg mt-2 max-w-md">
        {{ HOME_HEADINGS.heroSub }}
      </p>
      <NuxtLink
        to="/search"
        class="relative z-10 mt-5 inline-flex items-center gap-2 badge-hot text-base px-6 py-3 rounded-lg w-fit hover:opacity-90 transition-opacity shadow-md"
      >
        ดูสินค้าทั้งหมด
        <ArrowRight class="w-4 h-4" />
      </NuxtLink>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        <span
          v-for="i in 3"
          :key="i"
          class="h-2 rounded-full transition-all"
          :class="i === activeSlide ? 'bg-[#FFD600] dark:bg-[rgb(var(--accent-display))] w-5' : 'bg-white/40 dark:bg-white/25 w-2'"
        />
      </div>
    </div>

    <!-- Side cards -->
    <div class="flex flex-row lg:flex-col gap-3">
      <NuxtLink
        v-if="topProduct"
        :to="`/products/${topProduct.slug}`"
        class="rounded-xl p-4 flex-1 flex flex-col justify-between bg-[#FFF3CD] dark-card border border-transparent hover:shadow-md transition-shadow min-h-[140px] lg:min-h-0 lg:flex-1"
      >
        <div>
          <div class="text-xs font-bold text-[#856404] dark:text-shopee/80 uppercase tracking-wide flex items-center gap-1">
            <Star class="w-3.5 h-3.5" />
            ขายดีเดือนนี้
          </div>
          <div class="text-base font-bold text-content mt-1.5 leading-snug line-clamp-2">
            {{ topProduct.name }}
          </div>
          <div v-if="topProduct.lowestPrice" class="text-2xl font-bold text-accent mt-1">
            {{ formatPrice(topProduct.lowestPrice) }}
          </div>
        </div>
        <span class="text-sm text-accent font-semibold flex items-center gap-0.5 mt-2">
          ดูราคาทุก platform
          <ChevronRight class="w-3.5 h-3.5" />
        </span>
      </NuxtLink>

      <div class="rounded-xl p-4 flex-1 flex flex-col justify-between bg-[#D1ECF1] dark-card border border-transparent hover:shadow-md transition-shadow min-h-[140px] lg:min-h-0 lg:flex-1">
        <div>
          <div class="text-xs font-bold text-[#0c5460] dark:text-content-muted uppercase tracking-wide flex items-center gap-1">
            <Users class="w-3.5 h-3.5" />
            แนะนำจากบอร์ด
          </div>
          <div class="text-base font-bold text-content mt-1.5 leading-snug line-clamp-2">
            {{ boardHighlight.title }}
          </div>
          <div class="text-2xl font-bold text-[#0c5460] dark:text-content mt-1">฿299</div>
        </div>
        <NuxtLink to="/board" class="text-sm text-accent font-semibold flex items-center gap-0.5 mt-2 hover:underline">
          อ่านรีวิว
          <ChevronRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronRight, Star, Users, Zap } from 'lucide-vue-next'
import type { Product } from '~/types'
import { boardPreviewPosts } from '~/data/board-preview'
import { HOME_HEADINGS } from '~/constants/seo'

defineProps<{
  topProduct?: Product | null
}>()

const activeSlide = ref(1)
const boardHighlight = boardPreviewPosts[1]

let slideTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  slideTimer = setInterval(() => {
    activeSlide.value = activeSlide.value >= 3 ? 1 : activeSlide.value + 1
  }, 5000)
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

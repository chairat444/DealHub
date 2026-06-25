<template>
  <section class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 mb-2.5">
    <!-- Hero carousel -->
    <div class="hero-banner rounded-xl min-h-[260px] lg:min-h-[300px] relative overflow-hidden">
      <!-- Slide 1: โปรโมชัน -->
      <div
        class="absolute inset-0 flex flex-col justify-end p-8 lg:p-10 transition-opacity duration-500"
        :class="activeSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
      >
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
      </div>

      <!-- Image slides from API -->
      <NuxtLink
        v-for="(banner, index) in imageSlides"
        :key="banner.id"
        :to="banner.linkUrl"
        class="absolute inset-0 block transition-opacity duration-500"
        :class="activeSlide === index + 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        :aria-label="banner.altText || banner.title || 'แบนเนอร์โปรโมชัน'"
      >
        <img
          :src="resolveBannerImageUrl(banner.imageUrl)"
          :alt="banner.altText || banner.title || 'DealHub TH'"
          class="w-full h-full object-cover object-center"
          loading="lazy"
        >
      </NuxtLink>

      <!-- Dots -->
      <div
        v-if="slideCount > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20"
      >
        <button
          v-for="i in slideCount"
          :key="i"
          type="button"
          class="h-2 rounded-full transition-all"
          :class="activeSlide === i - 1
            ? 'bg-[#FFD600] dark:bg-[rgb(var(--accent-display))] w-5'
            : 'bg-white/40 dark:bg-white/25 w-2 hover:bg-white/60'"
          :aria-label="`แบนเนอร์ ${i}`"
          @click="activeSlide = i - 1"
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

      <NuxtLink
        v-if="boardHighlight"
        :to="`/board/posts/${boardHighlight.id}`"
        class="rounded-xl p-4 flex-1 flex flex-col justify-between bg-[#D1ECF1] dark-card border border-transparent hover:shadow-md transition-shadow min-h-[140px] lg:min-h-0 lg:flex-1"
      >
        <div>
          <div class="text-xs font-bold text-[#0c5460] dark:text-content-muted uppercase tracking-wide flex items-center gap-1">
            <Users class="w-3.5 h-3.5" />
            แนะนำจากบอร์ด
          </div>
          <div class="text-base font-bold text-content mt-1.5 leading-snug line-clamp-2">
            {{ boardHighlight.title }}
          </div>
          <div class="text-sm text-content-muted mt-1 flex items-center gap-2">
            <span>↑ {{ boardHighlight.upvotes }}</span>
            <span>💬 {{ boardHighlight.comments }}</span>
          </div>
        </div>
        <span class="text-sm text-accent font-semibold flex items-center gap-0.5 mt-2">
          อ่านรีวิว
          <ChevronRight class="w-3.5 h-3.5" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronRight, Star, Users, Zap } from 'lucide-vue-next'
import type { Product } from '~/types'
import { HOME_HEADINGS } from '~/constants/seo'
import type { BoardPost } from '~/types/board'
import type { Banner } from '~/types/banner'

defineProps<{
  topProduct?: Product | null
}>()

const { fetchPosts } = useBoard()
const { fetchHeroBanners, resolveBannerImageUrl } = useBanners()

const { data: boardHot } = await useAsyncData('hero-board-hot', () =>
  fetchPosts({ sort: 'hot', limit: 2 }).then((r) => r.items[1] ?? r.items[0] ?? null).catch(() => null),
)

const { data: heroBanners } = await useAsyncData('hero-banners', fetchHeroBanners)

const fallbackBanner: Banner = {
  id: 'fallback',
  imageUrl: '/hero-banner.png',
  linkUrl: '/search',
  altText: 'DealHub TH — เทียบราคา Shopee Lazada TikTok Shop',
  sortOrder: 0,
}

const imageSlides = computed(() => {
  const banners = heroBanners.value ?? []
  return banners.length > 0 ? banners : [fallbackBanner]
})

const slideCount = computed(() => 1 + imageSlides.value.length)

const boardHighlight = computed(() => boardHot.value as BoardPost | null)

const activeSlide = ref(0)

let slideTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (slideCount.value <= 1) return
  slideTimer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slideCount.value
  }, 6000)
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

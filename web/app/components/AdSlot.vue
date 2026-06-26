<template>
  <div v-if="banners.length || pending" :class="wrapperClass">
    <div
      v-if="pending && !banners.length"
      class="ad-slot relative w-full animate-pulse overflow-hidden rounded-xl border border-line/80 bg-surface-muted"
      :class="meta.aspect"
      :style="{ aspectRatio: meta.aspectRatio }"
    />

    <div
      v-else-if="banners.length"
      class="ad-slot group relative w-full overflow-hidden rounded-xl border border-line/80 bg-surface-muted shadow-sm transition-shadow duration-300 hover:shadow-md"
      :class="meta.aspect"
      :style="{ aspectRatio: meta.aspectRatio }"
    >
      <a
        v-for="(banner, index) in banners"
        v-show="activeIndex === index"
        :key="banner.id"
        :href="resolveLink(banner.linkUrl)"
        class="absolute inset-0 block"
        :aria-label="banner.altText || banner.title || 'โฆษณา'"
        rel="sponsored noopener"
        @click.prevent="onClick(banner)"
      >
        <img
          :src="resolveBannerImageUrl(banner.imageUrl)"
          :alt="banner.altText || banner.title || 'โฆษณา'"
          class="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        >
      </a>

      <span
        v-if="meta.showAdBadge"
        class="absolute top-2.5 left-2.5 z-20 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
      >
        โฆษณา
      </span>

      <span
        v-if="banners[activeIndex]?.sponsorName"
        class="absolute bottom-2.5 right-2.5 z-20 rounded-md bg-black/40 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm"
      >
        {{ banners[activeIndex]?.sponsorName }}
      </span>

      <div
        v-if="banners.length > 1"
        class="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"
      >
        <button
          v-for="(_, i) in banners"
          :key="i"
          type="button"
          class="h-1.5 rounded-full transition-all"
          :class="activeIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'"
          :aria-label="`โฆษณา ${i + 1}`"
          @click="activeIndex = i"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdPlacement } from '~/constants/ad-placements'
import { getPlacementMeta } from '~/constants/ad-placements'
import type { Banner } from '~/types/banner'

const props = withDefaults(defineProps<{
  placement: AdPlacement
  wrapperClass?: string
}>(), {
  wrapperClass: 'my-4',
})

const { resolveBannerImageUrl, trackImpression, trackClick } = useBanners()
const { banners, pending } = usePlacementBanners(props.placement)
const config = useRuntimeConfig()

const meta = computed(() => getPlacementMeta(props.placement))
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')

const activeIndex = ref(0)

let rotateTimer: ReturnType<typeof setInterval> | undefined

function resolveLink(linkUrl: string) {
  if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) return linkUrl
  return `${siteUrl}${linkUrl.startsWith('/') ? linkUrl : `/${linkUrl}`}`
}

function onClick(banner: Banner) {
  trackClick(banner.id)
  const url = resolveLink(banner.linkUrl)
  window.open(url, '_blank', 'noopener,noreferrer')
}

watch(banners, (items) => {
  for (const banner of items) {
    trackImpression(banner.id)
  }
}, { immediate: true })

function startRotateTimer() {
  if (rotateTimer) clearInterval(rotateTimer)
  if (banners.value.length <= 1) return
  rotateTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % banners.value.length
  }, 8000)
}

watch(() => banners.value.length, () => {
  activeIndex.value = 0
  startRotateTimer()
})

onMounted(() => {
  startRotateTimer()
})

onUnmounted(() => {
  if (rotateTimer) clearInterval(rotateTimer)
})
</script>

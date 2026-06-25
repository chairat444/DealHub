<template>
  <div class="relative overflow-hidden product-image-frame" :class="containerClass">
    <img
      v-show="!useFallback"
      :src="currentSrc"
      :alt="alt"
      :class="[imgClass, 'product-photo']"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="handleError"
    />
    <div
      v-if="useFallback"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-shopee-light to-shopee/10 dark:from-surface-muted dark:to-surface"
      :class="imgClass"
    >
      <span class="text-4xl sm:text-5xl select-none" aria-hidden="true">{{ fallbackEmoji }}</span>
      <span class="text-[10px] text-shopee/60 font-medium mt-2 px-2 text-center line-clamp-2">{{ alt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProductEmoji } from '~/composables/useProductHelpers'

const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  categorySlug?: string
  imgClass?: string
  containerClass?: string
}>(), {
  src: null,
  imgClass: 'w-full h-full object-cover',
  containerClass: '',
})

const PLACEHOLDER = '/placeholder-product.svg'

const errored = ref(false)
const currentSrc = ref(props.src || PLACEHOLDER)

const useFallback = computed(() => errored.value || !props.src)
const fallbackEmoji = computed(() => getProductEmoji(props.alt, props.categorySlug))

watch(() => props.src, (url) => {
  errored.value = false
  currentSrc.value = url || PLACEHOLDER
})

function handleError() {
  if (currentSrc.value !== PLACEHOLDER) {
    currentSrc.value = PLACEHOLDER
    return
  }
  errored.value = true
}
</script>

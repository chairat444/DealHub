<template>
  <div class="share-buttons" :class="compact ? '' : 'card p-4'">
    <p v-if="!compact" class="text-sm font-semibold text-content mb-3 flex items-center gap-2">
      <Share2 class="w-4 h-4 text-accent" aria-hidden="true" />
      {{ label }}
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <button
        v-if="canNativeShare"
        type="button"
        class="share-btn share-btn-primary"
        @click="handleNativeShare"
      >
        <Share2 class="w-4 h-4" />
        <span>แชร์</span>
      </button>

      <button
        type="button"
        class="share-btn"
        :class="copied ? 'share-btn-success' : ''"
        @click="handleCopy"
      >
        <Check v-if="copied" class="w-4 h-4" />
        <Link2 v-else class="w-4 h-4" />
        <span>{{ copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์' }}</span>
      </button>

      <button
        type="button"
        class="share-btn"
        aria-label="แชร์ไป Facebook"
        @click="openShareWindow(facebookShareUrl(path))"
      >
        <Facebook class="w-4 h-4" />
        <span v-if="!compact">Facebook</span>
      </button>

      <button
        type="button"
        class="share-btn share-btn-line"
        aria-label="แชร์ไป LINE"
        @click="openShareWindow(lineShareUrl(path))"
      >
        <MessageCircle class="w-4 h-4" />
        <span v-if="!compact">LINE</span>
      </button>

      <button
        type="button"
        class="share-btn"
        aria-label="แชร์ไป X"
        @click="openShareWindow(xShareUrl({ title, text, path }))"
      >
        <Twitter class="w-4 h-4" />
        <span v-if="!compact">X</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Facebook, Link2, MessageCircle, Share2, Twitter } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title: string
  text?: string
  path?: string
  label?: string
  compact?: boolean
}>(), {
  label: 'แชร์ให้เพื่อน',
  compact: false,
})

const {
  canNativeShare,
  shareNative,
  copyLink,
  facebookShareUrl,
  lineShareUrl,
  xShareUrl,
  openShareWindow,
} = useShare()

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function handleNativeShare() {
  try {
    await shareNative({
      title: props.title,
      text: props.text,
      path: props.path,
    })
  }
  catch {
    // ผู้ใช้ยกเลิก share sheet
  }
}

async function handleCopy() {
  try {
    await copyLink(props.path)
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2000)
  }
  catch {
    // clipboard ไม่รองรับ
  }
}

onUnmounted(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>

<style scoped>
.share-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
    border border-line bg-surface text-content
    hover:border-shopee/40 hover:bg-surface-muted transition-colors;
}
.share-btn-primary {
  @apply bg-shopee text-white border-shopee hover:bg-[#D73211] hover:border-[#D73211];
  @apply dark:bg-[#c94a32] dark:border-[#c94a32] dark:hover:bg-[#b5422d];
}
.share-btn-line {
  @apply text-[#06C755] border-[#06C755]/30 hover:bg-[#06C755]/10;
}
.share-btn-success {
  @apply text-green-700 border-green-300 bg-green-50;
  @apply dark:text-green-300 dark:border-green-800 dark:bg-green-950/40;
}
</style>

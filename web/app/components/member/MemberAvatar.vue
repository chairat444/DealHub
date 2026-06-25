<template>
  <component
    :is="linkTo ? 'NuxtLink' : 'div'"
    :to="linkTo"
    class="rounded-full flex items-center justify-center shrink-0 overflow-hidden font-bold text-white"
    :class="[sizeClass, linkTo ? 'hover:ring-2 hover:ring-white/50 transition-shadow' : '']"
    :style="!imageUrl && !preset ? { background: fallbackColor } : undefined"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="displayName"
      class="w-full h-full object-cover"
    >
    <span v-else-if="preset" class="leading-none" :class="emojiSizeClass">{{ preset.emoji }}</span>
    <span v-else :class="textSizeClass">{{ initials }}</span>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  avatar?: string | null
  name: string
  userId?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  linkTo?: string
}>(), {
  size: 'md',
})

const { resolveAvatarUrl, getInitials, getFallbackColor, getPreset } = useAvatar()

const preset = computed(() => getPreset(props.avatar))
const imageUrl = computed(() => resolveAvatarUrl(props.avatar))
const displayName = computed(() => props.name)
const initials = computed(() => getInitials(props.name))
const fallbackColor = computed(() => {
  if (preset.value) return preset.value.bg
  return getFallbackColor(props.userId || props.name)
})

const sizeClass = computed(() => ({
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
}[props.size]))

const textSizeClass = computed(() => ({
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
}[props.size]))

const emojiSizeClass = computed(() => ({
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-3xl',
}[props.size]))
</script>

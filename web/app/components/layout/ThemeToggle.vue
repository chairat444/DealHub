<template>
  <button
    type="button"
    class="flex flex-col items-center gap-1 text-sm opacity-90 hover:opacity-100 transition-opacity"
    :aria-label="isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'"
    @click="toggleTheme"
  >
    <Sun v-if="isDark" class="w-5 h-5" />
    <Moon v-else class="w-5 h-5" />
    <span class="hidden sm:inline">{{ isDark ? 'สว่าง' : 'มืด' }}</span>
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const { isDark, toggleTheme } = useTheme()
</script>

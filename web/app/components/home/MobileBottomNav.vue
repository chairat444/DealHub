<template>
  <nav class="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-line flex justify-around py-2.5 z-40">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 text-sm flex-1 transition-colors"
      :class="isActive(item.to) ? 'text-shopee' : 'text-content-muted'"
    >
      <component :is="item.icon" class="w-6 h-6" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { Home, LayoutGrid, MessageCircle, User, Zap } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { to: '/', label: 'หน้าแรก', icon: Home },
  { to: '/search', label: 'หมวดหมู่', icon: LayoutGrid },
  { to: '/search?sort=sold', label: 'Flash Sale', icon: Zap },
  { to: '/board', label: 'บอร์ด', icon: MessageCircle },
  { to: '/auth/login', label: 'บัญชี', icon: User },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path.split('?')[0])
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-shopee">
    <div class="page-container">
      <div class="flex items-center gap-3 h-14 md:h-[60px]">
        <NuxtLink to="/" class="text-white text-xl font-bold tracking-tight shrink-0 mr-1">
          Deal<span class="text-[#FFD600]">Hub</span>
        </NuxtLink>

        <form @submit.prevent="handleSearch" class="flex-1 flex items-center bg-white dark:bg-surface rounded-lg overflow-hidden h-10 md:h-11 max-w-3xl border border-transparent dark:border-line">
          <Search class="w-5 h-5 text-gray-400 ml-3 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาสินค้าจาก Shopee · Lazada · TikTok"
            class="flex-1 border-none outline-none px-2 text-base text-gray-800 dark:text-content bg-transparent min-w-0"
          />
          <button type="submit" class="bg-[#FFD600] hover:bg-[#f5cc00] h-full px-4 flex items-center text-shopee transition-colors">
            <ArrowRight class="w-5 h-5" />
          </button>
        </form>

        <div class="flex items-center gap-3 sm:gap-4 text-white text-sm shrink-0">
          <LayoutThemeToggle />

          <NuxtLink to="/notifications" class="nav-act hidden sm:flex">
            <Bell class="w-5 h-5" />
            <span>แจ้งเตือน</span>
          </NuxtLink>

          <NuxtLink to="/wishlist" class="nav-act relative hidden sm:flex">
            <Heart class="w-5 h-5" />
            <span>วิชลิสต์</span>
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-1 -right-1.5 bg-[#FFD600] text-shopee rounded-full text-xs font-bold px-1.5 min-w-5 text-center"
            >
              {{ wishlistCount }}
            </span>
          </NuxtLink>

          <template v-if="authStore.isLoggedIn">
            <NuxtLink v-if="authStore.isAdmin" to="/admin" class="nav-act hidden sm:flex">
              <Shield class="w-5 h-5" />
              <span>แอดมิน</span>
            </NuxtLink>
            <button type="button" class="nav-act hidden sm:flex" @click="authStore.logout(); navigateTo('/')">
              <User class="w-5 h-5" />
              <span class="max-w-[80px] truncate">{{ authStore.user?.name }}</span>
            </button>
          </template>
          <NuxtLink v-else to="/auth/login" class="nav-act hidden sm:flex">
            <User class="w-5 h-5" />
            <span>เข้าสู่ระบบ</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <nav class="bg-[#c13515]">
      <div class="page-container flex items-center h-10 md:h-11 overflow-x-auto gap-0 text-sm">
        <NuxtLink to="/search?sort=sold" class="subnav-item hot whitespace-nowrap">
          <Flame class="w-3.5 h-3.5 mr-1 inline" />
          Flash Sale
        </NuxtLink>
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="subnav-item whitespace-nowrap"
        >
          {{ cat.name }}
        </NuxtLink>
        <NuxtLink to="/search" class="subnav-item ml-auto text-[#FFD600] font-semibold whitespace-nowrap">
          <LayoutGrid class="w-3.5 h-3.5 mr-1 inline" />
          ทุกหมวด
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ArrowRight, Bell, Flame, Heart, LayoutGrid, Search, Shield, User } from 'lucide-vue-next'
import type { Category } from '~/types'

const authStore = useAuthStore()
const router = useRouter()
const { apiFetch } = useApi()

const searchQuery = ref('')
const wishlistCount = ref(0)

const { data: categories } = await useAsyncData('header-categories', () =>
  apiFetch<Category[]>('/categories').catch(() => []),
)

if (import.meta.client && authStore.isLoggedIn) {
  apiFetch<unknown[]>('/wishlist')
    .then((items) => { wishlistCount.value = items.length })
    .catch(() => {})
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}
</script>

<style scoped>
.nav-act {
  @apply flex flex-col items-center gap-1 text-sm opacity-90 hover:opacity-100 transition-opacity;
}
.subnav-item {
  @apply text-white px-3 h-full flex items-center opacity-85 hover:opacity-100 hover:bg-white/10 transition-colors;
}
.subnav-item.hot {
  @apply text-[#FFD600] font-semibold opacity-100;
}
</style>

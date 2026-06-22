<template>
  <header class="bg-[#EE4D2D] sticky top-0 z-50 shadow-md">
    <div class="container mx-auto px-4">
      <!-- Top bar -->
      <div class="flex items-center justify-between py-3 gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span class="text-[#EE4D2D] font-bold text-lg">D</span>
          </div>
          <span class="text-white font-bold text-xl hidden sm:block">DealHub</span>
        </NuxtLink>

        <!-- Search -->
        <form @submit.prevent="handleSearch" class="flex-1 max-w-2xl">
          <div class="flex">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาสินค้า แบรนด์ หรือหมวดหมู่..."
              class="flex-1 px-4 py-2.5 rounded-l-sm text-sm focus:outline-none"
            />
            <button type="submit" class="bg-[#D73211] hover:bg-[#c02a0d] px-6 rounded-r-sm transition-colors">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <!-- Actions -->
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink to="/compare" class="text-white hover:text-orange-100 relative p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span v-if="compareCount > 0" class="absolute -top-1 -right-1 bg-yellow-400 text-xs text-gray-900 rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ compareCount }}
            </span>
          </NuxtLink>

          <NuxtLink to="/wishlist" class="text-white hover:text-orange-100 p-2 hidden sm:block">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </NuxtLink>

          <template v-if="authStore.isLoggedIn">
            <NuxtLink v-if="authStore.isAdmin" to="/admin" class="text-white text-sm hover:text-orange-100 hidden md:block">
              แอดมิน
            </NuxtLink>
            <button @click="authStore.logout(); navigateTo('/')" class="text-white text-sm hover:text-orange-100">
              {{ authStore.user?.name }}
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-white text-sm hover:text-orange-100">
              เข้าสู่ระบบ
            </NuxtLink>
            <NuxtLink to="/auth/register" class="bg-white text-[#EE4D2D] text-sm font-medium px-3 py-1.5 rounded-sm hover:bg-orange-50">
              สมัครสมาชิก
            </NuxtLink>
          </template>
        </div>
      </div>

      <!-- Category nav -->
      <nav class="flex items-center gap-1 pb-2 overflow-x-auto text-sm">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors"
        >
          {{ cat.icon }} {{ cat.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const authStore = useAuthStore()
const compareStore = useCompareStore()
const router = useRouter()
const { apiFetch } = useApi()

const searchQuery = ref('')
const compareCount = computed(() => compareStore.count)

const { data: categories } = await useAsyncData('header-categories', () =>
  apiFetch<Category[]>('/categories').catch(() => []),
)

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}
</script>

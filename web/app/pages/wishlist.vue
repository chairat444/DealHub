<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-content mb-6">❤️ รายการที่ถูกใจ</h1>

    <div v-if="!authStore.isLoggedIn" class="text-center py-20">
      <p class="text-content-muted mb-4">กรุณาเข้าสู่ระบบเพื่อดูรายการที่ถูกใจ</p>
      <NuxtLink to="/auth/login" class="btn-primary inline-block">เข้าสู่ระบบ</NuxtLink>
    </div>

    <div v-else-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>
    <div v-else-if="!items?.length" class="text-center py-20">
      <div class="text-6xl mb-4">❤️</div>
      <p class="text-content-muted">ยังไม่มีสินค้าในรายการที่ถูกใจ</p>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <ProductCard
        v-for="item in items"
        :key="item.id"
        :product="item.product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { apiFetch } = useApi()

interface WishlistItem {
  id: string
  product: import('~/types').Product
}

const { data: items, pending } = await useAsyncData(
  'wishlist',
  () => authStore.isLoggedIn
    ? apiFetch<WishlistItem[]>('/wishlist').catch(() => [])
    : [],
  { watch: [() => authStore.isLoggedIn] },
)

useSiteSeo({ title: 'รายการที่ถูกใจ', noindex: true })
</script>

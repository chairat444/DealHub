<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-content mb-6">⚙️ แดชบอร์ดผู้ดูแลระบบ</h1>

    <div v-if="!authStore.isAdmin" class="text-center py-20 text-red-500">
      ไม่มีสิทธิ์เข้าถึง
    </div>

    <template v-else-if="dashboard">
      <div class="flex flex-wrap gap-3 mb-6">
        <NuxtLink to="/admin/categories" class="btn-outline text-sm px-4 py-2">
          จัดการหมวดหมู่ / คำโปรย SEO
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-[#EE4D2D]">{{ dashboard.stats.users }}</div>
          <div class="text-sm text-gray-500 mt-1">ผู้ใช้</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-[#EE4D2D]">{{ dashboard.stats.products }}</div>
          <div class="text-sm text-gray-500 mt-1">สินค้า</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-[#EE4D2D]">{{ dashboard.stats.clicks }}</div>
          <div class="text-sm text-gray-500 mt-1">Affiliate Clicks</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-[#EE4D2D]">{{ dashboard.stats.alerts }}</div>
          <div class="text-sm text-gray-500 mt-1">แจ้งเตือนราคา</div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="card p-6">
        <h2 class="font-bold text-gray-800 mb-4">สินค้าขายดี</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b text-gray-500">
              <th class="text-left py-2">สินค้า</th>
              <th class="text-right py-2">ขายแล้ว</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in dashboard.topProducts" :key="p.id" class="border-b">
              <td class="py-2">
                <NuxtLink :to="`/products/${p.slug}`" class="hover:text-[#EE4D2D]">{{ p.name }}</NuxtLink>
              </td>
              <td class="text-right py-2">{{ p.soldCount?.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { apiFetch } = useApi()

interface Dashboard {
  stats: { users: number; products: number; clicks: number; alerts: number }
  topProducts: { id: string; name: string; slug: string; soldCount: number }[]
}

const { data: dashboard } = await useAsyncData(
  'admin-dashboard',
  () => authStore.isAdmin
    ? apiFetch<Dashboard>('/admin/dashboard').catch(() => null)
    : null,
)

useSiteSeo({ title: 'แอดมิน', noindex: true })
</script>

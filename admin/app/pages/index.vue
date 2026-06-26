<template>
  <div class="p-6 max-w-5xl">
    <h1 class="text-2xl font-bold text-content mb-6">แดชบอร์ด</h1>

    <div v-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>

    <div v-else-if="loadError" class="card p-10 text-center text-red-600">{{ loadError }}</div>

    <template v-else-if="dashboard">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-shopee">{{ dashboard.stats.users }}</div>
          <div class="text-sm text-content-muted mt-1">ผู้ใช้</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-shopee">{{ dashboard.stats.products }}</div>
          <div class="text-sm text-content-muted mt-1">สินค้า</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-shopee">{{ dashboard.stats.clicks }}</div>
          <div class="text-sm text-content-muted mt-1">Affiliate Clicks</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-shopee">{{ dashboard.stats.alerts }}</div>
          <div class="text-sm text-content-muted mt-1">แจ้งเตือนราคา</div>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="font-bold text-content mb-4">สินค้าขายดี</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line text-content-muted">
              <th class="text-left py-2">สินค้า</th>
              <th class="text-right py-2">ขายแล้ว</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in dashboard.topProducts" :key="p.id" class="border-b border-line">
              <td class="py-2">
                <a
                  :href="`${siteUrl}/products/${p.slug}`"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-shopee"
                >
                  {{ p.name }}
                </a>
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
const config = useRuntimeConfig()
const { apiFetch } = useApi()

const siteUrl = config.public.siteUrl as string

interface Dashboard {
  stats: { users: number; products: number; clicks: number; alerts: number }
  topProducts: { id: string; name: string; slug: string; soldCount: number }[]
}

const { data: dashboard, pending, loadError } = useAdminFetch(
  () => 'admin-dashboard',
  () => apiFetch<Dashboard>('/admin/dashboard'),
)

usePageTitle('แดชบอร์ด')
</script>

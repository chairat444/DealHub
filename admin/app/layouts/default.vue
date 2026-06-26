<template>
  <div class="min-h-screen flex bg-page">
    <aside class="w-56 bg-surface border-r border-line shrink-0 flex flex-col">
      <div class="p-4 border-b border-line">
        <p class="font-bold text-content">DealHub Admin</p>
        <a
          :href="siteUrl"
          target="_blank"
          rel="noopener"
          class="text-xs text-shopee hover:underline mt-1 inline-block"
        >
          เปิดหน้าเว็บ ↗
        </a>
      </div>

      <nav class="p-2 flex-1 space-y-0.5">
        <NuxtLink to="/" class="nav-link">แดชบอร์ด</NuxtLink>
        <NuxtLink to="/categories" class="nav-link">หมวดหมู่ / SEO</NuxtLink>
        <NuxtLink to="/banners" class="nav-link">โฆษณา / แบนเนอร์</NuxtLink>
      </nav>

      <div class="p-4 border-t border-line">
        <p v-if="authStore.user" class="text-xs text-content-muted truncate mb-2">
          {{ authStore.user.email }}
        </p>
        <button
          type="button"
          class="text-sm text-red-600 hover:underline"
          @click="handleLogout"
        >
          ออกจากระบบ
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

const siteUrl = config.public.siteUrl as string

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

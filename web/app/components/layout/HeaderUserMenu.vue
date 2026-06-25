<template>
  <div ref="menuRoot" class="relative hidden sm:block">
    <button
      type="button"
      class="user-menu-trigger"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <MemberAvatar
        :avatar="authStore.user?.avatar"
        :name="authStore.user?.name || 'User'"
        :user-id="authStore.user?.id"
        size="sm"
      />
      <span class="max-w-[72px] truncate text-sm">{{ authStore.user?.tierLabel || authStore.user?.name }}</span>
      <ChevronDown class="w-4 h-4 opacity-80 transition-transform" :class="open ? 'rotate-180' : ''" />
    </button>

    <Transition name="menu-fade">
      <div
        v-if="open"
        class="user-menu-panel"
        role="menu"
      >
        <div class="px-4 py-3 border-b border-line flex items-center gap-3">
          <MemberAvatar
            :avatar="authStore.user?.avatar"
            :name="authStore.user?.name || ''"
            :user-id="authStore.user?.id"
            size="md"
          />
          <div class="min-w-0">
            <p class="font-semibold text-content truncate">{{ authStore.user?.name }}</p>
            <p v-if="authStore.user?.username" class="text-xs text-content-muted truncate">@{{ authStore.user.username }}</p>
            <p v-if="authStore.user?.tierLabel" class="text-xs text-accent mt-0.5">{{ authStore.user.tierLabel }}</p>
          </div>
        </div>

        <NuxtLink
          v-if="authStore.user?.username"
          :to="`/profile/${authStore.user.username}`"
          class="user-menu-item"
          role="menuitem"
          @click="open = false"
        >
          <User class="w-4 h-4" />
          โปรไฟล์ของฉัน
        </NuxtLink>

        <NuxtLink to="/settings/profile" class="user-menu-item" role="menuitem" @click="open = false">
          <Settings class="w-4 h-4" />
          ตั้งค่าโปรไฟล์
        </NuxtLink>

        <NuxtLink v-if="authStore.isAdmin" to="/admin" class="user-menu-item" role="menuitem" @click="open = false">
          <Shield class="w-4 h-4" />
          แอดมิน
        </NuxtLink>

        <div class="border-t border-line my-1" />

        <button type="button" class="user-menu-item user-menu-logout" role="menuitem" @click="logout">
          <LogOut class="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, LogOut, Settings, Shield, User } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const authStore = useAuthStore()
const menuRoot = ref<HTMLElement | null>(null)
const open = ref(false)

onClickOutside(menuRoot, () => { open.value = false })

function logout() {
  open.value = false
  authStore.logout()
  navigateTo('/')
}
</script>

<style scoped>
.user-menu-trigger {
  @apply flex items-center gap-2 px-2 py-1.5 rounded-lg
    text-white dark:text-content
    hover:bg-white/15 dark:hover:bg-white/10
    transition-colors;
}

.user-menu-panel {
  @apply absolute right-0 top-full mt-2 w-56 py-1
    bg-surface border border-line rounded-xl shadow-lg z-50
    dark:shadow-black/30;
}

.user-menu-item {
  @apply flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-content
    hover:bg-surface-muted transition-colors;
}

.user-menu-logout {
  @apply text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

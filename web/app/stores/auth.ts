import { defineStore } from 'pinia'
import type { AuthTokens, User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isLoggedIn = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN')

  function setAuth(data: AuthTokens) {
    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    if (import.meta.client) {
      localStorage.setItem('auth', JSON.stringify(data))
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const data: AuthTokens = JSON.parse(stored)
        user.value = data.user
        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken
      }
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth')
    }
  }

  return { user, accessToken, refreshToken, isLoggedIn, isAdmin, setAuth, loadFromStorage, logout }
})

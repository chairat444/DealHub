<template>
  <div class="container mx-auto px-4 py-6 max-w-md">
    <div class="card p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">เข้าสู่ระบบ</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">อีเมล</label>
          <input v-model="email" type="email" required class="input-field" placeholder="your@email.com" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">รหัสผ่าน</label>
          <input v-model="password" type="password" required class="input-field" placeholder="••••••••" />
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        ยังไม่มีบัญชี?
        <NuxtLink to="/auth/register" class="text-[#EE4D2D] hover:underline">สมัครสมาชิก</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthTokens } from '~/types'

const authStore = useAuthStore()
const { apiFetch } = useApi()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

useSeoMeta({ title: 'เข้าสู่ระบบ - DealHub TH' })

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const data = await apiFetch<AuthTokens>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    authStore.setAuth(data)
    router.push('/')
  } catch {
    error.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>

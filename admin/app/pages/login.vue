<template>
  <div class="card p-8 w-full max-w-md">
    <h1 class="text-2xl font-bold text-center text-content mb-2">DealHub Admin</h1>
    <p class="text-center text-content-muted text-sm mb-6">เข้าสู่ระบบสำหรับผู้ดูแลเท่านั้น</p>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm text-content-muted mb-1">อีเมล</label>
        <input v-model="email" type="email" required class="input-field" placeholder="admin@dealhub.th">
      </div>
      <div>
        <label class="block text-sm text-content-muted mb-1">รหัสผ่าน</label>
        <input v-model="password" type="password" required class="input-field" placeholder="••••••••">
      </div>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { AuthTokens } from '~/types'

definePageMeta({ layout: 'blank' })

const authStore = useAuthStore()
const { apiFetch } = useApi()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

usePageTitle('เข้าสู่ระบบ')

onMounted(() => {
  if (route.query.error === 'forbidden') {
    error.value = 'บัญชีนี้ไม่มีสิทธิ์แอดมิน'
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const data = await apiFetch<AuthTokens>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPER_ADMIN') {
      error.value = 'บัญชีนี้ไม่มีสิทธิ์แอดมิน'
      return
    }
    authStore.setAuth(data)
    router.push('/')
  } catch {
    error.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>

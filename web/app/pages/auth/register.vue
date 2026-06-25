<template>
  <div class="container mx-auto px-4 py-6 max-w-md">
    <div class="card p-8">
      <h1 class="text-2xl md:text-3xl font-bold text-center text-content mb-6">สมัครสมาชิก</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-base text-content-muted mb-1">ชื่อ</label>
          <input v-model="name" type="text" required class="input-field" placeholder="ชื่อของคุณ" />
        </div>
        <div>
          <label class="block text-base text-content-muted mb-1">อีเมล</label>
          <input v-model="email" type="email" required class="input-field" placeholder="your@email.com" />
        </div>
        <div>
          <label class="block text-base text-content-muted mb-1">รหัสผ่าน</label>
          <input v-model="password" type="password" required minlength="6" class="input-field" placeholder="อย่างน้อย 6 ตัวอักษร" />
        </div>
        <p v-if="error" class="text-red-500 text-base">{{ error }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
        </button>
      </form>

      <p class="text-center text-base text-content-muted mt-6">
        มีบัญชีแล้ว?
        <NuxtLink to="/auth/login" class="text-[#EE4D2D] hover:underline">เข้าสู่ระบบ</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthTokens } from '~/types'

const authStore = useAuthStore()
const { apiFetch } = useApi()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

useSiteSeo({ title: 'สมัครสมาชิก', noindex: true })

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    const data = await apiFetch<AuthTokens>('/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value },
    })
    authStore.setAuth(data)
    router.push('/')
  } catch {
    error.value = 'ไม่สามารถสมัครสมาชิกได้ อีเมลอาจถูกใช้งานแล้ว'
  } finally {
    loading.value = false
  }
}
</script>

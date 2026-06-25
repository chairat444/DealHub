<template>
  <div class="bg-page min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="text-6xl font-bold text-accent mb-2">{{ error.statusCode }}</p>
      <h1 class="text-xl font-bold text-content mb-2">
        {{ error.statusCode === 404 ? 'ไม่พบหน้าที่ต้องการ' : 'เกิดข้อผิดพลาด' }}
      </h1>
      <p class="text-content-muted mb-6">
        {{ error.statusCode === 404
          ? 'หน้านี้อาจถูกลบหรือย้ายไปแล้ว'
          : (error.message || 'ลองใหม่อีกครั้งในภายหลัง') }}
      </p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <button type="button" class="btn-primary" @click="handleClear">
          กลับหน้าแรก
        </button>
        <NuxtLink to="/search" class="btn-outline text-center">
          ค้นหาสินค้า
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSiteSeo({
  title: props.error.statusCode === 404 ? 'ไม่พบหน้า' : 'ข้อผิดพลาด',
  description: 'ไม่พบหน้าที่คุณต้องการบน DealHub TH',
  noindex: true,
})

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

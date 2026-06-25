<template>
  <div class="page-container py-16 text-center">
    <Bell class="w-12 h-12 text-shopee mx-auto mb-4" />
    <h1 class="text-2xl font-bold text-gray-800 mb-2">การแจ้งเตือน</h1>
    <p class="text-gray-500 text-sm mb-6">
      ฟีเจอร์แจ้งเตือนกำลังพัฒนา — รับแจ้งเตือนเมื่อราคาลดและกิจกรรมจากบอร์ดชุมชน
    </p>
    <NuxtLink to="/auth/login" class="btn-primary inline-block">เข้าสู่ระบบ</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'

useSiteSeo({ title: 'แจ้งเตือน', noindex: true })
</script>

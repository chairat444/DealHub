<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/admin" class="text-sm text-shopee hover:underline">← กลับแดชบอร์ด</NuxtLink>
        <h1 class="text-2xl font-bold text-content mt-2">จัดการหมวดหมู่</h1>
        <p class="text-content-muted text-base mt-1">
          แก้ไขคำโปรยแต่ละหมวด — ใช้แสดงบนหน้าหมวดและ meta description สำหรับ SEO
        </p>
      </div>
    </div>

    <div v-if="!authStore.isAdmin" class="text-center py-20 text-red-500">
      ไม่มีสิทธิ์เข้าถึง
    </div>

    <div v-else-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>

    <div v-else class="space-y-4">
      <article
        v-for="cat in categories"
        :key="cat.id"
        class="card p-5"
      >
        <div class="flex items-start gap-3 mb-4">
          <span class="text-3xl">{{ cat.icon || '📦' }}</span>
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-content text-lg">{{ cat.name }}</h2>
            <p class="text-sm text-content-muted">/{{ cat.slug }} · {{ cat._count?.products || 0 }} สินค้า</p>
          </div>
          <NuxtLink
            :to="`/categories/${cat.slug}`"
            target="_blank"
            class="text-sm text-shopee hover:underline shrink-0"
          >
            ดูหน้าเว็บ ↗
          </NuxtLink>
        </div>

        <label class="block text-sm font-medium text-content-muted mb-1">
          คำโปรย (SEO)
          <span class="font-normal"> — แนะนำ 120–160 ตัวอักษร</span>
        </label>
        <textarea
          v-model="forms[cat.id].description"
          rows="3"
          maxlength="500"
          class="input-field resize-y"
          :placeholder="`คำโปรยสำหรับหมวด${cat.name}`"
        />
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-content-muted">
            {{ forms[cat.id].description.length }}/500 ตัวอักษร
          </span>
          <span v-if="saved[cat.id]" class="text-xs text-green-600 dark:text-green-400">บันทึกแล้ว ✓</span>
        </div>

        <div class="flex justify-end mt-4">
          <button
            type="button"
            class="btn-primary text-sm px-5 py-2"
            :disabled="saving[cat.id] || !isDirty(cat)"
            @click="save(cat.id)"
          >
            {{ saving[cat.id] ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const authStore = useAuthStore()
const { apiFetch } = useApi()

const forms = reactive<Record<string, { description: string }>>({})
const saving = reactive<Record<string, boolean>>({})
const saved = reactive<Record<string, boolean>>({})

const { data: categories, pending, refresh } = await useAsyncData(
  'admin-categories',
  () => authStore.isAdmin
    ? apiFetch<Category[]>('/admin/categories').catch(() => [])
    : [],
)

watch(categories, (items) => {
  if (!items) return
  for (const cat of items) {
    if (!forms[cat.id]) {
      forms[cat.id] = { description: cat.description || '' }
    }
  }
}, { immediate: true })

function isDirty(cat: Category) {
  return forms[cat.id]?.description !== (cat.description || '')
}

async function save(id: string) {
  saving[id] = true
  saved[id] = false
  try {
    await apiFetch(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: { description: forms[id].description },
    })
    saved[id] = true
    await refresh()
    setTimeout(() => { saved[id] = false }, 3000)
  } catch {
    alert('บันทึกไม่สำเร็จ กรุณาลองใหม่')
  } finally {
    saving[id] = false
  }
}

useSiteSeo({ title: 'จัดการหมวดหมู่', noindex: true })
</script>

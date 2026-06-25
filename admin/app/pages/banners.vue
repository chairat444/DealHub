<template>
  <div class="p-6 max-w-4xl">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-content">จัดการแบนเนอร์หน้าแรก</h1>
        <p class="text-content-muted text-sm mt-1">
          อัปโหลดรูปสัดส่วนกว้าง ~3:1 (แนะนำ 1200×400 px) — แสดงใน carousel หลัง slide โปรโมชันหลัก
        </p>
      </div>
      <button
        type="button"
        class="btn-primary text-sm px-5 py-2"
        :disabled="creating"
        @click="addBanner"
      >
        {{ creating ? 'กำลังสร้าง...' : '+ เพิ่มแบนเนอร์' }}
      </button>
    </div>

    <div v-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>

    <div v-else-if="!banners?.length" class="card p-10 text-center text-content-muted">
      ยังไม่มีแบนเนอร์ — กด «เพิ่มแบนเนอร์» เพื่อเริ่มต้น
    </div>

    <div v-else class="space-y-6">
      <article
        v-for="banner in banners"
        :key="banner.id"
        class="card overflow-hidden"
      >
        <div class="aspect-[3/1] bg-surface-muted relative">
          <img
            :src="resolveBannerImageUrl(banner.imageUrl)"
            :alt="banner.altText || banner.title || 'แบนเนอร์'"
            class="w-full h-full object-cover"
          >
          <span
            class="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded"
            :class="banner.isActive ? 'bg-green-600 text-white' : 'bg-gray-600/80 text-white'"
          >
            {{ banner.isActive ? 'เปิดใช้งาน' : 'ปิดอยู่' }}
          </span>
        </div>

        <div class="p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-bold text-content text-lg">
              {{ banner.title || `แบนเนอร์ #${banner.sortOrder + 1}` }}
            </h2>
            <label class="inline-flex items-center gap-2 text-sm text-content cursor-pointer">
              <input
                v-model="forms[banner.id].isActive"
                type="checkbox"
                class="rounded border-line text-shopee focus:ring-shopee/30"
              >
              แสดงบนหน้าแรก
            </label>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">ชื่อ (ภายใน)</label>
              <input
                v-model="forms[banner.id].title"
                type="text"
                maxlength="120"
                class="input-field"
                placeholder="DealHub TH"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">ลำดับ</label>
              <input
                v-model.number="forms[banner.id].sortOrder"
                type="number"
                min="0"
                class="input-field"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-content-muted mb-1">ลิงก์เมื่อคลิก</label>
            <input
              v-model="forms[banner.id].linkUrl"
              type="text"
              maxlength="500"
              class="input-field"
              placeholder="/search"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-content-muted mb-1">ข้อความ alt (SEO / accessibility)</label>
            <input
              v-model="forms[banner.id].altText"
              type="text"
              maxlength="200"
              class="input-field"
              placeholder="DealHub TH — เทียบราคา Shopee Lazada TikTok Shop"
            >
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
            <div class="flex flex-wrap items-center gap-2">
              <input
                :ref="(el) => setFileInput(banner.id, el)"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="(e) => onFileSelected(banner.id, e)"
              >
              <button
                type="button"
                class="btn-outline text-sm px-4 py-2"
                :disabled="uploading[banner.id]"
                @click="triggerUpload(banner.id)"
              >
                {{ uploading[banner.id] ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปใหม่' }}
              </button>
              <span v-if="uploadError[banner.id]" class="text-sm text-red-600">{{ uploadError[banner.id] }}</span>
              <span v-else-if="uploaded[banner.id]" class="text-sm text-green-600">อัปโหลดแล้ว ✓</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                :disabled="deleting[banner.id]"
                @click="remove(banner.id)"
              >
                {{ deleting[banner.id] ? 'กำลังลบ...' : 'ลบ' }}
              </button>
              <button
                type="button"
                class="btn-primary text-sm px-5 py-2"
                :disabled="saving[banner.id] || !isDirty(banner)"
                @click="save(banner.id)"
              >
                {{ saving[banner.id] ? 'กำลังบันทึก...' : 'บันทึก' }}
              </button>
            </div>
          </div>

          <p v-if="saved[banner.id]" class="text-xs text-green-600 text-right">บันทึกแล้ว ✓</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminBanner, BannerForm } from '~/types/banner'

const {
  fetchAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  resolveBannerImageUrl,
} = useBanners()

const forms = reactive<Record<string, BannerForm>>({})
const saving = reactive<Record<string, boolean>>({})
const saved = reactive<Record<string, boolean>>({})
const uploading = reactive<Record<string, boolean>>({})
const uploaded = reactive<Record<string, boolean>>({})
const uploadError = reactive<Record<string, string>>({})
const deleting = reactive<Record<string, boolean>>({})
const fileInputs = reactive<Record<string, HTMLInputElement | null>>({})
const creating = ref(false)

const { data: banners, pending, refresh } = await useAsyncData(
  'admin-banners',
  () => fetchAdminBanners().catch(() => []),
)

function toForm(banner: AdminBanner): BannerForm {
  return {
    title: banner.title || '',
    linkUrl: banner.linkUrl,
    altText: banner.altText || '',
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
  }
}

watch(banners, (items) => {
  if (!items) return
  for (const banner of items) {
    if (!forms[banner.id]) {
      forms[banner.id] = toForm(banner)
    }
  }
}, { immediate: true })

function isDirty(banner: AdminBanner) {
  const form = forms[banner.id]
  if (!form) return false
  const original = toForm(banner)
  return (
    form.title !== original.title
    || form.linkUrl !== original.linkUrl
    || form.altText !== original.altText
    || form.sortOrder !== original.sortOrder
    || form.isActive !== original.isActive
  )
}

function setFileInput(id: string, el: unknown) {
  fileInputs[id] = el as HTMLInputElement | null
}

function triggerUpload(id: string) {
  fileInputs[id]?.click()
}

async function onFileSelected(id: string, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    uploadError[id] = 'ไฟล์ใหญ่เกิน 3MB'
    input.value = ''
    return
  }

  uploading[id] = true
  uploadError[id] = ''
  uploaded[id] = false
  try {
    await uploadBannerImage(id, file)
    uploaded[id] = true
    await refresh()
    setTimeout(() => { uploaded[id] = false }, 3000)
  } catch {
    uploadError[id] = 'อัปโหลดไม่สำเร็จ'
  } finally {
    uploading[id] = false
    input.value = ''
  }
}

async function save(id: string) {
  saving[id] = true
  saved[id] = false
  try {
    const form = forms[id]
    await updateBanner(id, {
      title: form.title || undefined,
      linkUrl: form.linkUrl,
      altText: form.altText || undefined,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
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

async function remove(id: string) {
  if (!confirm('ลบแบนเนอร์นี้?')) return
  deleting[id] = true
  try {
    await deleteBanner(id)
    delete forms[id]
    await refresh()
  } catch {
    alert('ลบไม่สำเร็จ')
  } finally {
    deleting[id] = false
  }
}

async function addBanner() {
  creating.value = true
  try {
    const nextOrder = banners.value?.length ?? 0
    await createBanner({
      title: `แบนเนอร์ ${nextOrder + 1}`,
      imageUrl: '/hero-banner.png',
      linkUrl: '/search',
      altText: 'DealHub TH',
      sortOrder: nextOrder,
      isActive: false,
    })
    await refresh()
  } catch {
    alert('สร้างแบนเนอร์ไม่สำเร็จ')
  } finally {
    creating.value = false
  }
}

usePageTitle('จัดการแบนเนอร์')
</script>

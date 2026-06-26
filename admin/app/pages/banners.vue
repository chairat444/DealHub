<template>
  <div class="p-6 max-w-5xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-content">จัดการโฆษณา / แบนเนอร์</h1>
      <p class="text-content-muted text-sm mt-1">
        กำหนดตำแหน่ง รูปภาพ ช่วงเวลาแสดง และดูสถิติ impression / click
      </p>
    </div>

    <!-- Placement tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-line pb-4">
      <button
        v-for="p in AD_PLACEMENTS"
        :key="p.id"
        type="button"
        class="text-sm px-3 py-1.5 rounded-sm border transition-colors"
        :class="activePlacement === p.id
          ? 'bg-[#FFF6F4] border-shopee text-shopee font-medium'
          : 'border-line text-content-muted hover:border-shopee/40'"
        @click="setPlacement(p.id)"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="card p-4 mb-6 bg-[#FFF6F4]/50 border-dashed">
      <p class="text-sm font-medium text-content">{{ placementMeta.page }}</p>
      <p class="text-xs text-content-muted mt-1">
        ขนาดแนะนำ: {{ placementMeta.sizeHint }}
        <span v-if="placementMeta.showAdBadge"> · แสดงป้าย «โฆษณา»</span>
      </p>
    </div>

    <div class="flex justify-end mb-4">
      <button
        type="button"
        class="btn-primary text-sm px-5 py-2"
        :disabled="creating"
        @click="addBanner"
      >
        {{ creating ? 'กำลังสร้าง...' : `+ เพิ่มโฆษณา (${placementMeta.label})` }}
      </button>
    </div>

    <div v-if="pending" class="text-center py-20 text-content-muted">กำลังโหลด...</div>

    <div v-else-if="loadError" class="card p-10 text-center">
      <p class="text-red-600 mb-4">{{ loadError }}</p>
      <button type="button" class="btn-primary text-sm px-5 py-2" @click="refresh()">ลองใหม่</button>
    </div>

    <div v-else-if="!banners?.length" class="card p-10 text-center text-content-muted">
      ยังไม่มีโฆษณาในตำแหน่งนี้
    </div>

    <div v-else class="space-y-6">
      <article
        v-for="banner in banners"
        :key="banner.id"
        class="card overflow-hidden"
      >
        <div
          class="relative w-full overflow-hidden rounded-t-xl bg-surface-muted"
          :class="placementMeta.aspect"
          :style="{ aspectRatio: placementMeta.aspectRatio }"
        >
          <img
            :src="resolveBannerImageUrl(banner.imageUrl)"
            :alt="banner.altText || banner.title || 'โฆษณา'"
            class="absolute inset-0 h-full w-full object-cover object-center"
          >
          <span
            class="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded"
            :class="banner.isActive ? 'bg-green-600 text-white' : 'bg-gray-600/80 text-white'"
          >
            {{ banner.isActive ? 'เปิดใช้งาน' : 'ปิดอยู่' }}
          </span>
          <span class="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-black/55 text-white">
            👁 {{ banner.impressions.toLocaleString() }} · 🖱 {{ banner.clicks.toLocaleString() }}
          </span>
        </div>

        <div class="p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-bold text-content text-lg">
              {{ banner.title || `โฆษณา #${banner.sortOrder + 1}` }}
            </h2>
            <label class="inline-flex items-center gap-2 text-sm text-content cursor-pointer">
              <input
                v-model="forms[banner.id].isActive"
                type="checkbox"
                class="rounded border-line text-shopee"
              >
              แสดงบนเว็บ
            </label>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">ชื่อแคมเปญ</label>
              <input v-model="forms[banner.id].title" type="text" maxlength="120" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">ผู้ลงโฆษณา</label>
              <input v-model="forms[banner.id].sponsorName" type="text" maxlength="120" class="input-field" placeholder="Shopee, Brand X">
            </div>
          </div>

          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">ลำดับ</label>
              <input v-model.number="forms[banner.id].sortOrder" type="number" min="0" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">เริ่มแสดง</label>
              <input v-model="forms[banner.id].startsAt" type="datetime-local" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-content-muted mb-1">สิ้นสุด</label>
              <input v-model="forms[banner.id].endsAt" type="datetime-local" class="input-field">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-content-muted mb-1">ลิงก์เมื่อคลิก</label>
            <input v-model="forms[banner.id].linkUrl" type="text" maxlength="500" class="input-field" placeholder="/search">
          </div>

          <div>
            <label class="block text-sm font-medium text-content-muted mb-1">ข้อความ alt</label>
            <input v-model="forms[banner.id].altText" type="text" maxlength="200" class="input-field">
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
                {{ uploading[banner.id] ? 'กำลังอัปโหลด...' : 'อัปโหลดรูป' }}
              </button>
              <span v-if="uploadError[banner.id]" class="text-sm text-red-600">{{ uploadError[banner.id] }}</span>
              <span v-else-if="uploaded[banner.id]" class="text-sm text-green-600">อัปโหลดแล้ว ✓</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-sm"
                :disabled="deleting[banner.id]"
                @click="remove(banner.id)"
              >
                ลบ
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
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AD_PLACEMENTS, getPlacementMeta, type AdPlacement } from '~/constants/ad-placements'
import type { AdminBanner, BannerForm } from '~/types/banner'

const route = useRoute()
const router = useRouter()

const {
  fetchAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  resolveBannerImageUrl,
} = useBanners()

const activePlacement = computed<AdPlacement>(() => {
  const q = route.query.placement as string
  return AD_PLACEMENTS.some((p) => p.id === q) ? (q as AdPlacement) : 'HERO'
})

const placementMeta = computed(() => getPlacementMeta(activePlacement.value))

function setPlacement(id: AdPlacement) {
  router.replace({ query: { placement: id } })
}

const forms = reactive<Record<string, BannerForm>>({})
const saving = reactive<Record<string, boolean>>({})
const uploading = reactive<Record<string, boolean>>({})
const uploaded = reactive<Record<string, boolean>>({})
const uploadError = reactive<Record<string, string>>({})
const deleting = reactive<Record<string, boolean>>({})
const fileInputs = reactive<Record<string, HTMLInputElement | null>>({})
const creating = ref(false)

const { data: banners, pending, refresh, loadError } = useAdminFetch(
  () => `admin-banners-${activePlacement.value}`,
  () => fetchAdminBanners(activePlacement.value),
  [activePlacement],
)

function toDatetimeLocal(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toForm(banner: AdminBanner): BannerForm {
  return {
    title: banner.title || '',
    sponsorName: banner.sponsorName || '',
    linkUrl: banner.linkUrl,
    altText: banner.altText || '',
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
    startsAt: toDatetimeLocal(banner.startsAt),
    endsAt: toDatetimeLocal(banner.endsAt),
  }
}

watch(banners, (items) => {
  if (!items) return
  for (const banner of items) {
    forms[banner.id] = toForm(banner)
  }
}, { immediate: true })

function isDirty(banner: AdminBanner) {
  const form = forms[banner.id]
  if (!form) return false
  return JSON.stringify(form) !== JSON.stringify(toForm(banner))
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

function toIsoOrUndefined(value: string) {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

async function save(id: string) {
  saving[id] = true
  try {
    const form = forms[id]
    await updateBanner(id, {
      title: form.title || undefined,
      sponsorName: form.sponsorName || undefined,
      linkUrl: form.linkUrl,
      altText: form.altText || undefined,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
      startsAt: toIsoOrUndefined(form.startsAt),
      endsAt: toIsoOrUndefined(form.endsAt),
    })
    await refresh()
  } catch {
    alert('บันทึกไม่สำเร็จ')
  } finally {
    saving[id] = false
  }
}

async function remove(id: string) {
  if (!confirm('ลบโฆษณานี้?')) return
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
      placement: activePlacement.value,
      title: `โฆษณา ${placementMeta.value.label}`,
      imageUrl: '/hero-banner.svg',
      linkUrl: '/search',
      altText: 'DealHub TH',
      sortOrder: nextOrder,
      isActive: false,
    })
    await refresh()
  } catch {
    alert('สร้างไม่สำเร็จ')
  } finally {
    creating.value = false
  }
}

usePageTitle('จัดการโฆษณา')
</script>

<template>
  <div class="bg-page min-h-screen pb-10">
    <div class="page-container py-6 max-w-lg">
      <h1 class="text-2xl font-bold text-content mb-6">ตั้งค่าโปรไฟล์</h1>

      <div v-if="!authStore.isLoggedIn" class="text-center py-16">
        <p class="text-content-muted mb-4">กรุณาเข้าสู่ระบบ</p>
        <NuxtLink to="/auth/login" class="btn-primary inline-block">เข้าสู่ระบบ</NuxtLink>
      </div>

      <form v-else class="space-y-5" @submit.prevent="save">
        <div v-if="pending" class="bg-surface border border-line rounded-xl p-4 text-sm text-content-muted">
          กำลังโหลดโปรไฟล์...
        </div>

        <div class="bg-surface border border-line rounded-xl p-4">
          <MemberAvatarPicker
            v-model="form.avatar"
            :display-name="displayName"
            :user-id="authStore.user?.id"
            @uploaded="onAvatarUploaded"
          />
        </div>

        <div v-if="profile" class="bg-surface border border-line rounded-xl p-4 flex items-center gap-4">
          <div class="text-sm text-content-muted">
            <div class="font-semibold text-content">{{ profile.displayName }}</div>
            <div>@{{ profile.username }}</div>
            <div class="mt-1 flex items-center gap-2">
              <MemberTierBadge :tier="profile.tier" />
              <span>{{ profile.dealScore }} คะแนน</span>
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-content">ชื่อเล่น</label>
          <input v-model="form.nickname" maxlength="40" class="w-full mt-1 border border-line rounded-lg px-3 py-2 bg-surface text-content" />
        </div>

        <div>
          <label class="text-sm font-medium text-content">แนะนำตัว</label>
          <textarea v-model="form.bio" rows="4" maxlength="500" class="w-full mt-1 border border-line rounded-lg px-3 py-2 bg-surface text-content resize-none" />
        </div>

        <div>
          <label class="text-sm font-medium text-content mb-2 block">หมวดที่ถนัด</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in EXPERTISE_OPTIONS"
              :key="opt.id"
              type="button"
              class="text-sm px-3 py-1.5 rounded-full border transition-colors"
              :class="form.expertiseTags.includes(opt.id)
                ? 'border-shopee bg-shopee/10 text-accent font-semibold'
                : 'border-line text-content-muted'"
              @click="toggleTag(opt.id)"
            >
              {{ opt.icon }} {{ opt.label }}
            </button>
          </div>
        </div>

        <p v-if="loadError" class="text-sm text-amber-600">โหลดข้อมูลโปรไฟล์ไม่สำเร็จ — ลองรีเฟรชหน้านี้</p>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p v-if="saved" class="text-sm text-green-600">บันทึกแล้ว ✓</p>

        <div class="flex gap-2">
          <NuxtLink
            v-if="profile?.username"
            :to="`/profile/${profile.username}`"
            class="btn-outline flex-1 text-center"
          >
            ดูโปรไฟล์
          </NuxtLink>
          <button type="submit" class="btn-primary flex-1" :disabled="saving">
            {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EXPERTISE_OPTIONS } from '~/constants/member'
import type { MemberProfile } from '~/types/member'

useSiteSeo({ title: 'ตั้งค่าโปรไฟล์', noindex: true })

const authStore = useAuthStore()
const { fetchMe, updateProfile } = useMember()

if (import.meta.client) {
  authStore.loadFromStorage()
}

const { data: profile, pending, error: loadError, refresh } = await useAsyncData(
  'settings-profile',
  () => {
    if (!authStore.accessToken) return Promise.resolve(null)
    return fetchMe()
  },
  {
    server: false,
    watch: [() => authStore.accessToken],
  },
)

const displayName = computed(
  () => profile.value?.displayName || authStore.user?.name || 'สมาชิก',
)

const form = reactive({
  nickname: '',
  bio: '',
  avatar: null as string | null,
  expertiseTags: [] as string[],
})

watch(profile, (p) => {
  if (p) {
    form.nickname = p.nickname || ''
    form.bio = p.bio || ''
    form.avatar = p.avatar
    form.expertiseTags = [...p.expertiseTags]
  }
}, { immediate: true })

watch(() => authStore.user?.avatar, (avatar) => {
  if (avatar && !form.avatar) form.avatar = avatar
})

const saving = ref(false)
const saved = ref(false)
const error = ref('')

function toggleTag(id: string) {
  const i = form.expertiseTags.indexOf(id)
  if (i >= 0) form.expertiseTags.splice(i, 1)
  else form.expertiseTags.push(id)
}

function syncAuthUser(updated: MemberProfile) {
  if (!authStore.user || !authStore.accessToken || !authStore.refreshToken) return
  authStore.setAuth({
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken,
    user: {
      ...authStore.user,
      username: updated.username,
      avatar: updated.avatar,
      dealScore: updated.dealScore,
      tier: updated.tier,
      tierLabel: updated.tierLabel,
    },
  })
}

function onAvatarUploaded(updated: MemberProfile) {
  syncAuthUser(updated)
  void refresh()
}

async function save() {
  saving.value = true
  error.value = ''
  saved.value = false
  try {
    const updated = await updateProfile({
      nickname: form.nickname.trim() || undefined,
      bio: form.bio.trim() || undefined,
      avatar: form.avatar || undefined,
      expertiseTags: form.expertiseTags,
    }) as MemberProfile
    syncAuthUser(updated)
    await refresh()
    saved.value = true
  }
  catch {
    error.value = 'บันทึกไม่สำเร็จ'
  }
  finally {
    saving.value = false
  }
}
</script>

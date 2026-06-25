<template>
  <div class="bg-page min-h-screen pb-10">
    <div v-if="pending" class="page-container py-20 text-center text-content-muted">กำลังโหลด...</div>
    <div v-else-if="!profile" class="page-container py-20 text-center">
      <p class="text-content-muted">ไม่พบโปรไฟล์</p>
    </div>

    <template v-else>
      <div class="board-header py-8">
        <div class="page-container">
          <div class="flex flex-col sm:flex-row gap-5 items-start">
            <div class="shrink-0 rounded-full border-4 border-white/30">
              <MemberAvatar
                :avatar="profile.avatar"
                :name="profile.displayName"
                :user-id="profile.id"
                size="xl"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl md:text-3xl font-bold">{{ profile.displayName }}</h1>
                <MemberTierBadge :tier="profile.tier" />
              </div>
              <p v-if="profile.username" class="text-white/80 mt-1">@{{ profile.username }}</p>
              <p v-if="profile.bio" class="text-white/90 mt-2 max-w-2xl">{{ profile.bio }}</p>
              <div class="flex flex-wrap gap-4 mt-3 text-sm text-white/85">
                <span>⭐ Deal Score <strong>{{ profile.dealScore.toLocaleString() }}</strong></span>
                <span>📝 โพสต์ <strong>{{ profile.stats.postCount }}</strong></span>
                <span>↑ ได้รับ <strong>{{ profile.stats.totalUpvotes.toLocaleString() }}</strong></span>
              </div>
              <div v-if="profile.expertiseTags.length" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in profile.expertiseTags"
                  :key="tag"
                  class="text-xs bg-white/15 px-2.5 py-1 rounded-full"
                >
                  {{ expertiseLabel(tag) }}
                </span>
              </div>
            </div>
            <NuxtLink
              v-if="isOwnProfile"
              to="/settings/profile"
              class="btn-primary text-sm shrink-0"
            >
              แก้ไขโปรไฟล์
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="page-container py-6 max-w-3xl">
        <h2 class="text-lg font-bold text-content mb-4">โพสต์ล่าสุด</h2>
        <div v-if="!profile.recentPosts?.length" class="text-content-muted text-sm">
          ยังไม่มีโพสต์
        </div>
        <div v-else class="space-y-3">
          <NuxtLink
            v-for="post in profile.recentPosts"
            :key="post.id"
            :to="`/board/posts/${post.id}`"
            class="block bg-surface border border-line rounded-xl p-4 hover:border-shopee/40 transition-colors"
          >
            <div class="flex items-center gap-2 text-xs text-content-muted mb-1">
              <span>{{ post.groupIcon }} {{ post.groupName }}</span>
              <span>· {{ post.timeAgo }}</span>
            </div>
            <h3 class="font-medium text-content">{{ post.title }}</h3>
            <div class="flex gap-3 mt-2 text-sm text-content-muted">
              <span class="text-accent font-semibold">↑ {{ post.upvotes }}</span>
              <span>💬 {{ post.comments }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { EXPERTISE_OPTIONS } from '~/constants/member'
import type { MemberProfile } from '~/types/member'

const route = useRoute()
const authStore = useAuthStore()
const { fetchProfile } = useMember()

const username = route.params.username as string

const { data: profile, pending } = await useAsyncData(
  `profile-${username}`,
  () => fetchProfile(username).catch(() => null),
)

const isOwnProfile = computed(() =>
  authStore.user?.username === username || authStore.user?.id === profile.value?.id,
)

function expertiseLabel(id: string) {
  return EXPERTISE_OPTIONS.find((e) => e.id === id)?.label ?? id
}

useSiteSeo(computed(() => ({
  title: profile.value ? `${profile.value.displayName} — โปรไฟล์สมาชิก` : 'โปรไฟล์',
  description: profile.value?.bio ?? 'โปรไฟล์สมาชิก DealHub TH',
  path: `/profile/${username}`,
  noindex: true,
})))
</script>

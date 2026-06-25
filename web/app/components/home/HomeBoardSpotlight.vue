<template>
  <section class="board-spotlight mb-2.5">
    <div class="board-spotlight-intro px-4 py-3 rounded-t-xl border border-b-0 border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl board-header flex items-center justify-center shrink-0">
          <MessageCircle class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="text-xs font-bold text-accent uppercase tracking-wider">ชุมชนผู้ช้อป</p>
          <h2 class="text-xl font-bold text-content">{{ HOME_HEADINGS.board }}</h2>
          <p class="text-sm text-content-muted mt-0.5">
            ถามก่อนซื้อ · แชร์ดีล · อ่านรีวิวจากคนจริง
          </p>
          <div v-if="stats" class="flex flex-wrap items-center gap-2 mt-2">
            <div class="flex -space-x-2">
              <span
                v-for="(color, i) in avatarStack"
                :key="i"
                class="w-7 h-7 rounded-full border-2 border-surface text-[10px] font-bold text-white flex items-center justify-center"
                :style="{ background: color }"
              >
                {{ ['AK', 'NT', 'PS', 'DH'][i] }}
              </span>
            </div>
            <span class="text-xs text-content-muted">
              สมาชิก <strong class="text-content">{{ stats.memberCount.toLocaleString() }}</strong> คน
              · โพสต์ <strong class="text-content">{{ stats.postCount.toLocaleString() }}</strong> กระทู้
            </span>
          </div>
          <p v-if="latestLabel" class="text-xs text-accent font-medium mt-1">{{ latestLabel }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="hidden sm:flex items-center gap-3 text-sm text-content-muted mr-2">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <strong class="text-content">{{ stats?.activeToday ?? 0 }}</strong> ออนไลน์วันนี้
          </span>
          <span v-if="stats">
            <strong class="text-content">{{ stats.postsToday }}</strong> โพสต์วันนี้
          </span>
        </div>
        <NuxtLink to="/board" class="btn-primary text-sm px-4 py-2.5 rounded-lg">
          เข้าร่วมบอร์ด
        </NuxtLink>
      </div>
    </div>

    <HomeBoardCommunity
      spotlight
      :groups="groups || []"
      :posts="posts || []"
      :unanswered-posts="unansweredPosts || []"
      :loading="pending"
    />
  </section>
</template>

<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { HOME_HEADINGS } from '~/constants/seo'
import { formatBoardLatestLabel } from '~/composables/useBoard'
import type { BoardGroup, BoardPost } from '~/types/board'

const { fetchGroups, fetchStats, fetchPosts } = useBoard()

const avatarStack = ['#EE4D2D', '#26aa99', '#7B1FA2', '#F57C00']

const [{ data: groups }, { data: stats }, { data: hotPosts }, { data: unanswered }] = await Promise.all([
  useAsyncData('home-board-groups', () => fetchGroups().catch(() => [])),
  useAsyncData('home-board-stats', () => fetchStats().catch(() => null)),
  useAsyncData('home-board-hot', () =>
    fetchPosts({ sort: 'hot', limit: 7 }).then((r) => r.items).catch(() => []),
  ),
  useAsyncData('home-board-unanswered', () =>
    fetchPosts({ group: 'ask', unanswered: true, sort: 'new', limit: 3 }).then((r) => r.items).catch(() => []),
  ),
])

const posts = computed(() => hotPosts.value || [])
const unansweredPosts = computed(() => unanswered.value || [])
const pending = computed(() => !groups.value && !hotPosts.value)

const latestLabel = computed(() =>
  stats.value ? formatBoardLatestLabel(stats.value.latestPostAt) : null,
)
</script>

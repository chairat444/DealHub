<template>
  <section class="board-spotlight mb-2.5 rounded-xl overflow-hidden border border-[#F5C4B8]/80 dark:border-line shadow-sm">
    <div class="board-header px-4 py-3.5 relative overflow-hidden">
      <div class="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div class="absolute right-12 bottom-0 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide bg-white/20 text-white px-2 py-0.5 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              สดวันนี้
            </span>
            <span v-if="stats" class="text-xs text-white/85">
              <strong class="text-white">{{ stats.activeToday }}</strong> ออนไลน์
              · <strong class="text-white">{{ stats.postsToday }}</strong> โพสต์ใหม่
            </span>
          </div>
          <h2 class="text-lg sm:text-xl font-bold text-white leading-tight">
            {{ HOME_HEADINGS.board }}
          </h2>
          <p class="text-sm text-white/85 mt-0.5">
            ถามก่อนซื้อ · แชร์ดีล · รีวิวจากคนจริง
          </p>
          <div v-if="stats" class="flex items-center gap-2 mt-2">
            <div class="flex -space-x-1.5">
              <span
                v-for="(color, i) in avatarStack"
                :key="i"
                class="w-6 h-6 rounded-full border-2 border-shopee text-[9px] font-bold text-white flex items-center justify-center"
                :style="{ background: color }"
              >
                {{ ['AK', 'NT', 'PS'][i] }}
              </span>
            </div>
            <span class="text-xs text-white/80">
              สมาชิก <strong class="text-white">{{ stats.memberCount.toLocaleString() }}</strong> คนกำลังคุยกัน
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <NuxtLink
            to="/board?compose=1"
            class="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-colors"
          >
            <PenLine class="w-4 h-4" />
            โพสต์เลย
          </NuxtLink>
          <NuxtLink
            to="/board"
            class="inline-flex items-center gap-1 badge-hot text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:opacity-95 transition-opacity"
          >
            เข้าบอร์ด
            <ChevronRight class="w-4 h-4" />
          </NuxtLink>
        </div>
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
import { ChevronRight, PenLine } from 'lucide-vue-next'
import { HOME_HEADINGS } from '~/constants/seo'

const { fetchGroups, fetchStats, fetchPosts } = useBoard()

const avatarStack = ['#EE4D2D', '#26aa99', '#7B1FA2']

const [{ data: groups }, { data: stats }, { data: hotPosts }, { data: unanswered }] = await Promise.all([
  useAsyncData('home-board-groups', () => fetchGroups().catch(() => [])),
  useAsyncData('home-board-stats', () => fetchStats().catch(() => null)),
  useAsyncData('home-board-hot', () =>
    fetchPosts({ sort: 'hot', limit: 6 }).then((r) => r.items).catch(() => []),
  ),
  useAsyncData('home-board-unanswered', () =>
    fetchPosts({ group: 'ask', unanswered: true, sort: 'new', limit: 2 }).then((r) => r.items).catch(() => []),
  ),
])

const posts = computed(() => hotPosts.value || [])
const unansweredPosts = computed(() => unanswered.value || [])
const pending = computed(() => !groups.value && !hotPosts.value)
</script>

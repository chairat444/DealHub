<template>
  <div class="bg-page min-h-screen pb-10">
    <div class="board-header py-8">
      <div class="page-container">
        <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Trophy class="w-8 h-8" />
          Leaderboard นักล่าดีล
        </h1>
        <p class="text-white/85 mt-1">สมาชิกที่มี Deal Score สูงสุดในชุมชน</p>
      </div>
    </div>

    <div class="page-container py-6 max-w-2xl">
      <div v-if="pending" class="text-center py-16 text-content-muted">กำลังโหลด...</div>
      <div v-else class="space-y-2">
        <NuxtLink
          v-for="entry in entries"
          :key="entry.id"
          :to="entry.username ? `/profile/${entry.username}` : '#'"
          class="flex items-center gap-4 bg-surface border border-line rounded-xl p-4 hover:border-shopee/40 transition-colors"
          :class="entry.rank <= 3 ? 'border-shopee/30 bg-shopee/5' : ''"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
            :class="entry.rank === 1 ? 'bg-[#FFD600] text-shopee' : entry.rank <= 3 ? 'bg-shopee/20 text-accent' : 'bg-surface-muted text-content-muted'"
          >
            {{ entry.rank }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-content">{{ entry.displayName }}</div>
            <div class="text-xs text-content-muted">@{{ entry.username }} · {{ entry.postCount }} โพสต์</div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-lg font-bold text-accent">{{ entry.dealScore.toLocaleString() }}</div>
            <MemberTierBadge :tier="entry.tier" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy } from 'lucide-vue-next'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const leaderboardTitle = 'Leaderboard นักล่าดีล'
const leaderboardDescription = 'อันดับสมาชิก DealHub TH ที่มี Deal Score สูงสุดในชุมชน'

useSiteSeo({
  title: leaderboardTitle,
  description: leaderboardDescription,
  path: '/leaderboard',
  jsonLd: () => buildLeaderboardPageJsonLd(siteUrl, leaderboardTitle, leaderboardDescription),
})

const { fetchLeaderboard } = useMember()

const { data: entries, pending } = await useAsyncData(
  'leaderboard',
  () => fetchLeaderboard(20).catch(() => []),
)
</script>

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
          <p class="text-sm text-content-muted mt-0.5">ถามก่อนซื้อ · แชร์ดีล · อ่านรีวิวจากคนจริง</p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="hidden sm:flex items-center gap-3 text-sm text-content-muted mr-2">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <strong class="text-content">{{ totalActiveToday }}</strong> ออนไลน์วันนี้
          </span>
          <span><strong class="text-content">{{ totalPosts }}</strong>+ โพสต์</span>
        </div>
        <NuxtLink to="/board" class="btn-primary text-sm px-4 py-2.5 rounded-lg">
          เข้าร่วมบอร์ด
        </NuxtLink>
      </div>
    </div>

    <HomeBoardCommunity spotlight />
  </section>
</template>

<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { boardGroups, boardPreviewPosts } from '~/data/board-preview'
import { HOME_HEADINGS } from '~/constants/seo'

const totalActiveToday = boardGroups.reduce((sum, g) => sum + g.activeToday, 0)
const totalPosts = boardGroups.reduce((sum, g) => sum + g.postCount, 0)
</script>

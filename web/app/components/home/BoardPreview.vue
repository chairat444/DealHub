<template>
  <section class="bg-white rounded-lg px-4 py-3.5 h-full">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-[15px] font-bold text-shopee flex items-center gap-2">
        <MessageCircle class="w-[18px] h-[18px]" />
        โพสต์ล่าสุดจาก Board
      </h2>
      <NuxtLink to="/board" class="text-xs text-shopee flex items-center gap-0.5 hover:underline">
        ดูทั้งหมด
        <ChevronRight class="w-3 h-3" />
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-2">
      <article
        v-for="post in posts"
        :key="post.id"
        class="flex gap-2.5 p-2.5 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div
          class="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
          :style="{ background: post.avatarColor }"
        >
          {{ post.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-semibold text-gray-800">{{ post.username }}</span>
            <span
              v-if="post.badge"
              class="text-[9px] bg-[#FEF0ED] text-shopee px-1.5 py-px rounded font-bold"
            >
              {{ post.badge }}
            </span>
          </div>
          <p class="text-xs text-gray-600 mt-0.5 truncate">{{ post.title }}</p>
          <div class="flex gap-2.5 mt-1 text-[11px] text-gray-400">
            <span class="flex items-center gap-0.5">
              <ArrowUp class="w-3 h-3" />
              {{ post.upvotes }}
            </span>
            <span class="flex items-center gap-0.5">
              <MessageCircle class="w-3 h-3" />
              {{ post.comments }}
            </span>
            <span class="flex items-center gap-0.5">
              <Clock class="w-3 h-3" />
              {{ post.timeAgo }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUp, ChevronRight, Clock, MessageCircle } from 'lucide-vue-next'
import type { BoardPreviewPost } from '~/data/board-preview'

defineProps<{
  posts: BoardPreviewPost[]
}>()
</script>

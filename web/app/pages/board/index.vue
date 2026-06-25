<template>
  <div class="bg-page min-h-screen pb-8">
    <div class="bg-gradient-to-r from-shopee to-[#FF6633] text-white py-6">
      <div class="page-container">
        <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MessageCircle class="w-7 h-7" />
          บอร์ดชุมชน
        </h1>
        <p class="text-base text-white/85 mt-1">
          พูดคุยกับคนไทย — อ่านรีวิว ถามก่อนซื้อ แชร์ประสบการณ์ช้อปออนไลน์
        </p>
      </div>
    </div>

    <div class="page-container py-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          v-for="group in groups"
          :key="group.id"
          type="button"
          class="text-left p-3 rounded-xl border-2 transition-all"
          :class="activeGroup === group.id ? 'border-current shadow-md' : 'border-line bg-surface hover:shadow-sm'"
          :style="{ background: activeGroup === group.id ? group.bg : undefined }"
          @click="activeGroup = group.id"
        >
          <span class="text-2xl">{{ group.icon }}</span>
          <div class="text-sm font-bold text-content mt-1">{{ group.name }}</div>
          <div class="text-xs text-content-muted">{{ group.postCount.toLocaleString() }} โพสต์</div>
        </button>
      </div>

      <div class="space-y-3">
        <article
          v-for="post in visiblePosts"
          :key="post.id"
          class="bg-surface rounded-xl p-4 border border-line hover:border-shopee/30 hover:shadow-sm transition-all"
        >
          <div class="flex gap-3">
            <div
              class="w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
              :style="{ background: post.avatarColor }"
            >
              {{ post.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-base font-semibold">{{ post.username }}</span>
                <span
                  class="text-xs px-2 py-0.5 rounded font-semibold"
                  :style="{ background: getGroupById(post.groupId)?.bg, color: getGroupById(post.groupId)?.color }"
                >
                  {{ getGroupById(post.groupId)?.icon }} {{ getGroupById(post.groupId)?.name }}
                </span>
                <span v-if="post.isHot" class="text-xs bg-shopee text-white px-2 py-0.5 rounded font-bold">HOT</span>
              </div>
              <h2 class="text-base font-medium text-content mt-1">{{ post.title }}</h2>
              <p v-if="post.excerpt" class="text-sm text-content-muted mt-1">{{ post.excerpt }}</p>
              <div class="flex gap-4 mt-2 text-sm text-content-muted">
                <span>↑ {{ post.upvotes }}</span>
                <span>💬 {{ post.comments }}</span>
                <span>{{ post.timeAgo }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <NuxtLink to="/auth/login" class="btn-primary block text-center mt-6">
        เข้าสู่ระบบเพื่อสร้างโพสต์
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import {
  boardGroups,
  getGroupById,
  getPostsByGroup,
  type BoardGroupId,
} from '~/data/board-preview'

useSiteSeo({
  title: 'บอร์ดชุมชน',
  description: 'พูดคุยกับคนไทย แชร์รีวิวสินค้า เทียบราคา และแนะนำของดีจาก Shopee, Lazada, TikTok Shop',
  path: '/board',
})

const route = useRoute()
const groups = boardGroups

const initialGroup = (route.query.group as BoardGroupId) || 'recommend'
const activeGroup = ref<BoardGroupId>(initialGroup)

const visiblePosts = computed(() => getPostsByGroup(activeGroup.value, 20))
</script>

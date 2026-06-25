<template>
  <section
    class="overflow-hidden border border-line bg-gradient-to-br from-[#FFF6F4] via-surface to-[#FFF9E6] dark:bg-surface dark:from-surface dark:via-surface dark:to-surface"
    :class="[
      spotlight
        ? 'rounded-b-xl border-t-0'
        : compact
          ? 'h-full flex flex-col rounded-xl'
          : 'rounded-xl mb-2.5',
      !spotlight && !compact ? 'border-[#F5C4B8] dark:border-line' : '',
    ]"
  >
    <div
      v-if="!spotlight"
      class="board-header"
      :class="compact ? 'px-4 py-3' : 'px-4 py-4'"
    >
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <Users class="w-5 h-5 shrink-0" />
            <h2 class="font-bold truncate" :class="compact ? 'text-base' : 'text-xl'">
              บอร์ดชุมชน
            </h2>
          </div>
          <NuxtLink
            to="/board?compose=1"
            class="badge-hot text-sm font-bold px-3 py-2 rounded-lg shrink-0 transition-colors hover:opacity-90"
          >
            + โพสต์
          </NuxtLink>
        </div>
        <p v-if="!compact" class="text-base text-white/90">
          พูดคุยกับคนไทย — แชร์รีวิว เทียบราคา ถามก่อนซื้อ
        </p>
        <div class="flex gap-3 text-sm text-white/85">
          <span class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            {{ totalActiveToday }} วันนี้
          </span>
          <span>{{ groups.length }} กลุ่ม</span>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col" :class="spotlight ? 'p-3.5 bg-gradient-to-b from-[#FFF8F6] to-surface dark:from-surface dark:to-surface' : compact ? 'p-3' : 'p-4'">
      <div v-if="loading" class="text-center py-10 text-content-muted text-sm">กำลังโหลดชุมชน...</div>

      <template v-else>
        <!-- Featured hot post -->
        <NuxtLink
          v-if="spotlight && featuredPost"
          :to="`/board/posts/${featuredPost.id}`"
          class="mb-3.5 block rounded-xl border-2 border-shopee/25 bg-surface overflow-hidden hover:border-shopee/50 hover:shadow-md transition-all group"
        >
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-shopee/15 to-amber-100/50 dark:from-shopee/20 dark:to-transparent">
            <span class="text-xs font-bold text-shopee dark:text-[rgb(var(--accent-display))]">🔥 โพสต์ยอดนิยมวันนี้</span>
            <span class="text-xs bg-shopee text-white px-1.5 py-0.5 rounded font-bold">HOT</span>
          </div>
          <div class="flex items-start gap-3 p-3">
            <div
              class="w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-surface shadow-sm"
              :style="{ background: featuredPost.avatarColor }"
            >
              {{ featuredPost.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-xs text-content-muted">{{ featuredPost.groupIcon }} {{ featuredPost.groupName }}</span>
              <h3 class="text-sm font-bold text-content mt-0.5 leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {{ featuredPost.title }}
              </h3>
              <div class="flex gap-3 mt-1.5 text-xs text-content-muted">
                <span class="text-accent font-semibold">↑ {{ featuredPost.upvotes }}</span>
                <span>💬 {{ featuredPost.comments }}</span>
                <span>{{ featuredPost.timeAgo }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Quick play -->
        <div v-if="spotlight" class="grid grid-cols-3 gap-2 mb-3.5">
          <NuxtLink
            to="/board?group=ask&compose=1"
            class="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-line bg-surface hover:border-shopee/40 hover:bg-shopee/5 hover:shadow-sm transition-all text-center"
          >
            <span class="text-xl">❓</span>
            <span class="text-[11px] font-semibold text-content leading-tight">ถามก่อนซื้อ</span>
          </NuxtLink>
          <NuxtLink
            to="/board?group=deals&compose=1"
            class="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-line bg-surface hover:border-shopee/40 hover:bg-shopee/5 hover:shadow-sm transition-all text-center"
          >
            <span class="text-xl">🏷️</span>
            <span class="text-[11px] font-semibold text-content leading-tight">แชร์ดีล</span>
          </NuxtLink>
          <NuxtLink
            to="/board?group=review&compose=1"
            class="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-line bg-surface hover:border-shopee/40 hover:bg-shopee/5 hover:shadow-sm transition-all text-center"
          >
            <span class="text-xl">⭐</span>
            <span class="text-[11px] font-semibold text-content leading-tight">รีวิวของดี</span>
          </NuxtLink>
        </div>

        <!-- Hot topics -->
        <div v-if="spotlight" class="mb-3.5">
          <h3 class="text-xs font-bold text-content-muted mb-2 flex items-center gap-1">
            <Flame class="w-3.5 h-3.5 text-shopee" />
            หัวข้อมาแรง
          </h3>
          <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-0.5 px-0.5">
            <button
              v-for="group in hotGroups"
              :key="group.slug"
              type="button"
              class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border-2 whitespace-nowrap shrink-0 transition-all hover:scale-[1.02] board-group-card"
              :class="[
                activeGroup === group.slug ? 'is-active font-bold shadow-sm' : 'opacity-90 hover:opacity-100 border-transparent',
              ]"
              :style="cardStyle(group, activeGroup === group.slug)"
              @click="activeGroup = group.slug"
            >
              <span class="text-base">{{ group.icon }}</span>
              {{ group.name }}
              <span class="opacity-70">{{ group.activeToday }}+</span>
            </button>
          </div>
        </div>

        <!-- Unanswered questions -->
        <div v-if="spotlight && unansweredPosts.length" class="mb-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-surface p-3">
          <div class="flex items-center justify-between gap-2 mb-2">
            <h3 class="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <HelpCircle class="w-4 h-4" />
              ใครช่วยตอบหน่อย?
            </h3>
            <NuxtLink to="/board?group=ask" class="text-xs font-semibold text-shopee hover:underline shrink-0">
              ดูทั้งหมด →
            </NuxtLink>
          </div>
          <div class="space-y-1.5">
            <NuxtLink
              v-for="post in unansweredPosts"
              :key="post.id"
              :to="`/board/posts/${post.id}`"
              class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/80 dark:bg-surface border border-amber-100 dark:border-line hover:border-shopee/40 hover:shadow-sm transition-all group"
            >
              <div
                class="w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                :style="{ background: post.avatarColor }"
              >
                {{ post.initials }}
              </div>
              <p class="flex-1 min-w-0 text-sm font-medium text-content line-clamp-1 group-hover:text-accent transition-colors">
                {{ post.title }}
              </p>
              <span class="text-[10px] font-bold text-shopee shrink-0 px-2 py-1 rounded-full bg-shopee/10 group-hover:bg-shopee/20 transition-colors">
                ตอบเลย
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Groups (non-spotlight) -->
        <div v-if="!spotlight && groups.length" class="mb-3">
          <h3 v-if="!compact" class="text-sm font-bold text-content-muted mb-2">
            เลือกกลุ่มที่สนใจ
          </h3>
          <div
            class="gap-2"
            :class="compact
              ? 'flex overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1'
              : 'grid grid-cols-2 sm:grid-cols-4 gap-2'"
          >
            <button
              v-for="group in groups"
              :key="group.slug"
              type="button"
              class="text-left rounded-xl border-2 transition-all duration-150"
              :class="[
                compact ? 'shrink-0 w-[145px] p-3' : 'p-3.5',
                ...cardClass(activeGroup === group.slug),
                activeGroup !== group.slug
                  ? 'border-transparent hover:border-line hover:shadow-sm'
                  : 'border-current shadow-md',
              ]"
              :style="cardStyle(group, activeGroup === group.slug)"
              @click="activeGroup = group.slug"
            >
              <span :class="compact ? 'text-xl' : 'text-2xl'">{{ group.icon }}</span>
              <div class="text-sm font-bold text-content mt-1 leading-tight">{{ group.name }}</div>
              <div v-if="!compact" class="text-xs text-content-muted mt-0.5 line-clamp-1">{{ group.description }}</div>
              <div class="text-xs font-semibold mt-1.5" :class="activeGroup === group.slug ? 'text-accent' : 'text-content-muted'">
                {{ group.activeToday }}+ วันนี้
              </div>
            </button>
          </div>
        </div>

        <!-- Posts -->
        <div v-if="spotlight">
          <h3 class="text-xs font-bold text-content-muted mb-2 flex items-center gap-1">
            <MessageSquare class="w-3.5 h-3.5" />
            {{ activeGroupData ? `กำลังคุยใน${activeGroupData.name}` : 'โพสต์ที่น่าสนใจ' }}
          </h3>
        </div>

        <div
          :class="spotlight
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-2'
            : compact
              ? 'space-y-2 flex-1'
              : 'grid grid-cols-1 md:grid-cols-2 gap-2.5'"
        >
          <NuxtLink
            v-for="post in visiblePosts"
            :key="post.id"
            :to="`/board/posts/${post.id}`"
            class="group transition-all"
            :class="spotlight
              ? 'flex gap-2.5 p-2.5 rounded-xl bg-surface border border-line hover:border-shopee/40 hover:shadow-md hover:-translate-y-0.5'
              : 'flex gap-2.5 bg-surface rounded-xl border border-line hover:border-shopee/40 hover:shadow-sm p-2.5'"
          >
            <div
              class="rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
              :class="spotlight ? 'w-9 h-9' : 'w-9 h-9'"
              :style="{ background: post.avatarColor }"
            >
              {{ post.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="text-xs font-semibold text-content">{{ post.username }}</span>
                <span v-if="post.isHot" class="text-[10px] bg-shopee text-white px-1 py-px rounded font-bold">HOT</span>
                <span v-if="spotlight" class="text-[10px] text-content-muted">{{ post.groupIcon }}</span>
              </div>
              <p
                class="text-sm font-medium text-content mt-0.5 group-hover:text-accent transition-colors"
                :class="spotlight ? 'line-clamp-2 leading-snug' : 'line-clamp-2 mt-1'"
              >
                {{ post.title }}
              </p>
              <div class="flex gap-2 mt-1 text-xs text-content-muted">
                <span class="text-accent font-semibold">↑ {{ post.upvotes }}</span>
                <span>💬 {{ post.comments }}</span>
                <span>{{ post.timeAgo }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-3.5 flex flex-col sm:flex-row gap-2" :class="spotlight ? '' : 'mt-3'">
          <NuxtLink
            :to="`/board${activeGroup !== 'all' ? `?group=${activeGroup}` : ''}`"
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-primary text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            เข้าไปอ่านต่อใน{{ activeGroupData?.name || 'บอร์ด' }}
            <ChevronRight class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            v-if="spotlight"
            to="/board?compose=1"
            class="sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-dashed border-shopee/35 text-accent text-sm font-semibold hover:bg-shopee/10 transition-colors"
          >
            <PenLine class="w-4 h-4" />
            สร้างโพสต์ของคุณ
          </NuxtLink>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, Flame, HelpCircle, MessageSquare, PenLine, Users } from 'lucide-vue-next'
import type { BoardGroup, BoardPost, BoardGroupSlug } from '~/types/board'

const props = withDefaults(defineProps<{
  groups: BoardGroup[]
  posts: BoardPost[]
  unansweredPosts?: BoardPost[]
  compact?: boolean
  spotlight?: boolean
  loading?: boolean
}>(), {
  unansweredPosts: () => [],
  compact: false,
  spotlight: false,
  loading: false,
})

const { cardStyle, cardClass } = useBoardGroupStyle()

const activeGroup = ref<BoardGroupSlug | 'all'>('all')

const activeGroupData = computed(() =>
  activeGroup.value === 'all'
    ? null
    : props.groups.find((g) => g.slug === activeGroup.value) ?? null,
)

const postLimit = computed(() => {
  if (props.spotlight) return 4
  if (props.compact) return 3
  return 4
})

const filteredPosts = computed(() => {
  if (activeGroup.value === 'all') return props.posts
  return props.posts.filter((p) => p.groupSlug === activeGroup.value)
})

const featuredPost = computed(() =>
  props.posts.find((p) => p.isHot) ?? props.posts[0],
)

const visiblePosts = computed(() => {
  const list = filteredPosts.value
  if (props.spotlight && featuredPost.value) {
    return list.filter((p) => p.id !== featuredPost.value!.id).slice(0, postLimit.value)
  }
  return list.slice(0, postLimit.value)
})

const totalActiveToday = computed(() =>
  props.groups.reduce((sum, g) => sum + g.activeToday, 0),
)

const hotGroups = computed(() =>
  [...props.groups].sort((a, b) => b.activeToday - a.activeToday).slice(0, 5),
)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

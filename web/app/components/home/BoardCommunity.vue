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

    <div class="flex-1 flex flex-col" :class="spotlight ? 'p-4 md:p-5' : compact ? 'p-3' : 'p-4'">
      <div v-if="loading" class="text-center py-10 text-content-muted text-sm">กำลังโหลดชุมชน...</div>

      <template v-else>
        <!-- Featured hot post -->
        <NuxtLink
          v-if="spotlight && featuredPost"
          :to="`/board/posts/${featuredPost.id}`"
          class="mb-4 p-4 rounded-xl border-2 border-shopee/25 bg-surface hover:border-shopee/50 hover:shadow-md transition-all group block"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-12 h-12 rounded-full text-white text-base font-bold flex items-center justify-center shrink-0"
              :style="{ background: featuredPost.avatarColor }"
            >
              {{ featuredPost.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-accent uppercase tracking-wide">โพสต์ยอดนิยมวันนี้</span>
                <span class="text-xs bg-shopee text-white px-2 py-0.5 rounded font-bold">HOT</span>
                <span class="text-xs bg-surface-muted text-content-muted px-2 py-0.5 rounded">
                  {{ featuredPost.groupIcon }} {{ featuredPost.groupName }}
                </span>
              </div>
              <h3 class="text-base md:text-lg font-bold text-content mt-1.5 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                {{ featuredPost.title }}
              </h3>
              <p v-if="featuredPost.excerpt" class="text-sm text-content-muted mt-1 line-clamp-1">
                {{ featuredPost.excerpt }}
              </p>
              <div class="flex gap-3 mt-2 text-sm text-content-muted">
                <span class="text-accent font-semibold">↑ {{ featuredPost.upvotes }}</span>
                <span>💬 {{ featuredPost.comments }}</span>
                <span>{{ featuredPost.timeAgo }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Unanswered questions -->
        <div v-if="spotlight && unansweredPosts.length" class="mb-4 p-3 rounded-xl bg-[#F3E5F5]/60 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/40">
          <h3 class="text-sm font-bold text-content flex items-center gap-1.5 mb-2">
            <span>❓</span> คำถามรอคำตอบ — มาช่วยตอบกัน!
          </h3>
          <div class="space-y-2">
            <NuxtLink
              v-for="post in unansweredPosts"
              :key="post.id"
              :to="`/board/posts/${post.id}`"
              class="block text-sm text-content hover:text-accent transition-colors line-clamp-1"
            >
              {{ post.title }}
            </NuxtLink>
          </div>
        </div>

        <!-- Hot topics -->
        <div v-if="spotlight" class="mb-4">
          <h3 class="text-sm font-bold text-content-muted mb-2">หัวข้อยอดนิยม</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="group in hotGroups"
              :key="group.slug"
              type="button"
              class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all"
              :class="activeGroup === group.slug
                ? 'border-shopee bg-shopee/10 text-accent font-semibold'
                : 'border-line bg-surface text-content-muted hover:border-shopee/30 hover:text-content'"
              @click="activeGroup = group.slug"
            >
              <span>{{ group.icon }}</span>
              {{ group.name }}
              <span class="text-xs opacity-70">{{ group.activeToday }}+</span>
            </button>
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
          <h3 class="text-sm font-bold text-content-muted mb-2">
            {{ activeGroupData ? `โพสต์ใน${activeGroupData.name}` : 'โพสต์ล่าสุด' }}
          </h3>
        </div>

        <div
          :class="spotlight
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
            : compact
              ? 'space-y-2 flex-1'
              : 'grid grid-cols-1 md:grid-cols-2 gap-2.5'"
        >
          <NuxtLink
            v-for="post in visiblePosts"
            :key="post.id"
            :to="`/board/posts/${post.id}`"
            class="flex gap-2.5 bg-surface rounded-xl border border-line hover:border-shopee/40 hover:shadow-sm transition-all group"
            :class="spotlight ? 'p-3.5 flex-col sm:flex-row' : 'p-2.5'"
          >
            <div class="flex gap-2.5" :class="spotlight ? 'w-full' : ''">
              <div
                class="rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
                :class="spotlight ? 'w-10 h-10' : 'w-9 h-9'"
                :style="{ background: post.avatarColor }"
              >
                {{ post.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1 flex-wrap">
                  <span class="text-sm font-semibold text-content">{{ post.username }}</span>
                  <span v-if="post.isHot" class="text-xs bg-shopee text-white px-1.5 py-0.5 rounded font-bold">HOT</span>
                </div>
                <p
                  class="font-medium text-content mt-1 group-hover:text-accent transition-colors"
                  :class="spotlight ? 'text-sm line-clamp-3 min-h-[3.75rem]' : 'text-sm line-clamp-2'"
                >
                  {{ post.title }}
                </p>
                <div class="flex gap-2 mt-1.5 text-sm text-content-muted">
                  <span class="text-accent font-semibold">↑ {{ post.upvotes }}</span>
                  <span>💬 {{ post.comments }}</span>
                  <span>{{ post.timeAgo }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div
          class="mt-4 flex flex-col sm:flex-row gap-2"
          :class="spotlight ? '' : 'mt-3'"
        >
          <NuxtLink
            :to="`/board${activeGroup !== 'all' ? `?group=${activeGroup}` : ''}`"
            class="flex-1 flex items-center justify-center gap-1 py-3 rounded-lg border-2 border-dashed border-shopee/30 text-accent text-sm font-semibold hover:bg-shopee/10 dark:hover:bg-shopee/20 transition-colors"
          >
            อ่านโพสต์{{ activeGroupData?.name ? `ใน${activeGroupData.name}` : 'ทั้งหมด' }}
            <ChevronRight class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            v-if="spotlight"
            to="/board?compose=1"
            class="flex-1 flex items-center justify-center gap-1 py-3 rounded-lg btn-primary text-sm"
          >
            <PenLine class="w-4 h-4" />
            สร้างโพสต์ใหม่
          </NuxtLink>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, PenLine, Users } from 'lucide-vue-next'
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
  if (props.spotlight) return 6
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
  [...props.groups].sort((a, b) => b.activeToday - a.activeToday).slice(0, 6),
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

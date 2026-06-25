<template>
  <section
    class="rounded-xl overflow-hidden border border-[#F5C4B8] dark:border-line bg-gradient-to-br from-[#FFF6F4] via-surface to-[#FFF9E6] dark:bg-surface dark:from-surface dark:via-surface dark:to-surface"
    :class="compact ? 'h-full flex flex-col' : 'mb-2.5'"
  >
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-shopee to-[#FF6633] text-white"
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
            to="/board"
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

    <div class="p-4 flex-1 flex flex-col" :class="compact ? 'p-3' : 'p-4'">
      <!-- Groups: horizontal scroll when compact -->
      <div class="mb-3">
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
            :key="group.id"
            type="button"
            class="text-left rounded-xl border-2 transition-all duration-150"
            :class="[
              compact ? 'shrink-0 w-[145px] p-3' : 'p-3.5',
              ...cardClass(activeGroup === group.id),
              activeGroup !== group.id
                ? 'border-transparent hover:border-line hover:shadow-sm'
                : 'border-current shadow-md',
            ]"
            :style="cardStyle(group, activeGroup === group.id)"
            @click="activeGroup = group.id"
          >
            <span :class="compact ? 'text-xl' : 'text-2xl'">{{ group.icon }}</span>
            <div class="text-sm font-bold text-content mt-1 leading-tight">{{ group.name }}</div>
            <div v-if="!compact" class="text-xs text-content-muted mt-0.5 line-clamp-1">{{ group.description }}</div>
            <div class="text-xs font-semibold mt-1.5" :class="activeGroup === group.id ? 'text-shopee' : 'text-content-muted'">
              {{ group.activeToday }}+ วันนี้
            </div>
          </button>
        </div>
      </div>

      <!-- Posts -->
      <div :class="compact ? 'space-y-2 flex-1' : 'grid grid-cols-1 md:grid-cols-2 gap-2.5'">
        <NuxtLink
          v-for="post in visiblePosts"
          :key="post.id"
          :to="`/board?group=${post.groupId}`"
          class="flex gap-2.5 p-2.5 bg-surface rounded-xl border border-line hover:border-shopee/40 hover:shadow-sm transition-all group"
        >
          <div
            class="w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
            :style="{ background: post.avatarColor }"
          >
            {{ post.initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1 flex-wrap">
              <span class="text-sm font-semibold text-content">{{ post.username }}</span>
              <span v-if="post.isHot" class="text-xs bg-shopee text-white px-1.5 py-0.5 rounded font-bold">HOT</span>
            </div>
            <p class="text-sm font-medium text-content mt-1 line-clamp-2 group-hover:text-shopee transition-colors">
              {{ post.title }}
            </p>
            <div class="flex gap-2 mt-1.5 text-sm text-content-muted">
              <span class="text-shopee font-semibold">↑ {{ post.upvotes }}</span>
              <span>💬 {{ post.comments }}</span>
              <span>{{ post.timeAgo }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <NuxtLink
        :to="`/board${activeGroup !== 'all' ? `?group=${activeGroup}` : ''}`"
        class="mt-3 flex items-center justify-center gap-1 w-full py-2.5 rounded-lg border-2 border-dashed border-shopee/30 text-shopee text-sm font-semibold hover:bg-shopee/10 dark:hover:bg-shopee/20 transition-colors"
      >
        เข้าร่วม{{ activeGroupData?.name ? ` ${activeGroupData.name}` : 'บอร์ดชุมชน' }}
        <ChevronRight class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight, Users } from 'lucide-vue-next'
import {
  boardGroups,
  getGroupById,
  getPostsByGroup,
  type BoardGroupId,
} from '~/data/board-preview'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const { cardStyle, cardClass } = useBoardGroupStyle()

const groups = boardGroups
const activeGroup = ref<BoardGroupId | 'all'>('recommend')

const activeGroupData = computed(() =>
  activeGroup.value === 'all' ? null : getGroupById(activeGroup.value),
)

const visiblePosts = computed(() =>
  getPostsByGroup(activeGroup.value, props.compact ? 3 : 4),
)

const totalActiveToday = computed(() =>
  groups.reduce((sum, g) => sum + g.activeToday, 0),
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

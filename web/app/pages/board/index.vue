<template>
  <div class="bg-page min-h-screen pb-8">
    <div class="board-header py-6">
      <div class="page-container">
        <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MessageCircle class="w-7 h-7" aria-hidden="true" />
          {{ HOME_HEADINGS.board }}
        </h1>
        <p class="text-base text-white/85 mt-1">
          พูดคุยกับคนไทย — อ่านรีวิว ถามก่อนซื้อ แชร์ประสบการณ์ช้อปออนไลน์
        </p>

        <div v-if="stats" class="flex flex-wrap gap-4 mt-4 text-sm text-white/90">
          <span>👥 สมาชิก <strong>{{ stats.memberCount.toLocaleString() }}</strong></span>
          <span>📝 โพสต์ <strong>{{ stats.postCount.toLocaleString() }}</strong></span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <strong>{{ stats.activeToday }}</strong> ออนไลน์วันนี้
          </span>
          <span v-if="latestLabel">{{ latestLabel }}</span>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" class="btn-primary text-sm px-4 py-2.5" @click="openCompose">
            <PenLine class="w-4 h-4 inline mr-1" />
            สร้างโพสต์ใหม่
          </button>
          <div class="flex-1 min-w-[200px] bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <ShareButtons
              compact
              title="บอร์ดชุมชน DealHub TH"
              text="พูดคุย แชร์รีวิว และเทียบราคาสินค้ากับคนไทย"
              path="/board"
              label="แชร์บอร์ดนี้"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="page-container py-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          v-for="group in groups || []"
          :key="group.slug"
          type="button"
          class="text-left p-3 rounded-xl border-2 transition-all"
          :class="[
            ...cardClass(activeGroup === group.slug),
            activeGroup === group.slug ? 'border-current shadow-md' : 'border-line bg-surface hover:shadow-sm',
          ]"
          :style="cardStyle(group, activeGroup === group.slug)"
          @click="activeGroup = group.slug"
        >
          <span class="text-2xl">{{ group.icon }}</span>
          <div class="text-sm font-bold text-content mt-1">{{ group.name }}</div>
          <div class="text-xs text-content-muted">{{ group.postCount.toLocaleString() }} โพสต์</div>
        </button>
      </div>

      <div class="flex gap-2 mb-4">
        <button
          v-for="tab in sortTabs"
          :key="tab.value"
          type="button"
          class="text-sm px-3 py-1.5 rounded-lg border transition-colors"
          :class="sort === tab.value
            ? 'border-shopee bg-shopee/10 text-accent font-semibold'
            : 'border-line text-content-muted hover:border-shopee/30'"
          @click="sort = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="postsPending" class="text-center py-16 text-content-muted">กำลังโหลด...</div>
      <div v-else-if="!posts?.items.length" class="text-center py-16 text-content-muted">
        ยังไม่มีโพสต์ในกลุ่มนี้ — เป็นคนแรกที่โพสต์เลย!
      </div>
      <div v-else class="space-y-3">
        <article
          v-for="post in posts.items"
          :key="post.id"
          class="bg-surface rounded-xl p-4 border border-line hover:border-shopee/30 hover:shadow-sm transition-all"
        >
          <NuxtLink :to="`/board/posts/${post.id}`" class="block">
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
                    :style="{ background: post.groupBg, color: post.groupColor }"
                  >
                    {{ post.groupIcon }} {{ post.groupName }}
                  </span>
                  <span v-if="post.isHot" class="text-xs bg-shopee text-white px-2 py-0.5 rounded font-bold">HOT</span>
                </div>
                <h2 class="text-base font-medium text-content mt-1 hover:text-accent transition-colors">{{ post.title }}</h2>
                <p v-if="post.excerpt" class="text-sm text-content-muted mt-1 line-clamp-2">{{ post.excerpt }}</p>
                <div class="flex gap-4 mt-2 text-sm text-content-muted">
                  <span class="text-accent font-semibold">↑ {{ post.upvotes }}</span>
                  <span>💬 {{ post.comments }}</span>
                  <span>{{ post.timeAgo }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>

    <!-- Compose modal -->
    <div
      v-if="showCompose"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      @click.self="showCompose = false"
    >
      <div class="bg-surface rounded-xl w-full max-w-lg p-5 border border-line shadow-xl">
        <h2 class="text-lg font-bold text-content mb-4">สร้างโพสต์ใหม่</h2>

        <div v-if="!authStore.isLoggedIn" class="text-center py-6">
          <p class="text-content-muted mb-4">เข้าสู่ระบบเพื่อสร้างโพสต์</p>
          <NuxtLink to="/auth/login" class="btn-primary inline-block">เข้าสู่ระบบ</NuxtLink>
        </div>

        <form v-else class="space-y-3" @submit.prevent="submitPost">
          <div>
            <label class="text-sm font-medium text-content">กลุ่ม</label>
            <select v-model="compose.groupSlug" class="w-full mt-1 border border-line rounded-lg px-3 py-2 bg-surface text-content">
              <option v-for="g in groups || []" :key="g.slug" :value="g.slug">
                {{ g.icon }} {{ g.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-content">หัวข้อ</label>
            <input
              v-model="compose.title"
              type="text"
              maxlength="200"
              required
              class="w-full mt-1 border border-line rounded-lg px-3 py-2 bg-surface text-content"
              placeholder="ถามหรือแชร์เรื่องที่อยากพูดคุย..."
            />
          </div>
          <div>
            <label class="text-sm font-medium text-content">รายละเอียด (ไม่บังคับ)</label>
            <textarea
              v-model="compose.body"
              rows="4"
              maxlength="5000"
              class="w-full mt-1 border border-line rounded-lg px-3 py-2 bg-surface text-content resize-none"
              placeholder="เล่าเพิ่มเติม แนบลิงก์ หรือรายละเอียดสินค้า..."
            />
          </div>
          <p v-if="composeError" class="text-sm text-red-600">{{ composeError }}</p>
          <div class="flex gap-2 pt-2">
            <button type="button" class="btn-outline flex-1" @click="showCompose = false">ยกเลิก</button>
            <button type="submit" class="btn-primary flex-1" :disabled="composing">
              {{ composing ? 'กำลังโพสต์...' : 'โพสต์เลย' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, PenLine } from 'lucide-vue-next'
import { HOME_HEADINGS } from '~/constants/seo'
import { formatBoardLatestLabel } from '~/composables/useBoard'
import type { BoardGroupSlug } from '~/types/board'

useSiteSeo({
  title: 'บอร์ดชุมชน — รีวิวและแนะนำสินค้า',
  description: 'พูดคุยกับคนไทย แชร์รีวิวสินค้า เทียบราคา และแนะนำของดีจาก Shopee, Lazada, TikTok Shop',
  path: '/board',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { fetchGroups, fetchStats, fetchPosts, createPost } = useBoard()
const { cardStyle, cardClass } = useBoardGroupStyle()

const sortTabs = [
  { value: 'hot' as const, label: '🔥 ยอดนิยม' },
  { value: 'new' as const, label: '🕐 ล่าสุด' },
]

const initialGroup = (route.query.group as BoardGroupSlug) || 'recommend'
const activeGroup = ref<BoardGroupSlug>(initialGroup)
const sort = ref<'hot' | 'new'>('hot')
const showCompose = ref(route.query.compose === '1')
const composing = ref(false)
const composeError = ref('')

const compose = reactive({
  groupSlug: initialGroup,
  title: '',
  body: '',
})

const { data: groups } = await useAsyncData('board-groups', () => fetchGroups().catch(() => []))
const { data: stats } = await useAsyncData('board-stats', () => fetchStats().catch(() => null))

const { data: posts, pending: postsPending, refresh: refreshPosts } = await useAsyncData(
  'board-posts',
  () => fetchPosts({ group: activeGroup.value, sort: sort.value, limit: 20 }).catch(() => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })),
  { watch: [activeGroup, sort] },
)

watch(activeGroup, (slug) => {
  compose.groupSlug = slug
  router.replace({ query: { ...route.query, group: slug } })
})

const latestLabel = computed(() =>
  stats.value ? formatBoardLatestLabel(stats.value.latestPostAt) : null,
)

function openCompose() {
  showCompose.value = true
}

async function submitPost() {
  if (!compose.title.trim()) return
  composing.value = true
  composeError.value = ''
  try {
    const post = await createPost({
      groupSlug: compose.groupSlug,
      title: compose.title.trim(),
      body: compose.body.trim() || undefined,
      excerpt: compose.body.trim().slice(0, 200) || undefined,
    }) as { id: string }
    showCompose.value = false
    compose.title = ''
    compose.body = ''
    await refreshPosts()
    await navigateTo(`/board/posts/${post.id}`)
  }
  catch {
    composeError.value = 'โพสต์ไม่สำเร็จ กรุณาลองใหม่'
  }
  finally {
    composing.value = false
  }
}
</script>

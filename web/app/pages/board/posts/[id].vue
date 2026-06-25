<template>
  <div class="bg-page min-h-screen pb-8">
    <div v-if="pending" class="page-container py-20 text-center text-content-muted">กำลังโหลด...</div>
    <div v-else-if="!post" class="page-container py-20 text-center">
      <p class="text-content-muted mb-4">ไม่พบโพสต์</p>
      <NuxtLink to="/board" class="btn-primary inline-block">กลับบอร์ด</NuxtLink>
    </div>

    <template v-else>
      <div class="page-container py-4 max-w-3xl">
        <NuxtLink to="/board" class="text-sm text-content-muted hover:text-accent mb-4 inline-flex items-center gap-1">
          ← กลับบอร์ด
        </NuxtLink>

        <article class="bg-surface rounded-xl border border-line p-5 md:p-6">
          <div class="flex gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-full text-white font-bold flex items-center justify-center shrink-0"
              :style="{ background: post.avatarColor }"
            >
              {{ post.initials }}
            </div>
            <div>
              <NuxtLink
                v-if="post.authorUsername"
                :to="`/profile/${post.authorUsername}`"
                class="font-semibold text-content hover:text-accent"
              >
                @{{ post.authorUsername }}
              </NuxtLink>
              <div v-else class="font-semibold text-content">{{ post.username }}</div>
              <div class="flex items-center gap-2 mt-1 flex-wrap text-sm">
                <span
                  class="text-xs px-2 py-0.5 rounded font-semibold"
                  :style="{ background: post.groupBg, color: post.groupColor }"
                >
                  {{ post.groupIcon }} {{ post.groupName }}
                </span>
                <span v-if="post.isHot" class="text-xs bg-shopee text-white px-2 py-0.5 rounded font-bold">HOT</span>
                <span class="text-content-muted">{{ post.timeAgo }}</span>
              </div>
            </div>
          </div>

          <h1 class="text-xl md:text-2xl font-bold text-content leading-snug">{{ post.title }}</h1>

          <p v-if="post.body" class="text-content mt-4 whitespace-pre-line leading-relaxed">{{ post.body }}</p>
          <p v-else-if="post.excerpt" class="text-content-muted mt-4">{{ post.excerpt }}</p>

          <NuxtLink
            v-if="post.product"
            :to="`/products/${post.product.slug}`"
            class="mt-4 flex items-center gap-3 p-3 rounded-lg border border-line hover:border-shopee/40 transition-colors"
          >
            <img
              v-if="post.product.imageUrl"
              :src="post.product.imageUrl"
              :alt="post.product.name"
              class="w-14 h-14 object-cover rounded"
            >
            <div>
              <div class="text-xs text-content-muted">สินค้าที่เกี่ยวข้อง</div>
              <div class="text-sm font-semibold text-content">{{ post.product.name }}</div>
            </div>
          </NuxtLink>

          <div class="flex items-center gap-3 mt-6 pt-4 border-t border-line">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors"
              :class="localHasUpvoted
                ? 'border-shopee bg-shopee/10 text-accent'
                : 'border-line text-content-muted hover:border-shopee/40'"
              :disabled="!authStore.isLoggedIn || upvoting"
              @click="handleUpvote"
            >
              ↑ {{ localUpvotes }}
              <span class="hidden sm:inline">{{ localHasUpvoted ? 'โหวตแล้ว' : 'ถูกใจ' }}</span>
            </button>
            <span class="text-sm text-content-muted">💬 {{ post.comments.length }} ความคิดเห็น</span>
            <ShareButtons
              compact
              :title="post.title"
              :path="`/board/posts/${post.id}`"
              label="แชร์โพสต์นี้"
            />
            <button
              v-if="isOwner"
              type="button"
              class="text-sm text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
              :disabled="deleting"
              @click="handleDelete"
            >
              ลบโพสต์
            </button>
          </div>
        </article>

        <!-- Comments -->
        <section class="mt-6">
          <h2 class="text-lg font-bold text-content mb-4">ความคิดเห็น ({{ post.comments.length }})</h2>

          <div v-if="!authStore.isLoggedIn" class="bg-surface-muted rounded-xl p-4 text-center mb-4">
            <p class="text-content-muted text-sm mb-2">เข้าสู่ระบบเพื่อแสดงความคิดเห็น</p>
            <NuxtLink to="/auth/login" class="btn-primary text-sm inline-block">เข้าสู่ระบบ</NuxtLink>
          </div>

          <form v-else class="mb-6" @submit.prevent="submitComment">
            <textarea
              v-model="commentBody"
              rows="3"
              maxlength="2000"
              required
              class="w-full border border-line rounded-xl px-4 py-3 bg-surface text-content resize-none"
              placeholder="แสดงความคิดเห็น แนะนำ หรือแชร์ประสบการณ์..."
            />
            <button type="submit" class="btn-primary mt-2 text-sm" :disabled="commenting">
              {{ commenting ? 'กำลังส่ง...' : 'ส่งความคิดเห็น' }}
            </button>
          </form>

          <div class="space-y-3">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="bg-surface rounded-xl border border-line p-4"
            >
              <div class="flex gap-3">
                <div
                  class="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                  :style="{ background: comment.user.avatarColor }"
                >
                  {{ comment.user.initials }}
                </div>
                <div>
                  <div class="text-sm font-semibold text-content">{{ comment.user.username }}</div>
                  <div class="text-xs text-content-muted">{{ comment.timeAgo }}</div>
                  <p class="text-sm text-content mt-2 whitespace-pre-line">{{ comment.body }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BoardPostDetail } from '~/types/board'

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const { fetchPost, addComment, toggleUpvote, deletePost } = useBoard()

const postId = route.params.id as string
const commentBody = ref('')
const commenting = ref(false)
const upvoting = ref(false)
const deleting = ref(false)
const localUpvotes = ref(0)
const localHasUpvoted = ref(false)

const { data: post, pending, refresh } = await useAsyncData(
  `board-post-${postId}`,
  () => fetchPost(postId).catch(() => null),
)

watch(post, (p) => {
  if (p) {
    localUpvotes.value = p.upvotes
    localHasUpvoted.value = !!p.hasUpvoted
  }
}, { immediate: true })

useSiteSeo(computed(() => {
  const p = post.value
  const description = p?.excerpt ?? p?.body?.slice(0, 160) ?? 'อ่านโพสต์และความคิดเห็นจากชุมชน DealHub TH'
  const site = config.public.siteUrl as string
  return {
    title: p?.title ?? 'โพสต์บอร์ด',
    description,
    path: `/board/posts/${postId}`,
    jsonLd: p
      ? [
          buildDiscussionForumPostingJsonLd({
            id: p.id,
            title: p.title,
            body: p.body,
            excerpt: p.excerpt,
            createdAt: p.createdAt,
            authorName: p.authorUsername ? `@${p.authorUsername}` : p.username,
            upvotes: p.upvotes,
            commentCount: p.comments.length,
          }, site),
          buildBreadcrumbJsonLd([
            { name: 'หน้าแรก', path: '/' },
            { name: 'บอร์ดชุมชน', path: '/board' },
            { name: p.title, path: `/board/posts/${postId}` },
          ], site),
        ]
      : undefined,
  }
}))

const isOwner = computed(() =>
  authStore.isLoggedIn && post.value?.userId === authStore.user?.id,
)

async function handleDelete() {
  if (!confirm('ลบโพสต์นี้?')) return
  deleting.value = true
  try {
    await deletePost(postId)
    await navigateTo('/board')
  }
  finally {
    deleting.value = false
  }
}

async function handleUpvote() {
  if (!authStore.isLoggedIn) {
    await navigateTo('/auth/login')
    return
  }
  upvoting.value = true
  try {
    const result = await toggleUpvote(postId)
    localUpvotes.value = result.upvoteCount
    localHasUpvoted.value = result.upvoted
    if (post.value) {
      post.value.hasUpvoted = result.upvoted
      post.value.upvotes = result.upvoteCount
    }
  }
  finally {
    upvoting.value = false
  }
}

async function submitComment() {
  if (!commentBody.value.trim()) return
  commenting.value = true
  try {
    await addComment(postId, commentBody.value.trim())
    commentBody.value = ''
    await refresh()
  }
  finally {
    commenting.value = false
  }
}
</script>

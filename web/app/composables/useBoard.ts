import type {
  BoardGroup,
  BoardPostDetail,
  BoardPostList,
  BoardStats,
  BoardGroupSlug,
} from '~/types/board'

export function useBoard() {
  const { apiFetch } = useApi()

  const fetchGroups = () => apiFetch<BoardGroup[]>('/board/groups')
  const fetchStats = () => apiFetch<BoardStats>('/board/stats')

  const fetchPosts = (params?: {
    group?: BoardGroupSlug | 'all'
    sort?: 'hot' | 'new'
    unanswered?: boolean
    page?: number
    limit?: number
  }) => {
    const query: Record<string, string> = {}
    if (params?.group && params.group !== 'all') query.group = params.group
    if (params?.sort) query.sort = params.sort
    if (params?.unanswered) query.unanswered = 'true'
    if (params?.page) query.page = String(params.page)
    if (params?.limit) query.limit = String(params.limit)
    return apiFetch<BoardPostList>('/board/posts', { query })
  }

  const fetchPost = (id: string) => apiFetch<BoardPostDetail>(`/board/posts/${id}`)

  const createPost = (body: {
    groupSlug: string
    postType?: string
    title: string
    excerpt?: string
    body?: string
    productId?: string
    dealPrice?: number
    platform?: string
    affiliateUrl?: string
  }) => apiFetch('/board/posts', { method: 'POST', body })

  const updatePost = (postId: string, body: { title?: string; excerpt?: string; body?: string }) =>
    apiFetch(`/board/posts/${postId}`, { method: 'PATCH', body })

  const deletePost = (postId: string) =>
    apiFetch(`/board/posts/${postId}`, { method: 'DELETE' })

  const addComment = (postId: string, body: string) =>
    apiFetch(`/board/posts/${postId}/comments`, { method: 'POST', body: { body } })

  const toggleUpvote = (postId: string) =>
    apiFetch<{ upvoted: boolean; upvoteCount: number }>(`/board/posts/${postId}/upvote`, {
      method: 'POST',
    })

  return {
    fetchGroups,
    fetchStats,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    addComment,
    toggleUpvote,
  }
}

export function formatBoardLatestLabel(latestPostAt: string | null) {
  if (!latestPostAt) return null
  const diffMs = Date.now() - new Date(latestPostAt).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'โพสต์ล่าสุดเมื่อสักครู่'
  if (mins < 60) return `โพสต์ล่าสุด ${mins} นาทีที่แล้ว`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `โพสต์ล่าสุด ${hours} ชม. ที่แล้ว`
  return null
}

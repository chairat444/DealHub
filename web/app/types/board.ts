export interface BoardGroup {
  id: string
  slug: string
  name: string
  icon: string
  description: string
  color: string
  bg: string
  sortOrder: number
  postCount: number
  activeToday: number
}

export interface BoardPost {
  id: string
  groupId: string
  groupSlug: string
  groupName: string
  groupIcon: string
  groupColor: string
  groupBg: string
  username: string
  initials: string
  avatarColor: string
  title: string
  excerpt?: string | null
  body?: string | null
  upvotes: number
  comments: number
  isHot: boolean
  createdAt: string
  timeAgo: string
  hasUpvoted?: boolean
  userId?: string
  authorUsername?: string
  postType?: string
  product?: {
    id: string
    slug: string
    name: string
    imageUrl?: string | null
  } | null
}

export interface BoardComment {
  id: string
  body: string
  createdAt: string
  timeAgo: string
  user: {
    id: string
    name: string
    username: string
    initials: string
    avatarColor: string
  }
}

export interface BoardPostDetail extends BoardPost {
  body?: string | null
  comments: BoardComment[]
}

export interface BoardStats {
  memberCount: number
  postCount: number
  postsToday: number
  commentsToday: number
  activeToday: number
  latestPostAt: string | null
}

export interface BoardPostList {
  items: BoardPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BoardGroupSlug =
  | 'variety'
  | 'recommend'
  | 'compare'
  | 'deals'
  | 'review'
  | 'ask'
  | 'lifestyle'
  | 'newbie'

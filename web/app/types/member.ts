export type MemberTier = 'DEAL_HUNTER' | 'DEAL_SCOUT' | 'DEAL_MASTER' | 'DEAL_LEGEND'

export interface MemberProfile {
  id: string
  email?: string
  name: string
  username: string | null
  nickname: string | null
  displayName: string
  bio: string | null
  avatar: string | null
  dealScore: number
  tier: MemberTier
  tierLabel: string
  tierLabelEn?: string
  expertiseTags: string[]
  role: string
  memberSince: string
  stats: {
    postCount: number
    totalUpvotes: number
  }
  recentPosts?: {
    id: string
    title: string
    excerpt?: string | null
    upvotes: number
    comments: number
    timeAgo: string
    groupSlug: string
    groupName: string
    groupIcon: string
    postType: string
  }[]
}

export interface LeaderboardEntry {
  rank: number
  id: string
  username: string | null
  displayName: string
  avatar: string | null
  dealScore: number
  tier: MemberTier
  tierLabel: string
  postCount: number
}

import type { MemberTier } from '~/types/member'

export const MEMBER_TIER_META: Record<MemberTier, { th: string; en: string; color: string; minScore: number }> = {
  DEAL_HUNTER: { th: 'นักล่าดีล', en: 'Deal Hunter', color: '#9E9E9E', minScore: 0 },
  DEAL_SCOUT: { th: 'สายล่าดีล', en: 'Deal Scout', color: '#26aa99', minScore: 500 },
  DEAL_MASTER: { th: 'ปรมาจารย์ดีล', en: 'Deal Master', color: '#F57C00', minScore: 2000 },
  DEAL_LEGEND: { th: 'ตำนานดีล', en: 'Deal Legend', color: '#EE4D2D', minScore: 2000 },
}

export const EXPERTISE_OPTIONS = [
  { id: 'beauty', label: 'ความงาม', icon: '💄' },
  { id: 'electronics', label: 'ไอที', icon: '📱' },
  { id: 'deals', label: 'ดีล & โปร', icon: '🏷️' },
  { id: 'compare', label: 'เทียบราคา', icon: '⚖️' },
  { id: 'recommend', label: 'แนะนำของดี', icon: '⭐' },
  { id: 'newbie', label: 'มือใหม่', icon: '🌱' },
  { id: 'mom', label: 'แม่และเด็ก', icon: '👶' },
  { id: 'home', label: 'บ้านและชีวิต', icon: '🏡' },
] as const

export const POST_TYPE_OPTIONS = [
  { value: 'DISCUSSION', label: 'พูดคุยทั่วไป', icon: '💬' },
  { value: 'DEAL', label: 'แชร์ดีล', icon: '🏷️' },
  { value: 'REVIEW', label: 'รีวิวใช้จริง', icon: '📝' },
] as const

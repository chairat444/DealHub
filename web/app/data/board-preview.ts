export type BoardGroupId =
  | 'variety'
  | 'recommend'
  | 'compare'
  | 'deals'
  | 'review'
  | 'ask'
  | 'lifestyle'
  | 'newbie'

export interface BoardGroup {
  id: BoardGroupId
  name: string
  icon: string
  description: string
  color: string
  bg: string
  postCount: number
  activeToday: number
}

export interface BoardPreviewPost {
  id: string
  groupId: BoardGroupId
  username: string
  initials: string
  avatarColor: string
  badge?: string
  title: string
  excerpt?: string
  upvotes: number
  comments: number
  timeAgo: string
  isHot?: boolean
}

export const boardGroups: BoardGroup[] = [
  {
    id: 'variety',
    name: 'บอร์ดวาไรตี้',
    icon: '💬',
    description: 'สนทนาทั่วไป แชร์ประสบการณ์ช้อปออนไลน์',
    color: '#EE4D2D',
    bg: '#FEF0ED',
    postCount: 1240,
    activeToday: 86,
  },
  {
    id: 'recommend',
    name: 'แนะนำสินค้า',
    icon: '⭐',
    description: 'รวมของดีที่อยากแนะนำให้เพื่อนๆ',
    color: '#F57C00',
    bg: '#FFF3E0',
    postCount: 2180,
    activeToday: 142,
  },
  {
    id: 'compare',
    name: 'เทียบราคา',
    icon: '⚖️',
    description: 'เปรียบเทียบราคาข้าม Shopee · Lazada · TikTok',
    color: '#1565C0',
    bg: '#E3F2FD',
    postCount: 980,
    activeToday: 67,
  },
  {
    id: 'deals',
    name: 'ดีล & โปรโมชั่น',
    icon: '🏷️',
    description: 'แจ้ง Flash Sale คูปอง และโปรเด็ดประจำวัน',
    color: '#D4006A',
    bg: '#FCE4EC',
    postCount: 1560,
    activeToday: 203,
  },
  {
    id: 'review',
    name: 'ใช้จริงรีวิว',
    icon: '📝',
    description: 'รีวิวหลังใช้งานจริง ไม่โม้ ไม่กั๊ก',
    color: '#2E7D32',
    bg: '#E8F5E9',
    postCount: 890,
    activeToday: 54,
  },
  {
    id: 'ask',
    name: 'ถามก่อนซื้อ',
    icon: '❓',
    description: 'สงสัยอะไรถามได้ ชุมชนช่วยตอบ',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    postCount: 720,
    activeToday: 91,
  },
  {
    id: 'lifestyle',
    name: 'ไลฟ์สไตล์',
    icon: '🏡',
    description: 'WFH, ความงาม, บ้านและของใช้ในชีวิตประจำวัน',
    color: '#00838F',
    bg: '#E0F7FA',
    postCount: 640,
    activeToday: 38,
  },
  {
    id: 'newbie',
    name: 'มือใหม่หัดช้อป',
    icon: '🌱',
    description: 'คำแนะนำพื้นฐานสำหรับคนเริ่มช้อปออนไลน์',
    color: '#558B2F',
    bg: '#F1F8E9',
    postCount: 410,
    activeToday: 29,
  },
]

export const boardPreviewPosts: BoardPreviewPost[] = [
  {
    id: '1',
    groupId: 'compare',
    username: '@arpakorn_k',
    initials: 'AK',
    avatarColor: '#EE4D2D',
    badge: 'Top Reviewer',
    title: 'เปรียบ Sony XM5 vs Bose QC45 ใช้จริง 3 เดือน ราคาต่างกัน 2K คุ้มไหม?',
    excerpt: 'สรุปสั้นๆ: XM5 เก็บเสียงรอบข้างดีกว่า แต่ QC45 ใส่สบายกว่า...',
    upvotes: 342,
    comments: 48,
    timeAgo: '2 ชม.',
    isHot: true,
  },
  {
    id: '2',
    groupId: 'recommend',
    username: '@nattaya_t',
    initials: 'NT',
    avatarColor: '#26aa99',
    title: 'แนะนำครีมกันแดดราคาไม่เกิน 500 บาท ที่ซื้อซ้ำมาแล้ว 5 ครั้ง 🌞',
    excerpt: 'เน้นตัวที่ไม่เหนอะหน้า ทาแล้วไม่อุดตัน ใช้ได้ทุกวัน',
    upvotes: 218,
    comments: 31,
    timeAgo: '4 ชม.',
    isHot: true,
  },
  {
    id: '3',
    groupId: 'deals',
    username: '@prasan_s',
    initials: 'PS',
    avatarColor: '#7B1FA2',
    title: 'PS5 Slim ราคา Lazada vs TikTok Shop วันนี้ต่างกัน 890 บาท! ซื้อที่ไหนดี',
    upvotes: 196,
    comments: 27,
    timeAgo: '6 ชม.',
    isHot: true,
  },
  {
    id: '4',
    groupId: 'lifestyle',
    username: '@kwanchai_w',
    initials: 'KW',
    avatarColor: '#F57C00',
    title: 'สรุป 10 อุปกรณ์ทำงาน WFH ราคาดีที่สุด Shopee เดือนนี้ 💻',
    upvotes: 154,
    comments: 19,
    timeAgo: '8 ชม.',
  },
  {
    id: '5',
    groupId: 'variety',
    username: '@mint_p',
    initials: 'MP',
    avatarColor: '#5C6BC0',
    title: 'ใครเคยสั่งของ TikTok Shop แล้วของไม่ตรงปกบ้าง? แชร์ประสบการณ์หน่อย',
    upvotes: 127,
    comments: 64,
    timeAgo: '1 ชม.',
  },
  {
    id: '6',
    groupId: 'ask',
    username: '@boy_d',
    initials: 'BD',
    avatarColor: '#AB47BC',
    title: 'จะซื้อ iPad ตัวแรก ควรเอา Air หรือ Pro ดี? งบไม่เกิน 25K',
    upvotes: 89,
    comments: 42,
    timeAgo: '3 ชม.',
  },
  {
    id: '7',
    groupId: 'review',
    username: '@fah_s',
    initials: 'FS',
    avatarColor: '#43A047',
    title: 'ใช้ Dyson V12 มา 6 เดือน สรุปข้อดีข้อเสียที่ไม่มีใครบอก',
    upvotes: 176,
    comments: 23,
    timeAgo: '5 ชม.',
  },
  {
    id: '8',
    groupId: 'newbie',
    username: '@new_user99',
    initials: 'NU',
    avatarColor: '#7CB342',
    title: 'มือใหม่ ถามวิธีเช็คราคาย้อนหลังก่อนซื้อใน DealHub ทำยังไง?',
    upvotes: 45,
    comments: 18,
    timeAgo: '12 ชม.',
  },
  {
    id: '9',
    groupId: 'recommend',
    username: '@ploy_j',
    initials: 'PJ',
    avatarColor: '#FF7043',
    title: 'รวม 7 รองเท้าผ้าใบ ราคาไม่เกิน 1,500 ใส่สบาย เดินทั้งวันไม่เจ็บ',
    upvotes: 203,
    comments: 35,
    timeAgo: '7 ชม.',
  },
  {
    id: '10',
    groupId: 'deals',
    username: '@deal_hunter',
    initials: 'DH',
    avatarColor: '#E91E63',
    badge: 'Deal Hunter',
    title: '🔥 Flash Sale เที่ยงคืนนี้! หูฟังลด 60% ทั้ง Shopee และ Lazada',
    upvotes: 312,
    comments: 56,
    timeAgo: '30 นาที',
    isHot: true,
  },
]

export function getPostsByGroup(groupId: BoardGroupId | 'all', limit = 4) {
  const filtered = groupId === 'all'
    ? boardPreviewPosts
    : boardPreviewPosts.filter((p) => p.groupId === groupId)
  return filtered.slice(0, limit)
}

export function getGroupById(id: BoardGroupId) {
  return boardGroups.find((g) => g.id === id)
}

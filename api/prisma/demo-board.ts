export const boardGroupDefs = [
  {
    slug: 'variety',
    name: 'บอร์ดวาไรตี้',
    icon: '💬',
    description: 'สนทนาทั่วไป แชร์ประสบการณ์ช้อปออนไลน์',
    color: '#EE4D2D',
    bg: '#FEF0ED',
    sortOrder: 1,
  },
  {
    slug: 'recommend',
    name: 'แนะนำสินค้า',
    icon: '⭐',
    description: 'รวมของดีที่อยากแนะนำให้เพื่อนๆ',
    color: '#F57C00',
    bg: '#FFF3E0',
    sortOrder: 2,
  },
  {
    slug: 'compare',
    name: 'เทียบราคา',
    icon: '⚖️',
    description: 'เปรียบเทียบราคาข้าม Shopee · Lazada · TikTok',
    color: '#1565C0',
    bg: '#E3F2FD',
    sortOrder: 3,
  },
  {
    slug: 'deals',
    name: 'ดีล & โปรโมชั่น',
    icon: '🏷️',
    description: 'แจ้ง Flash Sale คูปอง และโปรเด็ดประจำวัน',
    color: '#D4006A',
    bg: '#FCE4EC',
    sortOrder: 4,
  },
  {
    slug: 'review',
    name: 'ใช้จริงรีวิว',
    icon: '📝',
    description: 'รีวิวหลังใช้งานจริง ไม่โม้ ไม่กั๊ก',
    color: '#2E7D32',
    bg: '#E8F5E9',
    sortOrder: 5,
  },
  {
    slug: 'ask',
    name: 'ถามก่อนซื้อ',
    icon: '❓',
    description: 'สงสัยอะไรถามได้ ชุมชนช่วยตอบ',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    sortOrder: 6,
  },
  {
    slug: 'lifestyle',
    name: 'ไลฟ์สไตล์',
    icon: '🏡',
    description: 'WFH, ความงาม, บ้านและของใช้ในชีวิตประจำวัน',
    color: '#00838F',
    bg: '#E0F7FA',
    sortOrder: 7,
  },
  {
    slug: 'newbie',
    name: 'มือใหม่หัดช้อป',
    icon: '🌱',
    description: 'คำแนะนำพื้นฐานสำหรับคนเริ่มช้อปออนไลน์',
    color: '#558B2F',
    bg: '#F1F8E9',
    sortOrder: 8,
  },
] as const

export type BoardGroupSlug = (typeof boardGroupDefs)[number]['slug']

export const boardDemoUsers = [
  { email: 'arpakorn@dealhub.th', name: 'อาภากร ค.' },
  { email: 'nattaya@dealhub.th', name: 'ณัฐญา ท.' },
  { email: 'prasan@dealhub.th', name: 'ประสาน ส.' },
  { email: 'kwanchai@dealhub.th', name: 'ขวัญชัย ว.' },
  { email: 'mint@dealhub.th', name: 'มิ้นท์ พ.' },
  { email: 'boy@dealhub.th', name: 'บอย ด.' },
  { email: 'fah@dealhub.th', name: 'ฟ้า ส.' },
  { email: 'ploy@dealhub.th', name: 'พลอย จ.' },
  { email: 'dealhunter@dealhub.th', name: 'Deal Hunter' },
] as const

export interface BoardPostSeed {
  slug: string
  groupSlug: BoardGroupSlug
  authorEmail: string
  title: string
  excerpt?: string
  body?: string
  productSlug?: string
  upvoteCount: number
  commentCount: number
  isHot?: boolean
  hoursAgo: number
  seedComments?: { authorEmail: string; body: string; hoursAgo: number }[]
}

export const boardPostSeeds: BoardPostSeed[] = [
  {
    slug: 'sony-xm5-vs-bose-qc45',
    groupSlug: 'compare',
    authorEmail: 'arpakorn@dealhub.th',
    title: 'เปรียบ Sony XM5 vs Bose QC45 ใช้จริง 3 เดือน ราคาต่างกัน 2K คุ้มไหม?',
    excerpt: 'สรุปสั้นๆ: XM5 เก็บเสียงรอบข้างดีกว่า แต่ QC45 ใส่สบายกว่า...',
    body: 'ใช้ทั้งคู่มา 3 เดือน WFH ทุกวัน สรุปว่า XM5 ตัดเสียงรอบข้างได้ดีกว่าชัดเจน แต่ QC45 ใส่ทั้งวันไม่เจ็บหู ราคาต่างกัน ~2,000 บาท ถ้าซื้อที่ Lazada มีคูปองลดเพิ่มอีก',
    productSlug: 'sony-wh-1000xm5',
    upvoteCount: 342,
    commentCount: 3,
    isHot: true,
    hoursAgo: 2,
    seedComments: [
      { authorEmail: 'nattaya@dealhub.th', body: 'ผมเลือก XM5 เพราะเดินทางบ่อย ตัดเสียงเครื่องบินได้ดีมาก', hoursAgo: 1.5 },
      { authorEmail: 'boy@dealhub.th', body: 'QC45 ราคา TikTok Shop ถูกกว่า Shopee วันนี้ ลองเช็คดูครับ', hoursAgo: 1 },
      { authorEmail: 'mint@dealhub.th', body: 'ขอบคุณมาก กำลังลังเลอยู่พอดี', hoursAgo: 0.5 },
    ],
  },
  {
    slug: 'sunscreen-under-500',
    groupSlug: 'recommend',
    authorEmail: 'nattaya@dealhub.th',
    title: 'แนะนำครีมกันแดดราคาไม่เกิน 500 บาท ที่ซื้อซ้ำมาแล้ว 5 ครั้ง 🌞',
    excerpt: 'เน้นตัวที่ไม่เหนอะหน้า ทาแล้วไม่อุดตัน ใช้ได้ทุกวัน',
    upvoteCount: 218,
    commentCount: 2,
    isHot: true,
    hoursAgo: 4,
    seedComments: [
      { authorEmail: 'fah@dealhub.th', body: 'Biore UV สีฟ้า ใช้ดีมาก ราคาไม่เกิน 300', hoursAgo: 3 },
      { authorEmail: 'ploy@dealhub.th', body: 'เห็นด้วยค่ะ ซื้อจาก Shopee Mall ของแท้ชัวร์', hoursAgo: 2 },
    ],
  },
  {
    slug: 'ps5-lazada-vs-tiktok',
    groupSlug: 'deals',
    authorEmail: 'prasan@dealhub.th',
    title: 'PS5 Slim ราคา Lazada vs TikTok Shop วันนี้ต่างกัน 890 บาท! ซื้อที่ไหนดี',
    upvoteCount: 196,
    commentCount: 1,
    isHot: true,
    hoursAgo: 6,
    seedComments: [
      { authorEmail: 'dealhunter@dealhub.th', body: 'TikTok ถูกกว่าแต่เช็คร้านให้ดี แนะนำร้านที่มี rating 4.8+', hoursAgo: 5 },
    ],
  },
  {
    slug: 'wfh-gear-shopee',
    groupSlug: 'lifestyle',
    authorEmail: 'kwanchai@dealhub.th',
    title: 'สรุป 10 อุปกรณ์ทำงาน WFH ราคาดีที่สุด Shopee เดือนนี้ 💻',
    upvoteCount: 154,
    commentCount: 0,
    hoursAgo: 8,
  },
  {
    slug: 'tiktok-shop-wrong-item',
    groupSlug: 'variety',
    authorEmail: 'mint@dealhub.th',
    title: 'ใครเคยสั่งของ TikTok Shop แล้วของไม่ตรงปกบ้าง? แชร์ประสบการณ์หน่อย',
    upvoteCount: 127,
    commentCount: 2,
    hoursAgo: 1,
    seedComments: [
      { authorEmail: 'boy@dealhub.th', body: 'เจอครับ ขอคืนเงินได้แต่ต้องรอ 3-5 วัน', hoursAgo: 0.8 },
      { authorEmail: 'arpakorn@dealhub.th', body: 'เลยชอบซื้อร้านที่มีรีวิวเยอะและมีวิดีโอจริง', hoursAgo: 0.3 },
    ],
  },
  {
    slug: 'ipad-air-or-pro',
    groupSlug: 'ask',
    authorEmail: 'boy@dealhub.th',
    title: 'จะซื้อ iPad ตัวแรก ควรเอา Air หรือ Pro ดี? งบไม่เกิน 25K',
    upvoteCount: 89,
    commentCount: 0,
    isHot: false,
    hoursAgo: 3,
  },
  {
    slug: 'dyson-v12-review',
    groupSlug: 'review',
    authorEmail: 'fah@dealhub.th',
    title: 'ใช้ Dyson V12 มา 6 เดือน สรุปข้อดีข้อเสียที่ไม่มีใครบอก',
    upvoteCount: 176,
    commentCount: 1,
    hoursAgo: 5,
    productSlug: 'dyson-v12-detect-slim',
    seedComments: [
      { authorEmail: 'nattaya@dealhub.th', body: 'แบตหมดเร็วไหมคะ อยากรู้ก่อนซื้อ', hoursAgo: 4 },
    ],
  },
  {
    slug: 'dealhub-price-history-howto',
    groupSlug: 'newbie',
    authorEmail: 'user@dealhub.th',
    title: 'มือใหม่ ถามวิธีเช็คราคาย้อนหลังก่อนซื้อใน DealHub ทำยังไง?',
    upvoteCount: 45,
    commentCount: 1,
    hoursAgo: 12,
    seedComments: [
      { authorEmail: 'arpakorn@dealhub.th', body: 'เข้าหน้าสินค้าแล้วเลื่อนลงดูกราฟประวัติราคาได้เลยครับ', hoursAgo: 11 },
    ],
  },
  {
    slug: 'sneakers-under-1500',
    groupSlug: 'recommend',
    authorEmail: 'ploy@dealhub.th',
    title: 'รวม 7 รองเท้าผ้าใบ ราคาไม่เกิน 1,500 ใส่สบาย เดินทั้งวันไม่เจ็บ',
    upvoteCount: 203,
    commentCount: 0,
    hoursAgo: 7,
  },
  {
    slug: 'flash-sale-headphones',
    groupSlug: 'deals',
    authorEmail: 'dealhunter@dealhub.th',
    title: '🔥 Flash Sale เที่ยงคืนนี้! หูฟังลด 60% ทั้ง Shopee และ Lazada',
    upvoteCount: 312,
    commentCount: 2,
    isHot: true,
    hoursAgo: 0.5,
    seedComments: [
      { authorEmail: 'prasan@dealhub.th', body: 'ตั้งแจ้งเตือนไว้แล้ว ขอบคุณที่แชร์!', hoursAgo: 0.3 },
      { authorEmail: 'kwanchai@dealhub.th', body: 'Shopee ลดมากกว่า แต่ Lazada มีคูปองส่งฟรี', hoursAgo: 0.2 },
    ],
  },
  {
    slug: 'air-fryer-which-brand',
    groupSlug: 'ask',
    authorEmail: 'nattaya@dealhub.th',
    title: 'อยากได้ Air Fryer ตัวแรก Philips กับ Tefal อันไหนคุ้มกว่า?',
    upvoteCount: 67,
    commentCount: 0,
    hoursAgo: 0.25,
  },
  {
    slug: 'stanley-vs-generic-tumbler',
    groupSlug: 'compare',
    authorEmail: 'mint@dealhub.th',
    title: 'Stanley แท้ vs ของเลียนแบบ TikTok เก็บความเย็นต่างกันแค่ไหน?',
    upvoteCount: 134,
    commentCount: 0,
    hoursAgo: 1.5,
  },
]

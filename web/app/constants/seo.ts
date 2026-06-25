/** ข้อความ SEO กลาง — ใช้ทั้งหน้าแรกและ nuxt.config */
export const SEO = {
  siteName: 'DealHub TH',
  shortName: 'DealHub',
  locale: 'th_TH',
  themeColor: '#EE4D2D',

  /** Title หน้าแรก — คีย์เวิร์ดหลักนำหน้า ความยาว ~55 ตัวอักษร */
  homeTitle: 'เทียบราคาสินค้า Shopee Lazada TikTok Shop | DealHub TH',

  /** Meta description หน้าแรก — 150–160 ตัวอักษร */
  homeDescription:
    'เทียบราคาสินค้าออนไลน์จาก Shopee, Lazada และ TikTok Shop ดู Flash Sale สินค้ามาแรง ขายดี 12 อันดับ และประวัติราคา ช้อปออนไลน์ราคาดีที่สุด',

  homeKeywords:
    'เทียบราคา, เปรียบเทียบราคา, shopee, lazada, tiktok shop, flash sale, สินค้าขายดี, สินค้ามาแรง, ช้อปออนไลน์, dealhub',

  defaultTitle: 'เทียบราคาสินค้า Shopee Lazada TikTok Shop | DealHub TH',
  defaultDescription:
    'เทียบราคาสินค้าออนไลน์จาก Shopee, Lazada และ TikTok Shop ในที่เดียว ดู Flash Sale สินค้ามาแรง สินค้าขายดี และประวัติราคา ช้อปออนไลน์ราคาถูกที่สุดก่อนซื้อ',

  ogImageAlt: 'DealHub TH — เทียบราคาสินค้า Shopee Lazada TikTok Shop',
} as const

/** หัวข้อ H1/H2 บนหน้าแรก — เน้นคำค้นหา */
export const HOME_HEADINGS = {
  heroH1: 'เทียบราคาสินค้า Shopee Lazada TikTok Shop',
  heroSub: 'ลดสูงสุด 80% ทุกแพลตฟอร์ม — ช้อปออนไลน์ราคาดีที่สุดในที่เดียว',
  featured: 'สินค้าแนะนำขายดี — เทียบราคาทุกแพลตฟอร์ม',
  categories: 'หมวดหมู่สินค้า — ค้นหาตามประเภท',
  dealsZone: 'ดีลราคาดี Flash Sale และสินค้าแนะนำ',
  dealsZoneSub: 'Flash Sale · สินค้ามาแรง · สินค้าขายดี 12 อันดับ — จาก Shopee Lazada TikTok',
  flashSale: 'Flash Sale ลดราคาพิเศษ',
  trending: 'สินค้ามาแรงวันนี้',
  bestSellers: 'สินค้าขายดีประจำเดือน',
  board: 'บอร์ดพูดคุยและรีวิวสินค้า',
} as const

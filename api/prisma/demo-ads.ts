import { BannerPlacement } from '@prisma/client';

export const DEMO_AD_SEEDS = [
  {
    placement: BannerPlacement.HERO,
    title: 'DealHub TH',
    sponsorName: null as string | null,
    imageUrl: '/hero-banner.svg',
    linkUrl: '/search',
    altText: 'DealHub TH — เทียบราคา Shopee Lazada TikTok Shop',
    sortOrder: 0,
  },
  {
    placement: BannerPlacement.HOME_MID,
    title: 'Flash Sale สิ้นเดือน',
    sponsorName: 'Shopee',
    imageUrl: '/ads/home-mid-shopee.svg',
    linkUrl: '/search?sort=sold',
    altText: 'โปรโมชัน Flash Sale สิ้นเดือน — Shopee',
    sortOrder: 0,
  },
  {
    placement: BannerPlacement.SEARCH_TOP,
    title: 'เทียบราคาก่อนซื้อ',
    sponsorName: 'DealHub',
    imageUrl: '/ads/search-top.svg',
    linkUrl: '/search',
    altText: 'เทียบราคาก่อนซื้อ — DealHub TH',
    sortOrder: 0,
  },
  {
    placement: BannerPlacement.CATEGORY_TOP,
    title: 'ดีลเด็ดจาก Lazada',
    sponsorName: 'Lazada',
    imageUrl: '/ads/category-top.svg',
    linkUrl: '/search',
    altText: 'ดีลแนะนำจาก Lazada',
    sortOrder: 0,
  },
  {
    placement: BannerPlacement.PRODUCT_INLINE,
    title: 'ช้อปผ่าน TikTok Shop',
    sponsorName: 'TikTok Shop',
    imageUrl: '/ads/product-inline.svg',
    linkUrl: '/search?marketplace=TIKTOK_SHOP',
    altText: 'ช้อป TikTok Shop ผ่าน DealHub',
    sortOrder: 0,
  },
] as const;

export const DEMO_AD_CAROUSEL = [
  {
    placement: BannerPlacement.HOME_MID,
    title: 'Lazada 11.11 Warm Up',
    sponsorName: 'Lazada',
    imageUrl: '/ads/home-mid-lazada.svg',
    linkUrl: '/search?marketplace=LAZADA',
    altText: 'โปรโมชัน Lazada — ดีลร้อนแรง',
    sortOrder: 1,
  },
] as const;

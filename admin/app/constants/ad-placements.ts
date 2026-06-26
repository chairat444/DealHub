export type AdPlacement =
  | 'HERO'
  | 'HOME_MID'
  | 'SEARCH_TOP'
  | 'CATEGORY_TOP'
  | 'PRODUCT_INLINE'

export interface AdPlacementMeta {
  id: AdPlacement
  label: string
  page: string
  aspect: string
  aspectRatio: string
  sizeHint: string
  showAdBadge: boolean
}

export const AD_PLACEMENTS: AdPlacementMeta[] = [
  {
    id: 'HERO',
    label: 'Hero Carousel',
    page: 'หน้าแรก — carousel หลัก',
    aspect: 'aspect-[3/1]',
    aspectRatio: '3 / 1',
    sizeHint: '1200×400 px (3:1)',
    showAdBadge: false,
  },
  {
    id: 'HOME_MID',
    label: 'กลางหน้าแรก',
    page: 'หน้าแรก — ระหว่างดีลกับบอร์ด',
    aspect: 'aspect-[5/1]',
    aspectRatio: '5 / 1',
    sizeHint: '1200×240 px (5:1)',
    showAdBadge: true,
  },
  {
    id: 'SEARCH_TOP',
    label: 'บนผลค้นหา',
    page: 'หน้าค้นหา — เหนือรายการสินค้า',
    aspect: 'aspect-[4/1]',
    aspectRatio: '4 / 1',
    sizeHint: '1200×300 px (4:1)',
    showAdBadge: true,
  },
  {
    id: 'CATEGORY_TOP',
    label: 'บนหมวดหมู่',
    page: 'หน้าหมวด — เหนือรายการสินค้า',
    aspect: 'aspect-[4/1]',
    aspectRatio: '4 / 1',
    sizeHint: '1200×300 px (4:1)',
    showAdBadge: true,
  },
  {
    id: 'PRODUCT_INLINE',
    label: 'ในหน้าสินค้า',
    page: 'หน้ารายละเอียดสินค้า — ใต้ปุ่มแชร์',
    aspect: 'aspect-[3/1]',
    aspectRatio: '3 / 1',
    sizeHint: '900×300 px (3:1)',
    showAdBadge: true,
  },
]

export function getPlacementMeta(id: AdPlacement) {
  return AD_PLACEMENTS.find((p) => p.id === id) ?? AD_PLACEMENTS[0]!
}

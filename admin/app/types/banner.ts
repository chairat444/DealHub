export interface Banner {
  id: string
  title?: string | null
  sponsorName?: string | null
  imageUrl: string
  linkUrl: string
  altText?: string | null
  sortOrder: number
}

export interface AdminBanner extends Banner {
  placement: 'HERO' | 'HOME_MID' | 'SEARCH_TOP' | 'CATEGORY_TOP' | 'PRODUCT_INLINE'
  isActive: boolean
  startsAt?: string | null
  endsAt?: string | null
  impressions: number
  clicks: number
  createdAt: string
  updatedAt: string
}

export interface BannerForm {
  title: string
  sponsorName: string
  linkUrl: string
  altText: string
  sortOrder: number
  isActive: boolean
  startsAt: string
  endsAt: string
}

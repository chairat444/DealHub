export interface Banner {
  id: string
  title?: string | null
  imageUrl: string
  linkUrl: string
  altText?: string | null
  sortOrder: number
}

export interface AdminBanner extends Banner {
  placement: 'HERO'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BannerForm {
  title: string
  linkUrl: string
  altText: string
  sortOrder: number
  isActive: boolean
}

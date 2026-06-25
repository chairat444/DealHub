export interface Product {
  id: string
  name: string
  slug: string
  imageUrl?: string
  brand?: string
  rating?: number
  reviewCount: number
  soldCount: number
  isTrending: boolean
  isTopSelling: boolean
  lowestPrice?: number
  highestPrice?: number
  description?: string
  aiReviewSummary?: string
  category?: { id: string; name: string; slug: string }
  listings?: ProductListing[]
  priceHistory?: { price: number; recordedAt: string }[]
}

export interface ProductListing {
  id: string
  marketplace: 'SHOPEE' | 'LAZADA' | 'TIKTOK_SHOP' | 'OTHER'
  price: number
  originalPrice?: number
  affiliateUrl: string
  shopName?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
  children?: Category[]
  _count?: { products: number }
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

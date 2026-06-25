export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
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

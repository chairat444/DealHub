export interface Banner {
  id: string
  title?: string | null
  sponsorName?: string | null
  imageUrl: string
  linkUrl: string
  altText?: string | null
  sortOrder: number
}

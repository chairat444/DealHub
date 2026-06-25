import type { Product, ProductListing } from '~/types'

export function getLowestListing(product: Product): ProductListing | undefined {
  if (!product.listings?.length) return undefined
  return [...product.listings].sort((a, b) => a.price - b.price)[0]
}

export function getDiscountPercent(product: Product): number | null {
  const listing = getLowestListing(product)
  if (!listing?.originalPrice || listing.originalPrice <= listing.price) return null
  return Math.round((1 - listing.price / listing.originalPrice) * 100)
}

export function formatSoldCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return count.toString()
}

const emojiByKeyword: [string, string][] = [
  ['iphone', '📱'],
  ['samsung', '📱'],
  ['galaxy', '📱'],
  ['ipad', '💻'],
  ['เสื้อ', '👕'],
  ['tshirt', '👕'],
  ['เซรั่ม', '💄'],
  ['serum', '💄'],
  ['ครีม', '💄'],
  ['หูฟัง', '🎧'],
  ['headphone', '🎧'],
  ['โซฟา', '🛋️'],
  ['sofa', '🛋️'],
  ['nike', '👟'],
  ['รองเท้า', '👟'],
  ['watch', '⌚'],
  ['garmin', '⌚'],
]

export function getProductEmoji(name: string, categorySlug?: string): string {
  const lower = name.toLowerCase()
  for (const [keyword, emoji] of emojiByKeyword) {
    if (lower.includes(keyword)) return emoji
  }
  const byCategory: Record<string, string> = {
    electronics: '📱',
    fashion: '👗',
    beauty: '💄',
    'home-living': '🏠',
    sports: '⚽',
  }
  return (categorySlug && byCategory[categorySlug]) || '📦'
}

export function useCountdown(initialSeconds: number) {
  const remaining = ref(initialSeconds)

  const hours = computed(() => String(Math.floor(remaining.value / 3600)).padStart(2, '0'))
  const minutes = computed(() => String(Math.floor((remaining.value % 3600) / 60)).padStart(2, '0'))
  const seconds = computed(() => String(remaining.value % 60).padStart(2, '0'))

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      remaining.value = remaining.value > 0 ? remaining.value - 1 : initialSeconds
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { hours, minutes, seconds }
}

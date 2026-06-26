import type { AdPlacement } from '~/constants/ad-placements'
import type { Banner } from '~/types/banner'

export function usePlacementBanners(placement: AdPlacement) {
  const stateKey = `placement-banners-${placement}`
  const banners = useState<Banner[]>(stateKey, () => [])
  const pending = useState(`${stateKey}-pending`, () => false)
  const { fetchBanners } = useBanners()

  async function refresh() {
    if (pending.value) return
    pending.value = true
    try {
      const data = await fetchBanners(placement)
      if (data.length > 0) {
        banners.value = data
      }
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    refresh()
  })

  return { banners, pending, refresh }
}

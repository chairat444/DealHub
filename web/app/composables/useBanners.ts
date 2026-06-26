import type { AdPlacement } from '~/constants/ad-placements'
import type { Banner } from '~/types/banner'

export function useBanners() {
  const config = useRuntimeConfig()
  const { apiFetch } = useApi()

  function resolveBannerImageUrl(imageUrl: string) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
    if (imageUrl.startsWith('/uploads/')) {
      const origin = (config.public.apiBase as string).replace(/\/api\/v1\/?$/, '')
      return `${origin}${imageUrl}`
    }
    return imageUrl
  }

  async function fetchBanners(placement: AdPlacement) {
    try {
      return await apiFetch<Banner[]>(`/banners?placement=${placement}`)
    } catch {
      return []
    }
  }

  async function fetchHeroBanners() {
    return fetchBanners('HERO')
  }

  function trackImpression(bannerId: string) {
    if (!import.meta.client) return
    const key = `ad-imp-${bannerId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    apiFetch(`/banners/${bannerId}/impression`, { method: 'POST' }).catch(() => {})
  }

  function trackClick(bannerId: string) {
    if (!import.meta.client) return
    apiFetch(`/banners/${bannerId}/click`, { method: 'POST' }).catch(() => {})
  }

  return {
    fetchBanners,
    fetchHeroBanners,
    resolveBannerImageUrl,
    trackImpression,
    trackClick,
  }
}

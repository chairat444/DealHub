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

  async function fetchHeroBanners() {
    try {
      return await apiFetch<Banner[]>('/banners?placement=HERO')
    } catch {
      return []
    }
  }

  return { fetchHeroBanners, resolveBannerImageUrl }
}

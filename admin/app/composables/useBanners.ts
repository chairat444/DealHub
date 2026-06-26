import type { AdPlacement } from '~/constants/ad-placements'
import type { AdminBanner, BannerForm } from '~/types/banner'

export function useBanners() {
  const config = useRuntimeConfig()
  const { apiFetch } = useApi()

  function resolveBannerImageUrl(imageUrl: string) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl

    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`

    if (imageUrl.startsWith('/uploads/')) {
      const origin = (config.public.apiBase as string).replace(/\/api\/v1\/?$/, '')
      return `${origin}${path}`
    }

    // รูป static (/ads, hero-banner) — โหลดจาก origin ปัจจุบัน (admin มี copy ใน public/)
    if (import.meta.client) {
      return `${window.location.origin}${path}`
    }

    const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
    return `${siteUrl}${path}`
  }

  const fetchAdminBanners = (placement?: AdPlacement) =>
    apiFetch<AdminBanner[]>(
      placement ? `/admin/banners?placement=${placement}` : '/admin/banners',
    )

  const createBanner = (body: Partial<BannerForm> & { imageUrl: string; placement: AdPlacement }) =>
    apiFetch<AdminBanner>('/admin/banners', {
      method: 'POST',
      body: {
        linkUrl: '/search',
        sortOrder: 0,
        isActive: true,
        ...body,
      },
    })

  const updateBanner = (id: string, body: Partial<BannerForm> & { placement?: AdPlacement }) =>
    apiFetch<AdminBanner>(`/admin/banners/${id}`, { method: 'PATCH', body })

  const deleteBanner = (id: string) =>
    apiFetch(`/admin/banners/${id}`, { method: 'DELETE' })

  const uploadBannerImage = (id: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiFetch<AdminBanner>(`/admin/banners/${id}/image`, {
      method: 'POST',
      body: formData,
    })
  }

  return {
    fetchAdminBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage,
    resolveBannerImageUrl,
  }
}

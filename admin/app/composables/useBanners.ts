import type { AdminBanner, Banner, BannerForm } from '~/types/banner'

export function useBanners() {
  const config = useRuntimeConfig()
  const { apiFetch } = useApi()

  function resolveBannerImageUrl(imageUrl: string) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
    if (imageUrl.startsWith('/uploads/')) {
      const origin = (config.public.apiBase as string).replace(/\/api\/v1\/?$/, '')
      return `${origin}${imageUrl}`
    }
    const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
    return `${siteUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
  }

  const fetchAdminBanners = () => apiFetch<AdminBanner[]>('/admin/banners?placement=HERO')

  const createBanner = (body: Partial<BannerForm> & { imageUrl: string }) =>
    apiFetch<AdminBanner>('/admin/banners', {
      method: 'POST',
      body: {
        placement: 'HERO',
        linkUrl: '/search',
        sortOrder: 0,
        isActive: true,
        ...body,
      },
    })

  const updateBanner = (id: string, body: Partial<BannerForm>) =>
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

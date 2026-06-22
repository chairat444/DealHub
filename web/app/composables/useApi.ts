export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = <T>(url: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
    return $fetch<T>(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
      },
    })
  }

  return { apiFetch }
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(price)
}

export const marketplaceLabel = (marketplace: string) => {
  const labels: Record<string, string> = {
    SHOPEE: 'Shopee',
    LAZADA: 'Lazada',
    TIKTOK_SHOP: 'TikTok Shop',
    OTHER: 'อื่นๆ',
  }
  return labels[marketplace] || marketplace
}

export const marketplaceColor = (marketplace: string) => {
  const colors: Record<string, string> = {
    SHOPEE: 'marketplace-shopee',
    LAZADA: 'marketplace-lazada',
    TIKTOK_SHOP: 'marketplace-tiktok',
    OTHER: 'bg-gray-100 text-gray-700',
  }
  return colors[marketplace] || 'bg-gray-100 text-gray-700'
}

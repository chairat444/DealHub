export function useAdminFetch<T>(
  key: () => string,
  fetcher: () => Promise<T>,
  watchDeps: (() => unknown)[] = [],
) {
  const authStore = useAuthStore()
  const loadError = ref('')

  const { data, pending, refresh, error } = useAsyncData<T | null>(
    key,
    async () => {
      if (!authStore.accessToken) return null
      loadError.value = ''
      try {
        return await fetcher()
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode
        loadError.value = status === 401
          ? 'เซสชันหมดอายุ — ออกจากระบบแล้วเข้าใหม่'
          : 'โหลดข้อมูลไม่สำเร็จ — ตรวจสอบว่า API รันอยู่ที่ localhost:3001'
        return null
      }
    },
    { server: false, watch: watchDeps },
  )

  onMounted(() => {
    if (authStore.accessToken) refresh()
  })

  watch(() => authStore.accessToken, (token) => {
    if (token) refresh()
  })

  return { data, pending, refresh, error, loadError }
}

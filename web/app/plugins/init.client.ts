export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const compareStore = useCompareStore()
  authStore.loadFromStorage()
  compareStore.loadFromStorage()
})

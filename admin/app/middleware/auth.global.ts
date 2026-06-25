export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (to.path === '/login') {
    if (authStore.isAdmin) return navigateTo('/')
    return
  }

  if (!authStore.isLoggedIn || !authStore.isAdmin) {
    return navigateTo('/login')
  }
})

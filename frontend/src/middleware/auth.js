export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSessionStore()
  if (!session.isAuthenticated) {
    return navigateTo(`/login?redirect=${to.path}`)
  }
})

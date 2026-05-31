export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (process.server) return

  const session = useSessionStore()
  const token = localStorage.getItem('jwt_session')

  if (token) {
    session.token = token
    // Restore user data asynchronously
    session.restoreSession()
  }
})

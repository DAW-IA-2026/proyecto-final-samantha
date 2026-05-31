export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // In development, derive the API host from whatever hostname the browser used
  // (e.g. localhost, 127.0.0.1, or a local network IP like 192.168.x.x).
  // This allows mobile devices on the same WiFi to reach the backend automatically.
  const baseURL = import.meta.dev && import.meta.client
    ? `http://${window.location.hostname}:3001`
    : config.public.apiBaseUrl

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      if (process.client) {
        const token = localStorage.getItem('jwt_session')
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
          }
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401 && process.client) {
        const session = useSessionStore()
        session.logout()
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})

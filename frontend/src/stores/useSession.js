import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    async login(email, password) {
      const { $api } = useNuxtApp()
      const res = await $api('/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      this.token = res.data.token
      this.user = res.data
      localStorage.setItem('jwt_session', res.data.token)
      return res.data
    },

    async register(alias, email, password) {
      const { $api } = useNuxtApp()
      const res = await $api('/auth/register', {
        method: 'POST',
        body: { alias, email, password }
      })
      this.token = res.data.token
      this.user = res.data
      localStorage.setItem('jwt_session', res.data.token)
      return res.data
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('jwt_session')
      navigateTo('/')
    },

    async restoreSession() {
      const token = localStorage.getItem('jwt_session')
      if (!token) return
      this.token = token
      try {
        const { $api } = useNuxtApp()
        const res = await $api('/users/me')
        this.user = res.data
      } catch {
        this.logout()
      }
    }
  }
})

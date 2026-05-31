import { defineStore } from 'pinia'

export const useGameStore = defineStore('games', {
  state: () => ({
    games: [],
    meta: null,
    categories: [],
    tags: [],
    loading: false
  }),

  actions: {
    async fetchGames(params = {}) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const res = await $api('/games', { params })
        this.games = res.data
        this.meta = res.meta
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      const { $api } = useNuxtApp()
      const res = await $api('/categories')
      this.categories = res.data
    },

    async fetchTags() {
      const { $api } = useNuxtApp()
      const res = await $api('/tags')
      this.tags = res.data
    },

    async createGame(body) {
      const { $api } = useNuxtApp()
      return await $api('/games', { method: 'POST', body })
    },

    async updateGame(id, body) {
      const { $api } = useNuxtApp()
      return await $api(`/games/${id}`, { method: 'PUT', body })
    },

    async deleteGame(id) {
      const { $api } = useNuxtApp()
      return await $api(`/games/${id}`, { method: 'DELETE' })
    },

    async completeGame(id, body) {
      const { $api } = useNuxtApp()
      return await $api(`/games/${id}/complete`, { method: 'PATCH', body })
    }
  }
})

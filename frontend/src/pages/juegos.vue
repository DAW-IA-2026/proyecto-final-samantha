<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="font-pixel text-3xl text-white">My Games</h1>
        <p class="text-gray-400 mt-1">Organize, filter, and crush your backlog.</p>
      </div>
      <NuxtLink to="/juegos/nuevo" class="btn-primary">
        + Add Game
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="glass rounded-xl p-4 mb-8 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search games..."
          class="input-dark"
          @input="applyFilters"
        />
        <select v-model="filters.status" class="input-dark" @change="applyFilters">
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select v-model="filters.category_id" class="input-dark" @change="applyFilters">
          <option value="">All categories</option>
          <option v-for="cat in gameStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select v-model="filters.tag" class="input-dark" @change="applyFilters">
          <option value="">All tags</option>
          <option v-for="tag in gameStore.tags" :key="tag.id" :value="tag.slug">
            {{ tag.name }}
          </option>
        </select>
        <select v-model="filters.sort" class="input-dark" @change="applyFilters">
          <option value="priority">Priority ↓</option>
          <option value="score">Score ↓</option>
          <option value="hours">Hours ↑</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="gameStore.loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Game Grid -->
    <div v-else-if="gameStore.games.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <GameCard
        v-for="game in gameStore.games"
        :key="game.id"
        :game="game"
        @complete="handleComplete"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="glass rounded-xl p-12 text-center">
      <div class="text-6xl mb-4">🕹️</div>
      <h3 class="font-pixel text-xl text-white mb-2">No games yet</h3>
      <p class="text-gray-400 mb-6">Your backlog is empty. Time to fill it up!</p>
      <NuxtLink to="/juegos/nuevo" class="btn-primary">
        Add your first game
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useGameStore } from '~/stores/useGames'

definePageMeta({ middleware: 'auth' })

const gameStore = useGameStore()

const filters = reactive({
  search: '',
  status: '',
  category_id: '',
  tag: '',
  sort: 'priority'
})

const applyFilters = () => {
  const params = {
    page: 1,
    per_page: 100,
    sort: filters.sort
  }
  if (filters.status) params.status = filters.status
  if (filters.category_id) params.category_id = filters.category_id
  if (filters.tag) params.tag = filters.tag
  if (filters.search) params.search = filters.search

  gameStore.fetchGames(params)
}

const handleComplete = async (id) => {
  const notes = prompt('Completion notes (optional):')
  const rating = parseInt(prompt('Rating 1-5 (optional):') || '0')
  await gameStore.completeGame(id, {
    status: 'completed',
    completion_notes: notes || undefined,
    completion_rating: rating || undefined
  })
  applyFilters()
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure? This game will be deleted.')) return
  await gameStore.deleteGame(id)
  applyFilters()
}

onMounted(() => {
  applyFilters()
  gameStore.fetchCategories()
  gameStore.fetchTags()
})
</script>

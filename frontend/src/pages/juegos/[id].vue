<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <NuxtLink to="/juegos" class="text-sm text-gray-400 hover:text-neon-green transition-colors">
        ← Back to games
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="game" class="space-y-8">
      <!-- Header -->
      <div class="glass rounded-xl p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Cover -->
          <div class="shrink-0 w-full sm:w-48 h-64 rounded-lg overflow-hidden bg-dark-surface">
            <img
              v-if="game.cover_image_url"
              :src="game.cover_image_url"
              :alt="game.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl">🎮</span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="font-pixel text-3xl text-white">{{ game.name }}</h1>
                <p class="text-gray-400 mt-2">{{ game.category?.name }}</p>
              </div>
              <span
                :class="game.status === 'completed' ? 'status-completed' : 'status-pending'"
              >
                {{ game.status === 'completed' ? 'Completed' : 'Pending' }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div class="glass rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-yellow-400">{{ game.metacritic_score }}</div>
                <div class="text-xs text-gray-400 mt-1">Metacritic</div>
              </div>
              <div class="glass rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-white">{{ game.hours_to_complete }}h</div>
                <div class="text-xs text-gray-400 mt-1">Hours</div>
              </div>
              <div class="glass rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-neon-green">{{ game.priority_score ?? 'N/A' }}</div>
                <div class="text-xs text-gray-400 mt-1">Priority</div>
              </div>
              <div class="glass rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-neon-purple">{{ game.status === 'completed' ? '✓' : '○' }}</div>
                <div class="text-xs text-gray-400 mt-1">Status</div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="game.tags?.length" class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tag in game.tags"
                :key="tag.id"
                class="px-3 py-1 rounded-full text-sm bg-dark-bg text-gray-300 border border-dark-border"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="game.description" class="glass rounded-xl p-6">
        <h2 class="font-pixel text-lg text-white mb-3">Description</h2>
        <p class="text-gray-300 leading-relaxed">{{ game.description }}</p>
      </div>

      <!-- Completion info -->
      <div v-if="game.status === 'completed'" class="glass rounded-xl p-6">
        <h2 class="font-pixel text-lg text-white mb-3">Completion</h2>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">Date:</span>
            <span class="text-white">{{ new Date(game.completed_at).toLocaleDateString() }}</span>
          </div>
          <div v-if="game.completion_rating" class="flex items-center gap-2">
            <span class="text-gray-400">Rating:</span>
            <div class="flex items-center gap-1">
              <span
                v-for="i in 5"
                :key="i"
                :class="i <= game.completion_rating ? 'text-yellow-400' : 'text-gray-600'"
              >★</span>
            </div>
          </div>
          <div v-if="game.completion_notes" class="mt-3 p-3 rounded-lg bg-dark-bg/50 border border-dark-border">
            <p class="text-gray-300 italic">"{{ game.completion_notes }}"</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="`/juegos/edicion/${game.id}`"
          class="btn-primary"
        >
          ✎ Edit Game
        </NuxtLink>
        <button
          v-if="game.status !== 'completed'"
          @click="handleComplete"
          class="px-6 py-3 rounded-lg font-medium text-neon-green border border-neon-green/30 hover:bg-neon-green/10 transition-all"
        >
          ✓ Mark Complete
        </button>
        <button
          @click="handleDelete"
          class="px-6 py-3 rounded-lg font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all"
        >
          🗑 Delete
        </button>
      </div>
    </div>

    <div v-else class="glass rounded-xl p-12 text-center">
      <div class="text-6xl mb-4">😕</div>
      <h3 class="font-pixel text-xl text-white mb-2">Game not found</h3>
      <p class="text-gray-400 mb-6">The game you're looking for doesn't exist or was deleted.</p>
      <NuxtLink to="/juegos" class="btn-primary">
        Back to list
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '~/stores/useGames'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const game = ref(null)
const loading = ref(true)

const loadGame = async () => {
  loading.value = true
  try {
    game.value = await gameStore.fetchGame(route.params.id)
  } catch (e) {
    game.value = null
  } finally {
    loading.value = false
  }
}

const handleComplete = async () => {
  const notes = prompt('Completion notes (optional):')
  const rating = parseInt(prompt('Rating 1-5 (optional):') || '0')
  await gameStore.completeGame(game.value.id, {
    status: 'completed',
    completion_notes: notes || undefined,
    completion_rating: rating || undefined
  })
  loadGame()
}

const handleDelete = async () => {
  if (!confirm('Are you sure? This game will be deleted.')) return
  await gameStore.deleteGame(game.value.id)
  router.push('/juegos')
}

onMounted(loadGame)

definePageMeta({ middleware: 'auth' })
</script>

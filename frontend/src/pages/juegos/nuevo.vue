<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <NuxtLink to="/juegos" class="text-sm text-gray-400 hover:text-neon-green transition-colors">
        ← Back to games
      </NuxtLink>
      <h1 class="font-pixel text-3xl text-white mt-4">Add New Game</h1>
    </div>

    <!-- External Search -->
    <div class="glass rounded-xl p-6 mb-6 space-y-4">
      <label class="block text-sm font-medium text-gray-300">Find game data automatically</label>
      <div class="flex gap-3">
        <input
          v-model="searchQuery"
          type="text"
          class="input-dark flex-1"
          placeholder="e.g. Hades"
          @keyup.enter="runSearch"
        />
        <button
          type="button"
          class="px-4 py-3 rounded-lg font-medium text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all whitespace-nowrap"
          :disabled="searching"
          @click="runSearch"
        >
          {{ searching ? 'Searching...' : 'Search' }}
        </button>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length" class="space-y-3 mt-4">
        <p class="text-sm text-gray-400">Select a result to auto-fill the form:</p>
        <div
          v-for="result in searchResults"
          :key="result.name"
          class="flex items-center gap-4 p-3 rounded-lg bg-dark-bg/50 border border-dark-border hover:border-neon-green/50 cursor-pointer transition-all"
          @click="applyResult(result)"
        >
          <img
            v-if="result.cover_image_url"
            :src="result.cover_image_url"
            class="w-12 h-16 object-cover rounded"
          />
          <div v-else class="w-12 h-16 rounded bg-dark-surface flex items-center justify-center text-xl">🎮</div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white truncate">{{ result.name }}</p>
            <p class="text-xs text-gray-400">
              Score: {{ result.metacritic_score ?? 'N/A' }} | Hours: {{ result.hours_to_complete ?? 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <p v-if="searchError" class="text-sm text-red-400">{{ searchError }}</p>
    </div>

    <form class="glass rounded-xl p-6 sm:p-8 space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Game Name</label>
        <input v-model="form.name" type="text" class="input-dark" placeholder="e.g. Hades" required />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select v-model="form.category_id" class="input-dark" required>
            <option value="">Select category</option>
            <option v-for="cat in gameStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Metacritic Score</label>
          <input v-model.number="form.metacritic_score" type="number" min="0" max="100" class="input-dark" placeholder="0-100" required />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Hours to Complete</label>
          <input v-model.number="form.hours_to_complete" type="number" min="0.1" step="0.1" class="input-dark" placeholder="e.g. 25.5" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
          <input v-model="form.cover_image_url" type="url" class="input-dark" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in gameStore.tags"
            :key="tag.id"
            type="button"
            @click="toggleTag(tag.id)"
            class="px-3 py-1.5 rounded-full text-sm border transition-all"
            :class="form.tag_ids.includes(tag.id) ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-dark-border text-gray-400 hover:border-gray-500'"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Description / Notes</label>
        <textarea v-model="form.description" class="input-dark h-24 resize-none" placeholder="Personal notes about the game..." />
      </div>

      <!-- Error display -->
      <div v-if="errorMessage" class="p-4 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
        {{ errorMessage }}
      </div>

      <div class="flex items-center gap-4 pt-4">
        <button type="submit" class="btn-primary flex-1" :disabled="saving">
          {{ saving ? 'Creating...' : 'Create Game' }}
        </button>
        <NuxtLink to="/juegos" class="px-6 py-3 rounded-lg text-gray-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useGameStore } from '~/stores/useGames'

definePageMeta({ middleware: 'auth' })

const gameStore = useGameStore()
const router = useRouter()
const saving = ref(false)
const errorMessage = ref('')

const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searchError = ref('')

const form = reactive({
  name: '',
  category_id: '',
  metacritic_score: null,
  hours_to_complete: null,
  cover_image_url: '',
  description: '',
  tag_ids: []
})

const toggleTag = (id) => {
  const idx = form.tag_ids.indexOf(id)
  if (idx > -1) {
    form.tag_ids.splice(idx, 1)
  } else {
    form.tag_ids.push(id)
  }
}

const runSearch = async () => {
  if (!searchQuery.value.trim()) return
  searching.value = true
  searchResults.value = []
  searchError.value = ''
  try {
    const results = await gameStore.searchExternalGames(searchQuery.value.trim())
    searchResults.value = results
    if (!results.length) searchError.value = 'No games found. Try another name.'
  } catch (e) {
    searchError.value = 'Search service unavailable. Try again later.'
  } finally {
    searching.value = false
  }
}

const applyResult = (result) => {
  form.name = result.name || ''
  form.metacritic_score = result.metacritic_score ?? null
  form.hours_to_complete = result.hours_to_complete ?? null
  form.cover_image_url = result.cover_image_url || ''
  form.description = result.description || ''
  searchResults.value = []
}

const handleSubmit = async () => {
  errorMessage.value = ''
  if (form.metacritic_score === null || form.hours_to_complete === null) {
    errorMessage.value = 'Please fill in Metacritic Score and Hours to Complete'
    return
  }
  saving.value = true
  try {
    await gameStore.createGame(form)
    router.push('/juegos')
  } catch (e) {
    const backend = e?.response?._data
    if (backend?.message) {
      errorMessage.value = backend.message
      if (backend.errors?.length) {
        errorMessage.value += ': ' + backend.errors.map(err => err.message).join(', ')
      }
    } else {
      errorMessage.value = 'Error creating game: ' + (e.message || 'Unknown error')
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  gameStore.fetchCategories()
  gameStore.fetchTags()
})
</script>

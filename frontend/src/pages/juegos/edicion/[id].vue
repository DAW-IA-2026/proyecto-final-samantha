<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <NuxtLink to="/juegos" class="text-sm text-gray-400 hover:text-neon-green transition-colors">
        ← Back to games
      </NuxtLink>
      <h1 class="font-pixel text-3xl text-white mt-4">Edit Game</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>

    <form v-else class="glass rounded-xl p-6 sm:p-8 space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Game Name</label>
        <input v-model="form.name" type="text" class="input-dark" required />
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
          <input v-model.number="form.metacritic_score" type="number" min="0" max="100" class="input-dark" required />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Hours to Complete</label>
          <input v-model.number="form.hours_to_complete" type="number" min="0.1" step="0.1" class="input-dark" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
          <input v-model="form.cover_image_url" type="url" class="input-dark" />
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
        <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea v-model="form.description" class="input-dark h-24 resize-none" />
      </div>

      <div class="flex items-center gap-4 pt-4">
        <button type="submit" class="btn-primary flex-1" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
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

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const loading = ref(true)
const saving = ref(false)
const gameId = route.params.id

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

const handleSubmit = async () => {
  if (form.metacritic_score === null || form.hours_to_complete === null) {
    alert('Please fill in Metacritic Score and Hours to Complete')
    return
  }
  saving.value = true
  try {
    await gameStore.updateGame(gameId, form)
    router.push('/juegos')
  } catch (e) {
    alert('Error updating game: ' + (e.message || 'Unknown error'))
  } finally {
    saving.value = false
  }
}
  saving.value = true
  try {
    await gameStore.updateGame(gameId, form)
    router.push('/juegos')
  } catch (e) {
    alert('Error updating game: ' + (e.message || 'Unknown error'))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await gameStore.fetchCategories()
  await gameStore.fetchTags()

  try {
    const { $api } = useNuxtApp()
    const res = await $api(`/games/${gameId}`)
    const game = res.data
    Object.assign(form, {
      name: game.name,
      category_id: game.category?.id || '',
      metacritic_score: game.metacritic_score,
      hours_to_complete: game.hours_to_complete,
      cover_image_url: game.cover_image_url || '',
      description: game.description || '',
      tag_ids: game.tags?.map(t => t.id) || []
    })
  } catch {
    alert('Game not found')
    router.push('/juegos')
  } finally {
    loading.value = false
  }
})
</script>

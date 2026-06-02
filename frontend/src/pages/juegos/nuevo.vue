<script setup>
import { reactive, ref } from 'vue'
import { useGameStore } from '~/stores/useGames'
import { createGameSchema } from '~/validations/gameSchema'

definePageMeta({ middleware: 'auth' })

const gameStore = useGameStore()
const router = useRouter()
const saving = ref(false)
const errorMessage = ref('')
const fieldErrors = reactive({})

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

const clearErrors = () => {
  errorMessage.value = ''
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

const handleSubmit = async () => {
  clearErrors()

  const parseResult = createGameSchema.safeParse(form)
  if (!parseResult.success) {
    const issues = parseResult.error.issues
    issues.forEach((issue) => {
      const key = issue.path[0]
      if (key) fieldErrors[key] = issue.message
    })
    return
  }

  saving.value = true
  try {
    await gameStore.createGame(parseResult.data)
    router.push('/juegos')
  } catch (e) {
    const backend = e?.response?._data
    if (backend?.message) {
      errorMessage.value = backend.message
      if (backend.errors?.length) {
        errorMessage.value += ': ' + backend.errors.map((err) => err.message).join(', ')
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

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <NuxtLink to="/juegos" class="text-sm text-gray-400 hover:text-neon-green transition-colors">
        Back to games
      </NuxtLink>
      <h1 class="font-pixel text-3xl text-white mt-4">Add New Game</h1>
    </div>

    <form class="glass rounded-xl p-6 sm:p-8 space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Game Name</label>
        <input
          v-model="form.name"
          type="text"
          class="input-dark"
          placeholder="e.g. Hades"
        />
        <p v-if="fieldErrors.name" class="text-sm text-red-400 mt-1">{{ fieldErrors.name }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select v-model="form.category_id" class="input-dark">
            <option value="">Select category</option>
            <option v-for="cat in gameStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <p v-if="fieldErrors.category_id" class="text-sm text-red-400 mt-1">{{ fieldErrors.category_id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Metacritic Score</label>
          <input
            v-model.number="form.metacritic_score"
            type="number"
            min="0"
            max="100"
            class="input-dark"
            placeholder="0-100"
          />
          <p v-if="fieldErrors.metacritic_score" class="text-sm text-red-400 mt-1">{{ fieldErrors.metacritic_score }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Hours to Complete</label>
          <input
            v-model.number="form.hours_to_complete"
            type="number"
            min="0.1"
            step="0.1"
            class="input-dark"
            placeholder="e.g. 25.5"
          />
          <p v-if="fieldErrors.hours_to_complete" class="text-sm text-red-400 mt-1">{{ fieldErrors.hours_to_complete }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
          <input
            v-model="form.cover_image_url"
            type="text"
            class="input-dark"
            placeholder="https://..."
          />
          <p v-if="fieldErrors.cover_image_url" class="text-sm text-red-400 mt-1">{{ fieldErrors.cover_image_url }}</p>
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
        <textarea
          v-model="form.description"
          class="input-dark h-24 resize-none"
          placeholder="Personal notes about the game..."
        />
      </div>

      <!-- Backend error display -->
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



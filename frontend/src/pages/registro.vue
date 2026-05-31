<template>
  <div>
    <AppHeader />
    <main class="min-h-screen pt-24 pb-12 px-4">
      <div class="max-w-sm mx-auto">
        <div class="glass rounded-xl p-8">
          <h1 class="font-pixel text-2xl text-center text-white mb-6">Create Account</h1>

          <form class="space-y-4" @submit.prevent="handleRegister">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Alias</label>
              <input v-model="form.alias" type="text" class="input-dark" required minlength="2" />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <input v-model="form.email" type="email" class="input-dark" required />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Password</label>
              <input v-model="form.password" type="password" class="input-dark" required minlength="6" />
            </div>
            <button type="submit" class="btn-primary w-full" :disabled="loading">
              {{ loading ? 'Creating...' : 'Register' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-6">
            Already have an account?
            <NuxtLink to="/login" class="text-neon-green hover:underline">Login</NuxtLink>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSessionStore } from '~/stores/useSession'

definePageMeta({ layout: false })

const session = useSessionStore()
const router = useRouter()
const loading = ref(false)

onMounted(() => {
  if (session.isAuthenticated) {
    router.push('/')
  }
})

const form = reactive({
  alias: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  loading.value = true
  try {
    await session.register(form.alias, form.email, form.password)
    router.push('/')
  } catch (e) {
    alert('Registration failed: ' + (e.message || 'Unknown error'))
  } finally {
    loading.value = false
  }
}
</script>

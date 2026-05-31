<template>
  <div>
    <AppHeader />
    <main class="min-h-screen pt-24 pb-12 px-4">
      <div class="max-w-sm mx-auto">
        <div class="glass rounded-xl p-8">
          <h1 class="font-pixel text-2xl text-center text-white mb-6">Welcome back</h1>

          <form class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <input v-model="form.email" type="email" class="input-dark" required />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Password</label>
              <input v-model="form.password" type="password" class="input-dark" required />
            </div>
            <button type="submit" class="btn-primary w-full" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-6">
            No account?
            <NuxtLink to="/registro" class="text-neon-green hover:underline">Register</NuxtLink>
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
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  try {
    await session.login(form.email, form.password)
    router.push('/')
  } catch (e) {
    alert('Login failed: ' + (e.message || 'Invalid credentials'))
  } finally {
    loading.value = false
  }
}
</script>

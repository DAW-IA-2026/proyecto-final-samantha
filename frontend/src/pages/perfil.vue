<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="glass rounded-xl p-8 text-center">
      <div class="w-20 h-20 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">🎮</span>
      </div>
      <h1 class="font-pixel text-3xl text-white mb-2">{{ session.user?.alias }}</h1>
      <p class="text-gray-400 mb-8">{{ session.user?.email }}</p>

      <div class="flex items-center justify-center gap-4">
        <button @click="session.logout" class="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/stores/useSession'

definePageMeta({ middleware: 'auth' })

const session = useSessionStore()
</script>

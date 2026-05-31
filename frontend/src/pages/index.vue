<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 sm:py-28">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-neon-green rounded-full filter blur-[128px]" />
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple rounded-full filter blur-[128px]" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="font-pixel text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-up">
          Stop <span class="text-neon-green text-glow-green">hoarding</span>,<br />
          start <span class="text-neon-purple text-glow-purple">finishing</span>.
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-up" style="animation-delay: 0.1s">
          Your game backlog is out of control. We use a brilliantly absurd algorithm to tell you exactly what to play next. More dopamine, less decision paralysis.
        </p>

        <div v-if="session.isAuthenticated" class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style="animation-delay: 0.2s">
          <NuxtLink to="/juegos" class="btn-primary text-lg">
            🎮 View My Games
          </NuxtLink>
          <NuxtLink to="/juegos/nuevo" class="btn-secondary text-lg">
            + Add New Game
          </NuxtLink>
        </div>
        <div v-else class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style="animation-delay: 0.2s">
          <NuxtLink to="/registro" class="btn-primary text-lg">
            Get Started
          </NuxtLink>
          <NuxtLink to="/login" class="btn-secondary text-lg">
            I have an account
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-pixel text-3xl text-center mb-12">The Algorithm™</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="glass p-6 rounded-xl text-center">
            <div class="text-4xl mb-4">⭐</div>
            <h3 class="font-pixel text-xl text-white mb-2">Score</h3>
            <p class="text-gray-400">Metacritic user score. The higher, the better the game.</p>
          </div>
          <div class="glass p-6 rounded-xl text-center">
            <div class="text-4xl mb-4">⏱</div>
            <h3 class="font-pixel text-xl text-white mb-2">Time</h3>
            <p class="text-gray-400">Hours to complete. The lower, the faster the dopamine hit.</p>
          </div>
          <div class="glass p-6 rounded-xl text-center">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="font-pixel text-xl text-white mb-2">Priority</h3>
            <p class="text-gray-400">Score ÷ Time. High priority = instant gratification.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats preview (only if authenticated) -->
    <section v-if="session.isAuthenticated" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass rounded-2xl p-8 text-center">
          <p class="text-gray-400 text-lg mb-2">Current backlog</p>
          <p class="font-pixel text-6xl text-neon-green text-glow-green">{{ gameStore.games.length }}</p>
          <p class="text-gray-500 mt-2">games waiting for you</p>
          <NuxtLink to="/juegos/nuevo" class="inline-block mt-6 btn-secondary">
            Add one more? 🎮
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/stores/useSession'
import { useGameStore } from '~/stores/useGames'

const session = useSessionStore()
const gameStore = useGameStore()

onMounted(() => {
  if (session.isAuthenticated) {
    gameStore.fetchGames({ per_page: 100 })
  }
  gameStore.fetchCategories()
  gameStore.fetchTags()
})
</script>

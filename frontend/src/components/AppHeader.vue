<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-pixel text-neon-green text-glow-green">Needy games!</span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in publicNavItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="$route.path === item.path ? 'text-neon-green bg-neon-green/10' : 'text-gray-300 hover:text-white hover:bg-white/5'"
          >
            {{ item.label }}
          </NuxtLink>

          <template v-if="session.isAuthenticated">
            <NuxtLink
              v-for="item in visiblePrivateNavItems"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="$route.path === item.path ? 'text-neon-green bg-neon-green/10' : 'text-gray-300 hover:text-white hover:bg-white/5'"
            >
              {{ item.label }}
            </NuxtLink>
            <NuxtLink
              to="/perfil"
              class="px-4 py-2 rounded-lg text-sm font-medium text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
            >
              {{ session.user?.alias }}
            </NuxtLink>
            <button
              @click="session.logout()"
              class="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 rounded-lg text-sm font-medium text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
            >
              Login
            </NuxtLink>
          </template>
        </nav>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded-lg text-gray-300 hover:text-white"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden glass border-t border-white/5">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <NuxtLink
          v-for="item in publicNavItems"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="$route.path === item.path ? 'text-neon-green bg-neon-green/10' : 'text-gray-300 hover:text-white hover:bg-white/5'"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
          <template v-if="session.isAuthenticated">
            <NuxtLink
              v-for="item in visiblePrivateNavItems"
              :key="item.path"
            :to="item.path"
            class="block px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="$route.path === item.path ? 'text-neon-green bg-neon-green/10' : 'text-gray-300 hover:text-white hover:bg-white/5'"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <NuxtLink
            to="/perfil"
            class="block px-4 py-2 rounded-lg text-sm font-medium text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
            @click="mobileOpen = false"
          >
            {{ session.user?.alias }}
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="block px-4 py-2 rounded-lg text-sm font-medium text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
            @click="mobileOpen = false"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSessionStore } from '~/stores/useSession'

const session = useSessionStore()
const $route = useRoute()
const mobileOpen = ref(false)

const publicNavItems = [
  { path: '/', label: 'Home' }
]

const privateNavItems = [
  { path: '/juegos', label: 'My Games' },
  { path: '/juegos/nuevo', label: '+ Add Game' }
]

const visiblePrivateNavItems = computed(() =>
  privateNavItems.filter((item) => item.path !== $route.path)
)
</script>

<template>
  <div class="glass rounded-xl overflow-hidden card-glow transition-all duration-300 border border-dark-border">
    <!-- Cover Image -->
    <div class="relative aspect-[4/3] bg-dark-surface overflow-hidden">
      <img
        v-if="game.cover_image_url"
        :src="game.cover_image_url"
        :alt="game.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-6xl">🎮</span>
      </div>
      <div class="absolute top-2 right-2">
        <span :class="game.status === 'completed' ? 'status-completed' : 'status-pending'">
          {{ game.status === 'completed' ? 'Completed' : 'Pending' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h3 class="font-pixel text-lg text-white truncate" :title="game.name">
            {{ game.name }}
          </h3>
          <p class="text-sm text-gray-400 mt-1">{{ game.category?.name }}</p>
        </div>
        <div class="flex items-center space-x-1 shrink-0">
          <span class="text-yellow-400 text-sm">★</span>
          <span class="text-sm font-medium">{{ game.metacritic_score }}</span>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-3 text-sm text-gray-400">
        <div class="flex items-center gap-1">
          <span>⏱</span>
          <span>{{ game.hours_to_complete }}h</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-neon-green">⚡</span>
          <span class="font-medium text-neon-green">{{ game.priority_score }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="game.tags?.length" class="flex flex-wrap gap-1 mt-3">
        <span
          v-for="tag in game.tags"
          :key="tag.id"
          class="px-2 py-0.5 rounded text-xs bg-dark-bg text-gray-400 border border-dark-border"
        >
          {{ tag.name }}
        </span>
      </div>

      <!-- Rating if completed -->
      <div v-if="game.completion_rating" class="mt-3 flex items-center gap-1">
        <span
          v-for="i in 5"
          :key="i"
          class="text-sm"
          :class="i <= game.completion_rating ? 'text-yellow-400' : 'text-gray-600'"
        >
          ★
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        <NuxtLink
          :to="`/juegos/edicion/${game.id}`"
          class="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
        >
          Edit
        </NuxtLink>
        <button
          v-if="game.status !== 'completed'"
          @click="$emit('complete', game.id)"
          class="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center text-neon-green border border-neon-green/30 hover:bg-neon-green/10 transition-all"
        >
          Complete
        </button>
        <button
          @click="$emit('delete', game.id)"
          class="px-3 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all"
        >
          🗑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  game: { type: Object, required: true }
})

defineEmits(['complete', 'delete'])
</script>

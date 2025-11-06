<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

const isDark = ref(false)

// Carrega o tema salvo no localStorage ao montar
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    console.log('Dark mode enabled')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    console.log('Light mode enabled')
  }
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isDark"
    :data-state="isDark ? 'checked' : 'unchecked'"
    class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-primary"
    @click="toggleTheme"
  >
    <span
      :data-state="isDark ? 'checked' : 'unchecked'"
      class="pointer-events-none flex size-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    >
      <Moon v-if="isDark" class="size-3" />
      <Sun v-else class="size-3" />
    </span>
  </button>
</template>
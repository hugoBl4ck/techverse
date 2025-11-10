<template>
  <Toaster position="top-right" richColors :duration="4000" />
  <RouterView />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import { useFontSize } from '@/composables/useFontSize'

// Apply font size adjustments globally
useFontSize()
</script>


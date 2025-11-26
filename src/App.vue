<template>
  <Toaster position="top-right" richColors :duration="4000" />
  <RouterView />
  <PWAInstallBanner />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import { useFontSize } from '@/composables/useFontSize'
import PWAInstallBanner from '@/components/PWAInstallBanner.vue'

// Apply font size adjustments globally
useFontSize()
</script>

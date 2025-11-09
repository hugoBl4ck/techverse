<template>
  <Toaster position="top-right" richColors :duration="4000" />
  <div v-if="!loggedIn">
    <LoginView @loggedIn="onLoggedIn" />
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'
import LoginView from './views/LoginView.vue'

import { useFontSize } from '@/composables/useFontSize'

const router = useRouter()
const loggedIn = ref(false)

useFontSize()

const onLoggedIn = () => {
  loggedIn.value = true
  // Redirecionar para dashboard após login
  setTimeout(() => {
    router.push('/').catch(() => {})
  }, 100)
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loggedIn.value = true
    } else {
      loggedIn.value = false
    }
  })
})
</script>

<template>
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
import LoginView from './views/LoginView.vue'

import { useFontSize } from '@/composables/useFontSize' // Import useFontSize

const loggedIn = ref(false)

useFontSize() // Initialize the font size composable

const onLoggedIn = () => {
  // This function might become redundant, but we'll keep it for now
  // as the login view emits an event.
  loggedIn.value = true
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

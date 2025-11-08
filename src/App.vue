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

const loggedIn = ref(false)

const onLoggedIn = () => {
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

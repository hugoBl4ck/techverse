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
import { useTenant } from '@/composables/useTenant' // Import useTenant

const loggedIn = ref(false)
const { setTenant } = useTenant() // Get the setTenant function

const onLoggedIn = () => {
  // This function might become redundant, but we'll keep it for now
  // as the login view emits an event.
  loggedIn.value = true
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, set the tenant ID here.
      const tenantId = user.email.split('@')[1].split('.')[0]
      setTenant(tenantId)
      loggedIn.value = true
    } else {
      // User is signed out, clear the tenant ID.
      setTenant(null)
      loggedIn.value = false
    }
  })
})
</script>

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
import { useFontSize } from '@/composables/useFontSize' // Import useFontSize

const loggedIn = ref(false)
const { setTenant } = useTenant() // Get the setTenant function
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
      // User is signed in, set the tenant ID here.
      // TEMPORARY FIX: Hardcoding tenant ID for development/testing.
      // In a real application, this should be dynamically set based on user profile, custom claims, or selection.
      const tenantId = 'primeiraloja'; // REPLACE THIS WITH A REAL STORE ID FROM YOUR FIRESTORE 'stores' COLLECTION
      console.warn('WARNING: Tenant ID is hardcoded in App.vue. This should be dynamically set in production.');
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

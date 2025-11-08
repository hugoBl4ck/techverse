<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>
        <div class="mt-4">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login com Google
          </button>
        </div>
        <div v-if="error" class="mt-4 text-sm text-red-600">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth' // Added GoogleAuthProvider, signInWithPopup
import { useTenant } from '@/composables/useTenant'
import { auth } from '@/firebase/config' // Import auth from centralized config

const emit = defineEmits(['loggedIn'])
const email = ref('')
const password = ref('')
const error = ref(null)
const { setTenant } = useTenant()

const handleLogin = async () => {
  error.value = null
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const tenantId = userCredential.user.email.split('@')[1].split('.')[0] // Use userCredential.user.email
    setTenant(tenantId)
    emit('loggedIn')
  } catch (err) {
    error.value = err.message
  }
}

const handleGoogleLogin = async () => {
  error.value = null
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const tenantId = userCredential.user.email.split('@')[1].split('.')[0]
    setTenant(tenantId)
    emit('loggedIn')
  } catch (err) {
    error.value = err.message
  }
}
</script>

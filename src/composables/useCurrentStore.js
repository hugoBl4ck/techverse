import { ref, computed, watch } from 'vue';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const currentUser = ref(null);
const isLoading = ref(true);
let authReadyResolver = null;

const authReady = new Promise(resolve => {
  authReadyResolver = resolve;
});

let initialized = false;

function initializeAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    isLoading.value = false;
    if (authReadyResolver) {
      authReadyResolver(user);
      authReadyResolver = null; // Resolve only once
    }
  });
}

export function useCurrentStore() {
  initializeAuthListener();

  const storeId = computed(() => {
    return currentUser.value?.uid || null;
  });

  const isAuthenticated = computed(() => {
    return !!currentUser.value;
  });

  return {
    storeId,
    currentUser,
    isAuthenticated,
    isLoading,
    authReady, // Expose the promise
  };
}


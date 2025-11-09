import { ref, computed } from 'vue';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const currentUser = ref(null);
const isLoading = ref(true);

// Initialize auth state listener (singleton)
let initialized = false;

function initializeAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    isLoading.value = false;
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
  };
}

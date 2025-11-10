import { ref, computed, watch } from 'vue';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const currentUser = ref(null);
const storeIdValue = ref(null);
const isLoading = ref(true);
let authReadyResolver = null;

const authReady = new Promise(resolve => {
  authReadyResolver = resolve;
});

let initialized = false;

async function fetchStoreId(user) {
  if (!user) {
    storeIdValue.value = null;
    return null;
  }

  try {
    // Busca o documento do usuário em /users/{uid} para obter seu storeId
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const storeId = userData.storeId;
      if (storeId) {
        storeIdValue.value = storeId;
        return storeId;
      }
    }
    
    // Se não encontrar um storeId mapeado, log do erro
    console.warn(`Usuário ${user.uid} não tem um storeId associado no documento /users/${user.uid}`);
    storeIdValue.value = null;
    return null;
  } catch (error) {
    console.error('Erro ao buscar storeId:', error);
    storeIdValue.value = null;
    return null;
  }
}

function initializeAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user;
    await fetchStoreId(user);
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
    return storeIdValue.value || null;
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


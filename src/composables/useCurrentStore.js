import { ref, computed, watch } from 'vue';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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

async function trackUserLocation(user) {
  if (!user) return;

  try {
    // Verifica se já rastreou recentemente (para evitar chamadas excessivas à API)
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastTracked = userData.lastTracked?.toDate ? userData.lastTracked.toDate() : new Date(0);
      const now = new Date();
      const diffHours = (now - lastTracked) / (1000 * 60 * 60);

      // Só rastreia novamente se passou mais de 1 hora
      if (diffHours < 1) return;
    }

    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Falha ao obter dados de IP');

    const data = await response.json();

    await updateDoc(userDocRef, {
      lastIp: data.ip,
      lastLocation: `${data.city}, ${data.region_code} - ${data.country_code}`,
      userAgent: navigator.userAgent,
      lastTracked: new Date()
    });

  } catch (error) {
    console.error('Erro ao rastrear localização:', error);
  }
}

function initializeAuthListener() {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user;
    await fetchStoreId(user);
    isLoading.value = false;

    if (user) {
      trackUserLocation(user);
    }

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


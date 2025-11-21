import { ref, computed, watch } from 'vue';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const currentUser = ref(null);
const userProfile = ref(null); // New ref for Firestore user data
const storeIdValue = ref(null);
const isLoading = ref(true);
let authReadyResolver = null;
let userUnsubscribe = null; // Unsubscribe function for snapshot listener

const authReady = new Promise(resolve => {
  authReadyResolver = resolve;
});

let initialized = false;

// Listen to Firestore user document changes
function subscribeToUserProfile(user) {
  if (userUnsubscribe) {
    userUnsubscribe();
    userUnsubscribe = null;
  }

  if (!user) {
    userProfile.value = null;
    storeIdValue.value = null;
    return;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    userUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        userProfile.value = data;
        storeIdValue.value = data.storeId || null;
      } else {
        userProfile.value = null;
        storeIdValue.value = null;
      }
    }, (error) => {
      console.error("Error listening to user profile:", error);
    });
  } catch (error) {
    console.error("Error setting up user listener:", error);
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
    subscribeToUserProfile(user); // Start listening to Firestore updates

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

  // Computed property that merges Auth user with Firestore profile
  const userWithProfile = computed(() => {
    if (!currentUser.value) return null;
    return {
      ...currentUser.value,
      ...userProfile.value, // Merge Firestore data (avatarUrl, storeName, etc)
      // Ensure we don't overwrite critical Auth fields if needed, but Firestore usually takes precedence for custom fields
      displayName: userProfile.value?.nome || currentUser.value.displayName,
      photoURL: userProfile.value?.avatarUrl || currentUser.value.photoURL,
      email: currentUser.value.email // Email usually comes from Auth
    };
  });

  return {
    storeId,
    currentUser: userWithProfile, // Return the merged object
    rawAuthUser: currentUser, // Expose raw auth user just in case
    isAuthenticated,
    isLoading,
    authReady, // Expose the promise
  };
}


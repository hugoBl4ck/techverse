import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';

const storeId = ref(null);

export function useStore() {
  const { user } = useAuth();

  const fetchStoreId = async (uid) => {
    if (!uid) {
      storeId.value = null;
      return;
    }
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().storeId) {
        storeId.value = userDoc.data().storeId;
      } else {
        console.warn('User document or storeId not found.');
        storeId.value = null;
      }
    } catch (error) {
      console.error('Error fetching store ID:', error);
      storeId.value = null;
    }
  };

  watch(user, (currentUser) => {
    if (currentUser) {
      fetchStoreId(currentUser.uid);
    } else {
      storeId.value = null;
    }
  }, { immediate: true });

  return { storeId };
}

import { ref, onUnmounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const user = ref(null);
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return { user };
}

import { onMounted, onUnmounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { db } from '@/firebase/config.js'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export function useUserActivity() {
  const auth = getAuth()
  let activityInterval

  const updateUserActivity = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      const userDoc = doc(db, 'users', user.uid)
      await updateDoc(userDoc, {
        lastActive: serverTimestamp(),
      })
    } catch (error) {
      console.error('Erro ao atualizar atividade do usuário:', error)
    }
  }

  // Atualiza a atividade ao montar
  const startTracking = () => {
    updateUserActivity()

    // Atualiza a cada 2 minutos
    activityInterval = setInterval(updateUserActivity, 2 * 60 * 1000)

    // Também atualiza em eventos de interação (clique, digitação, movimento do mouse)
    const handleActivity = () => {
      updateUserActivity()
    }

    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity, true)

    return () => {
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity, true)
    }
  }

  const stopTracking = () => {
    if (activityInterval) {
      clearInterval(activityInterval)
    }
  }

  onMounted(() => {
    startTracking()
  })

  onUnmounted(() => {
    stopTracking()
  })

  return {
    updateUserActivity,
    startTracking,
    stopTracking,
  }
}

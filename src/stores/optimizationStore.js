import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOptimizationStore = defineStore('optimization', () => {
  const formData = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // We can't persist File objects in sessionStorage, so we keep them in memory (Pinia)
  // This works for SPA navigation (router.push) but not hard refresh
  const pendingUploads = ref([])

  const saveState = (data) => {
    formData.value = { ...data }
    // Persist text data to sessionStorage for backup against refresh
    sessionStorage.setItem('optimizationForm', JSON.stringify(data))
  }

  const restoreState = () => {
    // Try to restore from sessionStorage if Pinia is empty (e.g. after refresh)
    if (!formData.value.name) {
      const saved = sessionStorage.getItem('optimizationForm')
      if (saved) {
        try {
          formData.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved optimization form', e)
        }
      }
    }
    return {
      formData: formData.value,
      pendingUploads: pendingUploads.value
    }
  }

  const clearState = () => {
    formData.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
    pendingUploads.value = []
    sessionStorage.removeItem('optimizationForm')
  }

  const setPendingUploads = (files) => {
    pendingUploads.value = files
  }

  return {
    formData,
    pendingUploads,
    saveState,
    restoreState,
    clearState,
    setPendingUploads
  }
})

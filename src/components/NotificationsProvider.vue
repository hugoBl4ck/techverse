<template>
  <div class="fixed bottom-4 right-4 z-40 space-y-3 max-w-sm">
    <Transition
      v-for="notif in notifications"
      :key="notif.id"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-2"
    >
      <div 
        class="p-4 rounded-lg border-l-4 bg-background backdrop-blur-sm shadow-lg shadow-primary/10"
        :class="{
          'border-primary': notif.type === 'success',
          'border-accent': notif.type === 'warning',
          'border-destructive': notif.type === 'error',
          'border-primary': notif.type === 'info'
        }"
      >
        <div class="flex items-start gap-3">
          <div 
            class="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-primary/20': notif.type === 'success',
              'bg-accent/20': notif.type === 'warning',
              'bg-destructive/20': notif.type === 'error',
              'bg-primary/20': notif.type === 'info'
            }"
          >
            <span 
              class="text-xs font-bold"
              :class="{
                'text-primary': notif.type === 'success' || notif.type === 'info',
                'text-accent': notif.type === 'warning',
                'text-destructive': notif.type === 'error'
              }"
            >
              ✓
            </span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-foreground">{{ notif.title }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ notif.message }}</p>
          </div>
          <button 
            @click="removeNotification(notif.id)"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([])

// Função para adicionar notificação
const addNotification = (title, message, type = 'success', duration = 4000) => {
  const id = Date.now()
  notifications.value.push({
    id,
    title,
    message,
    type
  })

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

// Função para remover notificação
const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

// Exportar funções para uso global
defineExpose({
  addNotification,
  removeNotification
})
</script>

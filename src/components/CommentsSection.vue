<template>
  <div class="mt-12 border-t border-border pt-8">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <MessageSquare class="w-6 h-6" />
      Comentários ({{ comments.length }})
    </h3>

    <!-- Comment Form -->
    <div v-if="currentUser" class="mb-8 bg-muted/30 p-4 rounded-xl border border-border/50">
      <div class="flex gap-4">
        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="currentUser.photoURL" :src="currentUser.photoURL" class="w-full h-full object-cover" />
          <User v-else class="w-5 h-5 text-primary" />
        </div>
        <div class="flex-1">
          <textarea
            v-model="newComment"
            placeholder="Deixe seu comentário..."
            class="w-full bg-background border border-border rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y text-sm"
          ></textarea>
          <div class="flex justify-end mt-2">
            <Button @click="handleSubmit" :disabled="!newComment.trim() || isSubmitting" size="sm">
              {{ isSubmitting ? 'Enviando...' : 'Comentar' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mb-8 p-6 bg-muted/30 rounded-xl border border-border/50 text-center">
      <p class="text-muted-foreground mb-3">Faça login para participar da discussão.</p>
      <Button as-child variant="outline">
        <router-link :to="`/login?redirect=${route.fullPath}`">Fazer Login</router-link>
      </Button>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex gap-4 animate-pulse">
          <div class="w-10 h-10 bg-muted rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-muted rounded w-1/4"></div>
            <div class="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-8 text-muted-foreground">
        <p>Seja o primeiro a comentar!</p>
      </div>

      <div v-else v-for="comment in comments" :key="comment.id" class="flex gap-4 group">
        <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
          <img v-if="comment.autorAvatar" :src="comment.autorAvatar" class="w-full h-full object-cover" />
          <User v-else class="w-5 h-5 text-muted-foreground" />
        </div>
        <div class="flex-1">
          <div class="bg-muted/30 p-4 rounded-xl rounded-tl-none border border-border/50">
            <div class="flex justify-between items-start mb-2">
              <div>
                <span class="font-semibold text-sm block">{{ comment.autorNome }}</span>
                <span class="text-xs text-muted-foreground">{{ formatTimeAgo(comment.criadoEm) }}</span>
              </div>
              <button 
                v-if="canDelete(comment)" 
                @click="handleDelete(comment.id)"
                class="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                title="Excluir comentário"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <p class="text-sm text-foreground/90 whitespace-pre-wrap">{{ comment.texto }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { useFirestore } from '@/composables/useFirestore'
import { Button } from '@/components/ui/button'
import { MessageSquare, User, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps({
  newsId: {
    type: String,
    required: true
  }
})

const route = useRoute()
const { currentUser } = useCurrentStore()
const { getComments, addComment, deleteComment } = useFirestore()

const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const isSubmitting = ref(false)

const loadComments = async () => {
  loading.value = true
  try {
    comments.value = await getComments(props.newsId)
  } catch (error) {
    console.error('Erro ao carregar comentários:', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!newComment.value.trim()) return

  isSubmitting.value = true
  try {
    await addComment(props.newsId, {
      texto: newComment.value,
      autorId: currentUser.value.uid,
      autorNome: currentUser.value.displayName || currentUser.value.email.split('@')[0],
      autorAvatar: currentUser.value.photoURL || null
    })
    
    newComment.value = ''
    await loadComments()
    toast.success('Comentário enviado!')
  } catch (error) {
    console.error('Erro ao enviar comentário:', error)
    toast.error('Erro ao enviar comentário')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (commentId) => {
  if (!confirm('Tem certeza que deseja excluir este comentário?')) return

  try {
    await deleteComment(props.newsId, commentId)
    comments.value = comments.value.filter(c => c.id !== commentId)
    toast.success('Comentário excluído')
  } catch (error) {
    console.error('Erro ao excluir:', error)
    toast.error('Erro ao excluir comentário')
  }
}

const canDelete = (comment) => {
  if (!currentUser.value) return false
  // Admin (hardcoded for now based on email, ideally use claims)
  if (currentUser.value.email === 'hugovieira.eng@gmail.com') return true
  // Author
  return comment.autorId === currentUser.value.uid
}

const formatTimeAgo = (date) => {
  if (!date) return ''
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) return 'agora mesmo'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`
  
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  loadComments()
})
</script>

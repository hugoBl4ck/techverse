<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'vue-sonner';
import { ArrowLeft, MessageSquare, Send } from 'lucide-vue-next';
import ForumMessageItem from '@/components/forum/ForumMessageItem.vue';

const route = useRoute();
const router = useRouter();
const { currentUser } = useCurrentStore();

const topicId = route.params.id;
const topic = ref(null);
const messages = ref([]);
const newMessage = ref('');
const isLoading = ref(true);
const isSending = ref(false);

onMounted(async () => {
  await fetchTopic();
  subscribeToMessages();
});

async function fetchTopic() {
  try {
    const docRef = doc(db, 'forum_topics', topicId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      topic.value = { id: docSnap.id, ...docSnap.data() };
      
      // Increment view count (simple implementation)
      // In a real app, we might want to debounce this or track unique views
      updateDoc(docRef, {
        viewCount: increment(1)
      }).catch(console.error);
      
    } else {
      toast.error('Tópico não encontrado.');
      router.push('/forum');
    }
  } catch (error) {
    console.error('Erro ao carregar tópico:', error);
    toast.error('Erro ao carregar tópico.');
  } finally {
    isLoading.value = false;
  }
}

function subscribeToMessages() {
  const q = query(
    collection(db, 'forum_topics', topicId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
}

async function handleReply() {
  if (!newMessage.value.trim()) return;
  if (!currentUser.value) {
    toast.error('Faça login para responder.');
    return;
  }

  isSending.value = true;
  try {
    // Get member since date
    let memberSince = currentUser.value.metadata?.creationTime 
      ? new Date(currentUser.value.metadata.creationTime) 
      : new Date();

    const messageData = {
      content: newMessage.value.trim(),
      authorId: currentUser.value.uid,
      authorName: currentUser.value.displayName || 'Usuário',
      authorAvatar: currentUser.value.photoURL || null,
      authorMemberSince: memberSince,
      createdAt: serverTimestamp()
    };

    // Add message to subcollection
    await addDoc(collection(db, 'forum_topics', topicId, 'messages'), messageData);

    // Update topic metadata
    const topicRef = doc(db, 'forum_topics', topicId);
    await updateDoc(topicRef, {
      lastReplyAt: serverTimestamp(),
      replyCount: increment(1)
    });

    newMessage.value = '';
    toast.success('Resposta enviada!');
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
    toast.error('Erro ao enviar resposta.');
  } finally {
    isSending.value = false;
  }
}

// Helper to format the main topic post as a "message" for the list
const topicAsMessage = computed(() => {
  if (!topic.value) return null;
  return {
    id: 'main-post',
    content: topic.value.content,
    authorId: topic.value.authorId,
    authorName: topic.value.authorName,
    authorAvatar: topic.value.authorAvatar,
    authorMemberSince: topic.value.authorMemberSince,
    createdAt: topic.value.createdAt
  };
});
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-4xl">
    <Button variant="ghost" class="mb-6 pl-0 hover:pl-2 transition-all" @click="router.push('/forum')">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Voltar para o Fórum
    </Button>

    <div v-if="isLoading" class="space-y-4">
      <div class="h-12 w-3/4 bg-muted/40 animate-pulse rounded-lg"></div>
      <div class="h-64 bg-muted/40 animate-pulse rounded-lg"></div>
    </div>

    <div v-else-if="topic">
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold break-words">{{ topic.title }}</h1>
        <div class="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
          <span class="flex items-center gap-1">
            <MessageSquare class="h-4 w-4" />
            {{ messages.length }} respostas
          </span>
          <span>•</span>
          <span>Visualizado {{ topic.viewCount || 0 }} vezes</span>
        </div>
      </div>

      <Card class="mb-8 overflow-hidden">
        <!-- Main Topic Post -->
        <div class="bg-primary/5 border-b border-border/50">
          <ForumMessageItem 
            :message="topicAsMessage" 
            :is-author="currentUser && topic.authorId === currentUser.uid" 
          />
        </div>

        <!-- Replies -->
        <div class="divide-y divide-border/40">
          <ForumMessageItem 
            v-for="msg in messages" 
            :key="msg.id" 
            :message="msg"
            :is-author="currentUser && msg.authorId === currentUser.uid"
          />
        </div>
      </Card>

      <!-- Reply Form -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Responder</h3>
        <div v-if="currentUser" class="space-y-4">
          <Textarea 
            v-model="newMessage" 
            placeholder="Escreva sua resposta..." 
            class="min-h-[120px]"
          />
          <div class="flex justify-end">
            <Button @click="handleReply" :disabled="isSending || !newMessage.trim()">
              <Send class="mr-2 h-4 w-4" />
              {{ isSending ? 'Enviando...' : 'Enviar Resposta' }}
            </Button>
          </div>
        </div>
        <div v-else class="p-6 bg-muted/30 rounded-lg text-center border border-dashed border-muted-foreground/30">
          <p class="text-muted-foreground mb-4">Você precisa estar logado para responder.</p>
          <Button as-child>
            <router-link :to="{ name: 'Login', query: { redirect: route.fullPath } }">
              Fazer Login
            </router-link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

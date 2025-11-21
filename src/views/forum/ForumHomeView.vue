<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, MessageSquare, Clock } from 'lucide-vue-next';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const topics = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  await fetchTopics();
});

async function fetchTopics() {
  isLoading.value = true;
  try {
    const q = query(
      collection(db, 'forum_topics'),
      orderBy('lastReplyAt', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    topics.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar tópicos:", error);
  } finally {
    isLoading.value = false;
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}
</script>

<template>
  <div class="container mx-auto py-6 px-4 max-w-5xl">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Fórum TechVerse</h1>
        <p class="text-muted-foreground mt-1">Discuta, compartilhe conhecimento e tire dúvidas.</p>
      </div>
      <Button as-child>
        <router-link to="/forum/novo">
          <PlusCircle class="mr-2 h-4 w-4" />
          Novo Tópico
        </router-link>
      </Button>
    </div>

    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-muted/40 animate-pulse rounded-lg"></div>
    </div>

    <div v-else-if="topics.length === 0" class="text-center py-12 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/25">
      <MessageSquare class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
      <h3 class="text-lg font-medium">Nenhum tópico encontrado</h3>
      <p class="text-muted-foreground mb-6">Seja o primeiro a iniciar uma discussão!</p>
      <Button as-child variant="outline">
        <router-link to="/forum/novo">Criar Tópico</router-link>
      </Button>
    </div>

    <div v-else class="grid gap-4">
      <Card v-for="topic in topics" :key="topic.id" class="hover:border-primary/50 transition-colors cursor-pointer group">
        <router-link :to="`/forum/topico/${topic.id}`">
          <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-2">
            <div class="space-y-1">
              <CardTitle class="text-xl group-hover:text-primary transition-colors">
                {{ topic.title }}
              </CardTitle>
              <CardDescription class="line-clamp-1">
                Por {{ topic.authorName }} • {{ formatDate(topic.createdAt) }}
              </CardDescription>
            </div>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1" title="Respostas">
                <MessageSquare class="h-4 w-4" />
                <span>{{ topic.replyCount || 0 }}</span>
              </div>
              <div class="flex items-center gap-1" title="Última atividade">
                <Clock class="h-4 w-4" />
                <span>{{ formatDate(topic.lastReplyAt) }}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground line-clamp-2 text-sm">
              {{ topic.content }}
            </p>
          </CardContent>
        </router-link>
      </Card>
    </div>
  </div>
</template>

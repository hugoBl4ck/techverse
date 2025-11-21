<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'vue-sonner';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const { currentUser } = useCurrentStore();

const title = ref('');
const content = ref('');
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!title.value.trim() || !content.value.trim()) {
    toast.error('Preencha todos os campos.');
    return;
  }

  if (!currentUser.value) {
    toast.error('Você precisa estar logado para criar um tópico.');
    return;
  }

  isSubmitting.value = true;

  try {
    // Get user's registration date (member since)
    // We try to get it from the user document first, or fallback to auth creation time
    let memberSince = currentUser.value.metadata?.creationTime 
      ? new Date(currentUser.value.metadata.creationTime) 
      : new Date();
      
    // Try to fetch from firestore profile if available for more accuracy if needed
    // But for now, auth metadata is good enough or current time as fallback

    const topicData = {
      title: title.value.trim(),
      content: content.value.trim(),
      authorId: currentUser.value.uid,
      authorName: currentUser.value.displayName || 'Usuário',
      authorAvatar: currentUser.value.photoURL || null,
      authorMemberSince: memberSince,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastReplyAt: serverTimestamp(),
      replyCount: 0,
      viewCount: 0
    };

    const docRef = await addDoc(collection(db, 'forum_topics'), topicData);
    
    toast.success('Tópico criado com sucesso!');
    router.push(`/forum/topico/${docRef.id}`);
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    toast.error('Erro ao criar tópico. Tente novamente.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-3xl">
    <Button variant="ghost" class="mb-6 pl-0 hover:pl-2 transition-all" @click="router.back()">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Voltar para o Fórum
    </Button>

    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Tópico</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="title">Título do Tópico</Label>
          <Input 
            id="title" 
            v-model="title" 
            placeholder="Ex: Dúvida sobre formatação..." 
            class="text-lg font-medium"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="content">Conteúdo</Label>
          <Textarea 
            id="content" 
            v-model="content" 
            placeholder="Descreva sua dúvida ou discussão em detalhes..." 
            class="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter class="flex justify-end gap-4">
        <Button variant="outline" @click="router.back()" :disabled="isSubmitting">
          Cancelar
        </Button>
        <Button @click="handleSubmit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Publicando...' : 'Publicar Tópico' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

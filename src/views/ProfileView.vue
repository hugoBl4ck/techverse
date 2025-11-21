<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';
import { User, Store, Link, Mail } from 'lucide-vue-next';

const { currentUser } = useCurrentStore();
const isLoading = ref(false);
const isSaving = ref(false);

const profile = ref({
  nome: '',
  storeName: '',
  avatarUrl: '',
  email: ''
});

onMounted(async () => {
  if (currentUser.value) {
    await fetchProfile();
  }
});

async function fetchProfile() {
  isLoading.value = true;
  try {
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      profile.value = {
        nome: data.nome || data.displayName || '',
        storeName: data.storeName || '',
        avatarUrl: data.avatarUrl || '',
        email: data.email || currentUser.value.email
      };
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    toast.error('Erro ao carregar perfil.');
  } finally {
    isLoading.value = false;
  }
}

async function handleSave() {
  if (!currentUser.value) return;
  
  isSaving.value = true;
  try {
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      nome: profile.value.nome,
      storeName: profile.value.storeName,
      avatarUrl: profile.value.avatarUrl,
      updatedAt: new Date()
    });
    toast.success('Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    toast.error('Erro ao salvar perfil: ' + error.message);
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-8">Meu Perfil</h1>
    
    <Card>
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
            <User v-else class="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Gerencie suas informações e dados da loja</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" v-model="profile.email" disabled class="pl-9 bg-muted" />
          </div>
        </div>
        
        <div class="grid gap-2">
          <Label for="nome">Nome Completo</Label>
          <div class="relative">
            <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="nome" v-model="profile.nome" placeholder="Seu nome" class="pl-9" />
          </div>
        </div>
        
        <div class="grid gap-2">
          <Label for="storeName">Nome da Loja</Label>
          <div class="relative">
            <Store class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="storeName" v-model="profile.storeName" placeholder="Nome da sua assistência" class="pl-9" />
          </div>
        </div>
        
        <div class="grid gap-2">
          <Label for="avatarUrl">URL do Avatar</Label>
          <div class="relative">
            <Link class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="avatarUrl" v-model="profile.avatarUrl" placeholder="https://..." class="pl-9" />
          </div>
          <p class="text-xs text-muted-foreground">Cole o link de uma imagem para usar como avatar.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button @click="handleSave" :disabled="isSaving" class="w-full sm:w-auto">
          {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const props = defineProps({
  id: { type: String, default: null },
});

const router = useRouter();
const { storeId } = useCurrentStore();

const nome = ref('');
const telefone = ref('');
const email = ref('');
const isLoading = ref(false);

async function fetchCliente(id) {
  if (!id || !storeId.value) return;
  const docRef = doc(db, 'stores', storeId.value, 'clientes', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    nome.value = data.nome;
    telefone.value = data.telefone;
    email.value = data.email;
  } else {
    console.error('Cliente não encontrado!');
    toast.error('Cliente não encontrado!');
    router.push('/clientes');
  }
}

watch(() => props.id, (newId) => {
  fetchCliente(newId);
}, { immediate: true });

async function handleSubmit() {
  if (!nome.value) {
    toast.error('O nome é obrigatório.');
    return;
  }

  if (!storeId.value) {
    toast.error('Erro: Usuário não autenticado.');
    return;
  }

  isLoading.value = true;
  const loadingToast = toast.loading(props.id ? 'Atualizando cliente...' : 'Cadastrando cliente...');

  try {
    const clienteData = {
      nome: nome.value,
      telefone: telefone.value,
      email: email.value,
    };

    const clientesCol = collection(db, 'stores', storeId.value, 'clientes');

    if (props.id) {
      const docRef = doc(clientesCol, props.id);
      await updateDoc(docRef, clienteData);
      toast.success('Cliente atualizado com sucesso!', { id: loadingToast });
    } else {
      await addDoc(clientesCol, clienteData);
      toast.success('Cliente cadastrado com sucesso!', { id: loadingToast });
    }
    router.push('/clientes');
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    toast.error('Erro ao salvar cliente: ' + error.message, { id: loadingToast });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card class="fade-in">
    <CardHeader>
      <CardTitle>{{ props.id ? 'Editar Cliente' : 'Cadastrar Novo Cliente' }}</CardTitle>
      <CardDescription>Preencha os dados do cliente.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nome">Nome</Label>
          <Input id="nome" v-model="nome" type="text" placeholder="Nome completo do cliente" />
        </div>
        <div class="grid gap-2">
          <Label for="telefone">Telefone</Label>
          <Input id="telefone" v-model="telefone" type="tel" placeholder="(99) 99999-9999" />
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="email@exemplo.com" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleSubmit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Salvando...' : 'Salvar Cliente' }}
      </Button>
    </CardFooter>
  </Card>
</template>
<script setup>
import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useTenant } from '@/composables/useTenant';

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
const { tenant } = useTenant();
const storeId = tenant;

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
    console.error('No such document!');
    router.push('/clientes'); // Redirect if not found
  }
}

watch(storeId, (newStoreId) => {
  if (newStoreId) {
    fetchCliente(props.id);
  }
}, { immediate: true });


watch(() => props.id, (newId) => {
  if (storeId.value) {
    fetchCliente(newId);
  }
}, { immediate: true });

async function handleSubmit() {
  if (!nome.value || !storeId.value) {
    console.error('O nome é obrigatório e a loja precisa estar configurada.');
    return;
  }

  isLoading.value = true;
  try {
    const clienteData = {
      nome: nome.value,
      telefone: telefone.value,
      email: email.value,
    };

    const clientesCol = collection(db, 'stores', storeId.value, 'clientes');

    if (props.id) {
      // Update existing document
      const docRef = doc(clientesCol, props.id);
      await updateDoc(docRef, clienteData);
      console.log('Cliente atualizado!');
    } else {
      // Add new document
      await addDoc(clientesCol, clienteData);
      console.log('Cliente salvo!');
    }
    router.push('/clientes'); // Redirect to list after save/update
  } catch (error) {
    console.error('Erro ao salvar cliente: ', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Cadastrar Novo Cliente</CardTitle>
      <CardDescription>Preencha os dados do novo cliente.</CardDescription>
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
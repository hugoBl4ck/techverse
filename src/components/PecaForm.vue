<script setup>
import { ref } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc } from 'firebase/firestore';

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

const nome = ref('');
const quantidade = ref(0);
const preco = ref(0);
const isLoading = ref(false);

async function handleSubmit() {
  if (!nome.value) {
    console.error('O nome da peça é obrigatório.');
    return;
  }

  isLoading.value = true;
  try {
    await addDoc(collection(db, 'pecas'), {
      nome: nome.value,
      quantidade: quantidade.value,
      preco: preco.value,
    });
    console.log('Peça salva!');
    nome.value = '';
    quantidade.value = 0;
    preco.value = 0;
  } catch (error) {
    console.error('Erro ao salvar peça: ', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Cadastrar Nova Peça</CardTitle>
      <CardDescription>Preencha os dados da nova peça.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nome">Nome da Peça</Label>
          <Input id="nome" v-model="nome" type="text" placeholder="Nome da peça" />
        </div>
        <div class="grid gap-2">
          <Label for="quantidade">Quantidade</Label>
          <Input id="quantidade" v-model.number="quantidade" type="number" placeholder="0" />
        </div>
        <div class="grid gap-2">
          <Label for="preco">Preço</Label>
          <Input id="preco" v-model.number="preco" type="number" placeholder="0.00" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleSubmit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Salvando...' : 'Salvar Peça' }}
      </Button>
    </CardFooter>
  </Card>
</template>

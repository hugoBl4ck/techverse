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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const nome = ref('');
const quantidade = ref(0);
const precoCusto = ref(0);
const precoVenda = ref(0);
const tipo = ref('');
const socket = ref('');
const tipoRam = ref('');
const isLoading = ref(false);

const tiposPeca = [
  { value: 'cpu', label: 'CPU' },
  { value: 'placa-mae', label: 'Placa-Mãe' },
  { value: 'ram', label: 'Memória RAM' },
  { value: 'gpu', label: 'GPU' },
  { value: 'armazenamento', label: 'Armazenamento' },
  { value: 'fonte', label: 'Fonte' },
  { value: 'gabinete', label: 'Gabinete' },
];

async function handleSubmit() {
  if (!nome.value || !tipo.value) {
    console.error('Nome e Tipo da peça são obrigatórios.');
    return;
  }

  isLoading.value = true;
  try {
    await addDoc(collection(db, 'pecas'), {
      nome: nome.value,
      quantidade: quantidade.value,
      precoCusto: precoCusto.value,
      precoVenda: precoVenda.value,
      tipo: tipo.value,
      compatibilidade: {
        socket: socket.value,
        tipoRam: tipoRam.value,
      },
    });
    console.log('Peça salva!');
    nome.value = '';
    quantidade.value = 0;
    precoCusto.value = 0;
    precoVenda.value = 0;
    tipo.value = '';
    socket.value = '';
    tipoRam.value = '';
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
          <Label for="tipo">Tipo da Peça</Label>
          <Select v-model="tipo">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="t in tiposPeca" :key="t.value" :value="t.value">
                {{ t.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="quantidade">Quantidade</Label>
          <Input id="quantidade" v-model.number="quantidade" type="number" placeholder="0" />
        </div>
        <div class="grid gap-2">
          <Label for="precoCusto">Preço de Custo</Label>
          <Input id="precoCusto" v-model.number="precoCusto" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="precoVenda">Preço de Venda</Label>
          <Input id="precoVenda" v-model.number="precoVenda" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="socket">Socket</Label>
          <Input id="socket" v-model="socket" type="text" placeholder="Ex: AM4" />
        </div>
        <div class="grid gap-2">
          <Label for="tipoRam">Tipo de RAM</Label>
          <Input id="tipoRam" v-model="tipoRam" type="text" placeholder="Ex: DDR4" />
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
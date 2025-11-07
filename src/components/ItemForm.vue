<script setup>
import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // Added Textarea import

const props = defineProps({
  id: { type: String, default: null },
  itemPreenchido: { type: Object, default: null }
});

const emit = defineEmits(['item-salvo']);

const router = useRouter();

const nome = ref('');
const quantidade = ref(0);
const precoCusto = ref(0);
const precoVenda = ref(0);
const tipo = ref('');
const socket = ref('');
const tipoRam = ref('');
const imageUrl = ref('');
const descricao = ref(''); // Added description ref
const isLoading = ref(false);

const tiposItem = [
  { value: 'cpu', label: 'CPU' },
  { value: 'placa-mae', label: 'Placa-Mãe' },
  { value: 'ram', label: 'Memória RAM' },
  { value: 'gpu', label: 'GPU' },
  { value: 'armazenamento', label: 'Armazenamento' },
  { value: 'fonte', label: 'Fonte' },
  { value: 'gabinete', label: 'Gabinete' },
  { value: 'watercooler', label: 'Watercooler' },
  { value: 'aircooler', label: 'Air Cooler' },
  { value: 'ventoinhas', label: 'Ventoinhas' },
  { value: 'pasta termica', label: 'Pasta Térmica' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'teclado', label: 'Teclado' },
  { value: 'controle', label: 'Controle' },
  { value: 'controladoras', label: 'Controladoras' },
  { value: 'outro', label: 'Outro' },
];

const tipoRamOptions = [
  { value: 'DDR3', label: 'DDR3' },
  { value: 'DDR4', label: 'DDR4' },
  { value: 'DDR5', label: 'DDR5' },
];

const socketOptions = [
  { value: 'AM4', label: 'AM4' },
  { value: 'AM5', label: 'AM5' },
  { value: 'LGA1200', label: 'LGA1200' },
  { value: 'LGA1700', label: 'LGA1700' },
  { value: 'TR4', label: 'TR4' },
  { value: 'sTRX4', label: 'sTRX4' },
  { value: 'Outro', label: 'Outro' },
];

async function fetchItem(id) {
  if (!id) return;
  const docRef = doc(db, 'items', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    nome.value = data.nome;
    quantidade.value = data.quantidade;
    precoCusto.value = data.precoCusto;
    precoVenda.value = data.precoVenda;
    tipo.value = data.tipo;
    socket.value = data.compatibilidade?.socket || '';
    tipoRam.value = data.compatibilidade?.tipoRam || '';
    imageUrl.value = data.imageUrl || '';
    descricao.value = data.descricao || ''; // Fetch description
  } else {
    console.error('No such document!');
    router.push('/inventario'); // Redirect if not found
  }
}

watch(() => props.id, (newId) => {
  fetchItem(newId);
}, { immediate: true });

watch(() => props.itemPreenchido, (newItem) => {
  if (newItem) {
    nome.value = newItem.nome || '';
    tipo.value = newItem.tipo || '';
    // Reset other fields for the new entry
    quantidade.value = 1;
    precoCusto.value = 0;
    precoVenda.value = 0;
    socket.value = newItem.compatibilidade?.socket || '';
    tipoRam.value = newItem.compatibilidade?.tipoRam || '';
    imageUrl.value = newItem.imageUrl || '';
    descricao.value = newItem.descricao || ''; // Set description
  }
}, { deep: true, immediate: true });

async function handleSubmit() {
  if (!nome.value || !tipo.value) {
    console.error('Nome e Tipo do item são obrigatórios.');
    return;
  }

  isLoading.value = true;
  try {
    const itemData = {
      nome: nome.value,
      quantidade: quantidade.value,
      precoCusto: precoCusto.value,
      precoVenda: precoVenda.value,
      tipo: tipo.value,
      imageUrl: imageUrl.value,
      descricao: descricao.value, // Added description
      compatibilidade: {
        socket: socket.value,
        tipoRam: tipoRam.value,
      },
    }; // Added missing brace

    if (props.id) {
      // Update existing document
      const docRef = doc(db, 'items', props.id);
      await updateDoc(docRef, itemData);
      console.log('Item atualizado!');
      router.push('/inventario'); // Redirect to list after update
    } else {
      // Add new document
      const docRef = await addDoc(collection(db, 'items'), itemData);
      console.log('Item salvo!');
      emit('item-salvo', { id: docRef.id, ...itemData });
      // Reset form
      nome.value = '';
      tipo.value = '';
      quantidade.value = 0;
      precoCusto.value = 0;
      precoVenda.value = 0;
      socket.value = '';
      tipoRam.value = '';
      imageUrl.value = '';
      descricao.value = ''; // Reset description
    }
  } catch (error) {
    console.error('Erro ao salvar item: ', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Cadastrar Novo Item</CardTitle>
      <CardDescription>Preencha os dados do novo item.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nome">Nome do Item</Label>
          <Input id="nome" v-model="nome" type="text" placeholder="Nome do item" />
        </div>
        <div class="grid gap-2">
          <Label for="tipo">Tipo do Item</Label>
          <Select v-model="tipo">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="t in tiposItem" :key="t.value" :value="t.value">
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
          <Select v-model="socket">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Socket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="s in socketOptions" :key="s.value" :value="s.value">
                {{ s.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="tipoRam">Tipo de RAM</Label>
          <Select v-model="tipoRam">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Tipo de RAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="t in tipoRamOptions" :key="t.value" :value="t.value">
                {{ t.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="imageUrl">URL da Imagem</Label>
          <Input id="imageUrl" v-model="imageUrl" type="text" placeholder="https://exemplo.com/imagem.png" />
        </div>
        <div class="grid gap-2">
          <Label for="descricao">Descrição</Label>
          <Textarea id="descricao" v-model="descricao" placeholder="Descrição detalhada do item" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleSubmit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Salvando...' : 'Salvar Item' }}
      </Button>
    </CardFooter>
  </Card>
</template>
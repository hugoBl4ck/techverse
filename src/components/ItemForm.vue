<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useItem } from '@/composables/useItem.js';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps({
  id: { type: String, default: null },
  itemPreenchido: { type: Object, default: null }
});

const emit = defineEmits(['item-salvo']);
const router = useRouter();

const { form, isLoading, error, saveItem, uploadImage } = useItem(props.id);

watch(() => props.itemPreenchido, (newItem) => {
  if (newItem) {
    form.nome = newItem.nome || '';
    form.tipo = newItem.tipo || '';
    form.quantidade = 1;
    form.precoCusto = 0;
    form.precoVenda = 0;
    form.compatibilidade = newItem.compatibilidade || { socket: '', tipoRam: '' };
    form.imageUrl = newItem.imageUrl || '';
    form.descricao = newItem.descricao || '';
  }
}, { deep: true, immediate: true });

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      form.imageUrl = imageUrl;
    }
  }
}

async function handleSubmit() {
  await saveItem();
  if (!error.value) {
    if (props.id) {
      router.push('/inventario');
    } else {
      emit('item-salvo', { ...form });
      // Reset form
      Object.assign(form, {
        nome: '',
        quantidade: 0,
        precoCusto: 0,
        precoVenda: 0,
        tipo: '',
        compatibilidade: { socket: '', tipoRam: '' },
        imageUrl: '',
        descricao: '',
      });
    }
  }
}

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
  { value: 'LGA1151', label: 'LGA1151' },
  { value: 'LGA1200', label: 'LGA1200' },
  { value: 'LGA1700', label: 'LGA1700' },
  { value: 'TR4', label: 'TR4' },
  { value: 'sTRX4', label: 'sTRX4' },
  { value: 'Intel', label: 'Intel (Outros)' },
  { value: 'Outro', label: 'Outro' },
];
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ id ? 'Editar Item' : 'Cadastrar Novo Item' }}</CardTitle>
      <CardDescription>Preencha os dados do item.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nome">Nome do Item</Label>
          <Input id="nome" v-model="form.nome" type="text" placeholder="Nome do item" required />
        </div>
        <div class="grid gap-2">
          <Label for="tipo">Tipo do Item</Label>
          <Select v-model="form.tipo" required>
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
          <Input id="quantidade" v-model.number="form.quantidade" type="number" placeholder="0" required />
        </div>
        <div class="grid gap-2">
          <Label for="precoCusto">Preço de Custo</Label>
          <Input id="precoCusto" v-model.number="form.precoCusto" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="precoVenda">Preço de Venda</Label>
          <Input id="precoVenda" v-model.number="form.precoVenda" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="socket">Socket</Label>
          <Select v-model="form.compatibilidade.socket">
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
          <Select v-model="form.compatibilidade.tipoRam">
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
          <Input id="imageUrl" v-model="form.imageUrl" type="text" placeholder="https://exemplo.com/imagem.png" />
        </div>
        <div class="grid gap-2">
          <Label for="imageFile">Ou envie uma imagem</Label>
          <Input id="imageFile" type="file" @change="handleFileChange" />
        </div>
        <div class="grid gap-2">
          <Label for="descricao">Descrição</Label>
          <Textarea id="descricao" v-model="form.descricao" placeholder="Descrição detalhada do item" />
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      </div>
    </CardContent>
    <CardFooter>
      <Button @click="handleSubmit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Salvando...' : (id ? 'Salvar Alterações' : 'Salvar Item') }}
      </Button>
    </CardFooter>
  </Card>
</template>
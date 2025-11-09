<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Assistente de Marketing com IA</h1>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Gerador de Textos de Venda</CardTitle>
        <CardDescription>Selecione um item do seu inventário para gerar textos de venda otimizados para redes sociais.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1 w-full">
          <Label for="item-select">Selecione o Item</Label>
          <Select v-model="selectedItemId" id="item-select">
            <SelectTrigger>
              <SelectValue placeholder="Escolha um item do inventário..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in items" :key="item.id" :value="item.id">
                {{ item.nome }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button @click="handleGenerate" :disabled="!selectedItemId || isGenerating" class="w-full sm:w-auto mt-4 sm:mt-0 self-end">
          <Loader2 v-if="isGenerating" class="mr-2 h-4 w-4 animate-spin" />
          {{ isGenerating ? 'Gerando...' : 'Gerar Textos' }}
        </Button>
      </CardContent>
    </Card>

    <div v-if="isGenerating" class="text-center text-muted-foreground">
      <p>Aguarde, a IA está criando os textos...</p>
    </div>

    <div v-if="generatedCopy" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="(text, platform) in generatedCopy" :key="platform">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle class="capitalize">{{ platform.replace(/([A-Z])/g, ' $1') }}</CardTitle>
          <Button variant="ghost" size="icon" @click="copyToClipboard(text)">
            <Copy class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p class="text-sm whitespace-pre-wrap">{{ text }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy } from 'lucide-vue-next';


const items = ref([]);
const selectedItemId = ref(null);
const isLoadingItems = ref(true);
const isGenerating = ref(false);
const generatedCopy = ref(null);

async function fetchItems() {
  isLoadingItems.value = true;
  try {
    const itemsCol = collection(db, 'itens');
    const itemsSnapshot = await getDocs(itemsCol);
    items.value = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar itens do inventário:", error);
  } finally {
    isLoadingItems.value = false;
  }
}



async function handleGenerate() {
  if (!selectedItemId.value) return;

  const selectedItem = items.value.find(item => item.id === selectedItemId.value);
  if (!selectedItem) return;

  isGenerating.value = true;
  generatedCopy.value = null;
  try {
    const response = await fetch('/api/generate-sales-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: selectedItem }),
    });

    if (!response.ok) {
      throw new Error('A resposta da API não foi bem-sucedida.');
    }

    generatedCopy.value = await response.json();
  } catch (error) {
    console.error("Erro ao gerar textos de venda:", error);
    alert('Ocorreu um erro ao gerar os textos. Tente novamente.');
  } finally {
    isGenerating.value = false;
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  } catch (err) {
    console.error('Falha ao copiar texto: ', err);
    alert('Não foi possível copiar o texto.');
  }
}
</script>
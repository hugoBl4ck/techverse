<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Assistente de Marketing com IA</h1>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Gerador de Conteúdo de Marketing Técnico</CardTitle>
        <CardDescription>Crie anúncios profissionais e técnicos para componentes de hardware. Textos otimizados para Instagram, WhatsApp, Facebook e Email Marketing.</CardDescription>
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

    <div v-if="error" class="text-center text-red-500 p-4">
      <p>{{ error }}</p>
    </div>

    <div v-if="generatedCopy && Object.keys(generatedCopy).length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card v-for="platform in ['instagramPost', 'whatsappStatus', 'facebookPost', 'emailMarketing']" v-show="generatedCopy[platform]" :key="platform">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ getPlatformName(platform) }}
          </CardTitle>
          <Button variant="ghost" size="icon" @click="copyToClipboard(generatedCopy[platform])">
            <Copy class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div class="text-xs text-muted-foreground mb-2">
            {{ getPlatformDescription(platform) }}
          </div>
          <div class="mt-3 p-3 bg-muted/50 rounded-md max-h-96 overflow-y-auto">
            <p class="text-sm whitespace-pre-wrap">{{ generatedCopy[platform] }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
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
const error = ref(null);
const { storeId, authReady } = useCurrentStore();

// Watch para quando storeId está pronto
watch(storeId, (newStoreId) => {
  if (newStoreId) {
    console.log('Marketing: StoreId pronto:', newStoreId);
    fetchItems();
  }
}, { immediate: true });

async function fetchItems() {
  isLoadingItems.value = true;
  try {
    const currentStoreId = storeId.value;
    if (!currentStoreId) {
      console.error("Nenhuma loja encontrada para o usuário");
      alert("Erro ao carregar inventário. Nenhuma loja encontrada.");
      return;
    }

    const itemsCol = collection(db, `stores/${currentStoreId}/itens`);
    const itemsSnapshot = await getDocs(itemsCol);
    items.value = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (items.value.length === 0) {
      alert("Nenhum item cadastrado no inventário. Cadastre itens primeiro.");
    }
  } catch (error) {
    console.error("Erro ao buscar itens do inventário:", error);
    alert("Erro ao carregar inventário. Verifique se há itens cadastrados.");
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
  error.value = null;
  try {
    const response = await fetch('/api/generate-sales-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: selectedItem }),
    });

    if (!response.ok) {
      throw new Error('A resposta da API não foi bem-sucedida.');
    }

    const data = await response.json();
    generatedCopy.value = data;
  } catch (err) {
    console.error("Erro ao gerar textos de venda:", err);
    error.value = 'Erro ao gerar os textos. Verifique o console para mais detalhes.';
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

function getPlatformName(platform) {
  const names = {
    instagramPost: '📸 Instagram Post',
    whatsappStatus: '💬 WhatsApp Status',
    facebookPost: '📘 Facebook Post',
    emailMarketing: '📧 Email Marketing',
  };
  return names[platform] || platform;
}

function getPlatformDescription(platform) {
  const descriptions = {
    instagramPost: 'Post técnico com especificações e call-to-action',
    whatsappStatus: 'Status curto e direto para conversão rápida',
    facebookPost: 'Post detalhado com informações técnicas completas',
    emailMarketing: 'Email profissional com consultoria técnica',
  };
  return descriptions[platform] || '';
}

onMounted(async () => {
  await authReady;
  // fetchItems é chamado automaticamente pelo watch quando storeId está pronto
});
</script>
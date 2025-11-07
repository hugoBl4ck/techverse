<script setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ItemChip from '@/components/kit/ItemChip.vue';
import ItemForm from '@/components/ItemForm.vue';

const anuncioInput = ref('');
const isLoadingIA = ref(false);
const itemsEncontrados = ref([]);
const itemSelecionado = ref(null);

async function handleAnalisar() {
  if (!anuncioInput.value.trim()) {
    alert("Por favor, cole um anúncio primeiro.");
    return;
  }
  
  isLoadingIA.value = true;
  itemsEncontrados.value = []; 

  try {
    const response = await fetch('/api/parse-kit', {
      method: 'POST',
      
      // ===== ESTA É A CORREÇÃO CRUCIAL (1) =====
      headers: {
        'Content-Type': 'application/json' 
      },
      // ==========================================

      // ===== ESTA É A CORREÇÃO CRUCIAL (2) =====
      // Garante que estamos enviando um OBJETO JSON
      body: JSON.stringify({ texto: anuncioInput.value })
      // ==========================================
    });

    if (!response.ok) {
      // Isso vai capturar o erro 400 da API e exibir
      const errorData = await response.json();
      const errorMessage = errorData.details ? `${errorData.error}: ${JSON.stringify(errorData.details)}` : (errorData.error || 'A API retornou um erro');
      throw new Error(errorMessage);
    }

    const data = await response.json();
    itemsEncontrados.value = data.componentes || [];

  } catch (error) {
    console.error("Erro ao analisar anúncio:", error);
    // Exibe o erro real da API (ex: "Nenhum texto fornecido")
    alert(`Houve um erro: ${error.message}`); 
  } finally {
    isLoadingIA.value = false;
  }
}

function selecionarItem(item) {
  itemSelecionado.value = item;
}

function onItemSalvo(itemSalvo) {
  // Remove the saved item from the list
  itemsEncontrados.value = itemsEncontrados.value.filter(p => p.nome !== itemSalvo.nome);
  // Clear the selection
  itemSelecionado.value = null;
}
</script>

<template>
  <div class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Coluna 1: Analisador de IA -->
      <Card>
        <CardHeader>
          <CardTitle>Importar de Anúncio</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <textarea
            v-model="anuncioInput"
            placeholder="Cole aqui o texto do anúncio do kit ou lista de itens..."
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
            :disabled="isLoadingIA"
          />
          <Button @click="handleAnalisar" :disabled="isLoadingIA" class="w-full">
            <span v-if="isLoadingIA">Analisando...</span>
            <span v-else>Analisar Anúncio</span>
          </Button>

          <div v-if="itemsEncontrados.length > 0" class="pt-4">
            <h3 class="font-semibold mb-2">Itens Encontrados (Clique para validar):</h3>
            <div class="flex flex-col gap-2">
              <div
                v-for="(item, index) in itemsEncontrados"
                :key="index"
                @click="selecionarItem(item)"
                class="cursor-pointer"
              >
                <ItemChip :item="item" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Coluna 2: Validação e Cadastro -->
      <Card>
        <CardHeader>
          <CardTitle>Validar e Salvar Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="!itemSelecionado" class="text-center text-muted-foreground h-full flex items-center justify-center">
            <p>Selecione um item da lista para validar e salvar.</p>
          </div>
          <ItemForm
            v-else
            :item-preenchido="itemSelecionado"
            @item-salvo="onItemSalvo"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
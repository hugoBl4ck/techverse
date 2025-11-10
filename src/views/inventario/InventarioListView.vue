<script setup>
import { ref, watch, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { Pencil, Package, PlusCircle, Trash2, List, Grid3X3 } from 'lucide-vue-next'
import { Skeleton } from '@/components/ui/skeleton'

const { storeId } = useCurrentStore()
const items = ref([])
const isLoading = ref(true)
const viewMode = ref(localStorage.getItem('inventarioViewMode') || 'cards')

const colorMap = {
  cpu: { bg: 'bg-red-500', text: 'text-red-500' },
  'placa-mae': { bg: 'bg-blue-500', text: 'text-blue-500' },
  ram: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  gpu: { bg: 'bg-green-500', text: 'text-green-500' },
  armazenamento: { bg: 'bg-purple-500', text: 'text-purple-500' },
  fonte: { bg: 'bg-gray-500', text: 'text-gray-500' },
  gabinete: { bg: 'bg-indigo-500', text: 'text-indigo-500' },
  outro: { bg: 'bg-gray-300', text: 'text-gray-300' },
};

function getCategoryColors(item) {
  const tipo = item?.tipo || 'outro';
  return colorMap[tipo] || colorMap.outro;
}

// Agrupa os itens por categoria
const itemsAgrupados = computed(() => {
  const agrupados = items.value.reduce((acc, item) => {
    const tipo = item.tipo || 'outro';
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(item);
    return acc;
  }, {});
  console.log('🔄 itemsAgrupados computado:', agrupados);
  console.log('📊 items.value no computed:', items.value);
  return agrupados;
});

// Mapeia os tipos para nomes mais amigáveis
const nomesCategoria = {
  cpu: 'CPUs',
  'placa-mae': 'Placas-Mãe',
  ram: 'Memórias RAM',
  gpu: 'Placas de Vídeo',
  armazenamento: 'Armazenamento',
  fonte: 'Fontes de Alimentação',
  gabinete: 'Gabinetes',
  outro: 'Outros'
};

const orderedCategories = [
  'placa-mae',
  'cpu',
  'gpu',
  'ram',
  'armazenamento',
  'fonte',
  'gabinete',
  'outro',
];

async function fetchItems() {
  if (!storeId.value) {
    console.error('❌ InventarioListView - StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    console.log('📊 InventarioListView - StoreId:', storeId.value);
    const itemsCol = collection(db, 'stores', storeId.value, 'itens');
    console.log('🔍 Buscando itens de:', `stores/${storeId.value}/itens`);
    
    const querySnapshot = await getDocs(itemsCol);
    console.log('✅ Itens encontrados:', querySnapshot.size);
    
    items.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('📦 Inventário carregado:', items.value.length, 'itens');
    console.log('📋 Itens:', items.value);
    console.log('📊 isLoading:', isLoading.value);
    console.log('🏷️ itemsAgrupados:', itemsAgrupados.value);
  } catch (error) {
    console.error('❌ Erro ao carregar inventário:', error);
    toast.error('Erro ao carregar inventário: ' + error.message);
  } finally {
    isLoading.value = false;
    console.log('✅ Finalizado - isLoading setado para false');
  }
}

async function deleteItem(itemId, itemName) {
  const confirmDelete = window.confirm(
    `Tem certeza que deseja deletar "${itemName}"?\n\nEsta ação não pode ser desfeita.`
  );

  if (!confirmDelete) return;

  if (!storeId.value) {
    toast.error('Erro: StoreId não disponível');
    return;
  }

  const toastId = toast.loading('Deletando item...');

  try {
    const itemDocRef = doc(db, 'stores', storeId.value, 'itens', itemId);
    await deleteDoc(itemDocRef);
    
    // Remove do array local
    items.value = items.value.filter(item => item.id !== itemId);
    
    toast.success('Item deletado com sucesso!', { id: toastId });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    toast.error('Erro ao deletar item: ' + error.message, { id: toastId });
  }
}

function changeViewMode(mode) {
  viewMode.value = mode;
  localStorage.setItem('inventarioViewMode', mode);
}

// Watch para quando storeId está pronto
watch(
  () => storeId.value,
  (newStoreId) => {
    if (newStoreId) {
      console.log('🎯 InventarioListView - StoreId pronto:', newStoreId);
      fetchItems();
    }
  },
  { immediate: true }
);

// Estilo para o padrão de pontos a ser injetado no head
const dotPatternStyle = `
  .pattern-dots {
    background-image: radial-gradient(currentColor 2px, transparent 2px);
    background-size: 16px 16px;
  }
`;

</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Injeta o estilo do padrão no head do documento -->
    <Teleport to="head">
      <style>{{ dotPatternStyle }}</style>
    </Teleport>

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Inventário de Itens</h1>
        <p class="text-sm text-muted-foreground mt-1">{{ items.length }} itens no inventário</p>
      </div>
      <div class="flex gap-2 items-center">
        <!-- View Mode Toggle -->
        <div class="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-background': viewMode === 'cards' }"
            @click="changeViewMode('cards')"
            title="Visualizar como cards"
          >
            <Grid3X3 class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-background': viewMode === 'list' }"
            @click="changeViewMode('list')"
            title="Visualizar como lista"
          >
            <List class="h-4 w-4" />
          </Button>
        </div>
        <RouterLink to="/inventario/novo">
          <Button>
            <PlusCircle class="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Loading State com Skeleton -->
    <div v-if="isLoading" class="space-y-8">
      <p class="text-muted-foreground">Carregando inventário...</p>
      <div v-for="i in 3" :key="i" class="space-y-4">
        <Skeleton height="2rem" width="30%" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton height="15rem" v-for="j in 4" :key="j" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-16 fade-in">
      <p class="text-muted-foreground mb-4">items.length: {{ items.length }}</p>
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Package class="h-10 w-10 text-primary" />
      </div>
      <h3 class="text-xl font-semibold mb-2">Inventário vazio</h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        Adicione seus primeiros itens para começar a gerenciar seu estoque
      </p>
      <Button size="lg" as-child>
        <RouterLink to="/inventario/novo">
          <PlusCircle class="mr-2 h-5 w-5" />
          Adicionar Primeiro Item
        </RouterLink>
      </Button>
    </div>

    <!-- Debug Info -->
    <div v-if="!isLoading" class="mb-4 p-3 bg-blue-100 text-blue-900 rounded text-sm">
      <p><strong>Debug:</strong> items.length={{ items.length }}, isLoading={{ isLoading }}, keys={{ Object.keys(itemsAgrupados).join(', ') }}</p>
    </div>

    <!-- Seções de Categoria -->
    <div v-if="!isLoading && items.length > 0" class="space-y-10">
      <section v-for="tipo in orderedCategories" :key="tipo" v-if="itemsAgrupados[tipo]">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b pb-2">
          {{ nomesCategoria[tipo] || tipo }} ({{ itemsAgrupados[tipo].length }})
        </h2>

        <!-- CARDS VIEW -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(item, index) in itemsAgrupados[tipo]" 
            :key="item.id"
            :class="`fade-in fade-in-delay-${Math.min(index + 1, 5)} group rounded-lg overflow-hidden border bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col card-hover`"
          >
            <!-- Image Section -->
            <div class="h-36 relative">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.nome"
                   class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-muted flex items-center justify-center">
                <Package class="size-12 text-muted-foreground" />
              </div>
              <!-- Category Tag -->
              <span :class="[getCategoryColors(item).bg, 'absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full']">
                {{ item.tipo }}
              </span>
            </div>

            <!-- Content Section -->
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-base text-foreground mb-2 truncate" :title="item.nome">{{ item.nome }}</h3>
                <div class="text-sm text-muted-foreground space-y-1">
                  <p><strong>Estoque:</strong> {{ item.quantidade }} unidades</p>
                  <p><strong>Preço:</strong> R$ {{ item.precoVenda?.toFixed(2) }}</p>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-2 mt-4">
                <RouterLink :to="`/inventario/${item.id}/editar`" class="flex-1">
                  <Button variant="outline" size="sm" class="w-full">
                    <Pencil class="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </RouterLink>
                <Button 
                  variant="destructive" 
                  size="sm"
                  @click="deleteItem(item.id, item.nome)"
                  title="Deletar item"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="text-left p-3 font-semibold">Imagem</th>
                <th class="text-left p-3 font-semibold">Nome</th>
                <th class="text-left p-3 font-semibold">Estoque</th>
                <th class="text-right p-3 font-semibold">Preço Custo</th>
                <th class="text-right p-3 font-semibold">Preço Venda</th>
                <th class="text-center p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in itemsAgrupados[tipo]"
                :key="item.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="p-3">
                  <div class="h-12 w-12 rounded border bg-muted flex items-center justify-center overflow-hidden">
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.nome" class="h-full w-full object-cover">
                    <Package v-else class="h-6 w-6 text-muted-foreground" />
                  </div>
                </td>
                <td class="p-3">
                  <div>
                    <p class="font-medium">{{ item.nome }}</p>
                    <span :class="[getCategoryColors(item).text, 'text-xs font-semibold capitalize']">
                      {{ item.tipo }}
                    </span>
                  </div>
                </td>
                <td class="p-3">{{ item.quantidade }} un.</td>
                <td class="p-3 text-right">
                  <span v-if="item.precoCusto" class="text-muted-foreground">
                    R$ {{ item.precoCusto?.toFixed(2) }}
                  </span>
                  <span v-else class="text-muted-foreground text-xs">—</span>
                </td>
                <td class="p-3 text-right">
                  <span class="font-semibold">R$ {{ item.precoVenda?.toFixed(2) }}</span>
                </td>
                <td class="p-3">
                  <div class="flex gap-2 justify-center">
                    <RouterLink :to="`/inventario/${item.id}/editar`">
                      <Button variant="outline" size="sm">
                        <Pencil class="h-4 w-4" />
                      </Button>
                    </RouterLink>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      @click="deleteItem(item.id, item.nome)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

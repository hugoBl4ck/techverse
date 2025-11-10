<script setup>
import { ref, watchEffect, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { useCurrentStore } from '@/composables/useCurrentStore'

import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { Pencil, Package, PlusCircle } from 'lucide-vue-next'
import { Skeleton } from '@/components/ui/skeleton'

const { storeId } = useCurrentStore()
const items = ref([])
const isLoading = ref(true)

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
  return items.value.reduce((acc, item) => {
    const tipo = item.tipo || 'outro';
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(item);
    return acc;
  }, {});
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
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'stores', storeId.value, 'itens'))
    items.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Erro ao carregar inventário:', error);
    alert('Erro ao carregar inventário: ' + error.message);
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  if (storeId.value) {
    fetchItems();
  }
});




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
      <h1 class="text-2xl font-bold">Inventário de Itens</h1>
      <RouterLink to="/inventario/novo">
        <Button>Novo Item</Button>
      </RouterLink>
    </div>

    <!-- Loading State com Skeleton -->
    <div v-if="isLoading" class="space-y-8">
      <div v-for="i in 3" :key="i" class="space-y-4">
        <Skeleton height="2rem" width="30%" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton height="15rem" v-for="j in 4" :key="j" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-16 fade-in">
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

    <!-- Seções de Categoria -->
    <div v-else class="space-y-10">
      <section v-for="tipo in orderedCategories" :key="tipo">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b pb-2">
          {{ nomesCategoria[tipo] || tipo }}
        </h2>
        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <RouterLink :to="`/inventario/${item.id}/editar`" class="mt-4">
                      <Button variant="outline" size="sm" class="w-full">
                          <Pencil class="h-4 w-4 mr-2" />
                          Editar
                      </Button>
                  </RouterLink>
              </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
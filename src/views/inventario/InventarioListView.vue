<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'

const items = ref([])

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

async function fetchItems() {
  const querySnapshot = await getDocs(collection(db, 'itens'))
  items.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  fetchItems()
})

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

    <div v-if="!items.length" class="text-center text-muted-foreground">
      Carregando itens...
    </div>

    <!-- Seções de Categoria -->
    <div v-else class="space-y-10">
      <section v-for="(listaItems, tipo) in itemsAgrupados" :key="tipo">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b pb-2">
          {{ nomesCategoria[tipo] || tipo }}
        </h2>
        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="item in listaItems" :key="item.id"
              class="group relative h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex">
              <div :class="getCategoryColors(item).bg" class="w-2 h-full"></div>
              <div class="flex-1 relative">
                <!-- Camada 1: Imagem de Fundo -->
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.nome"
                  class="absolute inset-0 z-0 w-full h-full object-cover opacity-70 transition-all duration-300 group-hover:opacity-90 group-hover:scale-110"
                />
                <div v-else class="absolute inset-0 z-0 w-full h-full bg-gray-800 opacity-70"></div>

                <!-- Camada 4: Conteúdo -->
                <div class="relative z-30 p-3 h-full flex flex-col justify-between text-white dark:text-gray-100">
                  <div>
                      <h3 :class="getCategoryColors(item).text" class="font-bold text-sm">{{ item.nome }}</h3>
                      <span class="text-xs uppercase opacity-70">{{ item.tipo }}</span>
                  </div>
                  <div>
                      <div class="text-sm opacity-90 mt-1">
                          <p>Qtd: {{ item.quantidade }}</p>
                          <p>Venda: R$ {{ item.precoVenda?.toFixed(2) }}</p>
                      </div>
                      <RouterLink :to="`/inventario/${item.id}/editar`" class="mt-2">
                          <Button variant="outline" size="sm" class="w-full bg-transparent border border-white/50 hover:bg-white/20 text-white">
                          Editar
                          </Button>
                      </RouterLink>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
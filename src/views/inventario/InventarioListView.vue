<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'

const pecas = ref([])

const colorMap = {
  cpu: { bg: 'bg-red-500', text: 'text-red-500' },
  'placa-mae': { bg: 'bg-blue-500', text: 'text-blue-500' },
  ram: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  gpu: { bg: 'bg-green-500', text: 'text-green-500' },
  armazenamento: { bg: 'bg-purple-500', text: 'text-purple-500' },
  fonte: { bg: 'bg-gray-500', text: 'text-gray-500' },
  gabinete: { bg: 'bg-indigo-500', text: 'text-indigo-500' },
  watercooler: { bg: 'bg-sky-500', text: 'text-sky-500' },
  aircooler: { bg: 'bg-sky-300', text: 'text-sky-300' },
  ventoinhas: { bg: 'bg-zinc-400', text: 'text-zinc-400' },
  'pasta termica': { bg: 'bg-zinc-600', text: 'text-zinc-600' },
  mouse: { bg: 'bg-pink-500', text: 'text-pink-500' },
  teclado: { bg: 'bg-orange-500', text: 'text-orange-500' },
  controle: { bg: 'bg-cyan-500', text: 'text-cyan-500' },
  controladoras: { bg: 'bg-teal-500', text: 'text-teal-500' },
  outro: { bg: 'bg-gray-300', text: 'text-gray-300' },
};

function getCategoryColors(peca) {
  const tipo = peca?.tipo || 'outro';
  return colorMap[tipo] || colorMap.outro;
}


// Agrupa as peças por categoria
const pecasAgrupadas = computed(() => {
  return pecas.value.reduce((acc, peca) => {
    const tipo = peca.tipo || 'outro';
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(peca);
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
  // Adicione outros tipos aqui conforme necessário
  outro: 'Outros'
};

async function fetchPecas() {
  const querySnapshot = await getDocs(collection(db, 'pecas'))
  pecas.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  fetchPecas()
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
      <h1 class="text-2xl font-bold">Inventário de Peças</h1>
      <RouterLink to="/inventario/novo">
        <Button>Nova Peça</Button>
      </RouterLink>
    </div>

    <div v-if="!pecas.length" class="text-center text-muted-foreground">
      Carregando peças...
    </div>

    <!-- Seções de Categoria -->
    <div v-else class="space-y-10">
      <section v-for="(listaPecas, tipo) in pecasAgrupadas" :key="tipo">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b pb-2">
          {{ nomesCategoria[tipo] || tipo }}
        </h2>
        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="peca in listaPecas" :key="peca.id"
              class="group relative h-48 rounded-lg overflow-hidden shadow-md bg-card flex">
              <div :class="getCategoryColors(peca).bg" class="w-2 h-full"></div>
              <div class="flex-1 relative">
                <!-- Camada 1: Imagem de Fundo -->
                <img
                  v-if="peca.imageUrl"
                  :src="peca.imageUrl"
                  :alt="peca.nome"
                  class="absolute inset-0 z-0 w-full h-full object-cover opacity-30 transition-all duration-300 group-hover:opacity-75 group-hover:scale-110"
                />
                <div v-else class="absolute inset-0 z-0 w-full h-full bg-gray-800 opacity-30"></div>

                <!-- Camada 2: Gradiente -->
                <div class="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/50 to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>

                <!-- Camada 3: Pattern (Listrinhas) -->
                <div
                  class="absolute inset-0 z-20 opacity-30"
                  style="background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px);"
                ></div>

                <!-- Camada 4: Conteúdo -->
                <div class="relative z-30 p-3 h-full flex flex-col justify-between text-foreground">
                  <div>
                      <h3 :class="getCategoryColors(peca).text" class="font-bold truncate text-sm">{{ peca.nome }}</h3>
                      <span class="text-xs uppercase opacity-70">{{ peca.tipo }}</span>
                  </div>
                  <div>
                      <div class="text-sm opacity-90 mt-1">
                          <p>Qtd: {{ peca.quantidade }}</p>
                          <p>Venda: R$ {{ peca.precoVenda?.toFixed(2) }}</p>
                      </div>
                      <RouterLink :to="`/inventario/${peca.id}/editar`" class="mt-2">
                          <Button variant="outline" size="sm" class="w-full bg-transparent border border-white/20 hover:bg-white/10">
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

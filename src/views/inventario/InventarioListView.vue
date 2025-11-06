<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'

const pecas = ref([])

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
              class="relative rounded-lg overflow-hidden shadow-lg group h-72 flex flex-col justify-end text-white">
            
            <!-- 1. Imagem de Fundo -->
            <img v-if="peca.imageUrl" :src="peca.imageUrl" :alt="peca.nome" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 z-0" />
            <!-- Fallback para quando não há imagem -->
            <div v-else class="absolute inset-0 w-full h-full bg-gray-800 z-0"></div>

            <!-- 2. Padrão de Pontos -->
            <div class="pattern-dots absolute inset-0 w-full h-full text-white/10 z-10"></div>

            <!-- 3. Gradiente Overlay -->
            <div class="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20"></div>

            <!-- Conteúdo do Card -->
            <div class="relative p-4 z-30">
              <h3 class="font-bold text-lg truncate">{{ peca.nome }}</h3>
              <div class="text-sm opacity-90 mt-1">
                <p>Qtd: {{ peca.quantidade }}</p>
                <p>Venda: R$ {{ peca.precoVenda?.toFixed(2) }}</p>
              </div>
              <RouterLink :to="`/inventario/${peca.id}/editar`" class="mt-4">
                <Button variant="secondary" size="sm" class="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
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

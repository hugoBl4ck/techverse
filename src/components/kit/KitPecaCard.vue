<script setup>
import { computed } from 'vue';

const props = defineProps({ peca: Object });

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

const categoryColors = computed(() => {
  const tipo = props.peca?.tipo || 'outro';
  return colorMap[tipo] || colorMap.outro;
});
</script>

<template>
  <div class="relative h-20 w-full rounded-lg overflow-hidden shadow-md bg-card cursor-grab flex">
    <div :class="categoryColors.bg" class="w-2 h-full"></div>
    <div class="flex-1 relative">
      <!-- Camada 1: Imagem de Fundo -->
      <img
        v-if="peca.imageUrl"
        :src="peca.imageUrl"
        :alt="peca.nome"
        class="absolute inset-0 z-0 w-full h-full object-cover opacity-30"
      />
      <div v-else class="absolute inset-0 z-0 w-full h-full bg-gray-800 opacity-30"></div>

      <!-- Camada 2: Gradiente -->
      <div class="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/70 to-transparent"></div>

      <!-- Camada 3: Pattern (Listrinhas) -->
      <div
        class="absolute inset-0 z-20 opacity-30"
        style="background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px);"
      ></div>

      <!-- Camada 4: Conteúdo -->
      <div class="relative z-30 p-3 h-full flex flex-col justify-end text-foreground">
        <h3 :class="categoryColors.text" class="font-bold truncate text-sm">{{ peca.nome }}</h3>
        <span class="text-xs uppercase opacity-70">{{ peca.tipo }}</span>
      </div>
    </div>
  </div>
</template>
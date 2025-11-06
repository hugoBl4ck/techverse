<script setup>
  defineProps({ peca: Object })
</script>

<template>
  <div class="relative h-20 w-full rounded-lg overflow-hidden shadow-md bg-card cursor-grab">
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
      <h3 class="font-bold truncate text-sm">{{ peca.nome }}</h3>
      <span class="text-xs uppercase opacity-70">{{ peca.tipo }}</span>
    </div>
  </div>
</template>

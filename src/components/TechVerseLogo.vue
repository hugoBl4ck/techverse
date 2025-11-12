<script setup>
// Opções de ícone tech - escolha uma:
// 1. CPU com chamas
// 2. Circuito estilizado
// 3. Lightning tech
// 4. Microchip futurista

const iconType = 'flame-circuit' // opções: 'cpu-circuit', 'flame-circuit', 'lightning-tech', 'microchip'
</script>

<template>
  <div class="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-sm flex items-center justify-center relative overflow-hidden">
    <!-- Opção 1: CPU + Circuito -->
    <svg v-if="iconType === 'cpu-circuit'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- CPU central -->
      <rect x="8" y="8" width="8" height="8" stroke="white" stroke-width="1.5" fill="none" rx="1"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
      
      <!-- Circuito linhas -->
      <line x1="12" y1="4" x2="12" y2="7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="17" x2="12" y2="20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="4" y1="12" x2="7" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="17" y1="12" x2="20" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      
      <!-- Pontos de conexão -->
      <circle cx="12" cy="4" r="1.5" fill="white"/>
      <circle cx="12" cy="20" r="1.5" fill="white"/>
      <circle cx="4" cy="12" r="1.5" fill="white"/>
      <circle cx="20" cy="12" r="1.5" fill="white"/>
      
      <!-- Glow animado -->
      <circle cx="12" cy="12" r="5.5" stroke="white" stroke-width="0.5" fill="none" opacity="0" class="animate-glow"/>
    </svg>

    <!-- Opção 2: Circuito com chamas -->
    <svg v-else-if="iconType === 'flame-circuit'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Chama estilizada (tech) -->
      <path d="M12 2C12 2 10 6 10 9C10 11.2 11 13 12 13C13 13 14 11.2 14 9C14 6 12 2 12 2Z" fill="white" class="animate-pulse"/>
      
      <!-- Circuito -->
      <path d="M8 14L6 14L6 18C6 19.1 6.9 20 8 20L16 20C17.1 20 18 19.1 18 18L18 14L16 14" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <line x1="10" y1="14" x2="10" y2="20" stroke="white" stroke-width="1" opacity="0.6"/>
      <line x1="14" y1="14" x2="14" y2="20" stroke="white" stroke-width="1" opacity="0.6"/>
      
      <!-- Efeito de energia -->
      <circle cx="12" cy="14" r="4" stroke="white" stroke-width="0.5" fill="none" opacity="0" class="animate-energy"/>
    </svg>

    <!-- Opção 3: Lightning Tech -->
    <svg v-else-if="iconType === 'lightning-tech'" class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Lightning bolt -->
      <path d="M13 2L3 14H11L11 22L21 10H13L13 2Z" fill="white" opacity="0.9"/>
      
      <!-- Linha de circuito -->
      <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="1" opacity="0.5" stroke-dasharray="2,2" class="animate-dash"/>
      
      <!-- Glow animado -->
      <path d="M13 2L3 14H11L11 22L21 10H13L13 2Z" stroke="white" stroke-width="0.5" fill="none" opacity="0" class="animate-glow"/>
    </svg>

    <!-- Opção 4: Microchip futurista (DEFAULT) -->
    <svg v-else class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Chip central -->
      <rect x="7" y="7" width="10" height="10" stroke="white" stroke-width="1.5" fill="none" rx="1"/>
      
      <!-- Grid interno -->
      <line x1="10" y1="7" x2="10" y2="17" stroke="white" stroke-width="0.8" opacity="0.6"/>
      <line x1="14" y1="7" x2="14" y2="17" stroke="white" stroke-width="0.8" opacity="0.6"/>
      <line x1="7" y1="10" x2="17" y2="10" stroke="white" stroke-width="0.8" opacity="0.6"/>
      <line x1="7" y1="14" x2="17" y2="14" stroke="white" stroke-width="0.8" opacity="0.6"/>
      
      <!-- Pinos -->
      <line x1="4" y1="10" x2="7" y2="10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="17" y1="10" x2="20" y2="10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="10" y1="4" x2="10" y2="7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="14" y1="17" x2="14" y2="20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      
      <!-- Centro brilhante -->
      <circle cx="12" cy="12" r="2" fill="white" opacity="0.7"/>
    </svg>
  </div>
</template>

<style scoped>
@keyframes pulse-custom {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0;
    r: 4;
  }
  50% {
    opacity: 0.4;
    r: 6;
  }
}

@keyframes energy {
  0%, 100% {
    opacity: 0;
    r: 3;
  }
  50% {
    opacity: 0.5;
    r: 5;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 4;
  }
}

.animate-pulse {
  animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-glow {
  animation: glow 1.5s ease-in-out infinite;
}

.animate-energy {
  animation: energy 1.2s ease-in-out infinite;
}

.animate-dash {
  animation: dash 1s linear infinite;
}
</style>

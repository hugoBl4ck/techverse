<script setup>
// Escolha o tipo de ícone animado com morphing constante:
// 'microchip-morph'   - Microchip com transformação contínua
// 'circuit-pulse'     - Circuito pulsante com efeito
// 'energy-blob'       - Blob de energia (como o seu!)
// 'grip-infinite'     - Grade animada infinita com degrade

const iconType = 'grip-infinite'

// Array de coordenadas para a grade 3x3
const circles = [
  { cx: 8, cy: 8 },   // Top left
  { cx: 16, cy: 8 },  // Top middle
  { cx: 24, cy: 8 },  // Top right
  { cx: 8, cy: 16 },  // Middle left
  { cx: 16, cy: 16 }, // Center
  { cx: 24, cy: 16 }, // Middle right
  { cx: 8, cy: 24 },  // Bottom left
  { cx: 16, cy: 24 }, // Bottom middle
  { cx: 24, cy: 24 }, // Bottom right
]
</script>

<template>
  <div class="relative group">
    <!-- Microchip com Morphing -->
    <svg v-if="iconType === 'microchip-morph'" class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- Glow suave -->
      <circle cx="16" cy="16" r="10" fill="url(#glowGrad)" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1.5s" repeatCount="indefinite"/>
      </circle>

      <!-- Circuito principal - quadrado com cantos arredondados animado -->
      <path d="M 10 12 L 12 12 L 12 10 L 20 10 L 20 12 L 22 12 L 22 20 L 20 20 L 20 22 L 12 22 L 12 20 L 10 20 Z" 
        fill="none" 
        stroke="white" 
        stroke-width="1.2" 
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.9">
        <animate attributeName="stroke-width" values="1.2;1.5;1.2" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
      </path>

      <!-- Núcleo central morphing -->
      <circle cx="16" cy="16" r="2.5" fill="none" stroke="white" stroke-width="1" opacity="0.7">
        <animate attributeName="r" values="2.5;3.2;2.5" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite"/>
      </circle>

      <!-- Linhas horizontais internas -->
      <line x1="13" y1="16" x2="19" y2="16" stroke="white" stroke-width="0.8" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" repeatCount="indefinite"/>
      </line>

      <!-- Linhas verticais internas -->
      <line x1="16" y1="13" x2="16" y2="19" stroke="white" stroke-width="0.8" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
      </line>

      <!-- Conectores nos cantos -->
      <circle cx="10" cy="12" r="1" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="12" r="1" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" begin="0.45s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="20" r="1" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="10" cy="20" r="1" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" begin="0.75s" repeatCount="indefinite"/>
      </circle>
    </svg>

    <!-- Circuito com Pulse Energético -->
    <svg v-else-if="iconType === 'circuit-pulse'" class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Fundo -->
      <rect x="4" y="4" width="24" height="24" rx="4" fill="url(#energyGrad)" opacity="0.95"/>

      <!-- Circuito central pulsante -->
      <g>
        <!-- Núcleo -->
        <circle cx="16" cy="16" r="3" fill="white" opacity="0.8">
          <animate attributeName="r" values="3;4;3" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite"/>
        </circle>

        <!-- Anel 1 -->
        <circle cx="16" cy="16" r="6" fill="none" stroke="white" stroke-width="1" opacity="0.4">
          <animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite"/>
        </circle>

        <!-- Anel 2 -->
        <circle cx="16" cy="16" r="9" fill="none" stroke="white" stroke-width="0.8" opacity="0.2">
          <animate attributeName="r" values="9;11;9" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      <!-- Linhas de conexão -->
      <line x1="16" y1="4" x2="16" y2="10" stroke="white" stroke-width="1.2" opacity="0.7">
        <animate attributeName="stroke-width" values="1.2;2;1.2" dur="1.5s" repeatCount="indefinite"/>
      </line>
      <line x1="16" y1="22" x2="16" y2="28" stroke="white" stroke-width="1.2" opacity="0.7">
        <animate attributeName="stroke-width" values="1.2;2;1.2" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
      </line>
      <line x1="4" y1="16" x2="10" y2="16" stroke="white" stroke-width="1.2" opacity="0.7">
        <animate attributeName="stroke-width" values="1.2;2;1.2" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
      </line>
      <line x1="22" y1="16" x2="28" y2="16" stroke="white" stroke-width="1.2" opacity="0.7">
        <animate attributeName="stroke-width" values="1.2;2;1.2" dur="1.5s" begin="0.9s" repeatCount="indefinite"/>
      </line>
    </svg>

    <!-- Grip Infinito com Degrade -->
    <svg v-else-if="iconType === 'grip-infinite'" class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gripGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- Glow de fundo com degrade -->
      <circle cx="16" cy="16" r="12" fill="url(#gripGlow)" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
      </circle>

      <!-- Círculos da grade 3x3 com animação infinita -->
      <circle cx="8" cy="8" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="16" cy="8" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="0.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="8" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
      </circle>

      <circle cx="8" cy="16" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="16" cy="16" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="16" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="1s" repeatCount="indefinite"/>
      </circle>

      <circle cx="8" cy="24" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="16" cy="24" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="1.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="1.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="24" r="1.2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1.2;1.6;1.2" dur="1.8s" begin="1.6s" repeatCount="indefinite"/>
      </circle>

      <!-- Linhas finas conectando os círculos -->
      <line x1="8" y1="8" x2="24" y2="8" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite"/>
      </line>
      <line x1="8" y1="16" x2="24" y2="16" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="0.3s" repeatCount="indefinite"/>
      </line>
      <line x1="8" y1="24" x2="24" y2="24" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="0.6s" repeatCount="indefinite"/>
      </line>

      <line x1="8" y1="8" x2="8" y2="24" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="0.9s" repeatCount="indefinite"/>
      </line>
      <line x1="16" y1="8" x2="16" y2="24" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="1.2s" repeatCount="indefinite"/>
      </line>
      <line x1="24" y1="8" x2="24" y2="24" stroke="white" stroke-width="0.5" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" begin="1.5s" repeatCount="indefinite"/>
      </line>
    </svg>

    <!-- Energy Blob (como seu SVG!) -->
    <svg v-else class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Fundo -->
      <rect x="2" y="2" width="28" height="28" rx="4" fill="url(#blobGrad)" opacity="0.95"/>

      <!-- Blob morphing (simplificado para o tamanho) -->
      <path d="M 16 6 Q 20 8 22 12 Q 24 16 22 20 Q 20 24 16 26 Q 12 24 10 20 Q 8 16 10 12 Q 12 8 16 6"
        fill="white"
        opacity="0.85"
        stroke="white"
        stroke-width="0.5"
        stroke-opacity="0.4">
        
        <animate attributeName="d"
          values="M 16 6 Q 20 8 22 12 Q 24 16 22 20 Q 20 24 16 26 Q 12 24 10 20 Q 8 16 10 12 Q 12 8 16 6;
                  M 16 5 Q 21 7 23 11 Q 25 17 21 23 Q 17 26 16 27 Q 11 25 9 19 Q 7 13 9 9 Q 13 5 16 5;
                  M 16 6 Q 19 7 21 11 Q 23 18 19 24 Q 15 27 16 26 Q 13 23 11 18 Q 9 12 11 10 Q 13 6 16 6;
                  M 16 6 Q 20 8 22 12 Q 24 16 22 20 Q 20 24 16 26 Q 12 24 10 20 Q 8 16 10 12 Q 12 8 16 6"
          dur="1.2s"
          calcMode="spline"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
          repeatCount="indefinite"/>
      </path>

      <!-- Glow interno -->
      <circle cx="16" cy="16" r="8" fill="white" opacity="0" stroke="white" stroke-width="1">
        <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0.3;0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  </div>
</template>

<style scoped>
/* Sem estilos adicionais - tudo está em SVG animado! */
</style>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // Forçar um tipo específico: 'full' (tech.svg) ou 'logo' (techLOGO.svg)
  variant: {
    type: String,
    default: null, // null = automático baseado no tamanho da tela
    validator: (value) => !value || ['full', 'logo'].includes(value)
  },
  // Tamanho do logo
  size: {
    type: String,
    default: 'default' // 'small', 'default', 'large'
  },
  // Se deve ser clicável
  clickable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const router = useRouter()
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

if (typeof window !== 'undefined') {
  checkMobile()
  window.addEventListener('resize', checkMobile, { passive: true })
}

// Determinar qual SVG usar
const logoVariant = computed(() => {
  if (props.variant) {
    return props.variant
  }
  return isMobile.value ? 'logo' : 'full'
})

// Classes de tamanho
const sizeClasses = computed(() => {
  const sizes = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  }
  return sizes[props.size] || sizes.default
})

// Classes de container
const containerClasses = computed(() => [
  'flex items-center gap-2',
  props.clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
  logoVariant.value === 'full' ? 'flex-col sm:flex-row' : ''
])

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
    router.push('/dashboard')
  }
}
</script>

<template>
  <div 
    :class="containerClasses"
    @click="handleClick"
    :title="logoVariant === 'full' ? 'TechVerse - Gerenciador de TI' : 'TechVerse'"
  >
    <!-- Logo completo (tech.svg) -->
    <img 
      v-if="logoVariant === 'full'"
      src="/tech.svg" 
      alt="TechVerse Logo Completo"
      :class="[sizeClasses, 'object-contain']"
    />
    
    <!-- Apenas logo (techLOGO.svg) -->
    <img 
      v-else
      src="/techLOGO.svg" 
      alt="TechVerse Logo"
      :class="[sizeClasses, 'object-contain']"
    />
    
    <!-- Texto TechVerse (apenas quando usando logo completo) -->
    <div 
      v-if="logoVariant === 'full'"
      class="font-display text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
    >
      TechVerse
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  transition: all 0.2s ease-in-out;
}

.logo-container:hover {
  transform: translateY(-1px);
}

/* Responsividade para texto */
@media (max-width: 640px) {
  .text-responsive {
    font-size: 1rem;
  }
}
</style>
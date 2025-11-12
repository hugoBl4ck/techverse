<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 rounded-full border border-red-200 dark:border-red-800 mb-4">
            <Gift class="w-4 h-4 text-red-600 dark:text-red-400" />
            <span class="text-sm font-medium text-red-700 dark:text-red-300">Promoções Especiais</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Promoções <span class="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">TechVerse</span>
          </h1>
          
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Descubra ofertas exclusivas e economize em produtos selecionados
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search and Filters -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <!-- Search Bar -->
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar promoções..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-2">
          <Filter class="w-5 h-5 text-slate-500" />
          <select
            v-model="selectedStatus"
            class="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Todas as promoções</option>
            <option value="ativa">Ativas agora</option>
            <option value="comendo">Terminando</option>
            <option value="proxima">Próximas</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="space-y-4">
          <Skeleton class="h-48 w-full rounded-lg" />
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      </div>

      <!-- Results Info -->
      <div v-else class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            <span class="font-semibold text-slate-900 dark:text-white">{{ filteredPromos.length }}</span> promoção{{ filteredPromos.length !== 1 ? 's' : '' }} encontrada{{ filteredPromos.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="sortBy = 'desconto'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              sortBy === 'desconto'
                ? 'bg-red-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            ]"
          >
            Maior Desconto
          </button>
          <button
            @click="sortBy = 'proximas'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              sortBy === 'proximas'
                ? 'bg-red-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            ]"
          >
            Terminando em Breve
          </button>
        </div>
      </div>

      <!-- Promos Grid -->
      <div v-if="!loading && filteredPromos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <article
          v-for="promo in filteredPromos"
          :key="promo.id"
          class="group rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 hover:shadow-lg dark:hover:shadow-red-500/10 transition-all duration-300"
        >
          <!-- Header com Desconto -->
          <div class="relative h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 overflow-hidden">
            <div class="absolute inset-0 opacity-10">
              <Gift class="w-24 h-24 text-red-500 absolute -right-4 -top-4" />
            </div>
            <div class="relative text-center">
              <div class="text-5xl font-bold text-red-600 dark:text-red-400">
                {{ promo.desconto }}%
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">Desconto</p>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
              {{ promo.titulo }}
            </h3>

            <!-- Images Gallery -->
              <div v-if="promo.fotos && promo.fotos.length > 0" class="mb-4">
                <div class="flex gap-2 overflow-x-auto pb-2">
                  <img v-for="(foto, idx) in promo.fotos" :key="idx" :src="foto" :alt="`Foto ${idx + 1}`" class="h-20 w-20 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                </div>
              </div>

              <!-- Description -->
              <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                {{ promo.descricao }}
              </p>

              <!-- Dates -->
            <div class="space-y-2 py-4 border-t border-b border-slate-100 dark:border-slate-700 mb-4">
              <div class="flex items-center gap-2 text-sm">
                <Calendar class="w-4 h-4 text-slate-400" />
                <span class="text-slate-600 dark:text-slate-400">
                  {{ formatarData(promo.dataInicio) }} a {{ formatarData(promo.dataFim) }}
                </span>
              </div>

              <!-- Status Badge -->
              <div class="flex items-center gap-2">
                <Badge :variant="getStatusVariant(promo)" class="text-xs">
                  {{ getStatusText(promo) }}
                </Badge>
                <span v-if="getDiasRestantes(promo.dataFim) > 0" class="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                  {{ getDiasRestantes(promo.dataFim) }} dia{{ getDiasRestantes(promo.dataFim) !== 1 ? 's' : '' }} restante{{ getDiasRestantes(promo.dataFim) !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>

            <!-- CTA Button -->
             <a
               v-if="promo.linkCompra"
               :href="promo.linkCompra"
               target="_blank"
               rel="noopener noreferrer"
               class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all font-semibold group/btn"
             >
               <Zap class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
               Comprar Agora
             </a>
             <button
               v-else
               @click="handlePromoClick(promo)"
               class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all font-semibold group/btn"
             >
               <Zap class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
               Aproveitar Promoção
             </button>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="py-16 text-center">
        <Gift class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Nenhuma promoção encontrada
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Tente ajustar seus filtros ou volte mais tarde
        </p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <RotateCcw class="w-4 h-4" />
          Limpar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gift, Search, Filter, Calendar, Zap, RotateCcw } from 'lucide-vue-next'
import Badge from '@/components/ui/badge/Badge.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { useFirestore } from '@/composables/useFirestore'

const { getActivePromos } = useFirestore()

// State
const loading = ref(true)
const promos = ref([])
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('desconto')

// Computed
const filteredPromos = computed(() => {
  let filtered = promos.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.titulo.toLowerCase().includes(query) ||
      item.descricao.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    const now = new Date()
    filtered = filtered.filter(item => {
      const inicio = item.dataInicio instanceof Date ? item.dataInicio : new Date(item.dataInicio)
      const fim = item.dataFim instanceof Date ? item.dataFim : new Date(item.dataFim)

      if (selectedStatus.value === 'ativa') {
        return inicio <= now && now <= fim
      } else if (selectedStatus.value === 'comendo') {
        const diasRestantes = Math.ceil((fim - now) / (1000 * 60 * 60 * 24))
        return diasRestantes <= 7 && diasRestantes > 0
      } else if (selectedStatus.value === 'proxima') {
        return inicio > now
      }
      return true
    })
  }

  // Sort
  if (sortBy.value === 'desconto') {
    filtered.sort((a, b) => b.desconto - a.desconto)
  } else if (sortBy.value === 'proximas') {
    const now = new Date()
    filtered.sort((a, b) => {
      const fimA = a.dataFim instanceof Date ? a.dataFim : new Date(a.dataFim)
      const fimB = b.dataFim instanceof Date ? b.dataFim : new Date(b.dataFim)
      return Math.abs(fimA - now) - Math.abs(fimB - now)
    })
  }

  return filtered
})

// Methods
const formatarData = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getStatusText = (promo) => {
  const now = new Date()
  const inicio = promo.dataInicio instanceof Date ? promo.dataInicio : new Date(promo.dataInicio)
  const fim = promo.dataFim instanceof Date ? promo.dataFim : new Date(promo.dataFim)

  if (now < inicio) {
    return '⏳ Próxima'
  } else if (now <= fim) {
    return '✅ Ativa agora'
  } else {
    return '❌ Finalizada'
  }
}

const getStatusVariant = (promo) => {
  const now = new Date()
  const inicio = promo.dataInicio instanceof Date ? promo.dataInicio : new Date(promo.dataInicio)
  const fim = promo.dataFim instanceof Date ? promo.dataFim : new Date(promo.dataFim)

  if (now < inicio) {
    return 'outline'
  } else if (now <= fim) {
    return 'default'
  } else {
    return 'secondary'
  }
}

const getDiasRestantes = (dataFim) => {
  const fim = dataFim instanceof Date ? dataFim : new Date(dataFim)
  const agora = new Date()
  const diff = fim - agora
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return Math.max(0, dias)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  sortBy.value = 'desconto'
}

const handlePromoClick = (promo) => {
  // Aqui você pode adicionar lógica para abrir modal, redirecionar, etc
  console.log('Promoção clicada:', promo)
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    const data = await getActivePromos()
    promos.value = data || []
  } catch (error) {
    console.error('Erro ao carregar promoções:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
            <Newspaper class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Central de Notícias</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Notícias <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TechVerse</span>
          </h1>
          
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Fique atualizado sobre as novidades da TechVerse e tendências do mundo tech
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
              placeholder="Buscar notícias..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="flex items-center gap-2">
          <Filter class="w-5 h-5 text-slate-500" />
          <select
            v-model="selectedCategory"
            class="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            <option value="techverse">TechVerse</option>
            <option value="tech">Tech</option>
            <option value="tutorial">Tutorial</option>
            <option value="release">Release</option>
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
            <span class="font-semibold text-slate-900 dark:text-white">{{ filteredNews.length }}</span> notícia{{ filteredNews.length !== 1 ? 's' : '' }} encontrada{{ filteredNews.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="sortBy = 'recent'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              sortBy === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            ]"
          >
            Recentes
          </button>
          <button
            @click="sortBy = 'popular'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              sortBy === 'popular'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            ]"
          >
            Populares
          </button>
        </div>
      </div>

      <!-- News Grid -->
      <div v-if="!loading && filteredNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <article
          v-for="news in filteredNews"
          :key="news.id"
          class="group rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300"
        >
          <!-- Thumbnail -->
          <div v-if="news.imagem" class="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
            <img
              :src="news.imagem"
              :alt="news.titulo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          <div v-else class="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
            <Newspaper class="w-12 h-12 text-slate-400" />
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Category Badge -->
            <div class="mb-3 flex items-center gap-2">
              <Badge :variant="getCategoryVariant(news.categoria)">
                {{ formatarCategoria(news.categoria) }}
              </Badge>
              <span class="text-xs text-slate-500 dark:text-slate-400">
                {{ formatarData(news.dataPub) }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {{ news.titulo }}
            </h3>

            <!-- Excerpt -->
            <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
              {{ news.conteudo }}
            </p>

            <!-- Metadata -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Eye class="w-4 h-4" />
                <span>{{ news.views || 0 }} visualizações</span>
              </div>
              <button
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors text-sm font-medium"
              >
                Ler mais
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="py-16 text-center">
        <Newspaper class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Nenhuma notícia encontrada
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Tente ajustar seus filtros ou volte mais tarde
        </p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
import { Newspaper, Search, Filter, Eye, ArrowRight, RotateCcw } from 'lucide-vue-next'
import Badge from '@/components/ui/badge/Badge.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { useFirestore } from '@/composables/useFirestore'

const { getPublishedNews } = useFirestore()

// State
const loading = ref(true)
const news = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')

// Computed
const filteredNews = computed(() => {
  let filtered = news.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.titulo.toLowerCase().includes(query) ||
      item.conteudo.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.categoria === selectedCategory.value)
  }

  // Sort
  if (sortBy.value === 'recent') {
    filtered.sort((a, b) => new Date(b.dataPub) - new Date(a.dataPub))
  } else if (sortBy.value === 'popular') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  return filtered
})

// Methods
const formatarData = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatarCategoria = (categoria) => {
  const map = {
    techverse: '🔧 TechVerse',
    tech: '💻 Tech',
    tutorial: '📚 Tutorial',
    release: '🚀 Release'
  }
  return map[categoria] || categoria
}

const getCategoryVariant = (categoria) => {
  const variants = {
    techverse: 'default',
    tech: 'secondary',
    tutorial: 'outline',
    release: 'default'
  }
  return variants[categoria] || 'outline'
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'recent'
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    const data = await getPublishedNews()
    news.value = data || []
  } catch (error) {
    console.error('Erro ao carregar notícias:', error)
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

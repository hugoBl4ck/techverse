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

          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Descubra ofertas exclusivas de parceiros e economize em produtos selecionados para seu negócio
          </p>

          <div class="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <Shield class="w-4 h-4 text-green-600" />
              <span>Compras Seguras</span>
            </div>
            <div class="flex items-center gap-2">
              <Star class="w-4 h-4 text-blue-600" />
              <span>Parceiros Confiáveis</span>
            </div>
            <div class="flex items-center gap-2">
              <ExternalLink class="w-4 h-4 text-purple-600" />
              <span>Links Afiliados</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Featured Affiliate Section -->
      <div v-if="filteredPromos.some(p => p.tipo === 'afiliado' && p.destaque)" class="mb-12">
        <div class="text-center mb-8">
          <Badge variant="outline" class="bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 mb-4">
            <Star class="w-4 h-4 mr-2" />
            Destaque do Parceiro
          </Badge>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Ofertas Exclusivas AliExpress
          </h2>
          <p class="text-slate-600 dark:text-slate-400">
            Produtos selecionados com os melhores descontos do mercado
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <article
            v-for="promo in filteredPromos.filter(p => p.tipo === 'afiliado' && p.destaque)"
            :key="`featured-${promo.id}`"
            class="group rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-500"
          >
            <div class="md:flex">
              <!-- Images -->
              <div class="md:w-1/3 p-6">
                <div class="flex gap-3 overflow-x-auto">
                  <img
                    v-for="(foto, idx) in promo.fotos"
                    :key="idx"
                    :src="foto"
                    :alt="`Produto ${idx + 1}`"
                    class="h-24 w-24 rounded-xl object-cover flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-lg"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="md:w-2/3 p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {{ promo.titulo }}
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400 mb-4">
                      {{ promo.descricao }}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {{ promo.desconto }}% OFF
                    </div>
                    <div v-if="promo.preco && promo.precoDesconto" class="mt-2">
                      <div class="text-sm text-slate-500 dark:text-slate-400 line-through">
                        {{ promo.preco }}
                      </div>
                      <div class="text-xl font-bold text-green-600 dark:text-green-400">
                        {{ promo.precoDesconto }}
                      </div>
                    </div>
                    <Badge variant="default" class="bg-blue-600 text-white mt-2">
                      <Shield class="w-3 h-3 mr-1" />
                      Compra Segura
                    </Badge>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>📅 Válido até {{ formatarData(promo.dataFim) }}</span>
                    <span>🏷️ {{ promo.categoria }}</span>
                  </div>
                  <a
                    :href="promo.linkCompra"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click="trackAffiliateClick(promo)"
                    class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl group/btn"
                  >
                    <ExternalLink class="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    Ver Oferta Completa
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

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
          :class="[
            'group rounded-xl overflow-hidden bg-white dark:bg-slate-800 border transition-all duration-300',
            promo.tipo === 'afiliado'
              ? 'border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl dark:hover:shadow-blue-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 hover:shadow-lg dark:hover:shadow-red-500/10'
          ]"
        >
          <!-- Affiliate Badge -->
          <div v-if="promo.tipo === 'afiliado'" class="absolute top-3 right-3 z-10">
            <Badge variant="default" class="bg-blue-600 text-white text-xs font-semibold px-2 py-1">
              <Star class="w-3 h-3 mr-1" />
              Parceiro
            </Badge>
          </div>

          <!-- Header com Desconto -->
          <div
            :class="[
              'relative h-32 flex items-center justify-center border-b overflow-hidden',
              promo.tipo === 'afiliado'
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 border-blue-200 dark:border-blue-700'
                : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10 border-slate-200 dark:border-slate-700'
            ]"
          >
            <div class="absolute inset-0 opacity-10">
              <component :is="promo.tipo === 'afiliado' ? Star : Gift" class="w-24 h-24 text-current absolute -right-4 -top-4" />
            </div>
            <div class="relative text-center">
              <div :class="['text-5xl font-bold', promo.tipo === 'afiliado' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400']">
                {{ promo.desconto }}%
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">Desconto</p>
              <p v-if="promo.tipo === 'afiliado'" class="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                Via AliExpress
              </p>
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

            <!-- Trust Badges for Affiliate -->
            <div v-if="promo.tipo === 'afiliado'" class="flex items-center justify-center gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-1">
                <Shield class="w-3 h-3" />
                <span>Compra Segura</span>
              </div>
              <div class="flex items-center gap-1">
                <ExternalLink class="w-3 h-3" />
                <span>Link Afiliado</span>
              </div>
            </div>

            <!-- CTA Button -->
            <a
              v-if="promo.linkCompra"
              :href="promo.linkCompra"
              target="_blank"
              rel="noopener noreferrer"
              @click="trackAffiliateClick(promo)"
              :class="[
                'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all font-semibold group/btn',
                promo.tipo === 'afiliado'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
              ]"
            >
              <component :is="promo.tipo === 'afiliado' ? ExternalLink : Zap" class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              {{ promo.tipo === 'afiliado' ? 'Ver Oferta no AliExpress' : 'Comprar Agora' }}
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
import { Gift, Search, Filter, Calendar, Zap, RotateCcw, ExternalLink, Star, Shield } from 'lucide-vue-next'
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

// Function to extract basic info from AliExpress link (simplified)
const extractAliExpressInfo = (affiliateLink, originalLink) => {
  // This is a simplified extraction - in production you'd use proper scraping
  // For now, we'll use the data you provided

  return {
    id: 'aliexpress-b450-motherboard',
    titulo: 'MACHINIST B450 Motherboard AMD Processor Dual-channel DDR4 Memory AM4 Mainboard M.2 NVME (Supports Ryzen 5500 5600 5600G CPU)',
    descricao: 'Placa-mãe B450 de alta performance com suporte aos processadores AMD Ryzen 5000 series. Dual-channel DDR4 com suporte até 128GB, slots M.2 NVMe para SSDs ultrarrápidos (PCIe 3.0), USB 3.1 Gen1, HDMI 2.0, DisplayPort 1.4, Gigabit Ethernet, e todas as features necessárias para builds gaming e workstation. Compatível com Ryzen 5 5500, Ryzen 5 5600, Ryzen 5 5600G e outros processadores AMD.',
    desconto: 35,
    dataInicio: new Date('2025-11-15'),
    dataFim: new Date('2025-12-30'),
    fotos: [
      'https://ae-pic-a1.aliexpress-media.com/kf/S38903a9e49484defa52d952d76394200A.jpg_960x960q75.jpg_.avif',
      'https://ae01.alicdn.com/kf/S38903a9e49484defa52d952d76394200A.jpg_350x350.jpg'
    ],
    linkCompra: affiliateLink,
    linkOriginal: originalLink,
    categoria: 'Hardware',
    tipo: 'afiliado',
    destaque: true,
    preco: 'R$ 551,88',
    precoDesconto: 'R$ 220,98'
  }
}

// Test promotion data with affiliate link
const testPromo = extractAliExpressInfo(
  'https://s.click.aliexpress.com/e/_c2wEqpQ1',
  'https://pt.aliexpress.com/item/1005006997378224.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.1.1900em4Tem4TFM&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40196.439370.0&scm_id=1007.40196.439370.0&scm-url=1007.40196.439370.0&pvid=44a7659a-d220-4cb8-8a90-32078f2e5933&_t=gps-id:pcDetailTopMoreOtherSeller,scm-url:1007.40196.439370.0,pvid:44a7659a-d220-4cb8-8a90-32078f2e5933,tpp_buckets:668%232846%238107%231934&pdp_ext_f=%7B%22order%22%3A%226984%22%2C%22eval%22%3A%221%22%2C%22orig_sl_item_id%22%3A%221005006997378224%22%2C%22orig_item_id%22%3A%221005006802925639%22%2C%22sceneId%22%3A%2230050%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21BRL%21551.88%21220.98%21%21%21683.02%21273.49%21%402101d97817631854014998963ed847%2112000038991645066%21rec%21BR%212555967370%21XZ%211%210%21n_tag%3A-29919%3Bd%3A8425fd2f%3Bm03_new_user%3A-29895%3BpisId%3A5000000193373821&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A%7Cx_object_id%3A1005006997378224%7C_p_origin_prod%3A1005006802925639'
)

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
}

// Methods
const trackAffiliateClick = (promo) => {
  if (promo.tipo === 'afiliado') {
    // Track affiliate click (could integrate with analytics)
    // You could add Google Analytics, Facebook Pixel, etc. here
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    const data = await getActivePromos()
    // Add test promotion for demonstration
    promos.value = [testPromo, ...(data || [])]
  } catch (error) {
    console.error('Erro ao carregar promoções:', error)
    // Fallback to test promo only
    promos.value = [testPromo]
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

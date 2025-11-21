<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center relative">
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

          <!-- Admin Button -->
          <div v-if="isAdmin" class="absolute top-0 right-0 flex gap-2">
            <Button @click="forceCreateNews" variant="outline" class="bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white border-white/20">
              <RotateCcw class="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button @click="openNewNews" class="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus class="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </div>
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
            
            <!-- Admin Actions -->
            <div v-if="isAdmin" class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="editNews(news)" class="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600 transition-colors shadow-sm">
                <Edit class="w-4 h-4" />
              </button>
              <button @click.stop="handleDeleteNews(news.id)" class="p-2 bg-white/90 rounded-full hover:bg-white text-red-600 transition-colors shadow-sm">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
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
    <!-- Editor Modal -->
    <Dialog :open="showEditor" @update:open="showEditor = $event">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Editar Notícia' : 'Nova Notícia' }}</DialogTitle>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" v-model="editingNews.titulo" placeholder="Digite o título da notícia" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                v-model="editingNews.categoria"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="techverse">TechVerse</option>
                <option value="tech">Tech</option>
                <option value="tutorial">Tutorial</option>
                <option value="release">Release</option>
              </select>
            </div>
            
            <div class="grid gap-2">
              <Label htmlFor="imagem">URL da Imagem</Label>
              <div class="flex gap-2">
                <Input id="imagem" v-model="editingNews.imagem" placeholder="https://..." />
                <div v-if="editingNews.imagem" class="w-10 h-10 rounded overflow-hidden bg-slate-100 shrink-0">
                  <img :src="editingNews.imagem" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid gap-2">
            <Label htmlFor="conteudo">Conteúdo (Markdown suportado)</Label>
            <Textarea id="conteudo" v-model="editingNews.conteudo" class="h-64 font-mono text-sm" placeholder="Escreva o conteúdo da notícia..." />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="showEditor = false">Cancelar</Button>
          <Button @click="handleSaveNews">
            <Save class="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Newspaper, Search, Filter, Eye, ArrowRight, RotateCcw, Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-vue-next'
import Badge from '@/components/ui/badge/Badge.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Button } from '@/components/ui/button'
import { useFirestore } from '@/composables/useFirestore'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { getPublishedNews, saveNews, deleteNews } = useFirestore()
const { currentUser } = useCurrentStore()

// State
const loading = ref(true)
const news = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')

// Admin State
const isEditing = ref(false)
const showEditor = ref(false)
const editingNews = ref({
  titulo: '',
  conteudo: '',
  categoria: 'tech',
  imagem: '',
  ativo: true
})

// Computed
const isAdmin = computed(() => {
  // Simple check for now, ideally should be role-based
  return currentUser.value && currentUser.value.email
})

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

// Admin Methods
const openNewNews = () => {
  editingNews.value = {
    titulo: '',
    conteudo: '',
    categoria: 'tech',
    imagem: '',
    ativo: true
  }
  isEditing.value = false
  showEditor.value = true
}

const editNews = (item) => {
  editingNews.value = { ...item }
  isEditing.value = true
  showEditor.value = true
}

const handleDeleteNews = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta notícia?')) {
    try {
      await deleteNews(id)
      news.value = news.value.filter(n => n.id !== id)
    } catch (error) {
      console.error('Erro ao excluir notícia:', error)
      alert('Erro ao excluir notícia')
    }
  }
}

const handleSaveNews = async () => {
  try {
    const savedId = await saveNews(editingNews.value)
    
    if (isEditing.value) {
      const index = news.value.findIndex(n => n.id === savedId)
      if (index !== -1) {
        news.value[index] = { ...editingNews.value, id: savedId, dataPub: editingNews.value.dataPub || new Date() }
      }
    } else {
      news.value.unshift({ ...editingNews.value, id: savedId, dataPub: new Date() })
    }
    
    showEditor.value = false
  } catch (error) {
    console.error('Erro ao salvar notícia:', error)
    alert('Erro ao salvar notícia')
  }
}

// Auto-create default news if not exists
const createDefaultNews = async () => {
  // Check if already exists
  const exists = news.value.some(n => n.titulo === "5 Formas de Perder Clientes por Má Gestão")
  if (exists) return

  const defaultNews = {
    titulo: "5 Formas de Perder Clientes por Má Gestão",
    categoria: "tutorial",
    imagem: "/images/news/lost-clients.png",
    conteudo: `## 📌 Introdução

A gestão de clientes é o coração de qualquer negócio de serviços. Uma má gestão não apenas prejudica seu faturamento, mas também prejudica sua reputação no mercado.

Neste artigo, vamos explorar as 5 principais formas como você pode estar perdendo clientes sem nem perceber. Confira!

---

## 1️⃣ Falta de Comunicação Clara e Oportuna

### O Problema
Clientes que não sabem o status de seus serviços ficam ansiosos e desconfiados.

**Situação Real:**
- Cliente encomenda uma manutenção na segunda-feira
- Ninguém avisa quando será feito
- Cliente fica dias sem saber o andamento
- Cliente vai para seu concorrente

### ✅ A Solução
Com o **TechVerse**, você pode:
- Enviar atualizações automáticas do status do serviço
- Manter todo histórico de comunicação centralizado
- Registrar cada etapa do trabalho em tempo real
- Cliente vê tudo via portal

---

## 2️⃣ Cobranças Confusas ou Erros de Preço

### O Problema
Se o cliente não entende a sua fatura ou encontra erros repetidos, ele desaparece.

**Situação Real:**
- "Por que foi cobrado R$ 250 se eu falei R$ 150?"
- Falta de nota fiscal ou recibo claro
- Preços diferentes para o mesmo serviço

### ✅ A Solução
Com o **TechVerse + Módulo Financeiro**, você pode:
- Gerar orçamentos claros antes do serviço
- Sistema de preços consistente
- Rastreamento automático de custos
- Notas fiscais integradas
- Cliente vê exatamente do que está pagando

---

## 3️⃣ Perda de Informações do Cliente

### O Problema
Quando você não organiza dados dos clientes, perde oportunidades.

**Situação Real:**
- "Qual era a preferência desse cliente?"
- Não tem histórico de serviços anteriores
- Não sabe quando foi o último atendimento
- Cliente sente-se como um número

### ✅ A Solução
Com o **TechVerse**, cada cliente tem:
- Perfil completo centralizado
- Histórico completo de serviços
- Preferências e anotações pessoais
- Próximos serviços recomendados
- Data do último atendimento
- Cliente sente-se valorizado e conhecido

---

## 4️⃣ Agendamentos Confusos ou Perdidos

### O Problema
Clientes que não conseguem marcar horário facilmente vão para outro lugar.

**Situação Real:**
- "Qual é seu horário de funcionamento?"
- Conflito de agendamentos (dois clientes no mesmo horário)
- Cliente marca e você esquece
- Fila de espera desorganizada

### ✅ A Solução
Com o **TechVerse**, você oferece:
- Agenda clara e organizada
- Cliente vê disponibilidade em tempo real
- Sem conflitos de agendamento
- Lembretes automáticos para o cliente
- Sistema de fila transparente
- Agendamento 24/7, sem você fazer nada

---

## 5️⃣ Falta de Visão Geral do Negócio

### O Problema
Se você não sabe seus números, não pode melhorar.

**Situação Real:**
- "Quanto ganhei este mês?"
- Não sabe qual cliente é mais lucrativo
- Não sabe qual serviço gera mais receita
- Toma decisões no escuro

### ✅ A Solução
Com o **TechVerse Dashboard**, você vê:
- Receita total do mês
- Lucro real (receita - custo dos produtos)
- Margem de cada serviço
- Cliente mais lucrativo
- Serviço mais procurado
- Tendências e padrões

---

## 🎯 Resumo: Como o TechVerse Resolve Tudo Isso

| Problema | Solução TechVerse |
|----------|-------------------|
| Comunicação confusa | Status automático em tempo real |
| Cobranças erradas | Sistema financeiro preciso |
| Perda de dados | CRM centralizado |
| Agendamentos confusos | Agenda inteligente |
| Falta de visão | Dashboard com métricas claras |

---

## 🚀 Comece Agora

A boa notícia? Você não precisa reinventar a roda.

Com o **TechVerse**, você resolve tudo isso em uma única plataforma. Sem papéis perdidos, sem planilhas confusas, sem atrasos.

### Próximos Passos:
1. **Teste grátis por 30 dias** - Sem cartão de crédito
2. **Configure seus clientes** - Leva 10 minutos
3. **Comece a organizar** - Veja a diferença no primeiro dia
4. **Acompanhe seus números** - Dashboard automático

---

## 💬 Perguntas Frequentes

**P: Quanto tempo leva para aprender a usar?**  
R: 30 minutos. É bem intuitivo.

**P: Posso importar meus clientes antigos?**  
R: Sim, fazemos a importação para você.

**P: E se mudar de ideia?**  
R: Seus dados são sempre seus. Sem retenção.

---

**Não deixe mais seus clientes irem embora por má gestão.**  
**Teste o TechVerse hoje mesmo e veja a diferença.**`,
    dataPub: new Date(),
    views: 0,
    ativo: true
  }

  try {
    await saveNews(defaultNews)
    // Refresh list
    const data = await getPublishedNews()
    news.value = data || []
  } catch (error) {
    console.error('Erro ao criar notícia padrão:', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    const data = await getPublishedNews()
    news.value = data || []
    
    // Check and create default news
    // Only if user is logged in (required for write permission)
    if (currentUser.value) {
      await createDefaultNews()
    } else {
      console.log('Usuário não logado, pulando criação automática de notícia.')
    }
  } catch (error) {
    console.error('Erro ao carregar notícias:', error)
  } finally {
    loading.value = false
  }
})

// Debug function to force creation
const forceCreateNews = async () => {
  if (confirm('Deseja recriar a notícia padrão?')) {
    await createDefaultNews()
    alert('Tentativa de criação finalizada. Recarregue a página.')
  }
}
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

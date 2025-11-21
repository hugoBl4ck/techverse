<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Hero Section with Gradient -->
    <div class="relative bg-primary/5 border-b border-border/40 pb-16 pt-12">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog & Notícias
            </h1>
            <p class="text-lg text-muted-foreground max-w-2xl">
              Dicas de gestão, tutoriais e novidades do universo TechVerse para impulsionar sua assistência.
            </p>
          </div>
          
          <!-- Admin Actions -->
          <div v-if="isAdmin" class="flex gap-3">
            <Button @click="openNewNews" class="shadow-lg hover:shadow-xl transition-all">
              <Plus class="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </div>
        </div>

        <!-- Search & Filter Bar -->
        <div class="bg-card border border-border/50 rounded-xl shadow-sm p-2 flex flex-col md:flex-row gap-2">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar artigos..." 
              class="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm"
            />
          </div>
          <div class="h-px md:h-auto md:w-px bg-border/50 mx-2"></div>
          <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="selectedCategory = selectedCategory === cat.id ? '' : cat.id"
              class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
              :class="selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 max-w-6xl py-12">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="space-y-4">
          <div class="aspect-video bg-muted/40 rounded-xl animate-pulse"></div>
          <div class="h-4 bg-muted/40 rounded w-3/4 animate-pulse"></div>
          <div class="h-4 bg-muted/40 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredNews.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Newspaper class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
        <p class="text-muted-foreground mb-6">Tente buscar por outros termos ou categorias.</p>
        <Button variant="outline" @click="resetFilters">Limpar Filtros</Button>
      </div>

      <!-- News Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="item in filteredNews" 
          :key="item.id"
          class="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
        >
          <!-- Image -->
          <router-link :to="'/noticias/' + item.id" class="relative aspect-video overflow-hidden bg-muted">
            <img 
              v-if="item.imagem" 
              :src="item.imagem" 
              :alt="item.titulo"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
              <Newspaper class="w-12 h-12" />
            </div>
            
            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur text-foreground shadow-sm">
                {{ formatarCategoria(item.categoria) }}
              </span>
            </div>

            <!-- Admin Controls -->
            <div v-if="isAdmin" class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.prevent="editNews(item)" class="p-1.5 bg-background/90 backdrop-blur rounded-md hover:text-primary transition-colors shadow-sm">
                <Edit class="w-4 h-4" />
              </button>
              <button @click.prevent="handleDeleteNews(item.id)" class="p-1.5 bg-background/90 backdrop-blur rounded-md hover:text-destructive transition-colors shadow-sm">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </router-link>

          <!-- Content -->
          <div class="flex-1 p-5 flex flex-col">
            <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ formatarData(item.dataPub) }}</span>
              <span class="mx-1">•</span>
              <Eye class="w-3.5 h-3.5" />
              <span>{{ item.views || 0 }} views</span>
            </div>

            <router-link :to="'/noticias/' + item.id" class="block mb-3">
              <h3 class="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {{ item.titulo }}
              </h3>
            </router-link>

            <p class="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {{ getExcerpt(item.conteudo) }}
            </p>

            <div class="pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
              <router-link 
                :to="'/noticias/' + item.id"
                class="text-sm font-medium text-primary hover:underline inline-flex items-center"
              >
                Ler artigo
                <ArrowRight class="w-4 h-4 ml-1" />
              </router-link>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Editor Modal -->
    <Dialog :open="showEditor" @update:open="showEditor = $event">
      <DialogContent class="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Editar Notícia' : 'Nova Notícia' }}</DialogTitle>
        </DialogHeader>
        
        <div class="grid gap-6 py-4">
          <div class="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" v-model="editingNews.titulo" placeholder="Título chamativo..." class="text-lg font-medium" />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                v-model="editingNews.categoria"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
              </select>
            </div>
            
            <div class="grid gap-2">
              <Label htmlFor="imagem">URL da Imagem (Capa)</Label>
              <Input id="imagem" v-model="editingNews.imagem" placeholder="https://..." />
            </div>
          </div>

          <div v-if="editingNews.imagem" class="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
            <img :src="editingNews.imagem" class="w-full h-full object-cover" />
          </div>
          
          <div class="grid gap-2">
            <div class="flex justify-between items-center">
              <Label htmlFor="conteudo">Conteúdo (Markdown)</Label>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" class="text-xs text-primary hover:underline">
                Guia Markdown
              </a>
            </div>
            <Textarea 
              id="conteudo" 
              v-model="editingNews.conteudo" 
              class="min-h-[300px] font-mono text-sm leading-relaxed" 
              placeholder="# Título da Seção&#10;&#10;Escreva seu conteúdo aqui..." 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="showEditor = false">Cancelar</Button>
          <Button @click="handleSaveNews" :disabled="isSaving">
            <Save class="w-4 h-4 mr-2" />
            {{ isSaving ? 'Salvando...' : 'Salvar Publicação' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Newspaper, Search, Filter, Eye, ArrowRight, Plus, Edit, Trash2, Save, Calendar } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useFirestore } from '@/composables/useFirestore'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

const { getPublishedNews, saveNews, deleteNews } = useFirestore()
const { currentUser, authReady } = useCurrentStore()

// Constants
const categories = [
  { id: 'techverse', label: 'TechVerse' },
  { id: 'tutorial', label: 'Tutoriais' },
  { id: 'tech', label: 'Tecnologia' },
  { id: 'release', label: 'Novidades' },
  { id: 'business', label: 'Negócios' }
]

// State
const loading = ref(true)
const isSaving = ref(false)
const news = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')

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
  return currentUser.value && currentUser.value.email
})

const filteredNews = computed(() => {
  let filtered = news.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.titulo.toLowerCase().includes(query) ||
      item.conteudo.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.categoria === selectedCategory.value)
  }

  // Sort by date desc
  filtered.sort((a, b) => {
    const dateA = a.dataPub?.toDate ? a.dataPub.toDate() : new Date(a.dataPub || 0)
    const dateB = b.dataPub?.toDate ? b.dataPub.toDate() : new Date(b.dataPub || 0)
    return dateB - dateA
  })

  return filtered
})

// Methods
const formatarData = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const formatarCategoria = (catId) => {
  const cat = categories.find(c => c.id === catId)
  return cat ? cat.label : catId
}

const getExcerpt = (content) => {
  if (!content) return ''
  // Remove markdown chars roughly
  const plain = content.replace(/[#*`_]/g, '')
  return plain.substring(0, 150) + (plain.length > 150 ? '...' : '')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
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
      toast.success('Notícia excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir notícia:', error)
      toast.error('Erro ao excluir notícia')
    }
  }
}

const handleSaveNews = async () => {
  if (!editingNews.value.titulo || !editingNews.value.conteudo) {
    toast.error('Preencha título e conteúdo')
    return
  }

  isSaving.value = true
  try {
    const savedId = await saveNews(editingNews.value)
    
    const newItem = { 
      ...editingNews.value, 
      id: savedId, 
      dataPub: editingNews.value.dataPub || new Date() 
    }

    if (isEditing.value) {
      const index = news.value.findIndex(n => n.id === savedId)
      if (index !== -1) {
        news.value[index] = newItem
      }
    } else {
      news.value.unshift(newItem)
    }
    
    showEditor.value = false
    toast.success('Notícia salva com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar notícia:', error)
    toast.error('Erro ao salvar notícia')
  } finally {
    isSaving.value = false
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
    imagem: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
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
    toast.success('Notícia padrão criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar notícia padrão:', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await authReady
    const data = await getPublishedNews()
    news.value = data || []
    
    // Check and create default news if user is logged in
    if (currentUser.value) {
      await createDefaultNews()
    }
  } catch (error) {
    console.error('Erro ao carregar notícias:', error)
    toast.error('Erro ao carregar notícias')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 max-w-3xl">
      <div class="space-y-6 animate-pulse">
        <div class="h-8 bg-muted rounded w-3/4"></div>
        <div class="h-4 bg-muted rounded w-1/4"></div>
        <div class="h-64 bg-muted rounded-xl w-full"></div>
        <div class="space-y-3 pt-8">
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !news" class="container mx-auto px-4 py-20 text-center max-w-md">
      <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8 text-destructive" />
      </div>
      <h2 class="text-2xl font-bold text-foreground mb-2">Notícia não encontrada</h2>
      <p class="text-muted-foreground mb-6">O artigo que você procura pode ter sido removido ou não existe.</p>
      <Button as-child>
        <router-link to="/noticias">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Voltar para o Blog
        </router-link>
      </Button>
    </div>

    <!-- Content -->
    <article v-else>
      <!-- Hero Section with Gradient Overlay -->
      <header class="relative bg-muted/30 border-b border-border/40 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div class="container mx-auto px-4 py-16 md:py-20 max-w-4xl text-center relative z-10">
          <div class="flex flex-wrap items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 shadow-sm">
              {{ formatarCategoria(news.categoria) }}
            </span>
            <span class="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ formatarData(news.dataPub) }}
            </span>
            <span class="text-sm text-muted-foreground flex items-center gap-1 ml-2">
              <Eye class="w-3.5 h-3.5" />
              {{ news.views || 0 }} views
            </span>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {{ news.titulo }}
          </h1>

          <!-- Author -->
          <div class="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg ring-2 ring-background">
              <User class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-foreground">Equipe TechVerse</p>
              <p class="text-xs text-muted-foreground">Editor Chefe</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Image -->
      <div v-if="news.imagem" class="container mx-auto px-4 max-w-5xl -mt-12 mb-16 relative z-20 animate-in fade-in zoom-in-95 duration-1000 delay-300">
        <div class="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-muted group">
          <img 
            :src="news.imagem" 
            :alt="news.titulo"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <!-- Article Body -->
      <div class="container mx-auto px-4 max-w-3xl">
        <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
          <!-- Simple Markdown Rendering -->
          <div v-for="(block, index) in parsedContent" :key="index" class="mb-6">
            <!-- Headers -->
            <h2 v-if="block.type === 'h2'" :id="'h2-'+index" class="scroll-mt-24 text-2xl md:text-3xl mt-12 mb-6 pb-2 border-b border-border/50">
              {{ block.content }}
            </h2>
            <h3 v-else-if="block.type === 'h3'" :id="'h3-'+index" class="scroll-mt-24 text-xl md:text-2xl mt-8 mb-4 text-foreground/90">
              {{ block.content }}
            </h3>
            
            <!-- List -->
            <ul v-else-if="block.type === 'list'" class="space-y-2 my-6">
              <li v-for="(item, i) in block.items" :key="i" class="flex items-start gap-2">
                <span class="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                <span v-html="formatInline(item)"></span>
              </li>
            </ul>

            <!-- Table -->
             <div v-else-if="block.type === 'table'" class="not-prose overflow-x-auto my-8 border border-border rounded-lg shadow-sm bg-card">
              <table class="w-full text-sm text-left">
                <thead class="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
                  <tr>
                    <th v-for="(header, h) in block.headers" :key="h" class="px-6 py-3 whitespace-nowrap">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="(row, r) in block.rows" :key="r" class="bg-background hover:bg-muted/20 transition-colors">
                    <td v-for="(cell, c) in row" :key="c" class="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Horizontal Rule -->
            <hr v-else-if="block.type === 'hr'" class="my-12 border-border" />

            <!-- Code Block (Simple) -->
            <div v-else-if="block.type === 'code'" class="relative group my-6">
              <pre class="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-zinc-800 shadow-inner"><code>{{ block.content }}</code></pre>
            </div>

            <!-- Quote -->
            <blockquote v-else-if="block.type === 'quote'" class="border-l-4 border-primary pl-6 italic text-muted-foreground my-8 text-lg">
              "{{ block.content }}"
            </blockquote>

            <!-- Paragraph -->
            <p v-else class="leading-relaxed text-foreground/90">
              <span v-html="formatInline(block.content)"></span>
            </p>
          </div>
        </div>

        <!-- Share Section -->
        <div class="mt-16 py-8 border-y border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compartilhar artigo:</span>
            <div class="flex gap-2">
              <a 
                :href="`https://wa.me/?text=${encodeURIComponent(news.titulo + ' - ' + currentUrl)}`" 
                target="_blank" 
                class="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Compartilhar no WhatsApp"
              >
                <i class="fa-brands fa-whatsapp text-lg"></i>
              </a>
              <a 
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`" 
                target="_blank" 
                class="w-10 h-10 rounded-full bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Compartilhar no LinkedIn"
              >
                <i class="fa-brands fa-linkedin-in text-lg"></i>
              </a>
              <a 
                :href="`mailto:?subject=${encodeURIComponent(news.titulo)}&body=${encodeURIComponent('Confira esta notícia: ' + currentUrl)}`"
                class="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Compartilhar por Email"
              >
                <i class="fa-regular fa-envelope text-lg"></i>
              </a>
              <button 
                @click="copyLink"
                class="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Copiar Link"
              >
                <LinkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <Button variant="outline" as-child class="group">
            <router-link to="/noticias">
              <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Blog
            </router-link>
          </Button>
        </div>

        <!-- Comments Section -->
        <CommentsSection :news-id="news.id" />
        
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, User, Calendar, Eye, Link as LinkIcon } from 'lucide-vue-next'
import CommentsSection from '@/components/CommentsSection.vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const news = ref(null)

const currentUrl = computed(() => window.location.href)

const copyLink = () => {
  navigator.clipboard.writeText(currentUrl.value)
  toast.success('Link copiado para a área de transferência!')
}

const updateMetaTags = (newsItem) => {
  if (!newsItem) return
  
  // Update Title
  document.title = `${newsItem.titulo} | TechVerse`
  
  // Update Meta Description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    // Get first 150 chars of content for description, stripping markdown
    const plainText = newsItem.conteudo.replace(/[#*`_]/g, '').substring(0, 155) + '...'
    metaDescription.setAttribute('content', plainText)
  }
  
  // Open Graph Tags (for sharing)
  updateOgTag('og:title', newsItem.titulo)
  updateOgTag('og:description', newsItem.conteudo.replace(/[#*`_]/g, '').substring(0, 155) + '...')
  updateOgTag('og:image', newsItem.imagem || 'https://techverseapp.vercel.app/techLOGO.svg')
  updateOgTag('og:url', window.location.href)
}

const updateOgTag = (property, content) => {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'ID não fornecido'
    loading.value = false
    return
  }

  try {
    const docRef = doc(db, 'noticias', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      news.value = { id: docSnap.id, ...docSnap.data() }
      
      // Update SEO
      updateMetaTags(news.value)
      
      // Increment views
      updateDoc(docRef, {
        views: increment(1)
      }).catch(console.error)
      
    } else {
      error.value = 'Notícia não encontrada'
    }
  } catch (err) {
    console.error('Erro ao carregar notícia:', err)
    error.value = 'Erro ao carregar notícia'
  } finally {
    loading.value = false
  }
})

const formatarData = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const formatarCategoria = (categoria) => {
  const map = {
    techverse: 'TechVerse',
    tech: 'Tecnologia',
    tutorial: 'Tutorial',
    release: 'Novidade',
    business: 'Negócios'
  }
  return map[categoria] || categoria
}

// Improved Markdown Parser
const parsedContent = computed(() => {
  if (!news.value || !news.value.conteudo) return []

  const lines = news.value.conteudo.split('\n')
  const blocks = []
  let currentList = null
  let currentTable = null
  let inCodeBlock = false
  let codeContent = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '') // Remove carriage return if present

    // Code Blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({ type: 'code', content: codeContent.trim() })
        codeContent = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }

    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    // Headers
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.replace('## ', '') })
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.replace('### ', '') })
    }
    // Horizontal Rule
    else if (trimmedLine === '---' || trimmedLine === '***') {
      blocks.push({ type: 'hr' })
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', content: line.replace('> ', '') })
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!currentList) {
        currentList = { type: 'list', items: [] }
        blocks.push(currentList)
      }
      currentList.items.push(line.substring(2))
    }
    // Tables
    else if (line.startsWith('|')) {
      if (!currentTable) {
        // Assume first line is header
        const headers = line.split('|').filter(c => c.trim()).map(c => c.trim())
        currentTable = { type: 'table', headers, rows: [] }
        blocks.push(currentTable)
        // Skip separator line if next
        if (lines[i+1] && lines[i+1].includes('---')) {
          i++
        }
      } else {
        const row = line.split('|').filter(c => c.trim()).map(c => c.trim())
        currentTable.rows.push(row)
      }
    }
    // Paragraphs
    else {
      currentList = null
      currentTable = null
      blocks.push({ type: 'p', content: line })
    }
  }

  return blocks
})

const formatInline = (text) => {
  if (!text) return ''
  // Bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
  // Links
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank">$1</a>')
  // Code inline
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
  return formatted
}
</script>

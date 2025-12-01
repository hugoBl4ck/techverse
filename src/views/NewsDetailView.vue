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
      <!-- Header -->
      <header class="bg-background border-b border-border/40">
        <div class="container mx-auto px-4 py-12 max-w-4xl text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {{ formatarCategoria(news.categoria) }}
            </span>
            <span class="text-sm text-muted-foreground">
              {{ formatarData(news.dataPub) }}
            </span>
          </div>
          
          <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-tight">
            {{ news.titulo }}
          </h1>

          <!-- Author/Meta (Optional) -->
          <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <User class="w-4 h-4" />
            </div>
            <span>Por <span class="font-medium text-foreground">Equipe TechVerse</span></span>
          </div>
        </div>
      </header>

      <!-- Hero Image -->
      <div v-if="news.imagem" class="container mx-auto px-4 max-w-5xl -mt-8 mb-12">
        <div class="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
          <img 
            :src="news.imagem" 
            :alt="news.titulo"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Article Body -->
      <div class="container mx-auto px-4 max-w-3xl">
        <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl">
          <!-- Simple Markdown Rendering -->
          <div v-for="(block, index) in parsedContent" :key="index" class="mb-6">
            <!-- Headers -->
            <h2 v-if="block.type === 'h2'" :id="'h2-'+index" class="scroll-mt-20">
              {{ block.content }}
            </h2>
            <h3 v-else-if="block.type === 'h3'" :id="'h3-'+index" class="scroll-mt-20">
              {{ block.content }}
            </h3>
            
            <!-- List -->
            <ul v-else-if="block.type === 'list'">
              <li v-for="(item, i) in block.items" :key="i">
                <span v-html="formatInline(item)"></span>
              </li>
            </ul>

            <!-- Table -->
             <div v-else-if="block.type === 'table'" class="not-prose overflow-x-auto my-8 border border-border rounded-lg shadow-sm">
              <table class="w-full text-sm text-left">
                <thead class="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
                  <tr>
                    <th v-for="(header, h) in block.headers" :key="h" class="px-6 py-3">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="(row, r) in block.rows" :key="r" class="bg-background hover:bg-muted/20">
                    <td v-for="(cell, c) in row" :key="c" class="px-6 py-4 font-medium text-foreground">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Horizontal Rule -->
            <hr v-else-if="block.type === 'hr'" />

            <!-- Code Block (Simple) -->
            <pre v-else-if="block.type === 'code'" class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ block.content }}</code></pre>

            <!-- Quote -->
            <blockquote v-else-if="block.type === 'quote'" class="border-l-4 border-primary pl-4 italic text-muted-foreground">
              {{ block.content }}
            </blockquote>

            <!-- Paragraph -->
            <p v-else>
              <span v-html="formatInline(block.content)"></span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="ghost" as-child>
            <router-link to="/noticias">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Voltar para o Blog
            </router-link>
          </Button>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">Compartilhar:</span>
            <Button variant="outline" size="icon" class="rounded-full w-8 h-8">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </Button>
            <Button variant="outline" size="icon" class="rounded-full w-8 h-8">
              <i class="fa-brands fa-linkedin text-sm"></i>
            </Button>
            <Button variant="outline" size="icon" class="rounded-full w-8 h-8">
              <i class="fa-regular fa-envelope text-sm"></i>
            </Button>
          </div>
        </div>
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
import { ArrowLeft, AlertCircle, User } from 'lucide-vue-next'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const news = ref(null)

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

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="space-y-4 animate-pulse">
        <div class="h-8 bg-muted rounded w-3/4"></div>
        <div class="h-64 bg-muted rounded w-full"></div>
        <div class="space-y-2">
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-full"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !news" class="container mx-auto px-4 py-12 text-center">
      <h2 class="text-2xl font-bold text-foreground mb-4">Notícia não encontrada</h2>
      <p class="text-muted-foreground mb-6">A notícia que você procura não existe ou foi removida.</p>
      <router-link to="/noticias" class="text-primary hover:underline">
        &larr; Voltar para Notícias
      </router-link>
    </div>

    <!-- Content -->
    <article v-else>
      <!-- Hero Image -->
      <div class="relative h-[400px] w-full overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
        <img 
          v-if="news.imagem" 
          :src="news.imagem" 
          :alt="news.titulo"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-muted flex items-center justify-center">
          <span class="text-muted-foreground">Sem imagem</span>
        </div>
        
        <!-- Title Overlay -->
        <div class="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-12 max-w-4xl">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {{ formatarCategoria(news.categoria) }}
            </span>
            <span class="text-sm text-muted-foreground/80 text-white">
              {{ formatarData(news.dataPub) }}
            </span>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            {{ news.titulo }}
          </h1>
        </div>
      </div>

      <!-- Article Body -->
      <div class="container mx-auto px-4 py-12 max-w-3xl">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <!-- Simple Markdown Rendering -->
          <div v-for="(block, index) in parsedContent" :key="index" class="mb-6">
            <!-- Headers -->
            <h2 v-if="block.type === 'h2'" class="text-2xl font-bold mt-8 mb-4 text-foreground">
              {{ block.content }}
            </h2>
            <h3 v-if="block.type === 'h3'" class="text-xl font-semibold mt-6 mb-3 text-foreground">
              {{ block.content }}
            </h3>
            
            <!-- List -->
            <ul v-else-if="block.type === 'list'" class="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
              <li v-for="(item, i) in block.items" :key="i">
                <span v-html="formatInline(item)"></span>
              </li>
            </ul>

            <!-- Table -->
             <div v-else-if="block.type === 'table'" class="overflow-x-auto my-6">
              <table class="w-full border-collapse border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr class="bg-muted/50">
                    <th v-for="(header, h) in block.headers" :key="h" class="p-3 text-left border-b border-border font-semibold text-foreground">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, r) in block.rows" :key="r" class="border-b border-border/50 hover:bg-muted/20">
                    <td v-for="(cell, c) in row" :key="c" class="p-3 border-b border-border/50 text-muted-foreground">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Horizontal Rule -->
            <hr v-else-if="block.type === 'hr'" class="my-8 border-border" />

            <!-- Paragraph -->
            <p v-else class="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              <span v-html="formatInline(block.content)"></span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <router-link to="/noticias" class="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            &larr; Voltar para Notícias
          </router-link>
          
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Compartilhar:</span>
            <!-- Placeholder share buttons -->
            <button class="p-2 hover:bg-muted rounded-full transition-colors">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button class="p-2 hover:bg-muted rounded-full transition-colors">
              <i class="fa-brands fa-linkedin"></i>
            </button>
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
import { doc, getDoc } from 'firebase/firestore'

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
    release: 'Lançamento'
  }
  return map[categoria] || categoria
}

// Simple Markdown Parser
const parsedContent = computed(() => {
  if (!news.value || !news.value.conteudo) return []

  const lines = news.value.conteudo.split('\n')
  const blocks = []
  let currentList = null
  let currentTable = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) continue

    // Headers
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.replace('## ', '') })
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.replace('### ', '') })
    }
    // Horizontal Rule
    else if (line === '---' || line === '***') {
      blocks.push({ type: 'hr' })
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!currentList) {
        currentList = { type: 'list', items: [] }
        blocks.push(currentList)
      }
      currentList.items.push(line.substring(2))
    }
    // Tables (Basic support)
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
      // Reset list/table context if we hit a normal paragraph
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
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Links
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
  return formatted
}
</script>

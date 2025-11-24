<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 mb-8">
      <h1 class="text-4xl font-display font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent w-fit">
        Ranking de Processadores
      </h1>
      <p class="text-muted-foreground text-lg max-w-2xl">
        Compare o desempenho das CPUs mais populares do mercado. Dados baseados no benchmark CPU-Z.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Coluna Principal: Tabela (Occupies 8/12 on desktop) -->
      <div class="lg:col-span-8 space-y-4">
        
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-muted-foreground">Ordenar por:</span>
            <div class="flex bg-muted/50 rounded-lg p-1">
              <button 
                @click="sortBy('multi')"
                class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                :class="sortKey === 'multi' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              >
                Multi Thread
              </button>
              <button 
                @click="sortBy('single')"
                class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                :class="sortKey === 'single' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
              >
                Single Thread
              </button>
            </div>
          </div>

          <div class="relative w-full sm:w-72">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar processador (ex: Ryzen 5)..." 
              class="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <span class="absolute left-3 top-2.5 text-muted-foreground">
              <i class="fa-solid fa-search text-xs"></i>
            </span>
          </div>
        </div>

        <!-- Tabela -->
        <div class="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-muted/30 text-muted-foreground uppercase text-xs">
                <tr>
                  <th class="px-6 py-4 font-medium w-16 text-center">#</th>
                  <th class="px-6 py-4 font-medium">Processador</th>
                  <th class="px-6 py-4 font-medium w-1/4">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-primary" @click="sortBy('single')">
                      Single Thread
                      <i v-if="sortKey === 'single'" class="fa-solid fa-sort-down text-primary"></i>
                    </div>
                  </th>
                  <th class="px-6 py-4 font-medium w-1/4">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-primary" @click="sortBy('multi')">
                      Multi Thread
                      <i v-if="sortKey === 'multi'" class="fa-solid fa-sort-down text-primary"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/50">
                <tr v-for="(cpu, index) in filteredCpus" :key="cpu.name" class="group hover:bg-primary/5 transition-colors">
                  <td class="px-6 py-4 text-center font-bold text-muted-foreground/50 group-hover:text-primary transition-colors">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-foreground text-base">{{ cpu.name }}</span>
                        <span v-if="cpu.new" class="px-1.5 py-0.5 text-[10px] font-bold bg-accent/10 text-accent rounded border border-accent/20 uppercase tracking-wider">Novo</span>
                        <span v-if="cpu.special" class="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 uppercase tracking-wider">{{ cpu.special }}</span>
                      </div>
                      <span class="text-xs text-muted-foreground mt-1">{{ cpu.category }}</span>
                    </div>
                  </td>
                  
                  <!-- Single Thread Column -->
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1.5">
                      <div class="flex justify-between items-end">
                        <span class="font-mono font-medium" :class="sortKey === 'single' ? 'text-primary font-bold' : 'text-muted-foreground'">{{ cpu.single }}</span>
                      </div>
                      <div class="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                          :style="{ width: (cpu.single / maxSingle) * 100 + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>

                  <!-- Multi Thread Column -->
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1.5">
                      <div class="flex justify-between items-end">
                        <span class="font-mono font-medium" :class="sortKey === 'multi' ? 'text-primary font-bold' : 'text-muted-foreground'">{{ cpu.multi }}</span>
                      </div>
                      <div class="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          :style="{ width: (cpu.multi / maxMulti) * 100 + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCpus.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-muted-foreground">
                    <div class="flex flex-col items-center gap-2">
                      <i class="fa-solid fa-ghost text-2xl opacity-50"></i>
                      <p>Nenhum processador encontrado para "{{ searchQuery }}"</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sidebar (Occupies 4/12 on desktop) -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Info Card -->
        <div class="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg sticky top-24">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            Entendendo os Números
          </h3>
          
          <div class="space-y-5">
            <div class="p-3 rounded-lg bg-background/50 border border-border/50">
              <h4 class="font-semibold text-sm text-foreground mb-1">Single Thread</h4>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Desempenho de um único núcleo. Crucial para a maioria dos <strong class="text-foreground">jogos</strong> e uso cotidiano do Windows.
              </p>
            </div>

            <div class="p-3 rounded-lg bg-background/50 border border-border/50">
              <h4 class="font-semibold text-sm text-foreground mb-1">Multi Thread</h4>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Desempenho de todos os núcleos juntos. Vital para <strong class="text-foreground">streaming, edição de vídeo</strong> e renderização 3D.
              </p>
            </div>

            <div class="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-4 border border-primary/10">
              <div class="relative z-10">
                <h4 class="font-bold text-foreground mb-1">Seu PC está lento?</h4>
                <p class="text-xs text-muted-foreground mb-3">
                  Mesmo com um bom processador, configurações erradas podem matar o desempenho.
                </p>
                <router-link to="/otimizacao" class="text-xs font-bold text-primary hover:text-accent transition-colors inline-flex items-center gap-1">
                  Solicitar Análise Gratuita <i class="fa-solid fa-arrow-right"></i>
                </router-link>
              </div>
              <!-- Decorative circle -->
              <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        <!-- Submission Card -->
        <div class="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            <div class="p-2 rounded-lg bg-accent/10 text-accent">
              <i class="fa-solid fa-upload"></i>
            </div>
            Contribua
          </h3>
          <p class="text-xs text-muted-foreground mb-4">
            Ajude a comunidade enviando seus resultados do CPU-Z.
          </p>
          
          <form @submit.prevent="submitResult" class="space-y-3">
            <div>
              <input v-model="form.model" type="text" class="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-xs focus:ring-1 focus:ring-primary" placeholder="Modelo da CPU (ex: i5 12400F)" required />
            </div>
            <div>
              <input v-model="form.memoryFreq" type="text" class="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-xs focus:ring-1 focus:ring-primary" placeholder="Freq. Memória (ex: 3200MHz)" required />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.single" type="number" class="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-xs focus:ring-1 focus:ring-primary" placeholder="Score Single" required />
              <input v-model="form.multi" type="number" class="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-xs focus:ring-1 focus:ring-primary" placeholder="Score Multi" required />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground">Print do Resultado (Opcional)</label>
              <input 
                ref="fileInput"
                type="file" 
                @change="handleFileChange"
                accept="image/*"
                class="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
              />
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full py-2 bg-foreground text-background rounded-md text-xs font-bold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Enviando...' : 'Enviar Resultado' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, storage } from '@/firebase/config'
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, writeBatch, doc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { toast } from 'vue-sonner' // Assuming vue-sonner is used, or use alert/custom toast

const searchQuery = ref('')
const sortKey = ref('multi') // 'single' or 'multi'
const cpuData = ref([])
const isLoading = ref(true)

// Form Data
const form = ref({
  model: '',
  memoryFreq: '',
  single: '',
  multi: '',
  image: null
})
const isSubmitting = ref(false)
const fileInput = ref(null)

// Dados iniciais para seed (caso o banco esteja vazio)
const initialCpuData = [
  { name: 'Intel Core i9-14900K', single: 978, multi: 17100, category: 'Extremamente Forte', new: true },
  { name: 'AMD Ryzen 9 7950X', single: 790, multi: 15800, category: 'Extremamente Forte' },
  { name: 'Intel Core i9-13900K', single: 945, multi: 16800, category: 'Extremamente Forte' },
  { name: 'AMD Ryzen 9 7950X3D', single: 780, multi: 15500, category: 'Extremamente Forte' },
  { name: 'Intel Core i7-14700K', single: 930, multi: 15200, category: 'Extremamente Forte', new: true },
  { name: 'Intel Core i7-13700K', single: 870, multi: 12500, category: 'Muito Forte' },
  { name: 'AMD Ryzen 9 5950X', single: 690, multi: 11900, category: 'Muito Forte' },
  { name: 'Intel Core i5-14600K', single: 860, multi: 10400, category: 'Muito Forte', new: true },
  { name: 'Intel Core i5-13600K', single: 830, multi: 9900, category: 'Muito Forte' },
  { name: 'AMD Ryzen 7 7800X3D', single: 710, multi: 7800, category: 'Forte (Gaming King)', special: 'Gaming King' },
  { name: 'Intel Core i9-12900K', single: 810, multi: 11400, category: 'Muito Forte' },
  { name: 'AMD Ryzen 7 7700X', single: 770, multi: 8000, category: 'Forte' },
  { name: 'AMD Ryzen 9 5900X', single: 680, multi: 9500, category: 'Forte' },
  { name: 'Intel Core i7-12700K', single: 790, multi: 9300, category: 'Forte' },
  { name: 'AMD Ryzen 7 5800X3D', single: 620, multi: 6400, category: 'Forte (Gaming)' },
  { name: 'AMD Ryzen 5 5500X3D', single: 590, multi: 4500, category: 'Custo-Benefício', new: true, special: 'Budget King' },
  { name: 'AMD Ryzen 7 5800X', single: 650, multi: 6600, category: 'Forte' },
  { name: 'Intel Core i5-12600K', single: 770, multi: 7200, category: 'Forte' },
  { name: 'AMD Ryzen 5 7600X', single: 750, multi: 6100, category: 'Médio-Alto' },
  { name: 'Intel Core i5-13400F', single: 730, multi: 6600, category: 'Médio-Alto' },
  { name: 'AMD Ryzen 5 5600X', single: 640, multi: 4800, category: 'Médio' },
  { name: 'Intel Core i5-12400F', single: 700, multi: 4900, category: 'Médio' },
  { name: 'AMD Ryzen 5 5600', single: 610, multi: 4700, category: 'Médio' },
  { name: 'Intel Core i9-9900K', single: 580, multi: 5500, category: 'Médio' },
  { name: 'AMD Ryzen 7 3700X', single: 520, multi: 5400, category: 'Médio' },
  { name: 'Intel Core i7-8700K', single: 550, multi: 3700, category: 'Médio-Baixo' },
  { name: 'AMD Ryzen 5 3600', single: 510, multi: 4000, category: 'Médio-Baixo' },
  { name: 'Intel Core i3-12100F', single: 680, multi: 3400, category: 'Entrada Forte' },
  { name: 'AMD Ryzen 5 5500', single: 580, multi: 4300, category: 'Médio-Baixo' },
  { name: 'Intel Core i5-10400F', single: 490, multi: 3100, category: 'Entrada' },
  { name: 'AMD Ryzen 5 1600', single: 380, multi: 2800, category: 'Entrada' },
]

const fetchCpus = async () => {
  isLoading.value = true
  try {
    const q = query(collection(db, 'cpu_ranking'), orderBy('multi', 'desc'))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      // Se vazio, usa dados iniciais (e opcionalmente salva no banco)
      // Para produção, idealmente isso seria feito via admin ou script separado
      console.log('Banco vazio, usando dados locais')
      cpuData.value = initialCpuData
      // Uncomment to auto-seed on first load (use with caution)
      // seedDatabase() 
    } else {
      cpuData.value = snapshot.docs.map(doc => doc.data())
    }
  } catch (error) {
    console.error('Erro ao buscar CPUs:', error)
    cpuData.value = initialCpuData // Fallback
  } finally {
    isLoading.value = false
  }
}

// Função auxiliar para popular o banco (pode ser chamada via console ou botão oculto)
const seedDatabase = async () => {
  const batch = writeBatch(db)
  initialCpuData.forEach(cpu => {
    const docRef = doc(collection(db, 'cpu_ranking'))
    batch.set(docRef, cpu)
  })
  await batch.commit()
  console.log('Database seeded!')
}

const filteredCpus = computed(() => {
  let cpus = [...cpuData.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cpus = cpus.filter(cpu => cpu.name.toLowerCase().includes(query))
  }
  
  return cpus.sort((a, b) => b[sortKey.value] - a[sortKey.value])
})

// Computed max values for progress bars
const maxSingle = computed(() => {
  if (cpuData.value.length === 0) return 1000
  return Math.max(...cpuData.value.map(c => c.single))
})

const maxMulti = computed(() => {
  if (cpuData.value.length === 0) return 20000
  return Math.max(...cpuData.value.map(c => c.multi))
})

const sortBy = (key) => {
  sortKey.value = key
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
  }
}

const submitResult = async () => {
  if (!form.value.model || !form.value.single || !form.value.multi) {
    alert('Por favor, preencha todos os campos obrigatórios.')
    return
  }

  isSubmitting.value = true
  try {
    let imageUrl = ''
    
    // Upload Image if exists
    if (form.value.image) {
      const fileName = `cpu-submissions/${Date.now()}_${form.value.image.name}`
      const fileRef = storageRef(storage, fileName)
      const snapshot = await uploadBytes(fileRef, form.value.image)
      imageUrl = await getDownloadURL(snapshot.ref)
    }

    // Save to Firestore
    await addDoc(collection(db, 'cpu_submissions'), {
      model: form.value.model,
      memoryFreq: form.value.memoryFreq,
      single: Number(form.value.single),
      multi: Number(form.value.multi),
      imageUrl: imageUrl,
      status: 'pending',
      createdAt: serverTimestamp()
    })

    alert('Obrigado! Seu resultado foi enviado para análise e aparecerá no ranking após aprovação.')
    
    // Reset form
    form.value = {
      model: '',
      memoryFreq: '',
      single: '',
      multi: '',
      image: null
    }
    if (fileInput.value) fileInput.value.value = ''

  } catch (error) {
    console.error('Erro ao enviar:', error)
    alert('Erro ao enviar resultado. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCpus()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Ranking de Processadores</h1>
      <p class="text-muted-foreground">
        Compare o desempenho das CPUs mais populares do mercado com base no benchmark CPU-Z.
      </p>
    </div>

    <!-- Tabela de Ranking -->
    <div class="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div class="p-4 border-b border-border bg-muted/40">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 class="font-semibold text-lg">Top CPUs (Single & Multi Thread)</h2>
          <div class="relative w-full sm:w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar processador..." 
              class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span class="absolute right-3 top-2.5 text-muted-foreground">
              <i class="fa-solid fa-search text-xs"></i>
            </span>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th class="px-4 py-3 font-medium w-16 text-center">#</th>
              <th class="px-4 py-3 font-medium">Processador</th>
              <th 
                class="px-4 py-3 font-medium text-right cursor-pointer hover:text-primary transition-colors"
                @click="sortBy('single')"
              >
                Single Thread
                <i v-if="sortKey === 'single'" class="ml-1 fa-solid fa-sort-down"></i>
              </th>
              <th 
                class="px-4 py-3 font-medium text-right cursor-pointer hover:text-primary transition-colors"
                @click="sortBy('multi')"
              >
                Multi Thread
                <i v-if="sortKey === 'multi'" class="ml-1 fa-solid fa-sort-down"></i>
              </th>
              <th class="px-4 py-3 font-medium text-center">Classificação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="(cpu, index) in filteredCpus" :key="cpu.name" class="hover:bg-muted/20 transition-colors">
              <td class="px-4 py-3 text-center font-bold text-muted-foreground">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium text-foreground">
                {{ cpu.name }}
                <span v-if="cpu.new" class="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded border border-primary/20">NOVO</span>
              </td>
              <td class="px-4 py-3 text-right font-mono">{{ cpu.single }}</td>
              <td class="px-4 py-3 text-right font-mono font-semibold text-primary">{{ cpu.multi }}</td>
              <td class="px-4 py-3 text-center">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium border"
                  :class="getPerformanceClass(cpu.category)"
                >
                  {{ cpu.category }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredCpus.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                Nenhum processador encontrado para "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Seção Explicativa -->
      <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
          <i class="fa-solid fa-circle-info text-primary"></i>
          Entendendo o Ranking
        </h3>
        <div class="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong class="text-foreground">Single Thread:</strong> Importante para jogos e tarefas cotidianas que não utilizam muitos núcleos. Um valor acima de 700 é considerado excelente para gaming moderno.
          </p>
          <p>
            <strong class="text-foreground">Multi Thread:</strong> Crucial para renderização, edição de vídeo, streaming e multitarefa pesada. Quanto maior, melhor o processador lida com várias cargas de trabalho simultâneas.
          </p>
          <div class="p-4 bg-muted/30 rounded-md border border-border/50 mt-4">
            <h4 class="font-semibold text-foreground mb-2">Precisa de Otimização?</h4>
            <p class="mb-3">
              Se seu processador está na lista mas você sente lentidão, o problema pode não ser o hardware, mas sim a configuração do sistema.
            </p>
            <router-link to="/otimizacao" class="text-primary hover:underline font-medium inline-flex items-center gap-1">
              Solicitar Análise de Otimização <i class="fa-solid fa-arrow-right text-xs"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Seção de Envio -->
      <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
          <i class="fa-solid fa-upload text-primary"></i>
          Envie seu Resultado
        </h3>
        <p class="text-sm text-muted-foreground mb-4">
          Ajude a manter nosso banco de dados atualizado. Envie um print do seu resultado no CPU-Z.
        </p>
        
        <form @submit.prevent="submitResult" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Modelo da CPU</label>
              <input type="text" class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" placeholder="Ex: Ryzen 5 5600" required />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Frequência Memória (MHz)</label>
              <input type="text" class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" placeholder="Ex: 3200 ou 6000" required />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Score Single</label>
              <input type="number" class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" placeholder="0" required />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Score Multi</label>
              <input type="number" class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" placeholder="0" required />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Print do Resultado (Opcional)</label>
            <input type="file" class="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </div>

          <button type="submit" class="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            Enviar Contribuição
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const sortKey = ref('multi') // 'single' or 'multi'

// Dados aproximados baseados em benchmarks públicos (CPU-Z)
const cpuData = [
  { name: 'Intel Core i9-14900K', single: 978, multi: 17100, category: 'Extremamente Forte', new: true },
  { name: 'AMD Ryzen 9 7950X', single: 790, multi: 15800, category: 'Extremamente Forte' },
  { name: 'Intel Core i9-13900K', single: 945, multi: 16800, category: 'Extremamente Forte' },
  { name: 'AMD Ryzen 9 7950X3D', single: 780, multi: 15500, category: 'Extremamente Forte' },
  { name: 'Intel Core i7-14700K', single: 930, multi: 15200, category: 'Extremamente Forte', new: true },
  { name: 'Intel Core i7-13700K', single: 870, multi: 12500, category: 'Muito Forte' },
  { name: 'AMD Ryzen 9 5950X', single: 690, multi: 11900, category: 'Muito Forte' },
  { name: 'Intel Core i5-14600K', single: 860, multi: 10400, category: 'Muito Forte', new: true },
  { name: 'Intel Core i5-13600K', single: 830, multi: 9900, category: 'Muito Forte' },
  { name: 'AMD Ryzen 7 7800X3D', single: 710, multi: 7800, category: 'Forte (Gaming King)' },
  { name: 'Intel Core i9-12900K', single: 810, multi: 11400, category: 'Muito Forte' },
  { name: 'AMD Ryzen 7 7700X', single: 770, multi: 8000, category: 'Forte' },
  { name: 'AMD Ryzen 9 5900X', single: 680, multi: 9500, category: 'Forte' },
  { name: 'Intel Core i7-12700K', single: 790, multi: 9300, category: 'Forte' },
  { name: 'AMD Ryzen 7 5800X3D', single: 620, multi: 6400, category: 'Forte (Gaming)' },
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

const filteredCpus = computed(() => {
  let cpus = [...cpuData]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cpus = cpus.filter(cpu => cpu.name.toLowerCase().includes(query))
  }
  
  return cpus.sort((a, b) => b[sortKey.value] - a[sortKey.value])
})

const sortBy = (key) => {
  sortKey.value = key
}

const getPerformanceClass = (category) => {
  if (category.includes('Extremamente')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  if (category.includes('Muito Forte')) return 'bg-red-500/10 text-red-500 border-red-500/20'
  if (category.includes('Forte')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  if (category.includes('Médio')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
  return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
}

const submitResult = () => {
  alert('Obrigado! Seu resultado foi enviado para análise.')
  // TODO: Implementar envio real para backend/firebase
}
</script>

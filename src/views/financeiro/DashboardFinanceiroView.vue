<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Package, Zap, Truck } from 'lucide-vue-next'

const { storeId } = useCurrentStore()

// Dados de demonstração que funcionam sem autenticação
const isDemo = computed(() => !storeId.value)

const produtosDemo = [
  {
    id: 'demo-1',
    nome: 'Placa de Vídeo RTX 4060',
    sku: 'GPU-001',
    preco_venda: 1899.99,
    preco_custo: 1399.99,
    margem_lucro: 35.7,
    estoque: 15,
    categoria: 'eletronicos'
  },
  {
    id: 'demo-2',
    nome: 'Memória RAM 32GB DDR4',
    sku: 'MEM-001',
    preco_venda: 899.99,
    preco_custo: 599.99,
    margem_lucro: 50.0,
    estoque: 8,
    categoria: 'eletronicos'
  },
  {
    id: 'demo-3',
    nome: 'SSD NVMe 1TB',
    sku: 'SSD-001',
    preco_venda: 459.99,
    preco_custo: 299.99,
    margem_lucro: 53.3,
    estoque: 25,
    categoria: 'eletronicos'
  },
  {
    id: 'demo-4',
    nome: 'Processador AMD Ryzen 7',
    sku: 'CPU-001',
    preco_venda: 1299.99,
    preco_custo: 899.99,
    margem_lucro: 30.8,
    estoque: 12,
    categoria: 'eletronicos'
  },
  {
    id: 'demo-5',
    nome: 'Fonte 750W 80+ Gold',
    sku: 'PSU-001',
    preco_venda: 459.99,
    preco_custo: 299.99,
    margem_lucro: 53.3,
    estoque: 18,
    categoria: 'eletronicos'
  }
]

const transacoesDemo = computed(() => {
  const hoje = new Date()
  const vendas = []
  const despesas = []
  
  for (let i = 0; i < 14; i++) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() - i)
    
    // Gera vendas
    vendas.push({
      id: `demo-venda-${i}`,
      tipo: 'venda',
      valor: Math.random() * 1000 + 200,
      data_transacao: data,
      categoria: i % 3 === 0 ? 'eletronicos' : i % 3 === 1 ? 'servicos' : 'venda_geral',
      descricao: `Venda ${i + 1}`,
      status: 'concluida'
    })
    
    // Gera algumas despesas
    if (i % 2 === 0) {
      despesas.push({
        id: `demo-despesa-${i}`,
        tipo: 'despesa',
        valor: Math.random() * 200 + 50,
        data_transacao: data,
        categoria: i % 4 === 0 ? 'operacional' : i % 4 === 1 ? 'marketing' : 'manutencao',
        descricao: `Despesa ${i + 1}`,
        status: 'concluida'
      })
    }
  }
  
  return [...vendas, ...despesas].sort((a, b) => new Date(b.data_transacao) - new Date(a.data_transacao))
})

// Estado
const periodo = ref('mes')
const filtroCategoria = ref('todas')
const dataInicio = ref(null)
const dataFim = ref(null)

// Calcula datas baseado no período selecionado
const atualizarDatas = () => {
  const hoje = new Date()
  const inicio = new Date()

  switch (periodo.value) {
    case 'dia':
      inicio.setDate(hoje.getDate())
      break
    case 'semana':
      inicio.setDate(hoje.getDate() - 7)
      break
    case 'mes':
      inicio.setMonth(hoje.getMonth() - 1)
      break
    case 'ano':
      inicio.setFullYear(hoje.getFullYear() - 1)
      break
  }

  dataInicio.value = inicio
  dataFim.value = hoje
}

// Transações filtradas
const transacoesFiltradas = computed(() => {
  if (!dataInicio.value || !dataFim.value) return transacoesDemo.value
  
  return transacoesDemo.value.filter(t => {
    const data = new Date(t.data_transacao)
    return data >= dataInicio.value && data <= dataFim.value
  }).filter(t => {
    if (filtroCategoria.value === 'todas') return true
    return t.categoria === filtroCategoria.value
  })
})

// Totais recalculados com filtro
const totaisFiltrados = computed(() => {
  let receita = 0
  let despesa = 0

  transacoesFiltradas.value.forEach(t => {
    if (t.tipo === 'venda') receita += t.valor
    if (t.tipo === 'despesa') despesa += t.valor
  })

  return {
    receita: parseFloat(receita.toFixed(2)),
    despesa: parseFloat(despesa.toFixed(2)),
    lucro: parseFloat((receita - despesa).toFixed(2)),
    margem: receita > 0 ? ((receita - despesa) / receita * 100).toFixed(2) : 0
  }
})

// Dados para gráfico de faturamento diário
const dadosGraficoFaturamento = computed(() => {
  const agrupado = {}
  
  transacoesFiltradas.value.forEach(t => {
    if (t.tipo === 'venda') {
      const data = new Date(t.data_transacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
      agrupado[data] = (agrupado[data] || 0) + t.valor
    }
  })
  
  // Se não há dados, gera dados aleatórios para demonstração
  if (Object.keys(agrupado).length === 0) {
    const hoje = new Date()
    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje)
      data.setDate(hoje.getDate() - i)
      const dataStr = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
      agrupado[dataStr] = Math.random() * 800 + 200
    }
  }
  
  const dadosOrdenados = Object.entries(agrupado).map(([data, valor]) => ({ 
    data, 
    valor: parseFloat(valor.toFixed(2)) 
  }))
  
  return dadosOrdenados.sort((a, b) => {
    const [diaA, mesA] = a.data.split('/').map(Number)
    const [diaB, mesB] = b.data.split('/').map(Number)
    return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB)
  })
})

// Dados para gráfico por categoria
const dadosGraficoCategorias = computed(() => {
  const agrupado = {}
  
  transacoesFiltradas.value.forEach(t => {
    const cat = t.categoria || 'sem_categoria'
    if (!agrupado[cat]) {
      agrupado[cat] = { receita: 0, despesa: 0, total: 0 }
    }
    
    if (t.tipo === 'venda') {
      agrupado[cat].receita += t.valor
    } else if (t.tipo === 'despesa') {
      agrupado[cat].despesa += t.valor
    }
    agrupado[cat].total += t.tipo === 'venda' ? t.valor : -t.valor
  })
  
  return Object.entries(agrupado).map(([categoria, dados]) => ({
    name: categoria,
    receita: parseFloat(dados.receita.toFixed(2)),
    despesa: parseFloat(dados.despesa.toFixed(2)),
    lucro: parseFloat(dados.total.toFixed(2))
  }))
})

// Produtos para ranking
const produtosParaRanking = computed(() => {
  return produtosDemo.map(p => ({
    ...p,
    margem_lucro: ((p.preco_venda - p.preco_custo) / p.preco_venda * 100).toFixed(1)
  })).sort((a, b) => parseFloat(b.margem_lucro) - parseFloat(a.margem_lucro))
})

// Valores calculados
const valorEstoqueTotal = computed(() => {
  return produtosDemo.reduce((total, p) => total + (p.preco_custo * p.estoque), 0)
})

const itensEmTransito = computed(() => 12)
const quantidadeEmTransito = computed(() => 25)
const valorEmTransito = computed(() => 8750.50)

// Carrega dados ao montar
onMounted(() => {
  console.log('🔍 Dashboard carregado - Modo:', isDemo.value ? 'Demonstração' : 'Real')
  atualizarDatas()
})

// Monitora mudanças no período
watch(() => periodo.value, () => {
  atualizarDatas()
})

const isLoading = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
        <p class="text-sm text-muted-foreground mt-1">
          {{ isDemo ? 'Visão geral das finanças (Modo Demonstração)' : 'Visão geral das suas finanças' }}
        </p>
      </div>
      <div class="flex gap-2">
        <select 
          v-model="periodo"
          class="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium text-foreground hover:bg-primary/5 transition-colors"
        >
          <option value="dia">Últimos 24h</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mês</option>
          <option value="ano">Este ano</option>
        </select>
        <Button class="bg-primary hover:bg-primary/90">
          <Zap class="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>

    <!-- Métricas Principais -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Receita -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-primary/30 transition-all">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Receita
            <TrendingUp class="w-4 h-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">
            R$ {{ totaisFiltrados.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-primary mt-2">+{{ transacoesFiltradas.filter(t => t.tipo === 'venda').length }} vendas</p>
        </CardContent>
      </Card>

      <!-- Despesa -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-destructive/30 transition-all">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Despesa
            <TrendingDown class="w-4 h-4 text-destructive" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">
            R$ {{ totaisFiltrados.despesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-destructive mt-2">{{ transacoesFiltradas.filter(t => t.tipo === 'despesa').length }} despesas</p>
        </CardContent>
      </Card>

      <!-- Lucro -->
      <Card :class="[
        'border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm transition-all',
        totaisFiltrados.lucro >= 0 ? 'hover:border-green-500/30' : 'hover:border-destructive/30'
      ]">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Lucro
            <DollarSign :class="['w-4 h-4', totaisFiltrados.lucro >= 0 ? 'text-green-500' : 'text-destructive']" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div :class="['text-2xl font-bold', totaisFiltrados.lucro >= 0 ? 'text-green-500' : 'text-destructive']">
            R$ {{ totaisFiltrados.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </div>
          <p :class="['text-xs mt-2', totaisFiltrados.lucro >= 0 ? 'text-green-500' : 'text-destructive']">
            {{ totaisFiltrados.margem }}% de margem
          </p>
        </CardContent>
      </Card>

      <!-- Estoque -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-accent/30 transition-all">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Estoque
            <Package class="w-4 h-4 text-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-foreground">
            R$ {{ valorEstoqueTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-accent mt-2">{{ produtosDemo.length }} produtos</p>
        </CardContent>
      </Card>

      <!-- Em Trânsito -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-blue-500/30 transition-all">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Em Trânsito
            <Truck class="w-4 h-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-blue-500">
            R$ {{ valorEmTransito.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </div>
          <p class="text-xs text-blue-500 mt-2">{{ quantidadeEmTransito }} unidades</p>
        </CardContent>
      </Card>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de Faturamento Diário -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="dadosGraficoFaturamento.length === 0" class="h-80 flex items-center justify-center text-muted-foreground">
            Sem dados de transações no período
          </div>
          <ResponsiveContainer v-else width="100%" height="300">
            <BarChart :data="dadosGraficoFaturamento">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="data" stroke="rgba(var(--color-muted-foreground))" />
              <YAxis stroke="rgba(var(--color-muted-foreground))" />
              <Tooltip />
              <Bar dataKey="valor" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <!-- Gráfico por Categoria -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="dadosGraficoCategorias.length === 0" class="h-80 flex items-center justify-center text-muted-foreground">
            Sem dados de categorias no período
          </div>
          <ResponsiveContainer v-else width="100%" height="300">
            <BarChart :data="dadosGraficoCategorias">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="name" stroke="rgba(var(--color-muted-foreground))" />
              <YAxis stroke="rgba(var(--color-muted-foreground))" />
              <Tooltip />
              <Bar dataKey="receita" fill="#10b981" />
              <Bar dataKey="despesa" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <!-- Produtos com Melhor Margem -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top 5 Produtos por Margem de Lucro</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="(produto, idx) in produtosParaRanking.slice(0, 5)" :key="produto.id" class="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <div class="flex items-center gap-3 flex-1">
              <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                {{ idx + 1 }}
              </div>
              <div>
                <p class="font-medium text-foreground">{{ produto.nome }}</p>
                <p class="text-xs text-muted-foreground">{{ produto.sku }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-secondary">{{ produto.margem_lucro }}%</p>
              <p class="text-xs text-muted-foreground">R$ {{ produto.preco_venda.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Aviso para modo demo -->
    <div v-if="isDemo" class="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <strong>Modo Demonstração:</strong> Você está visualizando dados simulados. 
          Faça login para ver seus dados reais de vendas e compras.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-display {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>

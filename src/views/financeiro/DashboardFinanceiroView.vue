<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { useFinanceiro } from '@/composables/useFinanceiro'
import { useTransacoes } from '@/composables/useTransacoes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Package, Zap, Truck } from 'lucide-vue-next'

const { storeId } = useCurrentStore()
const { produtos, loadProdutos, produtosPorMargem, valorEstoqueTotal, itensEmTransito, quantidadeEmTransito, valorEmTransito, isLoading: isLoadingProdutos } = useFinanceiro(storeId)
const { 
  transacoes, 
  loadTransacoes, 
  totalVendas, 
  totalDespesas, 
  margemMedia,
  agruparPorCategoria,
  filtrarPorPeriodo,
  isLoading: isLoadingTransacoes
} = useTransacoes(storeId)

// Combina estados de loading
const isLoading = computed(() => isLoadingProdutos.value || isLoadingTransacoes.value)

// Estado
const periodo = ref('mes') // dia, semana, mes, ano
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
  if (!dataInicio.value || !dataFim.value) return transacoes.value
  
  let filtradas = filtrarPorPeriodo(dataInicio.value, dataFim.value)
  
  if (filtroCategoria.value !== 'todas') {
    filtradas = filtradas.filter(t => t.categoria === filtroCategoria.value)
  }
  
  return filtradas
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

// Dados para gráficos
const dadosGraficoReceita = computed(() => {
  const agrupado = {}
  transacoesFiltradas.value.forEach(t => {
    if (t.tipo === 'venda') {
      const data = new Date(t.data_transacao).toLocaleDateString()
      agrupado[data] = (agrupado[data] || 0) + t.valor
    }
  })
  return Object.entries(agrupado).map(([data, valor]) => ({ data, valor }))
})

const dadosGraficoDespesa = computed(() => {
  const agrupado = {}
  transacoesFiltradas.value.forEach(t => {
    if (t.tipo === 'despesa') {
      const data = new Date(t.data_transacao).toLocaleDateString()
      agrupado[data] = (agrupado[data] || 0) + t.valor
    }
  })
  return Object.entries(agrupado).map(([data, valor]) => ({ data, valor }))
})

const dadosGraficoCategorias = computed(() => {
  const agrupado = agruparPorCategoria(transacoesFiltradas.value)
  return Object.entries(agrupado).map(([categoria, dados]) => ({
    name: categoria,
    receita: dados.receita,
    despesa: dados.despesa,
    lucro: dados.total
  }))
})

const cores = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

// Carrega dados ao montar
onMounted(async () => {
  if (storeId.value) {
    try {
      await loadProdutos()
      await loadTransacoes()
      atualizarDatas()
    } catch (err) {
      console.error('❌ Erro ao carregar dados financeiros:', err)
    }
  }
})

// Monitora mudanças no período
watch(() => periodo.value, () => {
  atualizarDatas()
})

// Monitora mudanças na store
watch(() => storeId.value, (newStoreId) => {
  if (newStoreId) {
    loadProdutos()
    loadTransacoes()
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-muted-foreground">Carregando dashboard financeiro...</p>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
        <p class="text-sm text-muted-foreground mt-1">Visão geral das suas finanças</p>
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
          <p class="text-xs text-accent mt-2">{{ produtos.length }} produtos</p>
        </CardContent>
      </Card>

      <!-- Margem Média -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-secondary/30 transition-all">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">Margem Média</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-secondary">
            {{ totaisFiltrados.margem }}%
          </div>
          <p class="text-xs text-secondary mt-2">Do período</p>
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
      <!-- Gráfico de Receita vs Despesa -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Receita vs Despesa</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="dadosGraficoReceita.length === 0" class="h-80 flex items-center justify-center text-muted-foreground">
            Sem dados de transações no período
          </div>
          <ResponsiveContainer v-else width="100%" height={300}>
            <BarChart data={dadosGraficoReceita}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="data" stroke="rgba(var(--color-muted-foreground))" />
              <YAxis stroke="rgba(var(--color-muted-foreground))" />
              <Tooltip 
                :contentStyle="{ 
                  backgroundColor: 'rgba(var(--color-background))', 
                  border: '1px solid rgba(var(--color-border))',
                  borderRadius: '8px'
                }"
              />
              <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
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
          <ResponsiveContainer v-else width="100%" height={300}>
            <BarChart data={dadosGraficoCategorias}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="name" stroke="rgba(var(--color-muted-foreground))" />
              <YAxis stroke="rgba(var(--color-muted-foreground))" />
              <Tooltip 
                :contentStyle="{ 
                  backgroundColor: 'rgba(var(--color-background))', 
                  border: '1px solid rgba(var(--color-border))',
                  borderRadius: '8px'
                }"
              />
              <Legend />
              <Bar dataKey="receita" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesa" fill="#ef4444" radius={[8, 8, 0, 0]} />
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
          <div v-for="(produto, idx) in produtosPorMargem.slice(0, 5)" :key="produto.id" class="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
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
  </div>
</template>

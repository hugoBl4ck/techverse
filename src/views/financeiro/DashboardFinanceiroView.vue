<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { useFinanceiro } from '@/composables/useFinanceiro'
import { useTransacoes } from '@/composables/useTransacoes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
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
const services = ref([])
const cancelledServiceIds = ref(new Set())

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

// Carrega serviços para identificar cancelados
const loadServices = async () => {
  if (!storeId.value) return

  try {
    const servicesCol = collection(db, 'stores', storeId.value, 'ordens_servico')
    const snapshot = await getDocs(servicesCol)

    services.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.() || new Date(doc.data().date)
    }))

    // Identifica IDs de serviços cancelados
    cancelledServiceIds.value = new Set(
      services.value
        .filter(service => service.status === 'cancelada')
        .map(service => service.id)
    )
  } catch (error) {
    console.error('Erro ao carregar serviços:', error)
    services.value = []
    cancelledServiceIds.value = new Set()
  }
}

// Transações filtradas (excluindo serviços cancelados)
const transacoesFiltradas = computed(() => {
  if (!dataInicio.value || !dataFim.value) return transacoes.value

  let filtradas = filtrarPorPeriodo(dataInicio.value, dataFim.value)

  // Exclui transações de serviços cancelados
  filtradas = filtradas.filter(t =>
    !t.ordem_servico_id || !cancelledServiceIds.value.has(t.ordem_servico_id)
  )

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
      const data = new Date(t.data_transacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
      agrupado[data] = (agrupado[data] || 0) + t.valor
    }
  })

  // Se não há dados, gera dados vazios mas estruturados
  if (Object.keys(agrupado).length === 0) {
    return []
  }

  // Ordena por data para melhor visualização
  const dadosOrdenados = Object.entries(agrupado).map(([data, valor]) => ({ data, valor: parseFloat(valor.toFixed(2)) }))
  return dadosOrdenados.sort((a, b) => {
    const [diaA, mesA] = a.data.split('/').map(Number)
    const [diaB, mesB] = b.data.split('/').map(Number)
    return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB)
  })
})

// Dados para tabela diária detalhada
const dadosTabelaDiaria = computed(() => {
  const agrupado = {}

  transacoesFiltradas.value.forEach(t => {
    if (t.tipo === 'venda') {
      const data = new Date(t.data_transacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })

      if (!agrupado[data]) {
        agrupado[data] = { itens: 0, servicos: 0, total: 0 }
      }

      if (t.categoria === 'servico') {
        agrupado[data].servicos += t.valor
      } else {
        agrupado[data].itens += t.valor
      }

      agrupado[data].total += t.valor
    }
  })

  // Ordena por data
  const dadosOrdenados = Object.entries(agrupado)
    .map(([data, valores]) => ({
      data,
      itens: parseFloat(valores.itens.toFixed(2)),
      servicos: parseFloat(valores.servicos.toFixed(2)),
      total: parseFloat(valores.total.toFixed(2))
    }))
    .sort((a, b) => {
      const [diaA, mesA] = a.data.split('/').map(Number)
      const [diaB, mesB] = b.data.split('/').map(Number)
      return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB)
    })

  // Adiciona linha de total
  if (dadosOrdenados.length > 0) {
    const totalItens = dadosOrdenados.reduce((sum, row) => sum + row.itens, 0)
    const totalServicos = dadosOrdenados.reduce((sum, row) => sum + row.servicos, 0)
    const totalGeral = dadosOrdenados.reduce((sum, row) => sum + row.total, 0)

    dadosOrdenados.push({
      data: 'TOTAL',
      itens: parseFloat(totalItens.toFixed(2)),
      servicos: parseFloat(totalServicos.toFixed(2)),
      total: parseFloat(totalGeral.toFixed(2))
    })
  }

  return dadosOrdenados
})

const dadosGraficoCategorias = computed(() => {
  const agrupado = agruparPorCategoria(transacoesFiltradas.value)
  return Object.entries(agrupado).map(([categoria, dados]) => ({
    name: categoria,
    receita: parseFloat(dados.receita.toFixed(2)),
    despesa: parseFloat(dados.despesa.toFixed(2)),
    lucro: parseFloat(dados.total.toFixed(2))
  }))
})

const cores = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

// Carrega dados ao montar
onMounted(async () => {
  if (storeId.value) {
    try {
      await loadProdutos()
      await loadTransacoes()
      await loadServices()
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
    loadServices()
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

    <!-- Tabela de Receitas Diárias Detalhadas -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Receitas Diárias Detalhadas</CardTitle>
        <p class="text-sm text-muted-foreground">Vendas de itens e serviços por dia</p>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                <th class="text-right py-3 px-4 font-semibold text-foreground">Vendas de Itens</th>
                <th class="text-right py-3 px-4 font-semibold text-foreground">Serviços</th>
                <th class="text-right py-3 px-4 font-semibold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in dadosTabelaDiaria"
                :key="row.data"
                :class="[
                  'border-b border-border/50 hover:bg-primary/5 transition-colors',
                  row.data === 'TOTAL' ? 'bg-primary/10 font-semibold' : ''
                ]"
              >
                <td class="py-3 px-4 text-foreground">{{ row.data }}</td>
                <td class="py-3 px-4 text-right text-foreground">
                  R$ {{ row.itens.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </td>
                <td class="py-3 px-4 text-right text-foreground">
                  R$ {{ row.servicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </td>
                <td class="py-3 px-4 text-right font-semibold text-primary">
                  R$ {{ row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="dadosTabelaDiaria.length === 0" class="text-center py-8 text-muted-foreground">
            <p>Nenhuma transação encontrada no período selecionado</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de Receita vs Despesa -->
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="dadosGraficoReceita.length === 0" class="h-80 flex items-center justify-center text-muted-foreground">
            Sem dados de transações no período
          </div>
          <ResponsiveContainer v-else width="100%" height="300">
            <BarChart :data="dadosGraficoReceita">
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
              <Legend />
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

<style scoped>
.font-display {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>

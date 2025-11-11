<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { useFinanceiro } from '@/composables/useFinanceiro'
import { useTransacoes } from '@/composables/useTransacoes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Filter } from 'lucide-vue-next'

const { storeId } = useCurrentStore()
const { produtos, loadProdutos } = useFinanceiro(storeId)
const { transacoes, loadTransacoes, registrarVenda, registrarDespesa } = useTransacoes(storeId)

// Estado
const showForm = ref(false)
const tipoTransacao = ref('venda') // 'venda' | 'despesa'
const filtroTipo = ref('todas')
const filtroStatus = ref('todas')

const formData = ref({
  descricao: '',
  valor: 0,
  categoria: 'hardware',
  metodo_pagamento: 'pix',
  status: 'concluida',
  data_transacao: new Date().toISOString().split('T')[0],
  cliente_id: '',
  ordem_servico_id: '',
  produtos: []
})

const produtoSelecionado = ref({
  produtoId: '',
  quantidade: 1
})

// Transações filtradas
const transacoesFiltradas = computed(() => {
  let lista = [...transacoes.value]

  if (filtroTipo.value !== 'todas') {
    lista = lista.filter(t => t.tipo === filtroTipo.value)
  }

  if (filtroStatus.value !== 'todas') {
    lista = lista.filter(t => t.status === filtroStatus.value)
  }

  return lista.sort((a, b) => new Date(b.data_transacao) - new Date(a.data_transacao))
})

// Produto selecionado com dados
const produtoAtual = computed(() => {
  if (!produtoSelecionado.value.produtoId) return null
  return produtos.value.find(p => p.id === produtoSelecionado.value.produtoId)
})

// Subtotal do produto
const subtotalProduto = computed(() => {
  if (!produtoAtual.value) return 0
  return (produtoAtual.value.preco_venda * produtoSelecionado.value.quantidade).toFixed(2)
})

// Limpa formulário
const limparForm = () => {
  formData.value = {
    descricao: '',
    valor: 0,
    categoria: 'hardware',
    metodo_pagamento: 'pix',
    status: 'concluida',
    data_transacao: new Date().toISOString().split('T')[0],
    cliente_id: '',
    ordem_servico_id: '',
    produtos: []
  }
  produtoSelecionado.value = {
    produtoId: '',
    quantidade: 1
  }
}

// Adiciona produto à lista
const adicionarProduto = () => {
  if (!produtoSelecionado.value.produtoId || produtoSelecionado.value.quantidade <= 0) {
    alert('Selecione um produto e quantidade válida')
    return
  }

  formData.value.produtos.push({
    produtoId: produtoSelecionado.value.produtoId,
    quantidade: produtoSelecionado.value.quantidade,
    preco_unitario: produtoAtual.value.preco_venda,
    subtotal: parseFloat(subtotalProduto.value)
  })

  // Atualiza valor total
  formData.value.valor = formData.value.produtos.reduce((sum, p) => sum + p.subtotal, 0)

  // Limpa seleção
  produtoSelecionado.value = {
    produtoId: '',
    quantidade: 1
  }
}

// Remove produto da lista
const removerProduto = (idx) => {
  formData.value.produtos.splice(idx, 1)
  formData.value.valor = formData.value.produtos.reduce((sum, p) => sum + p.subtotal, 0)
}

// Salva transação
const salvarTransacao = async () => {
  if (!formData.value.descricao || formData.value.valor <= 0) {
    alert('Descrição e valor são obrigatórios')
    return
  }

  try {
    if (tipoTransacao.value === 'venda') {
      await registrarVenda(formData.value)
    } else {
      await registrarDespesa(formData.value)
    }

    showForm.value = false
    limparForm()
    await loadTransacoes()
  } catch (error) {
    alert('Erro ao registrar: ' + error.message)
  }
}

// Carrega dados
onMounted(() => {
  if (storeId.value) {
    loadProdutos()
    loadTransacoes()
  }
})

watch(() => storeId.value, (newStoreId) => {
  if (newStoreId) {
    loadProdutos()
    loadTransacoes()
  }
})

// Muda tipo de transação
watch(() => tipoTransacao.value, () => {
  limparForm()
  if (tipoTransacao.value === 'venda') {
    formData.value.categoria = 'hardware'
  } else {
    formData.value.categoria = 'operacional'
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-foreground">Registro de Transações</h1>
        <p class="text-sm text-muted-foreground mt-1">Registre vendas e despesas</p>
      </div>
      <Button 
        @click="() => { showForm = true; limparForm() }"
        class="bg-primary hover:bg-primary/90 gap-2"
      >
        <Plus class="w-4 h-4" />
        Nova Transação
      </Button>
    </div>

    <!-- Filtros -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50">
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex items-center gap-2">
            <Filter class="w-4 h-4 text-muted-foreground" />
            <span class="text-sm font-medium text-muted-foreground">Filtrar:</span>
          </div>
          <select 
            v-model="filtroTipo"
            class="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          >
            <option value="todas">Todas as transações</option>
            <option value="venda">Apenas vendas</option>
            <option value="despesa">Apenas despesas</option>
          </select>
          <select 
            v-model="filtroStatus"
            class="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          >
            <option value="todas">Todos os status</option>
            <option value="concluida">Concluída</option>
            <option value="pendente">Pendente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Histórico -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 overflow-hidden">
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="transacoesFiltradas.length === 0" class="p-8 text-center text-muted-foreground">
          <p>Nenhuma transação encontrada</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-border/50 bg-primary/5">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">Data</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">Descrição</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-foreground">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <tr v-for="transacao in transacoesFiltradas" :key="transacao.id" class="hover:bg-primary/5 transition-colors">
                <td class="px-6 py-4 text-sm text-muted-foreground">
                  {{ new Date(transacao.data_transacao).toLocaleDateString('pt-BR') }}
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-foreground">{{ transacao.descricao }}</p>
                    <p class="text-xs text-muted-foreground">{{ transacao.categoria }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    transacao.tipo === 'venda' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-destructive/20 text-destructive'
                  ]">
                    {{ transacao.tipo === 'venda' ? 'Venda' : 'Despesa' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    transacao.status === 'concluida'
                      ? 'bg-green-500/20 text-green-500'
                      : transacao.status === 'pendente'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-muted text-muted-foreground'
                  ]">
                    {{ transacao.status.charAt(0).toUpperCase() + transacao.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-bold">
                  <span :class="transacao.tipo === 'venda' ? 'text-green-500' : 'text-destructive'">
                    {{ transacao.tipo === 'venda' ? '+' : '-' }}
                    R$ {{ transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Modal de Formulário -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
        <Card class="w-full max-w-2xl mx-4 my-8 border-border/50 bg-background">
          <CardHeader>
            <CardTitle>
              {{ tipoTransacao === 'venda' ? 'Registrar Venda' : 'Registrar Despesa' }}
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Tipo de Transação -->
            <div class="flex gap-2 mb-4">
              <button 
                @click="tipoTransacao = 'venda'"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  tipoTransacao === 'venda'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                Venda
              </button>
              <button 
                @click="tipoTransacao = 'despesa'"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  tipoTransacao === 'despesa'
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                ]"
              >
                Despesa
              </button>
            </div>

            <!-- Dados Principais -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Data</label>
                <input 
                  v-model="formData.data_transacao"
                  type="date"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Categoria</label>
                <select 
                  v-model="formData.categoria"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option v-if="tipoTransacao === 'venda'" value="hardware">Hardware</option>
                  <option v-if="tipoTransacao === 'venda'" value="software">Software</option>
                  <option v-if="tipoTransacao === 'venda'" value="servico">Serviço</option>
                  <option v-if="tipoTransacao === 'despesa'" value="operacional">Operacional</option>
                  <option v-if="tipoTransacao === 'despesa'" value="suprimentos">Suprimentos</option>
                  <option v-if="tipoTransacao === 'despesa'" value="manutencao">Manutenção</option>
                </select>
              </div>
            </div>

            <!-- Descrição -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Descrição *</label>
              <textarea 
                v-model="formData.descricao"
                placeholder="Descreva a transação..."
                rows="2"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
              ></textarea>
            </div>

            <!-- Produtos (para vendas) -->
            <div v-if="tipoTransacao === 'venda'" class="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 class="font-medium text-foreground">Produtos da Venda</h3>

              <!-- Adicionar Produto -->
              <div class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select 
                    v-model="produtoSelecionado.produtoId"
                    class="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Selecionar produto...</option>
                    <option v-for="p in produtos" :key="p.id" :value="p.id">
                      {{ p.nome }} - R$ {{ p.preco_venda.toFixed(2) }}
                    </option>
                  </select>

                  <input 
                    v-model.number="produtoSelecionado.quantidade"
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    class="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />

                  <Button 
                    @click="adicionarProduto"
                    class="bg-primary hover:bg-primary/90 text-sm"
                  >
                    Adicionar
                  </Button>
                </div>

                <!-- Lista de Produtos -->
                <div v-if="formData.produtos.length > 0" class="space-y-2">
                  <div v-for="(p, idx) in formData.produtos" :key="idx" class="flex justify-between items-center p-2 bg-background/50 rounded">
                    <div>
                      <p class="text-sm font-medium text-foreground">
                        {{ produtos.find(prod => prod.id === p.produtoId)?.nome }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ p.quantidade }}x R$ {{ p.preco_unitario.toFixed(2) }} = R$ {{ p.subtotal.toFixed(2) }}
                      </p>
                    </div>
                    <button 
                      @click="removerProduto(idx)"
                      class="p-1 hover:bg-destructive/20 rounded transition-colors text-destructive"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Valor Manual (para despesas) -->
            <div v-if="tipoTransacao === 'despesa'" class="space-y-2">
              <label class="text-sm font-medium text-foreground">Valor (R$) *</label>
              <input 
                v-model.number="formData.valor"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <!-- Valor Total -->
            <div class="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div class="flex justify-between items-center">
                <span class="font-medium text-foreground">Valor Total:</span>
                <span class="text-2xl font-bold text-primary">
                  R$ {{ formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                </span>
              </div>
            </div>

            <!-- Método de Pagamento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Método de Pagamento</label>
                <select 
                  v-model="formData.metodo_pagamento"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Status</label>
                <select 
                  v-model="formData.status"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="concluida">Concluída</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>

            <!-- Botões -->
            <div class="flex gap-2 pt-4">
              <Button 
                @click="salvarTransacao"
                class="flex-1 bg-primary hover:bg-primary/90"
              >
                Registrar
              </Button>
              <Button 
                @click="() => { showForm = false; limparForm() }"
                variant="outline"
                class="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

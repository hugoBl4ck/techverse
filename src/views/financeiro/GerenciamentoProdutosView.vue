<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { useFinanceiro } from '@/composables/useFinanceiro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Plus, Edit2, Trash2, Search } from 'lucide-vue-next'

const { storeId } = useCurrentStore()
const { 
  produtos, 
  loadProdutos, 
  addProduto, 
  updateProduto, 
  deleteProduto,
  calcularMargemLucro,
  totalProdutos,
  estoqueTotal
} = useFinanceiro(storeId)

// Estado do formulário
const showForm = ref(false)
const editando = ref(null)
const busca = ref('')
const ordenarPor = ref('nome')

const formData = ref({
  nome: '',
  sku: '',
  custo: 0,
  preco_venda: 0,
  categoria: 'hardware',
  estoque: 0,
  descricao: ''
})

// Produtos filtrados
const produtosFiltrados = computed(() => {
  let lista = [...produtos.value]

  // Filtrar por busca
  if (busca.value) {
    const search = busca.value.toLowerCase()
    lista = lista.filter(p => 
      p.nome.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search)
    )
  }

  // Ordenar
  switch (ordenarPor.value) {
    case 'nome':
      lista.sort((a, b) => a.nome.localeCompare(b.nome))
      break
    case 'margem':
      lista.sort((a, b) => parseFloat(b.margem_lucro) - parseFloat(a.margem_lucro))
      break
    case 'estoque':
      lista.sort((a, b) => b.estoque - a.estoque)
      break
    case 'preco':
      lista.sort((a, b) => b.preco_venda - a.preco_venda)
      break
  }

  return lista
})

// Limpa formulário
const limparForm = () => {
  formData.value = {
    nome: '',
    sku: '',
    custo: 0,
    preco_venda: 0,
    categoria: 'hardware',
    estoque: 0,
    descricao: ''
  }
  editando.value = null
}

// Abre formulário para edição
const abrirEdicao = (produto) => {
  editando.value = produto.id
  formData.value = { ...produto }
  showForm.value = true
}

// Salva produto (novo ou editado)
const salvarProduto = async () => {
  if (!formData.value.nome || !formData.value.sku) {
    alert('Nome e SKU são obrigatórios')
    return
  }

  if (formData.value.preco_venda <= formData.value.custo) {
    alert('Preço de venda deve ser maior que o custo')
    return
  }

  try {
    if (editando.value) {
      // Atualizar
      const { id, ...dados } = formData.value
      await updateProduto(editando.value, dados)
    } else {
      // Adicionar novo
      await addProduto(formData.value)
    }
    
    showForm.value = false
    limparForm()
  } catch (error) {
    alert('Erro ao salvar: ' + error.message)
  }
}

// Deleta produto
const deletarProduto = async (id) => {
  if (confirm('Tem certeza que deseja deletar este produto?')) {
    await deleteProduto(id)
  }
}

// Carrega dados ao montar
onMounted(() => {
  if (storeId.value) {
    loadProdutos()
  }
})

watch(() => storeId.value, (newStoreId) => {
  if (newStoreId) {
    loadProdutos()
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-foreground">Gerenciamento de Produtos</h1>
        <p class="text-sm text-muted-foreground mt-1">Cadastre e gerencie seus produtos</p>
      </div>
      <Button 
        @click="() => { showForm = true; limparForm() }"
        class="bg-primary hover:bg-primary/90 gap-2"
      >
        <Plus class="w-4 h-4" />
        Novo Produto
      </Button>
    </div>

    <!-- Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50">
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Total de Produtos</p>
          <p class="text-3xl font-bold text-primary mt-2">{{ totalProdutos }}</p>
        </CardContent>
      </Card>
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50">
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Itens em Estoque</p>
          <p class="text-3xl font-bold text-accent mt-2">{{ estoqueTotal }}</p>
        </CardContent>
      </Card>
      <Card class="border-border/50 bg-gradient-to-br from-background to-background/50">
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Margem Média</p>
          <p class="text-3xl font-bold text-secondary mt-2">
            {{ produtos.length > 0 
              ? (produtos.reduce((sum, p) => sum + parseFloat(p.margem_lucro), 0) / produtos.length).toFixed(1)
              : '0'
            }}%
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Filtros e Busca -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50">
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input 
              v-model="busca"
              placeholder="Buscar por nome ou SKU..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <select 
            v-model="ordenarPor"
            class="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          >
            <option value="nome">Ordenar por Nome</option>
            <option value="margem">Ordenar por Margem</option>
            <option value="estoque">Ordenar por Estoque</option>
            <option value="preco">Ordenar por Preço</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Tabela de Produtos -->
    <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 overflow-hidden">
      <CardHeader>
        <CardTitle>Produtos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="produtosFiltrados.length === 0" class="p-8 text-center text-muted-foreground">
          <p>Nenhum produto encontrado</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-border/50 bg-primary/5">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-foreground">Custo</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-foreground">Preço</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-foreground">Margem</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-foreground">Estoque</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <tr v-for="produto in produtosFiltrados" :key="produto.id" class="hover:bg-primary/5 transition-colors">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-foreground">{{ produto.nome }}</p>
                    <p class="text-xs text-muted-foreground">{{ produto.categoria }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-muted-foreground font-mono">{{ produto.sku }}</td>
                <td class="px-6 py-4 text-right text-sm text-muted-foreground">
                  R$ {{ produto.custo.toFixed(2) }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium text-foreground">
                  R$ {{ produto.preco_venda.toFixed(2) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary">
                    {{ produto.margem_lucro }}%
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span :class="[
                    'text-sm font-medium px-2 py-1 rounded',
                    produto.estoque > 10 ? 'text-green-500' : produto.estoque > 0 ? 'text-yellow-500' : 'text-destructive'
                  ]">
                    {{ produto.estoque }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="abrirEdicao(produto)"
                      class="p-2 rounded-lg hover:bg-primary/20 transition-colors text-primary"
                      title="Editar"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button 
                      @click="deletarProduto(produto.id)"
                      class="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive"
                      title="Deletar"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Modal de Formulário -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card class="w-full max-w-lg mx-4 border-border/50 bg-background">
          <CardHeader>
            <CardTitle>{{ editando ? 'Editar Produto' : 'Novo Produto' }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Nome *</label>
              <input 
                v-model="formData.nome"
                type="text"
                placeholder="Ex: Processador Intel i5"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">SKU *</label>
                <input 
                  v-model="formData.sku"
                  type="text"
                  placeholder="Ex: PROC-I5-12400"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Categoria</label>
                <select 
                  v-model="formData.categoria"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="servico">Serviço</option>
                  <option value="acessorio">Acessório</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Custo (R$) *</label>
                <input 
                  v-model.number="formData.custo"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Preço de Venda (R$) *</label>
                <input 
                  v-model.number="formData.preco_venda"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Estoque</label>
                <input 
                  v-model.number="formData.estoque"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Margem de Lucro</label>
                <input 
                  type="text"
                  :value="calcularMargemLucro(formData.preco_venda, formData.custo) + '%'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Descrição</label>
              <textarea 
                v-model="formData.descricao"
                placeholder="Descrição adicional (opcional)"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
              ></textarea>
            </div>

            <div class="flex gap-2 pt-4">
              <Button 
                @click="salvarProduto"
                class="flex-1 bg-primary hover:bg-primary/90"
              >
                {{ editando ? 'Atualizar' : 'Criar' }}
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

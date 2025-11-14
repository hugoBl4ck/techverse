import { ref, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore'

export function useFinanceiro(storeId) {
  const produtos = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Calcula margem de lucro: (preço_venda - custo) / preço_venda * 100
   */
  const calcularMargemLucro = (precoVenda, custo) => {
    if (precoVenda <= 0) return 0
    return ((precoVenda - custo) / precoVenda * 100).toFixed(2)
  }

  /**
   * Carrega todos os produtos do inventário (itens)
   */
  const loadProdutos = async () => {
    if (!storeId?.value) {
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const itensRef = collection(db, 'stores', storeId.value, 'itens')
      
      // Carrega sem ordenação (compatível com qualquer estrutura)
      const snapshot = await getDocs(itensRef)
      
      produtos.value = snapshot.docs.map(doc => {
        const data = doc.data()
        const precoVenda = parseFloat(data.precoVenda || data.preco_venda || 0)
        const precoCusto = parseFloat(data.precoCusto || data.custo || 0)
        const quantidade = parseFloat(data.quantidade || data.estoque || 0)
        
        return {
          id: doc.id,
          nome: data.nome || 'Sem nome',
          sku: data.sku || data.codigo || data.id,
          preco_venda: precoVenda,
          custo: precoCusto,
          estoque: quantidade,
          ...data,
          margem_lucro: calcularMargemLucro(precoVenda, precoCusto)
        }
      })
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Adiciona novo produto
   */
  const addProduto = async (produtoData) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    if (!validarProduto(produtoData)) {
      error.value = 'Dados do produto inválidos'
      return null
    }

    try {
      const produtosRef = collection(db, 'stores', storeId.value, 'produtos')
      const novo = {
        ...produtoData,
        margem_lucro: calcularMargemLucro(produtoData.preco_venda, produtoData.custo),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      const docRef = await addDoc(produtosRef, novo)
      
      await loadProdutos()
      return docRef.id
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  /**
   * Atualiza produto existente
   */
  const updateProduto = async (produtoId, updates) => {
    if (!storeId?.value || !produtoId) return false

    try {
      const produtoRef = doc(db, 'stores', storeId.value, 'produtos', produtoId)
      
      const dadosAtualizar = {
        ...updates,
        updatedAt: Timestamp.now()
      }

      // Se alterar preços, recalcular margem
      if (updates.preco_venda !== undefined || updates.custo !== undefined) {
        const produto = produtos.value.find(p => p.id === produtoId)
        const precoVenda = updates.preco_venda ?? produto.preco_venda
        const custo = updates.custo ?? produto.custo
        dadosAtualizar.margem_lucro = calcularMargemLucro(precoVenda, custo)
      }

      await updateDoc(produtoRef, dadosAtualizar)
      
      await loadProdutos()
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  /**
   * Deleta produto
   */
  const deleteProduto = async (produtoId) => {
    if (!storeId?.value || !produtoId) return false

    try {
      await deleteDoc(doc(db, 'stores', storeId.value, 'produtos', produtoId))
      await loadProdutos()
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  /**
   * Valida dados do produto
   */
  const validarProduto = (data) => {
    return (
      data.nome && 
      typeof data.nome === 'string' && 
      data.nome.trim().length > 0 &&
      data.custo >= 0 &&
      data.preco_venda > 0 &&
      data.preco_venda > data.custo
    )
  }

  /**
   * Produtos ordenados por margem de lucro (maior primeiro)
   */
  const produtosPorMargem = computed(() => {
    return [...produtos.value].sort((a, b) => 
      parseFloat(b.margem_lucro) - parseFloat(a.margem_lucro)
    )
  })

  /**
   * Total de produtos cadastrados
   */
  const totalProdutos = computed(() => produtos.value.length)

  /**
   * Estoque total (apenas itens ativos)
   */
  const estoqueTotal = computed(() => 
    produtos.value
      .filter(p => p.status !== 'em_transito' && p.status !== 'bloqueado')
      .reduce((total, p) => total + (p.estoque || 0), 0)
  )

  /**
   * Valor total em estoque (custo) - apenas itens ativos
   */
  const valorEstoqueTotal = computed(() =>
    produtos.value
      .filter(p => p.status !== 'em_transito' && p.status !== 'bloqueado')
      .reduce((total, p) => total + (p.custo * (p.estoque || 0)), 0)
  )

  /**
   * Itens em trânsito
   */
  const itensEmTransito = computed(() =>
    produtos.value.filter(p => p.status === 'em_transito')
  )

  /**
   * Quantidade em trânsito
   */
  const quantidadeEmTransito = computed(() =>
    itensEmTransito.value.reduce((total, p) => total + (p.estoque || 0), 0)
  )

  /**
   * Valor em trânsito (custo)
   */
  const valorEmTransito = computed(() =>
    itensEmTransito.value.reduce((total, p) => total + (p.custo * (p.estoque || 0)), 0)
  )

  return {
    // State
    produtos,
    isLoading,
    error,

    // Methods
    loadProdutos,
    addProduto,
    updateProduto,
    deleteProduto,
    calcularMargemLucro,
    validarProduto,

    // Computed
    produtosPorMargem,
    totalProdutos,
    estoqueTotal,
    valorEstoqueTotal,
    itensEmTransito,
    quantidadeEmTransito,
    valorEmTransito
  }
}

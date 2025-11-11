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
      console.warn('⚠️ StoreId não disponível para loadProdutos')
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const itensRef = collection(db, 'stores', storeId.value, 'itens')
      
      // Tenta ordenar por criadoEm, se falhar carrega sem ordenação
      let q
      try {
        q = query(itensRef, orderBy('criadoEm', 'desc'))
      } catch {
        console.log('⚠️ Campo criadoEm não existe, carregando sem ordenação')
        q = query(itensRef)
      }
      
      const snapshot = await getDocs(q)
      
      console.log(`📊 Encontrados ${snapshot.docs.length} itens no Firestore`)
      console.log(`📍 Caminho: stores/${storeId.value}/itens`)
      if (snapshot.docs.length > 0) {
        console.log('📦 Primeiro item:', snapshot.docs[0].data())
      }
      
      produtos.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          nome: data.nome || 'Sem nome',
          sku: data.sku || data.codigo || data.id,
          preco_venda: parseFloat(data.precoVenda) || 0,
          custo: parseFloat(data.precoCusto) || 0,
          estoque: parseFloat(data.quantidade) || 0,
          ...data,
          margem_lucro: calcularMargemLucro(parseFloat(data.precoVenda) || 0, parseFloat(data.precoCusto) || 0)
        }
      })
      
      console.log('✅ Produtos carregados:', produtos.value.length)
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao carregar produtos:', err)
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
      console.log('✅ Produto adicionado:', docRef.id)
      
      await loadProdutos()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao adicionar produto:', err)
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
      console.log('✅ Produto atualizado:', produtoId)
      
      await loadProdutos()
      return true
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao atualizar produto:', err)
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
      console.log('✅ Produto deletado:', produtoId)
      await loadProdutos()
      return true
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao deletar produto:', err)
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
   * Estoque total
   */
  const estoqueTotal = computed(() => 
    produtos.value.reduce((total, p) => total + (p.estoque || 0), 0)
  )

  /**
   * Valor total em estoque (custo)
   */
  const valorEstoqueTotal = computed(() =>
    produtos.value.reduce((total, p) => total + (p.custo * (p.estoque || 0)), 0)
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
    valorEstoqueTotal
  }
}

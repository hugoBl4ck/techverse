import { ref, computed } from 'vue'
import { db } from '@/firebase/config.js'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  doc,
  updateDoc
} from 'firebase/firestore'

/**
 * Composable para gerenciar movimentações de estoque
 * Rastreia entrada, saída e ajustes de estoque
 * 
 * @param {Ref<string>} storeId - ID da loja
 * @returns {Object} Métodos e estado de movimentação
 */
export function useMovimentacaoEstoque(storeId) {
  const movimentacoes = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Carrega todas as movimentações
   */
  const loadMovimentacoes = async (filtros = {}) => {
    if (!storeId?.value) return

    isLoading.value = true
    error.value = null

    try {
      let movRef = collection(db, 'stores', storeId.value, 'movimentacoes_estoque')
      let constraints = []

      if (filtros.tipo) constraints.push(where('tipo', '==', filtros.tipo))
      if (filtros.referencia_tipo) constraints.push(where('referencia_tipo', '==', filtros.referencia_tipo))

      constraints.push(orderBy('data_movimento', 'desc'))

      const q = constraints.length > 0
        ? query(movRef, ...constraints)
        : query(movRef, orderBy('data_movimento', 'desc'))

      const snapshot = await getDocs(q)

      movimentacoes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data_movimento: doc.data().data_movimento?.toDate?.() || new Date(doc.data().data_movimento)
      }))

      console.log('✅ Movimentações carregadas:', movimentacoes.value.length)
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao carregar movimentações:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra saída de estoque (venda)
   * Cria movimentação e atualiza quantidade do produto
   */
  const registrarSaidaPorVenda = async (transacaoId, produtos) => {
    if (!storeId?.value || !transacaoId || !produtos.length) {
      error.value = 'Dados inválidos para saída de estoque'
      return null
    }

    try {
      const batch = writeBatch(db)
      
      // Calcular valor total de COGS
      let valorTotalCogs = 0
      
      // Criar movimentação
      const movimentacaoRef = collection(db, 'stores', storeId.value, 'movimentacoes_estoque')
      
      const movimentacaoData = {
        tipo: 'saida',
        referencia_id: transacaoId,
        referencia_tipo: 'venda',
        descricao: `Saída por venda ${transacaoId}`,
        produtos: produtos.map(p => {
          valorTotalCogs += (p.custo_unitario || 0) * (p.quantidade || 0)
          return {
            produtoId: p.produtoId,
            nome: p.nome,
            quantidade: p.quantidade,
            custo_unitario: p.custo_unitario || 0,
            valor_total: (p.custo_unitario || 0) * (p.quantidade || 0)
          }
        }),
        valor_total_cogs: parseFloat(valorTotalCogs.toFixed(2)),
        data_movimento: Timestamp.now(),
        createdAt: Timestamp.now()
      }

      // Adicionar movimentação
      const docRef = await addDoc(movimentacaoRef, movimentacaoData)
      console.log('✅ Movimentação de saída criada:', docRef.id)

      // Atualizar quantidade de cada produto
      for (const produto of produtos) {
        const produtoRef = doc(db, 'stores', storeId.value, 'itens', produto.produtoId)
        
        batch.update(produtoRef, {
          quantidade: produto.quantidade_atual - produto.quantidade,
          updatedAt: Timestamp.now()
        })
      }

      await batch.commit()
      console.log('✅ Estoque atualizado para', produtos.length, 'produtos')

      await loadMovimentacoes()
      
      return {
        id: docRef.id,
        valor_cogs: valorTotalCogs
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar saída:', err)
      return null
    }
  }

  /**
   * Registra entrada de estoque (compra/reposição)
   */
  const registrarEntrada = async (entradaData) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    if (!validarMovimentacao(entradaData)) {
      error.value = 'Dados de entrada inválidos'
      return null
    }

    try {
      const batch = writeBatch(db)
      const movRef = collection(db, 'stores', storeId.value, 'movimentacoes_estoque')

      let valorTotal = 0

      const movimentacao = {
        tipo: 'entrada',
        referencia_tipo: entradaData.referencia_tipo || 'compra',
        referencia_id: entradaData.referencia_id || null,
        descricao: entradaData.descricao,
        produtos: entradaData.produtos.map(p => {
          valorTotal += (p.custo_unitario || 0) * (p.quantidade || 0)
          return {
            produtoId: p.produtoId,
            nome: p.nome,
            quantidade: p.quantidade,
            custo_unitario: p.custo_unitario || 0,
            valor_total: (p.custo_unitario || 0) * (p.quantidade || 0)
          }
        }),
        valor_total_entrada: parseFloat(valorTotal.toFixed(2)),
        data_movimento: Timestamp.now(),
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(movRef, movimentacao)
      console.log('✅ Entrada de estoque registrada:', docRef.id)

      // Atualizar quantidade de produtos
      for (const produto of entradaData.produtos) {
        const produtoRef = doc(db, 'stores', storeId.value, 'itens', produto.produtoId)
        
        batch.update(produtoRef, {
          quantidade: produto.quantidade_atual + produto.quantidade,
          updatedAt: Timestamp.now()
        })
      }

      await batch.commit()
      console.log('✅ Estoque atualizado para', entradaData.produtos.length, 'produtos')

      await loadMovimentacoes()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar entrada:', err)
      return null
    }
  }

  /**
   * Registra ajuste manual de estoque
   */
  const registrarAjuste = async (ajusteData) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    try {
      const batch = writeBatch(db)
      const movRef = collection(db, 'stores', storeId.value, 'movimentacoes_estoque')

      const ajuste = {
        tipo: 'ajuste',
        referencia_tipo: 'ajuste_manual',
        descricao: ajusteData.descricao,
        motivo: ajusteData.motivo || 'Ajuste manual',
        produtos: ajusteData.produtos,
        data_movimento: Timestamp.now(),
        usuario: ajusteData.usuario,
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(movRef, ajuste)
      console.log('✅ Ajuste registrado:', docRef.id)

      // Atualizar quantidade de produtos
      for (const produto of ajusteData.produtos) {
        const produtoRef = doc(db, 'stores', storeId.value, 'itens', produto.produtoId)
        const novaQuantidade = produto.quantidade_atual + produto.diferenca
        
        batch.update(produtoRef, {
          quantidade: Math.max(0, novaQuantidade),
          updatedAt: Timestamp.now()
        })
      }

      await batch.commit()
      console.log('✅ Estoque ajustado para', ajusteData.produtos.length, 'produtos')

      await loadMovimentacoes()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar ajuste:', err)
      return null
    }
  }

  /**
   * Valida dados de movimentação
   */
  const validarMovimentacao = (data) => {
    return (
      data.descricao &&
      typeof data.descricao === 'string' &&
      data.descricao.trim().length > 0 &&
      Array.isArray(data.produtos) &&
      data.produtos.length > 0 &&
      data.produtos.every(p => p.produtoId && p.quantidade > 0)
    )
  }

  /**
   * Filtra por período
   */
  const filtrarPorPeriodo = (dataInicio, dataFim) => {
    return movimentacoes.value.filter(m => {
      const data = new Date(m.data_movimento)
      return data >= dataInicio && data <= dataFim
    })
  }

  /**
   * Calcula valor total de COGS do período
   */
  const calcularCogsTotal = (movimentacoesParaCalcular = null) => {
    const lista = movimentacoesParaCalcular || movimentacoes.value
    
    return lista
      .filter(m => m.tipo === 'saida')
      .reduce((total, m) => total + (m.valor_total_cogs || 0), 0)
  }

  /**
   * Agrupa movimentações por tipo
   */
  const agruparPorTipo = (movimentacoesParaAgrupar = null) => {
    const lista = movimentacoesParaAgrupar || movimentacoes.value
    const agrupado = {
      entrada: [],
      saida: [],
      ajuste: []
    }

    lista.forEach(m => {
      if (agrupado[m.tipo]) {
        agrupado[m.tipo].push(m)
      }
    })

    return agrupado
  }

  // Computed properties
  const totalEntradas = computed(() =>
    movimentacoes.value
      .filter(m => m.tipo === 'entrada')
      .reduce((total, m) => total + (m.valor_total_entrada || 0), 0)
      .toFixed(2)
  )

  const totalSaidas = computed(() =>
    movimentacoes.value
      .filter(m => m.tipo === 'saida')
      .reduce((total, m) => total + (m.valor_total_cogs || 0), 0)
      .toFixed(2)
  )

  const saidaEsteMes = computed(() => {
    const agora = new Date()
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1)
    const ultimo = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
    
    return calcularCogsTotal(filtrarPorPeriodo(primeiroDia, ultimo))
  })

  return {
    // State
    movimentacoes,
    isLoading,
    error,

    // Methods
    loadMovimentacoes,
    registrarSaidaPorVenda,
    registrarEntrada,
    registrarAjuste,
    validarMovimentacao,
    filtrarPorPeriodo,
    calcularCogsTotal,
    agruparPorTipo,

    // Computed
    totalEntradas,
    totalSaidas,
    saidaEsteMes
  }
}

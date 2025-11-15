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
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore'

export function useTransacoes(storeId) {
  const transacoes = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Carrega transações com filtros opcionais
   */
  const loadTransacoes = async (filtros = {}) => {
    if (!storeId?.value) return

    isLoading.value = true
    error.value = null

    try {
      let transacoesRef = collection(db, 'stores', storeId.value, 'transacoes_financeiras')
      let constraints = []

      // Filtros opcionais
      if (filtros.tipo) constraints.push(where('tipo', '==', filtros.tipo))
      if (filtros.categoria) constraints.push(where('categoria', '==', filtros.categoria))
      if (filtros.status) constraints.push(where('status', '==', filtros.status))

      // Sempre ordena por data
      constraints.push(orderBy('data_transacao', 'desc'))

      const q = filtros.tipo || filtros.categoria || filtros.status
        ? query(transacoesRef, ...constraints)
        : query(transacoesRef, orderBy('data_transacao', 'desc'))
      
      const snapshot = await getDocs(q)

      transacoes.value = snapshot.docs.map(doc => {
        const data = doc.data()
        const transacao = {
          id: doc.id,
          ...data,
          data_transacao: data.data_transacao?.toDate?.() || new Date(data.data_transacao),
          data_pagamento: data.data_pagamento?.toDate?.() || null
        }

        console.log('🔍 Transação carregada:', {
          id: transacao.id,
          tipo: transacao.tipo,
          valor: transacao.valor,
          categoria: transacao.categoria,
          data_transacao: transacao.data_transacao,
          raw_data: data
        })

        return transacao
      })

      console.log('✅ Transações carregadas:', transacoes.value.length)
      console.log('💵 Totais calculados:', {
        totalVendas: totalVendas.value,
        totalDespesas: totalDespesas.value,
        margemMedia: margemMedia.value
      })
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao carregar transações:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra uma venda
   */
  const registrarVenda = async (vendaData) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    if (!validarTransacao(vendaData)) {
      error.value = 'Dados da venda inválidos'
      return null
    }

    try {
      const transacoesRef = collection(db, 'stores', storeId.value, 'transacoes_financeiras')

      const venda = {
        tipo: 'venda',
        descricao: vendaData.descricao,
        valor: vendaData.valor,
        categoria: vendaData.categoria || 'venda_geral',
        produtos: vendaData.produtos || [],
        cliente_id: vendaData.cliente_id || null,
        ordem_servico_id: vendaData.ordem_servico_id || null,
        status: 'concluida',
        data_transacao: Timestamp.now(),
        data_pagamento: vendaData.data_pagamento ? Timestamp.fromDate(new Date(vendaData.data_pagamento)) : Timestamp.now(),
        metodo_pagamento: vendaData.metodo_pagamento || 'pix',
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(transacoesRef, venda)
      console.log('✅ Venda registrada:', docRef.id)

      await loadTransacoes()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar venda:', err)
      return null
    }
  }

  /**
   * Registra uma despesa
   */
  const registrarDespesa = async (despesaData) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    if (!validarTransacao(despesaData)) {
      error.value = 'Dados da despesa inválidos'
      return null
    }

    try {
      const transacoesRef = collection(db, 'stores', storeId.value, 'transacoes_financeiras')

      const despesa = {
        tipo: 'despesa',
        descricao: despesaData.descricao,
        valor: despesaData.valor,
        categoria: despesaData.categoria || 'operacional',
        produtos: despesaData.produtos || [],
        status: despesaData.status || 'concluida',
        data_transacao: Timestamp.now(),
        data_pagamento: despesaData.data_pagamento ? Timestamp.fromDate(new Date(despesaData.data_pagamento)) : Timestamp.now(),
        metodo_pagamento: despesaData.metodo_pagamento || 'dinheiro',
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(transacoesRef, despesa)
      console.log('✅ Despesa registrada:', docRef.id)

      await loadTransacoes()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar despesa:', err)
      return null
    }
  }

  /**
   * Atualiza transação
   */
  const updateTransacao = async (transacaoId, updates) => {
    if (!storeId?.value || !transacaoId) return false

    try {
      const transacaoRef = doc(db, 'stores', storeId.value, 'transacoes_financeiras', transacaoId)
      const dadosAtualizar = {
        ...updates,
        updatedAt: Timestamp.now()
      }

      await updateDoc(transacaoRef, dadosAtualizar)
      console.log('✅ Transação atualizada:', transacaoId)

      await loadTransacoes()
      return true
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao atualizar transação:', err)
      return false
    }
  }

  /**
   * Deleta transação
   */
  const deleteTransacao = async (transacaoId) => {
    if (!storeId?.value || !transacaoId) return false

    try {
      await deleteDoc(doc(db, 'stores', storeId.value, 'transacoes_financeiras', transacaoId))
      console.log('✅ Transação deletada:', transacaoId)
      await loadTransacoes()
      return true
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao deletar transação:', err)
      return false
    }
  }

  /**
   * Filtra transações por período
   */
  const filtrarPorPeriodo = (dataInicio, dataFim) => {
    return transacoes.value.filter(t => {
      const data = new Date(t.data_transacao)
      return data >= dataInicio && data <= dataFim
    })
  }

  /**
   * Calcula totais (receita, despesa, lucro)
   */
  const calcularTotais = (transacoesParaCalcular = null) => {
    const lista = transacoesParaCalcular || transacoes.value
    
    let receita = 0
    let despesa = 0

    lista.forEach(t => {
      if (t.tipo === 'venda') {
        receita += t.valor
      } else if (t.tipo === 'despesa') {
        despesa += t.valor
      }
    })

    return {
      receita: parseFloat(receita.toFixed(2)),
      despesa: parseFloat(despesa.toFixed(2)),
      lucro: parseFloat((receita - despesa).toFixed(2))
    }
  }

  /**
   * Valida dados da transação
   */
  const validarTransacao = (data) => {
    return (
      data.descricao &&
      typeof data.descricao === 'string' &&
      data.descricao.trim().length > 0 &&
      data.valor > 0
    )
  }

  /**
   * Agrupa transações por categoria
   */
  const agruparPorCategoria = (transacoesParaAgrupar = null) => {
    const lista = transacoesParaAgrupar || transacoes.value
    const agrupado = {}

    lista.forEach(t => {
      const cat = t.categoria || 'Sem categoria'
      if (!agrupado[cat]) {
        agrupado[cat] = {
          receita: 0,
          despesa: 0,
          total: 0,
          transacoes: 0
        }
      }

      if (t.tipo === 'venda') {
        agrupado[cat].receita += t.valor
      } else if (t.tipo === 'despesa') {
        agrupado[cat].despesa += t.valor
      }

      agrupado[cat].total += t.tipo === 'venda' ? t.valor : -t.valor
      agrupado[cat].transacoes += 1
    })

    return agrupado
  }

  // Computed properties
  const totais = computed(() => calcularTotais())

  const vendas = computed(() => 
    transacoes.value.filter(t => t.tipo === 'venda')
  )

  const despesas = computed(() =>
    transacoes.value.filter(t => t.tipo === 'despesa')
  )

  const totalVendas = computed(() =>
    vendas.value.reduce((total, v) => total + v.valor, 0).toFixed(2)
  )

  const totalDespesas = computed(() =>
    despesas.value.reduce((total, d) => total + d.valor, 0).toFixed(2)
  )

  const margemMedia = computed(() => {
    if (totalVendas.value === 0) return 0
    return (((totalVendas.value - totalDespesas.value) / totalVendas.value) * 100).toFixed(2)
  })

  return {
    // State
    transacoes,
    isLoading,
    error,

    // Methods
    loadTransacoes,
    registrarVenda,
    registrarDespesa,
    updateTransacao,
    deleteTransacao,
    filtrarPorPeriodo,
    calcularTotais,
    agruparPorCategoria,
    validarTransacao,

    // Computed
    totais,
    vendas,
    despesas,
    totalVendas,
    totalDespesas,
    margemMedia
  }
}

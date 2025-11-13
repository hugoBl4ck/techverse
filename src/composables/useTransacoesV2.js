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
import { useMovimentacaoEstoque } from './useMovimentacaoEstoque'

/**
 * Composable melhorado para Transações Financeiras com COGS
 * Integra vendas com movimento de estoque
 * 
 * @param {Ref<string>} storeId - ID da loja
 * @returns {Object} Métodos e estado de transações
 */
export function useTransacoesV2(storeId) {
  const transacoes = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  const { registrarSaidaPorVenda } = useMovimentacaoEstoque(storeId)

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

      if (filtros.tipo) constraints.push(where('tipo', '==', filtros.tipo))
      if (filtros.categoria) constraints.push(where('categoria', '==', filtros.categoria))
      if (filtros.status) constraints.push(where('status', '==', filtros.status))

      constraints.push(orderBy('data_transacao', 'desc'))

      const q = constraints.length > 0
        ? query(transacoesRef, ...constraints)
        : query(transacoesRef, orderBy('data_transacao', 'desc'))
      
      const snapshot = await getDocs(q)

      transacoes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data_transacao: doc.data().data_transacao?.toDate?.() || new Date(doc.data().data_transacao),
        data_pagamento: doc.data().data_pagamento?.toDate?.() || null
      }))

      console.log('✅ Transações carregadas:', transacoes.value.length)
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao carregar transações:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra uma venda com COGS automático
   * ✅ Melhoria: Captura custo dos produtos vendidos
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
      const batch = writeBatch(db)

      // Calcular COGS (Custo de Bens Vendidos)
      let cogsTotalCalculado = 0
      const produtosComCusto = vendaData.produtos.map(p => {
        const custTotal = (p.custo_unitario || 0) * (p.quantidade || 1)
        cogsTotalCalculado += custTotal
        return {
          ...p,
          custo_unitario: p.custo_unitario || 0,
          custo_total: parseFloat(custTotal.toFixed(2))
        }
      })

      // ✅ NOVO: Campos contábeis
      const margemBruta = vendaData.valor - cogsTotalCalculado
      const percentualMargemBruta = vendaData.valor > 0 
        ? ((margemBruta / vendaData.valor) * 100).toFixed(2)
        : 0

      const transacoesRef = collection(db, 'stores', storeId.value, 'transacoes_financeiras')

      const venda = {
        tipo: 'venda',
        descricao: vendaData.descricao,
        
        // Valores monetários
        valor_venda: parseFloat(vendaData.valor.toFixed(2)),
        valor_cogs: parseFloat(cogsTotalCalculado.toFixed(2)),      // ✅ NOVO
        margem_bruta: parseFloat(margemBruta.toFixed(2)),           // ✅ NOVO
        percentual_margem_bruta: parseFloat(percentualMargemBruta), // ✅ NOVO
        
        categoria: vendaData.categoria || 'venda_geral',
        produtos: produtosComCusto,  // ✅ Agora inclui custo_unitario e custo_total
        cliente_id: vendaData.cliente_id || null,
        ordem_servico_id: vendaData.ordem_servico_id || null,
        status: 'concluida',
        data_transacao: Timestamp.now(),
        data_pagamento: vendaData.data_pagamento 
          ? Timestamp.fromDate(new Date(vendaData.data_pagamento)) 
          : Timestamp.now(),
        metodo_pagamento: vendaData.metodo_pagamento || 'pix',
        
        // Auditoria
        createdAt: Timestamp.now()
      }

      // Adicionar transação
      const docRef = await addDoc(transacoesRef, venda)
      console.log('✅ Venda registrada com COGS:', docRef.id)

      // ✅ NOVO: Registrar saída de estoque automaticamente
      const resultadoEstoque = await registrarSaidaPorVenda(docRef.id, vendaData.produtos)
      if (resultadoEstoque) {
        console.log('✅ Estoque atualizado para venda:', docRef.id)
      }

      await loadTransacoes()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao registrar venda:', err)
      return null
    }
  }

  /**
   * Registra uma despesa categorizada
   * ✅ Melhoria: Suporte a subcategorias
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
        valor: parseFloat(despesaData.valor.toFixed(2)),
        
        // ✅ NOVO: Categorização melhorada
        categoria: despesaData.categoria || 'operacional',
        subcategoria: despesaData.subcategoria || null,  // ✅ NOVO
        
        produtos: despesaData.produtos || [],
        status: despesaData.status || 'concluida',
        data_transacao: Timestamp.now(),
        data_pagamento: despesaData.data_pagamento 
          ? Timestamp.fromDate(new Date(despesaData.data_pagamento)) 
          : Timestamp.now(),
        metodo_pagamento: despesaData.metodo_pagamento || 'dinheiro',
        
        // Auditoria
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
   * ✅ NOVO: Calcula totais contábeis corretos
   */
  const calcularTotais = (transacoesParaCalcular = null) => {
    const lista = transacoesParaCalcular || transacoes.value
    
    let receita = 0
    let cogs = 0      // ✅ NOVO
    let despesa = 0

    lista.forEach(t => {
      if (t.tipo === 'venda') {
        receita += t.valor_venda || t.valor || 0
        cogs += t.valor_cogs || 0  // ✅ NOVO
      } else if (t.tipo === 'despesa') {
        despesa += t.valor || 0
      }
    })

    const margemBruta = receita - cogs        // ✅ NOVO
    const lucroLiquido = margemBruta - despesa
    const percentualMargemBruta = receita > 0 
      ? ((margemBruta / receita) * 100).toFixed(2)
      : 0
    const percentualMargemLiquida = receita > 0
      ? ((lucroLiquido / receita) * 100).toFixed(2)
      : 0

    return {
      receita: parseFloat(receita.toFixed(2)),
      cogs: parseFloat(cogs.toFixed(2)),                      // ✅ NOVO
      margem_bruta: parseFloat(margemBruta.toFixed(2)),       // ✅ NOVO
      percentual_margem_bruta: parseFloat(percentualMargemBruta),  // ✅ NOVO
      despesa: parseFloat(despesa.toFixed(2)),
      lucro_liquido: parseFloat(lucroLiquido.toFixed(2)),     // ✅ RENOMEADO
      percentual_margem_liquida: parseFloat(percentualMargemLiquida) // ✅ NOVO
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
          cogs: 0,           // ✅ NOVO
          margem_bruta: 0,   // ✅ NOVO
          despesa: 0,
          lucro_liquido: 0,  // ✅ NOVO
          transacoes: 0,
          vendas: 0,
          despesas: 0
        }
      }

      if (t.tipo === 'venda') {
        agrupado[cat].receita += t.valor_venda || t.valor || 0
        agrupado[cat].cogs += t.valor_cogs || 0
        agrupado[cat].margem_bruta += (t.margem_bruta || 0)
        agrupado[cat].vendas += 1
      } else if (t.tipo === 'despesa') {
        agrupado[cat].despesa += t.valor || 0
        agrupado[cat].despesas += 1
      }

      agrupado[cat].lucro_liquido = agrupado[cat].margem_bruta - agrupado[cat].despesa
      agrupado[cat].transacoes += 1
    })

    return agrupado
  }

  /**
   * ✅ NOVO: Gera relatório de lucro bruto vs líquido
   */
  const gerarRelatorioDRE = (transacoesParaRelatorio = null) => {
    const lista = transacoesParaRelatorio || transacoes.value
    const totais = calcularTotais(lista)

    return {
      // Demonstração de Resultado do Exercício (DRE)
      receita_bruta: totais.receita,
      (-) : {
        custo_bens_vendidos: totais.cogs
      },
      (=) : {
        lucro_bruto: totais.margem_bruta,
        percentual_margem_bruta: totais.percentual_margem_bruta
      },
      despesas_operacionais: totais.despesa,
      lucro_liquido: totais.lucro_liquido,
      percentual_margem_liquida: totais.percentual_margem_liquida
    }
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
    vendas.value.reduce((total, v) => total + (v.valor_venda || v.valor || 0), 0).toFixed(2)
  )

  const totalCogs = computed(() =>
    vendas.value.reduce((total, v) => total + (v.valor_cogs || 0), 0).toFixed(2)
  )

  const totalDespesas = computed(() =>
    despesas.value.reduce((total, d) => total + (d.valor || 0), 0).toFixed(2)
  )

  const margemMedia = computed(() => {
    const t = totais.value
    return t.percentual_margem_bruta || 0
  })

  const margemLiquidaMedia = computed(() => {
    const t = totais.value
    return t.percentual_margem_liquida || 0
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
    gerarRelatorioDRE,

    // Computed
    totais,
    vendas,
    despesas,
    totalVendas,
    totalCogs,
    totalDespesas,
    margemMedia,
    margemLiquidaMedia
  }
}

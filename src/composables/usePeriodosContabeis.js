import { ref, computed } from 'vue'
import { db } from '@/firebase/config.js'
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc
} from 'firebase/firestore'
import { useTransacoesV2 } from './useTransacoesV2'

/**
 * Composable para gerenciar períodos contábeis fechados
 * Permite fechar meses/trimestres com dados imutáveis
 * 
 * @param {Ref<string>} storeId - ID da loja
 * @returns {Object} Métodos e estado de períodos contábeis
 */
export function usePeriodosContabeis(storeId) {
  const periodos = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  const { loadTransacoes, filtrarPorPeriodo, calcularTotais, agruparPorCategoria, transacoes } = useTransacoesV2(storeId)

  /**
   * Carrega todos os períodos contábeis
   */
  const loadPeriodos = async () => {
    if (!storeId?.value) return

    isLoading.value = true
    error.value = null

    try {
      const periodosRef = collection(db, 'stores', storeId.value, 'periodos_contabeis')
      const q = query(periodosRef, orderBy('data_fim', 'desc'))
      
      const snapshot = await getDocs(q)

      periodos.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data_inicio: doc.data().data_inicio?.toDate?.(),
        data_fim: doc.data().data_fim?.toDate?.(),
        fechado_em: doc.data().fechado_em?.toDate?.()
      }))
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao carregar períodos:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ✅ NOVO: Fecha um período contábil
   * Consolida dados e torna imutável
   */
  const fecharPeriodo = async (mes, ano) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return null
    }

    try {
      // Verificar se período já está fechado
      const periodaExistente = periodos.value.find(p => p.mes === mes && p.ano === ano && p.status === 'fechado')
      if (periodaExistente) {
        error.value = `Período ${mes}/${ano} já está fechado`
        return null
      }

      // Definir datas do período
      const dataInicio = new Date(ano, mes - 1, 1)
      const dataFim = new Date(ano, mes, 0, 23, 59, 59)

      // Carrega transações do período
      await loadTransacoes()
      const transacoesDoPeriodo = filtrarPorPeriodo(dataInicio, dataFim)

      if (transacoesDoPeriodo.length === 0) {
        error.value = 'Nenhuma transação encontrada para este período'
        return null
      }

      // Calcula totais
      const totais = calcularTotais(transacoesDoPeriodo)
      const porCategoria = agruparPorCategoria(transacoesDoPeriodo)

      // Prepare dados consolidados
      const periodoDados = {
        mes,
        ano,
        data_inicio: Timestamp.fromDate(dataInicio),
        data_fim: Timestamp.fromDate(dataFim),
        status: 'fechado',

        // Consolidação de receitas
        receita_total: totais.receita,
        receita_por_categoria: Object.keys(porCategoria)
          .filter(cat => porCategoria[cat].receita > 0)
          .reduce((acc, cat) => {
            acc[cat] = porCategoria[cat].receita
            return acc
          }, {}),

        // Consolidação de COGS
        cogs_total: totais.cogs,
        cogs_por_categoria: Object.keys(porCategoria)
          .filter(cat => porCategoria[cat].cogs > 0)
          .reduce((acc, cat) => {
            acc[cat] = porCategoria[cat].cogs
            return acc
          }, {}),

        // Consolidação de lucro bruto
        lucro_bruto: totais.margem_bruta,
        percentual_margem_bruta: totais.percentual_margem_bruta,

        // Consolidação de despesas
        despesa_total: totais.despesa,
        despesa_por_categoria: Object.keys(porCategoria)
          .filter(cat => porCategoria[cat].despesa > 0)
          .reduce((acc, cat) => {
            acc[cat] = porCategoria[cat].despesa
            return acc
          }, {}),

        // Resultado líquido
        lucro_liquido: totais.lucro_liquido,
        percentual_margem_liquida: totais.percentual_margem_liquida,

        // Estatísticas
        quantidade_vendas: transacoesDoPeriodo.filter(t => t.tipo === 'venda').length,
        quantidade_despesas: transacoesDoPeriodo.filter(t => t.tipo === 'despesa').length,
        quantidade_transacoes: transacoesDoPeriodo.length,

        // Métodos de pagamento
        metodos_pagamento: extrairMetodosPagamento(transacoesDoPeriodo),

        // Auditoria
        fechado_em: Timestamp.now(),
        usuario_fechamento: 'admin',  // TODO: Buscar usuário atual
        notas: `Período ${mes}/${ano} fechado automaticamente`
      }

      // Salva período
      const periodosRef = collection(db, 'stores', storeId.value, 'periodos_contabeis')
      const docRef = await addDoc(periodosRef, periodoDados)
      
      await loadPeriodos()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao fechar período:', err)
      return null
    }
  }

  /**
   * Reabre período fechado
   */
  const reabrirPeriodo = async (periodoId) => {
    if (!storeId?.value) {
      error.value = 'StoreId não disponível'
      return false
    }

    try {
      const periodoRef = doc(db, 'stores', storeId.value, 'periodos_contabeis', periodoId)
      
      await updateDoc(periodoRef, {
        status: 'aberto',
        reaberto_em: Timestamp.now()
      })

      await loadPeriodos()
      return true
    } catch (err) {
      error.value = err.message
      console.error('❌ Erro ao reabrir período:', err)
      return false
    }
  }

  /**
   * Extrai métodos de pagamento das transações
   */
  const extrairMetodosPagamento = (transacoesDoPeriodo) => {
    const metodos = {}
    
    transacoesDoPeriodo.forEach(t => {
      const metodo = t.metodo_pagamento || 'desconhecido'
      metodos[metodo] = (metodos[metodo] || 0) + t.valor
    })

    return metodos
  }

  /**
   * Gera relatório completo (DRE - Demonstração de Resultado)
   */
  const gerarDRE = (periodoId) => {
    const periodo = periodos.value.find(p => p.id === periodoId)
    if (!periodo) return null

    return {
      titulo: `DRE - ${periodo.mes}/${periodo.ano}`,
      periodo: `${periodo.mes}/${periodo.ano}`,
      
      // Estrutura DRE padrão
      receita_bruta: periodo.receita_total,
      descricao_receita: Object.entries(periodo.receita_por_categoria || {})
        .map(([cat, valor]) => `  ${cat}: R$ ${valor.toFixed(2)}`)
        .join('\n'),
      
      '-': 'Custo de Bens Vendidos',
      cogs_total: `(R$ ${periodo.cogs_total.toFixed(2)})`,
      descricao_cogs: Object.entries(periodo.cogs_por_categoria || {})
        .map(([cat, valor]) => `  ${cat}: R$ ${valor.toFixed(2)}`)
        .join('\n'),

      '=': 'Lucro Bruto',
      lucro_bruto: periodo.lucro_bruto,
      percentual_margem_bruta: `${periodo.percentual_margem_bruta}%`,

      despesas_operacionais: `(R$ ${periodo.despesa_total.toFixed(2)})`,
      descricao_despesas: Object.entries(periodo.despesa_por_categoria || {})
        .map(([cat, valor]) => `  ${cat}: R$ ${valor.toFixed(2)}`)
        .join('\n'),

      '==': 'Lucro Líquido',
      lucro_liquido: periodo.lucro_liquido,
      percentual_margem_liquida: `${periodo.percentual_margem_liquida}%`,

      // Estatísticas
      estatisticas: {
        quantidade_vendas: periodo.quantidade_vendas,
        quantidade_despesas: periodo.quantidade_despesas,
        valor_medio_venda: (periodo.receita_total / periodo.quantidade_vendas).toFixed(2),
        valor_medio_despesa: (periodo.despesa_total / periodo.quantidade_despesas).toFixed(2)
      }
    }
  }

  /**
   * Verifica se há período fechado para o mês/ano
   */
  const verificarPeriodoFechado = (mes, ano) => {
    return periodos.value.find(p => p.mes === mes && p.ano === ano && p.status === 'fechado')
  }

  /**
   * Busca período aberto mais recente
   */
  const obterPeriodoAtual = () => {
    return periodos.value.find(p => p.status === 'aberto') || null
  }

  // Computed properties
  const periodosAbertos = computed(() =>
    periodos.value.filter(p => p.status === 'aberto')
  )

  const periodosFechados = computed(() =>
    periodos.value.filter(p => p.status === 'fechado')
  )

  const ultimoPeriodoFechado = computed(() =>
    periodosFechados.value[0] || null
  )

  const totalLucroAnoAtual = computed(() => {
    const ano = new Date().getFullYear()
    return periodosFechados.value
      .filter(p => p.ano === ano)
      .reduce((total, p) => total + (p.lucro_liquido || 0), 0)
      .toFixed(2)
  })

  const totalReceitaAnoAtual = computed(() => {
    const ano = new Date().getFullYear()
    return periodosFechados.value
      .filter(p => p.ano === ano)
      .reduce((total, p) => total + (p.receita_total || 0), 0)
      .toFixed(2)
  })

  return {
    // State
    periodos,
    isLoading,
    error,

    // Methods
    loadPeriodos,
    fecharPeriodo,
    reabrirPeriodo,
    gerarDRE,
    verificarPeriodoFechado,
    obterPeriodoAtual,

    // Computed
    periodosAbertos,
    periodosFechados,
    ultimoPeriodoFechado,
    totalLucroAnoAtual,
    totalReceitaAnoAtual
  }
}

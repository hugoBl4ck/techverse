# 🔗 Exemplos de Integração - Módulo Financeiro

## 1. Integração com Ordens de Serviço (Recomendado)

Quando uma Ordem de Serviço é concluída, registra automaticamente como transação.

### No `OrdemServicoFormView.vue`:

```javascript
import { useTransacoes } from '@/composables/useTransacoes'

export default {
  setup() {
    const { registrarVenda } = useTransacoes(storeId)

    const finalizarOrdem = async (ordemServico) => {
      // ... lógica de conclusão da OS ...

      // Registra como venda no financeiro
      await registrarVenda({
        descricao: `OS #${ordemServico.id} - ${ordemServico.cliente.nome}`,
        valor: ordemServico.total,
        categoria: 'servico',
        cliente_id: ordemServico.cliente.id,
        ordem_servico_id: ordemServico.id,
        metodo_pagamento: ordemServico.metodo_pagamento,
        produtos: ordemServico.produtos.map(p => ({
          produtoId: p.id,
          quantidade: p.quantidade,
          preco_unitario: p.preco,
          subtotal: p.preco * p.quantidade
        }))
      })

      console.log('✅ Venda registrada automaticamente')
    }

    return { finalizarOrdem }
  }
}
```

---

## 2. Dashboard com Resumo Financeiro

Adicionar widget de finanças no Dashboard principal.

### No `DashboardView.vue`:

```vue
<script setup>
import { useTransacoes } from '@/composables/useTransacoes'
import { useFinanceiro } from '@/composables/useFinanceiro'

const { transacoes, totais } = useTransacoes(storeId)
const { produtos } = useFinanceiro(storeId)

// Carrega dados ao montar
onMounted(() => {
  loadTransacoes()
  loadProdutos()
})
</script>

<template>
  <!-- Widget Financeiro -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardContent class="pt-6">
        <p class="text-sm text-muted-foreground">Receita Hoje</p>
        <p class="text-2xl font-bold text-green-500 mt-2">
          R$ {{ calcularHoje('venda').toFixed(2) }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="pt-6">
        <p class="text-sm text-muted-foreground">Despesa Hoje</p>
        <p class="text-2xl font-bold text-destructive mt-2">
          R$ {{ calcularHoje('despesa').toFixed(2) }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="pt-6">
        <p class="text-sm text-muted-foreground">Lucro Hoje</p>
        <p class="text-2xl font-bold text-secondary mt-2">
          R$ {{ (calcularHoje('venda') - calcularHoje('despesa')).toFixed(2) }}
        </p>
      </CardContent>
    </Card>
  </div>

  <!-- Link para Dashboard Financeiro -->
  <Button @click="$router.push('/financeiro')" class="mt-4">
    Ver Dashboard Financeiro Completo →
  </Button>
</template>

<script>
const calcularHoje = (tipo) => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return transacoes.value
    .filter(t => {
      const dataTrans = new Date(t.data_transacao)
      dataTrans.setHours(0, 0, 0, 0)
      return dataTrans.getTime() === hoje.getTime() && t.tipo === tipo
    })
    .reduce((sum, t) => sum + t.valor, 0)
}
</script>
```

---

## 3. Verificação de Estoque Baixo

Alert automático quando estoque fica abaixo do limite.

```javascript
import { useFinanceiro } from '@/composables/useFinanceiro'

export default {
  setup() {
    const { produtos } = useFinanceiro(storeId)

    const verificarEstoqueBaixo = computed(() => {
      const limite = 5 // produtos com menos de 5 unidades
      return produtos.value.filter(p => p.estoque < limite)
    })

    // Mostrar notificação
    watch(verificarEstoqueBaixo, (novosBaixos) => {
      novosBaixos.forEach(produto => {
        showNotification({
          type: 'warning',
          title: 'Estoque Baixo',
          message: `${produto.nome} está com apenas ${produto.estoque} unidades`
        })
      })
    })

    return { verificarEstoqueBaixo }
  }
}
```

---

## 4. Widget de Margem de Lucro

Mostrar a margem de cada produto no inventário.

```vue
<!-- Em InventarioListView.vue -->
<template>
  <tr v-for="item in items" :key="item.id">
    <td>{{ item.nome }}</td>
    <td>R$ {{ item.preco }}</td>
    
    <!-- Coluna de margem (adicionar) -->
    <td>
      <span v-if="item.margem" class="px-2 py-1 rounded-full text-xs font-semibold" 
        :class="item.margem > 30 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'">
        {{ item.margem }}% 🎯
      </span>
    </td>
  </tr>
</template>

<script>
export default {
  setup() {
    const { calcularMargemLucro } = useFinanceiro(storeId)

    // Enrichir itens com margem
    const itemsComMargem = computed(() => {
      return items.value.map(item => ({
        ...item,
        margem: calcularMargemLucro(item.preco, item.custo)
      }))
    })

    return { itemsComMargem }
  }
}
</script>
```

---

## 5. Relatório Automático por Email

Script para gerar relatório mensal automático (Firebase Cloud Function).

```javascript
// functions/gerarRelatorioMensal.js
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')

exports.gerarRelatorioMensal = functions.pubsub
  .schedule('0 0 1 * *') // Primeiro dia do mês
  .onRun(async (context) => {
    const db = admin.firestore()
    const stores = await db.collection('stores').get()

    for (const storeDoc of stores.docs) {
      const storeId = storeDoc.id
      const owner = storeDoc.data().owner_email

      // Pega transações do mês anterior
      const mesAnterior = new Date()
      mesAnterior.setMonth(mesAnterior.getMonth() - 1)

      const transacoes = await db
        .collection('stores')
        .doc(storeId)
        .collection('transacoes_financeiras')
        .where('data_transacao', '>=', mesAnterior)
        .get()

      // Calcula totais
      let receita = 0, despesa = 0
      transacoes.docs.forEach(doc => {
        const t = doc.data()
        if (t.tipo === 'venda') receita += t.valor
        if (t.tipo === 'despesa') despesa += t.valor
      })

      // Envia email
      await enviarEmail(owner, {
        receita,
        despesa,
        lucro: receita - despesa,
        margem: ((receita - despesa) / receita * 100).toFixed(2),
        mes: mesAnterior.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
      })
    }
  })

async function enviarEmail(para, dados) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const html = `
    <h2>Relatório Financeiro - ${dados.mes}</h2>
    <p><strong>Receita:</strong> R$ ${dados.receita.toFixed(2)}</p>
    <p><strong>Despesa:</strong> R$ ${dados.despesa.toFixed(2)}</p>
    <p><strong>Lucro:</strong> R$ ${dados.lucro.toFixed(2)}</p>
    <p><strong>Margem:</strong> ${dados.margem}%</p>
  `

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: para,
    subject: `Relatório Financeiro - ${dados.mes}`,
    html
  })
}
```

---

## 6. Exportar Relatório para PDF

Integrar com biblioteca PDF (como jsPDF).

```javascript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportarRelatorioPDF(transacoes, totais, periodo) {
  const doc = new jsPDF()

  // Cabeçalho
  doc.setFontSize(16)
  doc.text('Relatório Financeiro', 14, 15)
  doc.setFontSize(10)
  doc.text(`Período: ${periodo}`, 14, 22)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28)

  // Resumo
  doc.setFontSize(11)
  doc.text(`Receita Total: R$ ${totais.receita.toFixed(2)}`, 14, 40)
  doc.text(`Despesa Total: R$ ${totais.despesa.toFixed(2)}`, 14, 48)
  doc.text(`Lucro Líquido: R$ ${totais.lucro.toFixed(2)}`, 14, 56)
  doc.text(`Margem: ${totais.margem}%`, 14, 64)

  // Tabela de transações
  const tableData = transacoes.map(t => [
    new Date(t.data_transacao).toLocaleDateString('pt-BR'),
    t.descricao,
    t.tipo,
    `R$ ${t.valor.toFixed(2)}`
  ])

  autoTable(doc, {
    head: [['Data', 'Descrição', 'Tipo', 'Valor']],
    body: tableData,
    startY: 75,
    styles: { fontSize: 9 }
  })

  doc.save(`relatorio-financeiro-${periodo}.pdf`)
}
```

---

## 7. Alert de Margem Baixa

Avisar quando produto tem margem < 20%.

```javascript
const alertarMargemBaixa = computed(() => {
  const limite = 20 // %
  return produtos.value.filter(p => parseFloat(p.margem_lucro) < limite)
})

// Mostrar banner
watch(alertarMargemBaixa, (produtos) => {
  if (produtos.length > 0) {
    console.warn(`⚠️ ${produtos.length} produtos com margem baixa!`)
    // Mostrar em UI
  }
})
```

---

## 8. Histórico de Preços

Manter registro de variações de preço (opcional).

```javascript
// Adicionar ao Firestore
stores/{storeId}/produtos/{id}/historico_precos/
  {
    data: Timestamp,
    preco_anterior: 400,
    preco_novo: 450,
    variacao_percentual: 12.5,
    motivo: "Aumento de custo"
  }
```

---

## 9. Dashboard em Tempo Real

Usar Firestore listeners para atualizar em tempo real.

```javascript
import { onSnapshot } from 'firebase/firestore'

export function useDashboardRealtime(storeId) {
  const transacoes = ref([])
  const unsubscribe = ref(null)

  const subscribe = () => {
    const q = query(
      collection(db, 'stores', storeId, 'transacoes_financeiras'),
      orderBy('data_transacao', 'desc'),
      limit(100)
    )

    unsubscribe.value = onSnapshot(q, (snapshot) => {
      transacoes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

  const unsubscribeAll = () => {
    unsubscribe.value?.()
  }

  return { transacoes, subscribe, unsubscribeAll }
}
```

---

## 🎯 Implementação Recomendada

**Ordem de Prioridade:**

1. ✅ **Já feito**: Dashboard, Produtos, Transações
2. 📌 **Próximo**: Integração com OS (exemplo 1)
3. 📌 **Depois**: Widget no Dashboard (exemplo 2)
4. 📌 **Depois**: Alertas de estoque (exemplo 3)
5. 📌 **Futuro**: Exportação PDF
6. 📌 **Futuro**: Relatórios automáticos

---

**Dúvidas? Consulte `GUIA_MODULO_FINANCEIRO.md` para mais detalhes!**

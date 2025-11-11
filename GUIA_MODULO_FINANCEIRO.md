# 💰 Guia Rápido - Módulo Financeiro

## O que foi criado

### 1. **Composables** (Lógica de Negócio)

#### `useFinanceiro.js`
```javascript
// Operações com produtos
const {
  produtos,                    // Lista de produtos
  loadProdutos(),             // Carrega produtos
  addProduto(data),           // Adiciona novo
  updateProduto(id, data),    // Atualiza
  deleteProduto(id),          // Deleta
  calcularMargemLucro(),      // Calcula margem
  
  // Computed properties
  produtosPorMargem,          // Ordenados por lucro
  totalProdutos,              // Quantidade
  estoqueTotal,               // Itens em estoque
  valorEstoqueTotal           // Valor total em estoque
} = useFinanceiro(storeId)
```

#### `useTransacoes.js`
```javascript
// Operações financeiras
const {
  transacoes,                 // Histórico de movimentações
  loadTransacoes(filtros),    // Carrega com filtros
  registrarVenda(data),       // Registra venda
  registrarDespesa(data),     // Registra despesa
  updateTransacao(id, data),  // Atualiza
  deleteTransacao(id),        // Deleta
  
  // Análises
  filtrarPorPeriodo(),        // Filtra por data
  calcularTotais(),           // Receita, despesa, lucro
  agruparPorCategoria(),      // Agrupa dados
  
  // Computed properties
  totais,                     // { receita, despesa, lucro }
  vendas,                     // Apenas vendas
  despesas,                   // Apenas despesas
  totalVendas,               // Soma vendas
  totalDespesas,             // Soma despesas
  margemMedia                // % de lucro médio
} = useTransacoes(storeId)
```

### 2. **Views** (Interfaces)

#### **Dashboard Financeiro** (`/financeiro`)
- Visão geral das finanças
- Métricas principais (receita, despesa, lucro)
- Gráficos interativos
- Filtro por período (dia, semana, mês, ano)
- Top 5 produtos por margem

#### **Gerenciamento de Produtos** (`/financeiro/produtos`)
- CRUD completo de produtos
- Busca por nome/SKU
- Ordenação (nome, margem, estoque, preço)
- Cálculo automático de margem de lucro
- Modal para edição

## 🚀 Como Usar

### Exemplo 1: Adicionar um Produto

```javascript
import { useFinanceiro } from '@/composables/useFinanceiro'
import { useCurrentStore } from '@/composables/useCurrentStore'

const { storeId } = useCurrentStore()
const { addProduto } = useFinanceiro(storeId)

// Adicionar novo produto
await addProduto({
  nome: 'Processador Intel i5',
  sku: 'PROC-I5-12400',
  custo: 400.00,
  preco_venda: 650.00,
  categoria: 'hardware',
  estoque: 5,
  descricao: 'Processador i5 12ª geração'
})
```

### Exemplo 2: Registrar uma Venda

```javascript
import { useTransacoes } from '@/composables/useTransacoes'

const { registrarVenda } = useTransacoes(storeId)

// Registrar venda de produtos
await registrarVenda({
  descricao: 'Venda de kit custom para João Silva',
  valor: 1200.00,
  categoria: 'hardware',
  cliente_id: 'cliente-123',
  ordem_servico_id: 'os-456',
  metodo_pagamento: 'pix',
  produtos: [
    {
      produtoId: 'proc-123',
      quantidade: 1,
      preco_unitario: 650.00,
      subtotal: 650.00
    },
    {
      produtoId: 'ssd-456',
      quantidade: 1,
      preco_unitario: 350.00,
      subtotal: 350.00
    }
  ]
})
```

### Exemplo 3: Gerar Relatório de um Período

```javascript
const { transacoes, filtrarPorPeriodo, calcularTotais, agruparPorCategoria } = useTransacoes(storeId)

// Pega últimos 30 dias
const inicio = new Date()
inicio.setDate(inicio.getDate() - 30)
const fim = new Date()

const doMes = filtrarPorPeriodo(inicio, fim)
const totais = calcularTotais(doMes)
const porCategoria = agruparPorCategoria(doMes)

console.log('Receita:', totais.receita)
console.log('Despesa:', totais.despesa)
console.log('Lucro:', totais.lucro)
console.log('Por categoria:', porCategoria)
```

## 📊 Estrutura de Dados no Firestore

### Coleção: `stores/{storeId}/produtos/`
```javascript
{
  nome: "Processador Intel i5",
  sku: "PROC-I5-12400",
  custo: 400.00,
  preco_venda: 650.00,
  margem_lucro: 38.46,
  categoria: "hardware",
  estoque: 5,
  descricao: "Processador i5 12ª geração",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Coleção: `stores/{storeId}/transacoes_financeiras/`
```javascript
{
  tipo: "venda",                           // "venda" | "despesa"
  descricao: "Venda de kit custom",
  valor: 1200.00,
  categoria: "hardware",
  status: "concluida",                    // "pendente" | "concluida" | "cancelada"
  metodo_pagamento: "pix",                // "dinheiro" | "pix" | "cartao" | "cheque"
  cliente_id: "cliente-123",              // opcional
  ordem_servico_id: "os-456",            // opcional
  data_transacao: Timestamp.now(),
  data_pagamento: Timestamp.now(),
  produtos: [
    {
      produtoId: "proc-123",
      quantidade: 1,
      preco_unitario: 650.00,
      subtotal: 650.00
    }
  ],
  createdAt: Timestamp
}
```

## 🎯 Próximos Passos Recomendados

### Fase 1: Integração com Ordens de Serviço ✅
- [ ] Ao criar OS, salvar como transação automática
- [ ] Ao finalizar OS, marcar transação como concluída
- [ ] Integrar estoque com vendas

### Fase 2: Relatórios Avançados ⏳
- [ ] Gerar PDF com relatórios mensais
- [ ] Exportar para Excel
- [ ] Análise de tendências
- [ ] Previsões de receita

### Fase 3: Controle de Caixa ⏳
- [ ] Abertura/fechamento de caixa
- [ ] Métodos de pagamento
- [ ] Reconciliação bancária

### Fase 4: Integrações ⏳
- [ ] Integração contábil
- [ ] Backup automático
- [ ] Sincronização com banco

## 🔒 Segurança

As operações estão configuradas para:
- Validar dados antes de salvar
- Usar timestamps automáticos
- Manter rastreabilidade (createdAt, updatedAt)
- Filtrar por storeId (multi-tenant)

## 📱 Componentes Utilizados

- **Chart Library**: Recharts (para gráficos)
- **Ícones**: lucide-vue-next
- **UI**: Components customizados (@/components/ui)
- **Banco**: Firestore

## ❓ Dúvidas Comuns

**P: Como calcular margem de lucro?**
R: Automático! `(preco_venda - custo) / preco_venda * 100`

**P: Posso ter produtos com o mesmo SKU?**
R: Não é recomendado. O SKU deve ser único por produto.

**P: Como filtro relatórios por período?**
R: Use `filtrarPorPeriodo(dataInicio, dataFim)` do composable.

**P: Posso deletar uma transação?**
R: Sim, mas é melhor marcar como "cancelada" para auditoria.

## 📞 Suporte

Para adicionar novas funcionalidades ou ajustar a estrutura, veja `ARQUITETURA_FINANCEIRA.md`.

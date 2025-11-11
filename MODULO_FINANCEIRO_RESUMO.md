# 📊 Módulo Financeiro - Resumo Executivo

## ✅ O Que Foi Criado

Um **módulo financeiro completo** para controlar receitas, despesas, produtos e gerar relatórios. Sistema inteligente que calcula automaticamente margens de lucro e agrupa dados por período.

---

## 🎯 Componentes Principais

### 1. **Dashboard Financeiro** (`/financeiro`)
**Visão geral das suas finanças em tempo real**

- Métrica de Receita (total de vendas)
- Métrica de Despesa (total de gastos)
- Métrica de Lucro Líquido (receita - despesa)
- Métrica de Estoque (valor total em estoque)
- Métrica de Margem Média (% de lucro)
- Gráfico de Receita vs Despesa (por período)
- Gráfico de Distribuição por Categoria
- Top 5 Produtos com Melhor Margem
- **Filtros**: Últimas 24h, semana, mês, ano
- **Exportação**: Botão para exportar dados (preparado para expansão)

### 2. **Gerenciamento de Produtos** (`/financeiro/produtos`)
**CRUD completo de produtos com cálculo automático de margem**

- ✅ Criar novo produto
- ✅ Editar produto
- ✅ Deletar produto
- ✅ Buscar por nome/SKU
- ✅ Ordenar por: nome, margem, estoque, preço
- ✅ Cálculo automático de margem de lucro
- Campos: nome, SKU, custo, preço venda, categoria, estoque, descrição

**Fórmula de Margem**: `(preço_venda - custo) / preço_venda * 100`

### 3. **Registro de Transações** (`/financeiro/transacoes`)
**Registre vendas e despesas de forma estruturada**

- ✅ Registrar vendas
  - Selecionar múltiplos produtos
  - Quantidade automática
  - Preço automático do produto
  - Cliente e OS opcional
  
- ✅ Registrar despesas
  - Valor manual
  - Categoria (operacional, suprimentos, etc)
  
- ✅ Métodos de pagamento: PIX, Dinheiro, Cartão, Cheque
- ✅ Status: Concluída, Pendente, Cancelada
- ✅ Histórico com filtros
- ✅ Tabela com todas as transações

---

## 💾 Estrutura de Dados (Firestore)

```
stores/{storeId}/
├── produtos/
│   └── {id}: { nome, sku, custo, preco_venda, margem_lucro, categoria, estoque }
│
├── transacoes_financeiras/
│   └── {id}: { tipo, descricao, valor, categoria, status, metodo_pagamento, produtos[] }
```

---

## 🔧 Como Usar (Exemplos Práticos)

### Exemplo 1: Adicionar Produto
```javascript
// No componente ou action
import { useFinanceiro } from '@/composables/useFinanceiro'
import { useCurrentStore } from '@/composables/useCurrentStore'

const { storeId } = useCurrentStore()
const { addProduto } = useFinanceiro(storeId)

await addProduto({
  nome: 'SSD Samsung 1TB',
  sku: 'SSD-SAMSUNG-1TB',
  custo: 250.00,
  preco_venda: 400.00,    // Margem será: 37.5%
  categoria: 'hardware',
  estoque: 10
})
```

### Exemplo 2: Registrar Venda
```javascript
import { useTransacoes } from '@/composables/useTransacoes'

const { registrarVenda } = useTransacoes(storeId)

await registrarVenda({
  descricao: 'PC Gamer Custom para João',
  categoria: 'hardware',
  cliente_id: 'cliente-123',
  metodo_pagamento: 'pix',
  produtos: [
    {
      produtoId: 'proc-123',
      quantidade: 1,
      preco_unitario: 500,
      subtotal: 500
    }
  ],
  valor: 500  // Calculado automaticamente
})
```

### Exemplo 3: Ver Relatório do Mês
```javascript
const { transacoes, filtrarPorPeriodo, calcularTotais } = useTransacoes(storeId)

const inicio = new Date()
inicio.setDate(1)  // Primeiro dia do mês
const fim = new Date()

const doMes = filtrarPorPeriodo(inicio, fim)
const { receita, despesa, lucro } = calcularTotais(doMes)

console.log(`Receita: R$ ${receita}`)
console.log(`Despesa: R$ ${despesa}`)
console.log(`Lucro: R$ ${lucro}`)
```

---

## 📈 Composables (Lógica Reutilizável)

### `useFinanceiro(storeId)`
```javascript
{
  // State
  produtos,                    // Array de produtos
  isLoading, error,           // Estados
  
  // Methods
  loadProdutos(),             // Carrega do Firestore
  addProduto(data),          // Cria novo
  updateProduto(id, data),   // Edita
  deleteProduto(id),         // Deleta
  calcularMargemLucro(),     // Fórmula
  
  // Computed (atualizados automaticamente)
  produtosPorMargem,         // Ordenados por lucro
  totalProdutos,             // Quantidade
  estoqueTotal,              // Itens
  valorEstoqueTotal          // Valor em R$
}
```

### `useTransacoes(storeId)`
```javascript
{
  // State
  transacoes,                // Histórico
  
  // Methods
  loadTransacoes(filtros),   // Carrega
  registrarVenda(data),      // Cria venda
  registrarDespesa(data),    // Cria despesa
  updateTransacao(id, data), // Edita
  deleteTransacao(id),       // Deleta
  filtrarPorPeriodo(ini, fim), // Filtra
  calcularTotais(),          // { receita, despesa, lucro }
  agruparPorCategoria(),     // Agrupa
  
  // Computed
  totais,                    // Resumo
  vendas,                    // Só vendas
  despesas,                  // Só despesas
  margemMedia                // % lucro
}
```

---

## 🚀 Próximas Funcionalidades Recomendadas

### Fase 2 (Análises Avançadas)
- [ ] Exportar para PDF mensal
- [ ] Exportar para Excel
- [ ] Gráfico de tendências (últimos 12 meses)
- [ ] Previsão de receita

### Fase 3 (Controle de Caixa)
- [ ] Abertura/fechamento de caixa
- [ ] Caixa atual (saldo)
- [ ] Reconciliação de pagamentos

### Fase 4 (Integrações)
- [ ] Integração com Ordens de Serviço (auto-registrar)
- [ ] Backup automático diário
- [ ] Sincronização contábil
- [ ] Alertas de estoque baixo

---

## 🔒 Segurança

✅ **Implementado:**
- Validação de dados antes de salvar
- Multi-tenant (isolado por storeId)
- Timestamps automáticos (auditoria)
- Dados tipados (TypeScript ready)

---

## 📱 Integração com Sidebar

Para adicionar links no menu:

**Editar**: `src/components/ui/SidebarMenu.vue`

```vue
<SidebarItem to="/financeiro">
  📊 Dashboard Financeiro
</SidebarItem>
<SidebarItem to="/financeiro/produtos">
  📦 Produtos
</SidebarItem>
<SidebarItem to="/financeiro/transacoes">
  💰 Transações
</SidebarItem>
```

---

## 🎨 Design & UX

- Cards com gradientes premium
- Gráficos interativos (Recharts)
- Modais para formulários
- Tabelas responsivas
- Filtros e buscas
- Status visual (cores diferentes)
- Loading states

---

## 📊 Métricas Exibidas

**Dashboard:**
- Receita total
- Despesa total
- Lucro líquido
- Valor em estoque
- Margem média
- Quantidade de vendas
- Quantidade de despesas
- Top 5 produtos

**Produtos:**
- Total de produtos
- Itens em estoque
- Margem média
- Margem por produto
- Preço por produto

**Transações:**
- Histórico completo
- Filtrado por tipo
- Filtrado por status
- Valor de cada transação
- Data de cada transação

---

## ✨ Diferenciais Implementados

1. **Cálculo automático de margem** - Atualiza em tempo real
2. **Filtros inteligentes** - Por período, tipo, status, categoria
3. **Busca rápida** - Produto por nome/SKU
4. **Gráficos visuais** - Receita vs despesa, por categoria
5. **Multi-produto em vendas** - Registra múltiplos itens
6. **Rastreabilidade** - createdAt, updatedAt automáticos
7. **Flexible** - Produtos opcionais em despesas

---

## 🎯 Status

- ✅ Dashboard Financeiro
- ✅ Gerenciamento de Produtos
- ✅ Registro de Transações
- ✅ Composables reutilizáveis
- ✅ Firestore integrado
- ✅ Gráficos e análises
- ⏳ Exportação avançada
- ⏳ Integração com OS
- ⏳ Controle de caixa

---

## 📖 Documentação Completa

Para mais detalhes, veja:
- `ARQUITETURA_FINANCEIRA.md` - Desenho técnico
- `GUIA_MODULO_FINANCEIRO.md` - Guia detalhado
- Código comentado nos composables

---

## 💡 Dicas de Uso

1. **Sempre cadastre produtos antes** de registrar vendas
2. **Use categorias** para filtrar relatórios depois
3. **Registre despesas** no mesmo dia para relatórios precisos
4. **Acompanhe a margem** de cada produto
5. **Exporte relatórios** no final do mês

---

**Pronto para aumentar seus lucros! 🚀**

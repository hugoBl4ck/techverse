# 📊 Diagrama de Fluxo - Sistema Financeiro Novo

## 🔄 Fluxo de Venda (Antes vs Depois)

### ❌ ANTES (Problema)
```
┌─────────────────────────────────────────────────┐
│ Cliente compra PC Gamer por R$ 1.200            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Registra Venda  │
        │                 │
        │ valor: 1200     │
        └────────┬────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  Dashboard Mostra:   │
      │                      │
      │ Receita:     1200    │
      │ Despesa:      150    │
      │ ─────────────────    │
      │ Lucro:      1050 ❌  │
      │                      │
      │ (SEM SABER CUSTO)    │
      └──────────────────────┘
      
      ⚠️ Lucro aparece do nada!
         Não rastreia estoque
         Não controla custo
```

### ✅ DEPOIS (Solução)
```
┌─────────────────────────────────────────────────┐
│ Cliente compra PC Gamer por R$ 1.200            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────┐
        │ Registra Venda com:      │
        │                          │
        │ Produtos:                │
        │ ├─ Proc i5 (R$500)      │
        │ │  Custo: R$350         │
        │ └─ SSD (R$700)          │
        │    Custo: R$500         │
        └────────┬─────────────────┘
                 │
                 ▼
        ┌──────────────────────────┐
        │ Sistema Calcula:         │
        │                          │
        │ ✅ COGS: R$ 850         │
        │ ✅ Margem Bruta: R$ 350 │
        │ ✅ Estoque: Atualizado  │
        │ ✅ Movimento: Registrado│
        └────────┬─────────────────┘
                 │
                 ▼
      ┌──────────────────────────────┐
      │  Dashboard Mostra:           │
      │                              │
      │ Receita:         R$ 1.200    │
      │ (-) COGS:        R$ 850      │
      │ ─────────────────────────    │
      │ Lucro Bruto:     R$ 350 ✅   │
      │ Margem:          29,2%       │
      │                              │
      │ (-) Despesas:    R$ 150      │
      │ ─────────────────────────    │
      │ Lucro Líquido:   R$ 200 ✅   │
      │ Margem Final:    16,7%       │
      │                              │
      │ Estoque:         Atualizado  │
      └──────────────────────────────┘
      
      ✅ Tudo rastreável!
         Estoque integrado
         Custo controlado
```

---

## 🔗 Integração de Módulos

```
┌──────────────────────────────────────────────────────────────┐
│                      DASHBOARD FINANCEIRO                    │
│  (DashboardFinanceiroView.vue)                              │
└────┬──────────────────────────────┬──────────────┬───────────┘
     │                              │              │
     ▼                              ▼              ▼
┌─────────────────┐      ┌──────────────────┐   ┌──────────────┐
│ useTransacoesV2 │      │useMovimentacao   │   │usePeriodos   │
│                 │      │Estoque           │   │Contabeis     │
│ Registra:       │      │                  │   │              │
│ ├─ Vendas      │      │ Rastreia:       │   │ Consolida:   │
│ ├─ Despesas    │      │ ├─ Entrada      │   │ ├─ Receita   │
│ ├─ COGS Auto   │      │ ├─ Saída        │   │ ├─ COGS      │
│ └─ DRE         │      │ └─ Ajuste       │   │ ├─ Despesa   │
│                 │      │                  │   │ └─ DRE      │
└────┬────────────┘      └────┬─────────────┘   └──────┬───────┘
     │                         │                        │
     └─────────────┬───────────┴────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Firestore          │
        │                      │
        │ ├─ Transações        │
        │ ├─ Movimentações     │
        │ ├─ Períodos          │
        │ └─ Produtos          │
        └──────────────────────┘
```

---

## 📝 Estrutura de Dados

### Produto (Existente + Melhorado)
```javascript
{
  id: "prod-123",
  nome: "Processador Intel i5",
  sku: "PROC-I5-12400",
  preco_venda: 500.00,
  custo: 350.00,  // ✅ NOVO
  categoria: "hardware",
  quantidade: 5,
  margem_lucro: 30,  // Calculado: (500-350)/500*100
}
```

### Transação - Venda (Antes vs Depois)

**ANTES:**
```javascript
{
  id: "trans-123",
  tipo: "venda",
  descricao: "PC Gamer",
  valor: 1200.00
  // ❌ Falta custo, falta detalhe
}
```

**DEPOIS:**
```javascript
{
  id: "trans-123",
  tipo: "venda",
  descricao: "PC Gamer",
  
  // Valores monetários
  valor_venda: 1200.00,
  valor_cogs: 850.00,      // ✅ NOVO
  margem_bruta: 350.00,    // ✅ NOVO
  percentual_margem_bruta: 29.17,  // ✅ NOVO
  
  // Detalhes dos produtos
  produtos: [
    {
      produtoId: "prod-proc",
      quantidade: 1,
      preco_unitario: 500,
      custo_unitario: 350,  // ✅ NOVO
      custo_total: 350      // ✅ NOVO
    },
    {
      produtoId: "prod-ssd",
      quantidade: 1,
      preco_unitario: 700,
      custo_unitario: 500,  // ✅ NOVO
      custo_total: 500      // ✅ NOVO
    }
  ]
}
```

### Movimentação de Estoque (NOVO)
```javascript
{
  id: "mov-456",
  tipo: "saida",           // entrada | saida | ajuste
  referencia_tipo: "venda",
  referencia_id: "trans-123",
  
  produtos: [
    {
      produtoId: "prod-proc",
      quantidade: 1,
      custo_unitario: 350,
      valor_total: 350
    },
    {
      produtoId: "prod-ssd",
      quantidade: 1,
      custo_unitario: 500,
      valor_total: 500
    }
  ],
  
  valor_total_cogs: 850,
  data_movimento: Timestamp.now()
}
```

### Período Contábil (NOVO)
```javascript
{
  id: "periodo-202411",
  mes: 11,
  ano: 2024,
  status: "fechado",
  
  // Consolidação
  receita_total: 15000,
  cogs_total: 8500,
  lucro_bruto: 6500,
  percentual_margem_bruta: 43.33,
  
  despesa_total: 2000,
  lucro_liquido: 4500,
  percentual_margem_liquida: 30,
  
  // Agrupamento
  receita_por_categoria: {
    "hardware": 10000,
    "servicos": 5000
  },
  
  // Auditoria
  quantidade_vendas: 15,
  quantidade_despesas: 8,
  fechado_em: Timestamp.now(),
  usuario_fechamento: "admin"
}
```

---

## 🔢 Cálculos Contábeis

### Fórmula DRE (Demonstração de Resultado)
```
RECEITA BRUTA
────────────────────────────
(15.000,00)

Custo de Bens Vendidos (COGS)
- 8.500,00

────────────────────────────
LUCRO BRUTO
(6.500,00 ou 43,33%)

Despesas Operacionais
- Aluguel:         1.000,00
- Energia:           500,00
- Outros:            500,00
- Total:          - 2.000,00

────────────────────────────
LUCRO LÍQUIDO
(4.500,00 ou 30%)
────────────────────────────
```

### Código de Cálculo
```javascript
// useTransacoesV2.js - calcularTotais()
const calcularTotais = () => {
  let receita = 0;
  let cogs = 0;
  let despesa = 0;
  
  transacoes.forEach(t => {
    if (t.tipo === 'venda') {
      receita += t.valor_venda;
      cogs += t.valor_cogs;
    } else if (t.tipo === 'despesa') {
      despesa += t.valor;
    }
  });
  
  return {
    receita,
    cogs,
    margem_bruta: receita - cogs,
    despesa,
    lucro_liquido: (receita - cogs) - despesa,
    percentual_margem_bruta: ((receita - cogs) / receita * 100),
    percentual_margem_liquida: (((receita - cogs) - despesa) / receita * 100)
  };
};
```

---

## 🔄 Ciclo de Vida de uma Venda

```
1️⃣ Registro de Venda
┌──────────────────────────────────┐
│ await registrarVenda({           │
│   descricao: "PC Custom",        │
│   valor: 1200,                   │
│   produtos: [...]                │
│ })                               │
└────────────────┬─────────────────┘
                 │
                 ▼
2️⃣ Cálculo Automático
┌──────────────────────────────────┐
│ Sistema calcula:                 │
│ - COGS total: 850                │
│ - Margem bruta: 350              │
│ - % margem: 29,17%               │
└────────────────┬─────────────────┘
                 │
                 ▼
3️⃣ Registra Movimentação
┌──────────────────────────────────┐
│ registrarSaidaPorVenda(...)      │
│ - Cria movimento de estoque      │
│ - Valor saída: 850               │
│ - Produtos: 2 unidades           │
└────────────────┬─────────────────┘
                 │
                 ▼
4️⃣ Atualiza Estoque
┌──────────────────────────────────┐
│ updateDoc(produto):              │
│ - Proc: 5 → 4                    │
│ - SSD: 10 → 9                    │
└────────────────┬─────────────────┘
                 │
                 ▼
5️⃣ Dashboard Atualiza
┌──────────────────────────────────┐
│ Mostra automaticamente:          │
│ - Receita: 1200 ✓                │
│ - COGS: 850 ✓                    │
│ - Lucro Bruto: 350 ✓             │
│ - Estoque atualizado ✓           │
└──────────────────────────────────┘
```

---

## 📅 Ciclo de Fechamento Mensal

```
MÊS: Novembro (Dias 1-30)
┌─────────────────────────────────────┐
│ • Registra vendas normalmente      │
│ • Registra despesas normalmente    │
│ • Estoque atualizado automaticamente│
│ • Status: ABERTO                   │
└────────────┬────────────────────────┘
             │
             │ (Final do mês)
             ▼
┌─────────────────────────────────────┐
│ 1. Clica em "Fechar Período"        │
│ 2. Seleciona: Mês 11, Ano 2024      │
│ 3. Sistema consolida:               │
│    ├─ Receita total: 15.000         │
│    ├─ COGS total: 8.500             │
│    ├─ Lucro bruto: 6.500            │
│    ├─ Despesa total: 2.000          │
│    └─ Lucro líquido: 4.500          │
│ 4. Gera DRE automaticamente         │
│ 5. Bloqueia período: FECHADO        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ PERÍODO FECHADO 11/2024             │
│                                     │
│ Status: ✓ FECHADO                   │
│ Dados: ✓ IMUTÁVEIS                  │
│ Auditoria: ✓ REGISTRADA             │
│ DRE: ✓ DISPONÍVEL                   │
│                                     │
│ Próximo mês: ABERTO (novo)          │
└─────────────────────────────────────┘
```

---

## 🎯 Comparação: Antes vs Depois

### Dashboard Financeiro

**ANTES:**
```
┌──────────────────────────────┐
│  Dashboard Financeiro        │
├──────────────────────────────┤
│ Receita:    R$ 15.000        │
│ Despesa:    R$ 2.000         │
│ ────────────────────────     │
│ Lucro:      R$ 13.000 ❌     │
│                              │
│ (Sem contexto, sem detalhe)  │
└──────────────────────────────┘
```

**DEPOIS:**
```
┌────────────────────────────────────┐
│  Dashboard Financeiro              │
├────────────────────────────────────┤
│ RECEITA BRUTA      R$ 15.000       │
│ ─────────────────────────────────  │
│ (-) Custo de Bens  R$ 8.500        │
│ ─────────────────────────────────  │
│ LUCRO BRUTO        R$ 6.500 (43%) ✅
│                                    │
│ (-) Despesas       R$ 2.000        │
│ ─────────────────────────────────  │
│ LUCRO LÍQUIDO      R$ 4.500 (30%) ✅
│                                    │
│ Margem Bruta:      43,33%          │
│ Margem Líquida:    30,00%          │
│                                    │
│ Período:           Nov/2024        │
│ Status:            Fechado ✓       │
│                                    │
│ [Gráficos]         [Relatórios]    │
└────────────────────────────────────┘
```

---

## 🔐 Segurança e Auditoria

```
Período Fechado (11/2024)
│
├─ Não permite editar transações
│
├─ Não permite deletar produtos
│
├─ Não permite alterar estoque
│
├─ Registra quem fechou e quando
│
├─ Consolida dados imutáveis
│
└─ Backup automático disponível
```

---

## 🎬 Conclusão Visual

```
ANTES: Lucro aparece do nada → Confusão
       ❌ Sem rastreabilidade
       ❌ Sem controle
       ❌ Sem confiabilidade

DEPOIS: Lucro rastreável de A a Z → Clareza
        ✅ Tudo documentado
        ✅ Tudo integrado
        ✅ Tudo auditado
```

Essa é a transformação que a solução oferece!

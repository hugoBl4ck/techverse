# 📋 Guia de Cancelamento de Ordens de Serviço

## 🎯 Abordagem Contábil Implementada

Ao invés de **deletar** ordens de serviço (o que perderia auditoria), o sistema agora usa a melhor prática contábil: **cancelamento com reversão**.

---

## ✅ O que acontece ao cancelar uma ordem

Quando você clica no botão **❌ (XCircle)** ao lado de uma ordem de serviço:

### 1️⃣ **Status é marcado como "Cancelada"**
- A ordem fica visível na lista (com fundo vermelho)
- Não pode ser editada ou gerar recibo
- Mantém histórico completo para auditoria

### 2️⃣ **Estoque é restaurado**
```javascript
// Exemplo: Se vendeu 2 RAMs, elas retornam ao inventário
Item: RAM 16GB
Quantidade ANTES da venda: 5 unidades
Quantidade APÓS a venda: 3 unidades
Quantidade APÓS cancelamento: 5 unidades (restaurado)
```

### 3️⃣ **Transação Financeira é Revertida**
- Uma transação com **valor negativo** é registrada
- Categoria: `cancelamento`
- Descrição: `CANCELAMENTO - Ordem de Serviço #xxx`
- Método: `reembolso`

**Exemplo no Financeiro:**
```
TRANSAÇÃO ORIGINAL:
Tipo: Venda
Valor: +R$ 500,00
Categoria: servico

TRANSAÇÃO REVERSA (Cancelamento):
Tipo: Venda (valor negativo)
Valor: -R$ 500,00
Categoria: cancelamento
```

### 4️⃣ **Produtos da transação também são revertidos**
- Quantidade negativa para cada item
- Preços unitários registrados corretamente

---

## 📊 Impacto Financeiro

Quando você cancela uma ordem no valor de **R$ 500,00** com **2 peças**:

### Dashboard Financeiro:
- **Receita bruta**: Sem alteração (ambas as transações são registradas)
- **Receita líquida**: -R$ 500,00 (pela transação reversa)
- **Lucro**: Reduzido em R$ 500,00
- **Histórico completo**: Mantido para auditoria

### Relatórios:
- Ao filtrar por período, aparece a venda e seu cancelamento
- Permite análise de vendas perdidas
- Indica padrões de cancelamento

---

## 🔍 Exemplo Prático

**Cenário:** Ordem de serviço de manutenção

```
DATA: 13/11/2025
CLIENTE: João Silva
ITENS USADOS:
  - SSD 240GB (x1) - R$ 150,00
  - Pasta Térmica (x2) - R$ 40,00

SUBTOTAL: R$ 230,00
DESCONTO: R$ 30,00
TOTAL: R$ 200,00

ESTOQUE ANTES:
  - SSD: 5 unidades
  - Pasta: 10 unidades

ESTOQUE DEPOIS (venda concluída):
  - SSD: 4 unidades
  - Pasta: 8 unidades
```

**Ao cancelar a ordem:**

```
ESTOQUE RESTAURADO:
  - SSD: 5 unidades ✅
  - Pasta: 10 unidades ✅

TRANSAÇÃO FINANCEIRA REVERTIDA:
  - Descrição: "CANCELAMENTO - Ordem #xxx - João Silva"
  - Valor: -R$ 200,00
  - Produtos: 
    * SSD: -1 unidade
    * Pasta: -2 unidades

ORDEM APARECERÁ NA LISTA COMO:
  - Status: ❌ Cancelada (fundo vermelho)
  - Botões desativados (Editar, Recibo)
```

---

## 📋 Vantagens desta Abordagem

✅ **Auditoria Completa** - Histórico nunca é perdido
✅ **Conformidade Legal** - Segue normas contábeis
✅ **Rastreamento** - Sabe quantas vendas foram canceladas
✅ **Análise** - Identifica padrões de cancelamento
✅ **Reversão Automática** - Estoque restaurado corretamente
✅ **Contabilidade Correta** - Transações negativas registram o reembolso

---

## ⚠️ O que NÃO é possível após cancelar

- ❌ Editar a ordem
- ❌ Gerar novo recibo
- ❌ Selecionar ações (deve criar nova ordem)

**Solução:** Se precisa ajustar, crie uma **nova ordem de serviço**

---

## 🧮 Fórmulas Financeiras

### Receita Líquida com Cancelamentos:
```
Receita Líquida = ∑(Vendas) + ∑(Cancelamentos)
                = R$ 5.000 + (-R$ 500)
                = R$ 4.500
```

### Margem com Cancelamentos:
```
Margem = (Receita Líquida - Custos) / Receita Líquida
       = (4.500 - 2.000) / 4.500
       = 44,4%
```

---

## 📌 Resumo

| Ação | O que acontece |
|------|----------------|
| **Criar Ordem** | Estoque ↓ / Transação registrada |
| **Editar Ordem** | Mantém status "aberta" |
| **Cancelar Ordem** | Estoque ↑ / Transação reversa / Status "cancelada" |
| **Deletar** | ❌ Não é permitido (usa cancelamento) |

**Lembre-se:** Cancelar é sempre mais seguro do que deletar em sistemas financeiros! 💰

# ⚡ Guia Rápido de Referência - Dashboard Financeiro

## 🎯 3 Conceitos-Chave

### 1. COGS (Custo de Bens Vendidos)
```
O que é?
- Custo dos produtos que você vende
- Calculado automaticamente quando vende

Exemplo:
- Você vende um PC por R$ 1.200
- O custo do PC é R$ 850
- COGS = R$ 850

Importância:
- Lucro REAL = Venda - COGS
- R$ 1.200 - R$ 850 = R$ 350 (Lucro Bruto)
```

### 2. Lucro Bruto vs Lucro Líquido
```
Lucro Bruto = Receita - COGS
(Margem do produto)

Lucro Líquido = Lucro Bruto - Despesas
(Lucro real após custos operacionais)

Exemplo:
Venda:              R$ 1.200
- COGS:             R$ 850
= Lucro Bruto:      R$ 350 (29,2%)

- Despesa:          R$ 100
= Lucro Líquido:    R$ 250 (20,8%)
```

### 3. Período Contábil Fechado
```
O que é?
- Mês encerrado com dados consolidados
- Não permite mais edições
- Gera relatório DRE automático

Por quê?
- Garantir integridade de dados
- Auditoria e conformidade
- Histórico confiável

Quando?
- Último dia de cada mês
```

---

## 📊 Fórmulas Rápidas

### Dashboard
```
Receita Bruta = Σ(valor_venda)
COGS = Σ(valor_cogs)
Lucro Bruto = Receita - COGS
Margem % Bruta = (Lucro Bruto / Receita) × 100
Despesa = Σ(despesas)
Lucro Líquido = Lucro Bruto - Despesa
Margem % Líquida = (Lucro Líquido / Receita) × 100
```

### Produto
```
Margem Lucro = (Preço Venda - Custo) / Preço Venda × 100
Valor Margem = Preço Venda - Custo
```

### Por Categoria
```
Receita Cat = Σ(valor_venda) onde categoria = X
COGS Cat = Σ(valor_cogs) onde categoria = X
Lucro Cat = Receita Cat - COGS Cat - Despesa Cat
```

---

## 💻 Código Rápido

### Registrar Venda
```javascript
// Importar
import { useTransacoesV2 } from '@/composables/useTransacoesV2'

// Usar
const { registrarVenda } = useTransacoesV2(storeId)

await registrarVenda({
  descricao: 'Venda PC',
  valor: 1200,
  categoria: 'hardware',
  produtos: [
    {
      produtoId: 'proc-123',
      quantidade: 1,
      preco_unitario: 500,
      custo_unitario: 350  // ← IMPORTANTE
    },
    {
      produtoId: 'ssd-456',
      quantidade: 1,
      preco_unitario: 700,
      custo_unitario: 500  // ← IMPORTANTE
    }
  ]
})

// Sistema faz automaticamente:
// ✓ Calcula COGS (850)
// ✓ Calcula Lucro Bruto (350)
// ✓ Registra movimento estoque
// ✓ Atualiza quantidade
```

### Registrar Despesa
```javascript
import { useTransacoesV2 } from '@/composables/useTransacoesV2'

const { registrarDespesa } = useTransacoesV2(storeId)

await registrarDespesa({
  descricao: 'Aluguel mês',
  valor: 1000,
  categoria: 'operacional',
  subcategoria: 'aluguel'  // ← NOVO
})
```

### Fechar Período
```javascript
import { usePeriodosContabeis } from '@/composables/usePeriodosContabeis'

const { fecharPeriodo } = usePeriodosContabeis(storeId)

await fecharPeriodo(11, 2024)  // Novembro 2024

// Sistema:
// ✓ Consolida dados
// ✓ Gera DRE
// ✓ Bloqueia edições
```

### Gerar DRE
```javascript
const { gerarDRE } = usePeriodosContabeis(storeId)

const dre = gerarDRE(periodoId)

console.log(dre.receita_bruta)
console.log(dre.cogs_total)
console.log(dre.lucro_bruto)
console.log(dre.lucro_liquido)
```

---

## 📁 Estrutura Firestore

```
stores/{storeId}/

├── itens/
│   └── {id}: { nome, sku, custo, precoVenda, quantidade, ... }

├── transacoes_financeiras/
│   └── {id}: {
│       tipo: 'venda',
│       valor_venda: 1200,
│       valor_cogs: 850,      ✅ NOVO
│       margem_bruta: 350,    ✅ NOVO
│       produtos: [ ... ],
│       ...
│     }

├── movimentacoes_estoque/  ✅ NOVO
│   └── {id}: {
│       tipo: 'saida',
│       referencia_tipo: 'venda',
│       valor_total_cogs: 850,
│       produtos: [ ... ],
│       ...
│     }

└── periodos_contabeis/  ✅ NOVO
    └── {id}: {
        mes: 11,
        ano: 2024,
        receita_total: 15000,
        cogs_total: 8500,
        lucro_bruto: 6500,
        despesa_total: 2000,
        lucro_liquido: 4500,
        ...
    }
```

---

## 🔢 Exemplo Numérico Completo

### Dia 15/11/2024 - Venda 1
```
Registra Venda:
- PC Custom: R$ 1.200
  ├─ Proc i5 (R$ 500, Custo: R$ 350)
  └─ SSD (R$ 700, Custo: R$ 500)

Sistema Calcula:
- Venda: R$ 1.200
- COGS: R$ 850
- Lucro Bruto: R$ 350 (29,2%)

Estoque Atualizado:
- Proc: 10 → 9
- SSD: 5 → 4
```

### Dia 20/11/2024 - Despesa
```
Registra Despesa:
- Aluguel: R$ 1.000
```

### Dia 30/11/2024 - Fechar Período
```
Períodos: Nov/2024
- Receita: R$ 1.200
- COGS: R$ 850
- Lucro Bruto: R$ 350 (29,2%)
- Despesa: R$ 1.000
- Lucro Líquido: -R$ 650 (-54,2%)
  (Perda porque despesa > lucro bruto)

Status: FECHADO ✓
DRE: Disponível ✓
```

---

## 📊 Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Dashboard Financeiro - Nov/2024        │
├─────────────────────────────────────────┤
│                                         │
│ [Receita]  [COGS]  [Lucro Bruto]       │
│   1.200      850       350 (29%)        │
│                                         │
│ [Lucro Líquido]  [Margem]               │
│   -650 (Perda!)     -54%                │
│                                         │
│ [Período Status: FECHADO]  [DRE]        │
│                                         │
│ Gráfico Receita por Categoria           │
│ ┌─────────────────────────────┐         │
│ │ [Gráfico]                   │         │
│ └─────────────────────────────┘         │
│                                         │
│ Movimentação de Estoque                 │
│ ┌─────────────────────────────┐         │
│ │ Data    Tipo    Qtd  Valor  │         │
│ │ 15/11   Saída   2    R$ 850 │         │
│ └─────────────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Rápido

### Antes de Implementar
- [ ] Backup dos dados Firestore
- [ ] Todos os produtos têm custo?
- [ ] Entendi COGS?
- [ ] Entendi Lucro Bruto vs Líquido?

### Implementação Semana 1
- [ ] Adicionar campo `custo` aos produtos
- [ ] Copiar `useMovimentacaoEstoque.js`
- [ ] Testar movimentação básica
- [ ] Validar COGS nos 5 primeiros dados

### Implementação Semana 2
- [ ] Copiar `useTransacoesV2.js`
- [ ] Registrar venda de teste
- [ ] Verificar COGS automático
- [ ] Validar estoque atualizado

### Implementação Semana 3
- [ ] Copiar `usePeriodosContabeis.js`
- [ ] Fechar período de teste
- [ ] Gerar DRE
- [ ] Validar dados consolidados

### Migração
- [ ] Ler MIGRACAO_DADOS_FINANCEIRO.md
- [ ] Executar script 1 (custo produtos)
- [ ] Executar script 2 (movimentações)
- [ ] Executar script 3 (COGS transações)
- [ ] Executar script 4 (períodos históricos)
- [ ] Validar dados antes/depois

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| COGS não aparece | Verificar se produtos têm `custo_unitario` |
| Estoque não atualiza | Verificar se `registrarSaidaPorVenda()` foi chamada |
| Período não fecha | Verificar se há transações no período |
| Números estão errados | Validar fórmulas em `calcularTotais()` |
| Erro ao salvar | Verificar se Firestore rules permitem escrita |

---

## 🚀 Próximas Ações

### Opção 1: Entender (30 min)
```
Leia:
1. Este arquivo (10 min)
2. RESUMO_SOLUCAO_FINANCEIRA.md (15 min)
3. DIAGRAMA_FLUXO_NOVO.md (5 min)
```

### Opção 2: Implementar (4 semanas)
```
1. Faça backup
2. Leia IMPLEMENTACAO_DASHBOARD_MELHORADO.md
3. Siga checklist acima
4. Execute ao final MIGRACAO_DADOS_FINANCEIRO.md
```

### Opção 3: Dúvida Específica
```
Use:
INDICE_SOLUCAO_FINANCEIRA.md
(localiza tópico e referência)
```

---

## 📞 Referências Rápidas

**COGS explicado:** MELHORIAS_DASHBOARD_FINANCEIRO.md → "1️⃣"
**Como registrar venda:** IMPLEMENTACAO_DASHBOARD_MELHORADO.md → "Tarefa 2.1"
**Estrutura Firestore:** DIAGRAMA_FLUXO_NOVO.md → "📝 Estrutura de Dados"
**Scripts migração:** MIGRACAO_DADOS_FINANCEIRO.md → "✅ Passo 1-4"
**Fluxo visual:** DIAGRAMA_FLUXO_NOVO.md → "🔄 Fluxo de Venda"

---

## 💡 Dicas Práticas

1. **Sempre registre custo com produto**
   ```
   ✓ Quando adiciona produto: coloca custo
   ✓ Quando vende: passa custo_unitario
   ```

2. **Valide COGS após cada venda**
   ```
   ✓ Venda + COGS calculado automático
   ✓ Confirme se bateu
   ```

3. **Feche mês todos os 30 dias**
   ```
   ✓ No último dia do mês
   ✓ Consolida dados
   ✓ Gera DRE
   ```

4. **Monitore Lucro Líquido**
   ```
   ✓ Lucro Bruto - Despesas = Lucro Real
   ✓ Se negativo = prejuízo
   ```

---

**Pronto para começar? Qual é seu próximo passo?** 🎯

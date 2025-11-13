# 🚀 Implementação do Dashboard Financeiro Melhorado

## 📌 Status: Preparação Para Implementação

Foram criados 3 novos composables que implementam a solução contábil eficiente:

### ✅ Arquivo 1: `useMovimentacaoEstoque.js`
**Objetivo:** Rastrear entrada e saída de estoque com COGS

**Principais funções:**
- `registrarSaidaPorVenda()` - Registra saída de estoque quando vende
- `registrarEntrada()` - Registra reposição de estoque
- `registrarAjuste()` - Ajustes manuais de estoque
- `calcularCogsTotal()` - Calcula custo total de bens vendidos
- `agruparPorTipo()` - Agrupa movimentações por tipo

### ✅ Arquivo 2: `useTransacoesV2.js`
**Objetivo:** Registrar vendas com COGS automático

**Principais funções:**
- `registrarVenda()` - ✅ NOVO: Calcula e registra COGS
- `registrarDespesa()` - ✅ Melhorado: Suporte a subcategorias
- `calcularTotais()` - ✅ NOVO: Calcula Lucro Bruto e Líquido corretos
- `gerarRelatorioDRE()` - ✅ NOVO: Gera DRE (Demonstração de Resultado)
- `agruparPorCategoria()` - ✅ Melhorado: Inclui COGS e Lucro por categoria

### ✅ Arquivo 3: `usePeriodosContabeis.js`
**Objetivo:** Fechar períodos contábeis com dados imutáveis

**Principais funções:**
- `fecharPeriodo()` - Fecha mês/trimestre com consolidação automática
- `reabrirPeriodo()` - Reabre período se necessário
- `gerarDRE()` - Gera relatório DRE do período fechado
- `verificarPeriodoFechado()` - Verifica se período está fechado

---

## 🔄 Fluxo Operacional Novo

### **Antes (Problema):**
```
1. Registra venda → Valor: R$ 1200
2. Dashboard mostra:
   - Receita: 1200
   - Despesa: 150
   - Lucro: 1050 ❌ (SEM saber custo dos produtos)
```

### **Depois (Solução):**
```
1. Registra venda com produtos:
   ├─ Produto 1: Quantidade 1, Custo R$350
   └─ Produto 2: Quantidade 1, Custo R$500

2. Sistema calcula automaticamente:
   ├─ Valor venda: R$ 1.200
   ├─ COGS: R$ 850
   ├─ Lucro Bruto: R$ 350 (29,2%)
   ├─ Estoque atualizado
   └─ Movimento registrado

3. Dashboard mostra:
   ├─ Receita: 1.200
   ├─ COGS: 850
   ├─ Lucro Bruto: 350 (29,2%)
   ├─ Despesas: 150
   └─ Lucro Líquido: 200 (16,7%) ✅ CORRETO
```

---

## 📋 Tarefas de Implementação

### **FASE 1: Integração com Produtos (URGENTE)**

#### Tarefa 1.1: Atualizar estrutura de Produtos
**Onde:** `src/composables/useFinanceiro.js`

```javascript
// ADICIONAR estes campos ao produto:
{
  id: "prod-123",
  nome: "Processador Intel i5",
  sku: "PROC-I5-12400",
  custo: 350.00,           // ✅ CAMPO OBRIGATÓRIO
  preco_venda: 500.00,
  quantidade: 5,
  categoria: "hardware",
  
  // Calculado automaticamente:
  margem_lucro: 30,        // (500-350)/500*100
  margem_valor: 150        // (500-350)
}
```

**Ações:**
- [ ] Verificar se campo `custo` existe em todos os produtos
- [ ] Se não existir, migrar dados dos produtos existentes
- [ ] Validar que `preco_venda > custo` sempre

---

#### Tarefa 1.2: Atualizar formulário de Produtos
**Onde:** `src/views/financeiro/GerenciamentoProdutosView.vue` (se existir)

```vue
<!-- ADICIONAR campo de custo -->
<div class="form-group">
  <label>Custo (R$)</label>
  <input v-model.number="produto.custo" type="number" step="0.01" required />
  <small>Preço de custo do fornecedor</small>
</div>

<!-- Margem será calculada automaticamente -->
<div class="form-group">
  <label>Margem de Lucro</label>
  <span>{{ margemCalculada }}%</span>
  <span class="text-muted">R$ {{ margemValor }}</span>
</div>
```

---

#### Tarefa 1.3: Atualizar Dashboard para mostrar COGS
**Onde:** `src/views/financeiro/DashboardFinanceiroView.vue`

```vue
<!-- MUDAR de: -->
<Card>
  <CardTitle>Lucro</CardTitle>
  <CardContent>
    R$ {{ receita - despesa }}
  </CardContent>
</Card>

<!-- PARA: -->
<Card>
  <CardTitle>Lucro Bruto</CardTitle>
  <CardContent>
    <p class="text-2xl font-bold">R$ {{ receita - cogs }}</p>
    <p class="text-sm">{{ percentualMargemBruta }}% de margem</p>
  </CardContent>
</Card>

<Card>
  <CardTitle>Lucro Líquido</CardTitle>
  <CardContent>
    <p class="text-2xl font-bold text-green-600">R$ {{ (receita - cogs) - despesa }}</p>
    <p class="text-sm">{{ percentualMargemLiquida }}% de margem</p>
  </CardContent>
</Card>
```

---

### **FASE 2: Integração com Transações (PRÓXIMA SEMANA)**

#### Tarefa 2.1: Atualizar Registro de Venda
**Onde:** `src/views/financeiro/` (Componente de venda)

```javascript
// Quando registra venda, DEVE passar:
await registrarVenda({
  descricao: 'PC Gamer Custom',
  valor: 1200.00,
  
  // ✅ AGORA OBRIGATÓRIO:
  produtos: [
    {
      produtoId: 'proc-123',
      nome: 'Processador',
      quantidade: 1,
      preco_unitario: 500,
      custo_unitario: 350    // ✅ NOVO
    },
    {
      produtoId: 'ssd-456',
      nome: 'SSD',
      quantidade: 1,
      preco_unitario: 700,
      custo_unitario: 500    // ✅ NOVO
    }
  ]
})

// Sistema calcula:
// - valor_cogs: 850
// - margem_bruta: 350
// - Registra movimento de estoque
```

---

#### Tarefa 2.2: Adicionar Movimentação de Estoque
**Onde:** Integração com `useTransacoesV2.js`

```javascript
// Quando registra venda, automaticamente:
// 1. Cria transação_financeira
// 2. Cria movimentacao_estoque
// 3. Atualiza quantidade do produto

// Resultado:
// - Estoque automaticamente atualizado
// - Histórico completo de saídas
// - Custo rastreável
```

---

#### Tarefa 2.3: Atualizar Estrutura de Despesa
**Onde:** Formulário de despesa

```javascript
// ANTES:
{
  tipo: 'despesa',
  descricao: 'Aluguel do mês',
  valor: 1500,
  categoria: 'operacional'  // Genérico
}

// DEPOIS:
{
  tipo: 'despesa',
  descricao: 'Aluguel do escritório',
  valor: 1500,
  categoria: 'operacional',
  subcategoria: 'aluguel'   // ✅ NOVO (específico)
}

// Categorias padrão:
/*
Custos Diretos (COGS):
- custo_materia_prima
- custo_mao_obra
- custo_terceirizados

Operacionais:
- aluguel
- energia
- internet
- salario_administrativo
- marketing
- combustivel
- manutencao

Impostos:
- imposto_estadual
- imposto_municipal
- taxa_bancaria
*/
```

---

### **FASE 3: Fechamento de Períodos (MÊS 2)**

#### Tarefa 3.1: Criar View de Fechamento
**Onde:** `src/views/financeiro/FechamentoPeriodoView.vue` (NOVO)

```vue
<template>
  <div class="space-y-6">
    <h1>Fechamento Contábil</h1>
    
    <!-- Seleção de Mês/Ano -->
    <Card>
      <CardHeader>
        <CardTitle>Fechar Período</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <select v-model="mesParaFechar">
            <option v-for="m in 12" :key="m" :value="m">
              Mês {{ m }}
            </option>
          </select>
          <select v-model="anoParaFechar">
            <option v-for="a in 5" :key="a" :value="2024 + a">
              {{ 2024 + a }}
            </option>
          </select>
        </div>
        <Button @click="fecharPeriodo">Fechar Período</Button>
      </CardContent>
    </Card>

    <!-- Visualização de Período Fechado -->
    <Card>
      <CardHeader>
        <CardTitle>Períodos Fechados</CardTitle>
      </CardHeader>
      <CardContent>
        <table>
          <thead>
            <tr>
              <th>Período</th>
              <th>Receita</th>
              <th>COGS</th>
              <th>Lucro Bruto</th>
              <th>Despesas</th>
              <th>Lucro Líquido</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in periodosFechados" :key="p.id">
              <td>{{ p.mes }}/{{ p.ano }}</td>
              <td>R$ {{ p.receita_total }}</td>
              <td>R$ {{ p.cogs_total }}</td>
              <td>R$ {{ p.lucro_bruto }}</td>
              <td>R$ {{ p.despesa_total }}</td>
              <td>R$ {{ p.lucro_liquido }}</td>
              <td>
                <Button @click="visualizarDRE(p.id)">DRE</Button>
                <Button @click="exportarPDF(p.id)">PDF</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
</template>
```

---

### **FASE 4: Relatórios Avançados (MÊS 3)**

#### Tarefa 4.1: Gerar Relatório DRE
**Onde:** Nova view `RelatorioFinanceiroView.vue`

```
Demonstração de Resultado do Exercício - Novembro/2024
═══════════════════════════════════════════════════════

Receita Bruta                    R$ 15.000,00
  Hardware                       R$ 10.000,00
  Serviços                       R$ 5.000,00
                                 ──────────────
(-) Custo de Bens Vendidos      (R$ 8.500,00)
  Hardware                      (R$ 5.500,00)
  Serviços                      (R$ 3.000,00)
                                 ──────────────
(=) Lucro Bruto                  R$ 6.500,00
    Margem Bruta: 43,33%

(-) Despesas Operacionais       (R$ 2.000,00)
  Aluguel                       (R$ 1.000,00)
  Energia                       (R$ 500,00)
  Outras                        (R$ 500,00)
                                 ──────────────
(=) Lucro Líquido               R$ 4.500,00
    Margem Líquida: 30,00%
```

---

## 🎯 Ordem de Execução Recomendada

### **Semana 1: Fundações**
- [ ] Implementar `useMovimentacaoEstoque.js`
- [ ] Implementar `useTransacoesV2.js`
- [ ] Testar integração básica
- [ ] Validar COGS em vendas simples

### **Semana 2: Dashboard**
- [ ] Atualizar DashboardFinanceiroView.vue com COGS
- [ ] Incluir movimentação automática de estoque
- [ ] Testar com dados reais

### **Semana 3: Períodos**
- [ ] Implementar `usePeriodosContabeis.js`
- [ ] Criar tela de fechamento
- [ ] Gerar DRE automático

### **Semana 4: Relatórios**
- [ ] Criar RelatorioFinanceiroView.vue
- [ ] Exportação para PDF
- [ ] Análises avançadas

---

## 📊 Checklist de Implementação

### Frontend (Vue)
- [ ] Atualizar form de produtos com campo "Custo"
- [ ] Atualizar form de venda para capturar custos
- [ ] Novo dashboard com Lucro Bruto + Líquido
- [ ] Tela de movimentação de estoque
- [ ] Tela de fechamento mensal
- [ ] Tela de relatório DRE

### Backend (Firebase)
- [ ] Coleção `movimentacoes_estoque` criada
- [ ] Coleção `periodos_contabeis` criada
- [ ] Rules de segurança atualizadas
- [ ] Índices Firestore criados (se necessário)

### Testes
- [ ] Testar venda simples com COGS
- [ ] Testar movimento de estoque
- [ ] Testar fechamento de período
- [ ] Testar DRE gerado
- [ ] Validar cálculos contábeis

---

## 💡 Exemplos de Uso

### Registrar Venda com COGS
```javascript
import { useTransacoesV2 } from '@/composables/useTransacoesV2'

const { registrarVenda } = useTransacoesV2(storeId)

await registrarVenda({
  descricao: 'PC Custom para João',
  valor: 1200,
  produtos: [
    {
      produtoId: 'proc-123',
      quantidade: 1,
      preco_unitario: 500,
      custo_unitario: 350    // ✅ Novo
    }
  ]
})

// Resultado:
// - valor_cogs: 350
// - margem_bruta: 850
// - Estoque atualizado
```

### Fechar Período
```javascript
import { usePeriodosContabeis } from '@/composables/usePeriodosContabeis'

const { fecharPeriodo } = usePeriodosContabeis(storeId)

await fecharPeriodo(11, 2024)  // Novembro 2024

// Resultado:
// - Período 11/2024 fechado
// - Dados consolidados
// - DRE gerado
// - Dados imutáveis
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

## 🚨 Pontos Críticos a Verificar

1. **Validação de Custo**
   - Custo não pode ser negativo
   - Custo não pode ser maior que preço de venda
   - Custo deve ser obrigatório em vendas

2. **Integridade de Estoque**
   - Saldo não pode ficar negativo
   - Movimentação deve ser registrada ANTES de atualizar quantidade
   - Histórico deve ser imutável

3. **Segurança de Período Fechado**
   - Período fechado não pode ser alterado
   - Transações de período fechado não podem ser deletadas
   - Apenas reabrir com motivo auditado

4. **Cálculos Contábeis**
   - Lucro Bruto = Receita - COGS (sempre)
   - Lucro Líquido = Lucro Bruto - Despesas (sempre)
   - Percentuais corretos com 2 casas decimais

---

## 📞 Suporte e Dúvidas

Se tiver dúvidas durante implementação:
1. Verificar exemplo em MELHORIAS_DASHBOARD_FINANCEIRO.md
2. Verificar comentários nos composables
3. Testar com dados fictícios antes de dados reais

**Próximos passos?** Quer que comece a implementar?

# 💰 Arquitetura do Módulo Financeiro - TechVerse

## Estrutura Proposta

### 1. **Coleções Firestore**

```
stores/{storeId}/
├── produtos/
│   ├── {produtoId}
│   │   ├── nome: string
│   │   ├── sku: string
│   │   ├── custo: number (preço de custo)
│   │   ├── preco_venda: number
│   │   ├── categoria: string
│   │   ├── estoque: number
│   │   ├── margem_lucro: number (calculado: (preco_venda - custo) / preco_venda * 100)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── transacoes_financeiras/
│   ├── {transacaoId}
│   │   ├── tipo: "venda" | "despesa" | "entrada" (enum)
│   │   ├── descricao: string
│   │   ├── valor: number
│   │   ├── categoria: string (ex: "hardware", "serviço", "operacional")
│   │   ├── produtos: [
│   │   │   {
│   │   │     produtoId: string,
│   │   │     quantidade: number,
│   │   │     preco_unitario: number,
│   │   │     subtotal: number
│   │   │   }
│   │   │ ]
│   │   ├── cliente_id: string (referência)
│   │   ├── ordem_servico_id: string (referência opcional)
│   │   ├── status: "pendente" | "concluida" | "cancelada"
│   │   ├── data_transacao: timestamp
│   │   ├── data_pagamento: timestamp (opcional)
│   │   ├── metodo_pagamento: string ("dinheiro", "pix", "cartao", "cheque")
│   │   └── createdAt: timestamp
│
├── relatorios_financeiros/
│   ├── {relatorioId}
│   │   ├── periodo: "diario" | "semanal" | "mensal" | "anual"
│   │   ├── data_inicio: timestamp
│   │   ├── data_fim: timestamp
│   │   ├── receita_total: number
│   │   ├── despesa_total: number
│   │   ├── lucro_liquido: number
│   │   ├── margem_lucro_media: number
│   │   ├── transacoes_count: number
│   │   ├── produtos_vendidos: number
│   │   ├── gerado_em: timestamp
│   │   └── dados_agrupados: {
│   │       "categoria": {
│   │         receita: number,
│   │         despesa: number,
│   │         lucro: number
│   │       }
│   │     }
│
└── caixa/
    ├── {caixaId}
    │   ├── data: timestamp
    │   ├── abertura_saldo: number
    │   ├── entradas: number
    │   ├── saidas: number
    │   ├── encerramento_saldo: number
    │   ├── status: "aberto" | "fechado"
    │   └── transacoes: [transacaoId]
```

## 2. **Módulos Vue a Criar**

### A. `src/views/financeiro/`
```
financeiro/
├── DashboardFinanceiroView.vue (visão geral)
├── GerenciamentoProdutosView.vue (CRUD de produtos)
├── RegistroTransacoesView.vue (registrar vendas/despesas)
├── RelatorioFinanceiroView.vue (relatórios mensais/anuais)
├── CaixaView.vue (controle de caixa)
├── AnaliseMargemView.vue (análise de margem de lucro)
└── ExportacaoFinanceiraView.vue (exportar dados)
```

### B. `src/composables/`
```
useFinanceiro.js
├── loadProdutos()
├── addProduto()
├── updateProduto()
├── deleteProduto()
├── calcularMargemLucro()
└── validarProduto()

useTransacoes.js
├── registrarVenda()
├── registrarDespesa()
├── listarTransacoes()
├── filtrarPorPeriodo()
└── calcularTotais()

useRelatorios.js
├── gerarRelatorioMensal()
├── gerarRelatorioAnual()
├── calcularLucroLiquido()
├── agruparPorCategoria()
└── exportarPDF()
```

## 3. **Forma Mais Eficiente**

### ✅ Fluxo Recomendado:

**Opção A: Integrado com Ordens de Serviço (Recomendado)**
```
1. Cliente faz pedido → cria Ordem de Serviço
2. Ordem de Serviço inclui produtos/serviços com preços
3. Ao finalizar a OS → registra automaticamente como Transação
4. Sistema calcula automaticamente lucro/despesa
```

**Opção B: Separado (Mais Flexível)**
```
1. Cadastra Produtos com custo e preço de venda
2. Registra Transações manualmente (vendas/despesas)
3. Gera Relatórios automaticamente
4. Controla Caixa diário
```

**Recomendação:** Usar Opção A (integrado) + Opção B (flexibilidade)

## 4. **Implementação Passo a Passo**

### Fase 1: Base (Essencial)
- [ ] CRUD de Produtos com custo
- [ ] Registro simples de Transações (venda/despesa)
- [ ] Dashboard com totais básicos

### Fase 2: Análises
- [ ] Relatórios mensais
- [ ] Gráficos de receita/despesa
- [ ] Margem de lucro por produto

### Fase 3: Controle
- [ ] Controle de caixa
- [ ] Métodos de pagamento
- [ ] Histórico e rastreabilidade

### Fase 4: Exportação
- [ ] Exportar PDF/Excel
- [ ] Integração contábil
- [ ] Backup automático

## 5. **Exemplo de Estrutura de Transação**

```javascript
{
  tipo: "venda",
  descricao: "Venda de kit custom para João Silva",
  valor: 850.00,
  categoria: "hardware",
  produtos: [
    {
      produtoId: "proc-intel-i5",
      quantidade: 1,
      preco_unitario: 400.00,
      subtotal: 400.00
    },
    {
      produtoId: "ssd-samsung",
      quantidade: 1,
      preco_unitario: 350.00,
      subtotal: 350.00
    }
  ],
  cliente_id: "cliente-123",
  ordem_servico_id: "os-456",
  status: "concluida",
  data_transacao: Timestamp.now(),
  metodo_pagamento: "pix",
  createdAt: Timestamp.now()
}
```

## 6. **Métricas Principais**

```
Dashboard mostrará:
- Receita Total (período selecionado)
- Despesa Total
- Lucro Líquido
- Margem Média
- Top 5 Produtos Vendidos
- Categorias com melhor margem
- Gráfico de receita vs despesa
- Caixa atual
```

## 7. **Firestore Rules para Segurança**

```javascript
// Apenas o owner pode ver/editar dados financeiros
match /stores/{storeId}/financeiro/{document=**} {
  allow read, write: if request.auth.uid == resource.data.userId
}
```

## 🎯 Próximos Passos
1. Confirmar estrutura (ajustar conforme necessário)
2. Criar composables para operações
3. Implementar views passo a passo
4. Adicionar ao router
5. Testes com dados reais

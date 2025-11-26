# 📦 Migração de Dados para Nova Estrutura Financeira

## 📋 Objetivo
Migrar dados existentes para a nova estrutura contábil sem perder informações.

---

## 🔍 Diagnóstico Atual

### Antes de começar, verifique:

```javascript
// 1. Verificar se produtos têm campo "custo"
db.collection('stores').doc(storeId).collection('itens').doc()
// Esperado: { custo: 350.00, ... }

// 2. Verificar estrutura de transações
db.collection('stores').doc(storeId).collection('transacoes_financeiras').doc()
// Esperado: { tipo: 'venda', valor: 1200, ... }
// Problema: Não tem "valor_cogs", "custo_unitario", etc.

// 3. Verificar coleção de movimentacoes
// Problema: Provavelmente não existe ainda
```

---

## ✅ Passo 1: Preparar Produtos com Custo

### Script de Verificação (Firestore Console)
```javascript
// Executar no Firestore Console
db.collection("stores").get().then(stores => {
  stores.forEach(storeDoc => {
    const storeId = storeDoc.id;
    db.collection("stores").doc(storeId).collection("itens").get()
      .then(items => {
        let semCusto = 0;
        items.forEach(itemDoc => {
          const data = itemDoc.data();
          if (!data.custo && !data.precoCusto) {
            semCusto++;
            console.log(`Produto sem custo: ${data.nome}`);
          }
        });
        if (semCusto > 0) {
          console.log(`⚠️ Store ${storeId}: ${semCusto} produtos sem custo`);
        }
      });
  });
});
```

### Se Produtos Não Tivem Custo

**Opção A: Buscar custo do fornecedor (Recomendado)**
```
1. Acesse os dados originais do AliExpress/fornecedor
2. Para cada produto, encontre o custo original
3. Atualize manualmente ou via script
```

**Opção B: Estimar custo (Último recurso)**
```javascript
// Se conhecer margem média (ex: 40%)
// custo = preco_venda / (1 + margem)
// Ex: preco_venda = 100, margem = 40%
// custo = 100 / 1.4 = 71.43

// NUNCA use isso se tiver dados reais!
```

### Script Para Adicionar Custo (via Node.js)
```javascript
// run-migration.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const db = getFirestore();

async function adicionarCustoAosProdutos() {
  const stores = await getDocs(collection(db, 'stores'));
  
  for (const storeDoc of stores.docs) {
    const storeId = storeDoc.id;
    const itensRef = collection(db, 'stores', storeId, 'itens');
    const items = await getDocs(itensRef);
    
    console.log(`\n📦 Store: ${storeId}`);
    
    for (const itemDoc of items.docs) {
      const data = itemDoc.data();
      const precoVenda = data.precoVenda || data.preco_venda || 0;
      
      // Se não tem custo, skip (manual)
      if (!data.custo && !data.precoCusto) {
        console.log(`⚠️ ${data.nome} - FALTA CUSTO (adicionar manualmente)`);
        continue;
      }
      
      // Se já tem custo, marcar como verificado
      const custo = data.custo || data.precoCusto;
      const margem = ((precoVenda - custo) / precoVenda * 100).toFixed(2);
      
      await updateDoc(doc(db, 'stores', storeId, 'itens', itemDoc.id), {
        custo: custo,
        custo_verificado: true,
        margem_calculada: parseFloat(margem)
      });
      
      console.log(`✅ ${data.nome} - Custo R$ ${custo}, Margem ${margem}%`);
    }
  }
}

await adicionarCustoAosProdutos();
```

---

## ✅ Passo 2: Criar Coleção de Movimentações

### Script Para Criar Movimentações (Retroativa)
```javascript
// retroativo-movimentacoes.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const db = getFirestore();

async function criarMovimentacoesDeProdutos() {
  const stores = await getDocs(collection(db, 'stores'));
  
  for (const storeDoc of stores.docs) {
    const storeId = storeDoc.id;
    
    // Para cada produto, criar movimentação de entrada inicial
    const itensRef = collection(db, 'stores', storeId, 'itens');
    const items = await getDocs(itensRef);
    
    console.log(`\n📦 Store: ${storeId} - Criando movimentações iniciais`);
    
    for (const itemDoc of items.docs) {
      const data = itemDoc.data();
      const quantidadeAtual = data.quantidade || data.estoque || 0;
      const custo = data.custo || data.precoCusto || 0;
      
      if (quantidadeAtual === 0) continue;
      
      // Criar movimentação de entrada para estoque atual
      const movRef = collection(db, 'stores', storeId, 'movimentacoes_estoque');
      
      await addDoc(movRef, {
        tipo: 'entrada',
        referencia_tipo: 'saldo_inicial',
        referencia_id: itemDoc.id,
        descricao: `Saldo inicial de ${data.nome}`,
        produtos: [{
          produtoId: itemDoc.id,
          nome: data.nome,
          quantidade: quantidadeAtual,
          custo_unitario: custo,
          valor_total: parseFloat((custo * quantidadeAtual).toFixed(2))
        }],
        valor_total_entrada: parseFloat((custo * quantidadeAtual).toFixed(2)),
        data_movimento: data.createdAt || Timestamp.now(),
        createdAt: Timestamp.now()
      });
      
      console.log(`✅ Entrada: ${data.nome} (${quantidadeAtual} un, R$ ${custo})`);
    }
  }
}

await criarMovimentacoesDeProdutos();
```

---

## ✅ Passo 3: Migrar Transações Existentes

### Script Para Adicionar COGS às Transações
```javascript
// migrar-transacoes-cogs.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const db = getFirestore();

async function adicionarCogsAsTransacoes() {
  const stores = await getDocs(collection(db, 'stores'));
  
  for (const storeDoc of stores.docs) {
    const storeId = storeDoc.id;
    const transacoesRef = collection(db, 'stores', storeId, 'transacoes_financeiras');
    const transacoes = await getDocs(transacoesRef);
    
    console.log(`\n💰 Store: ${storeId} - Migrando transações`);
    
    for (const transacaoDoc of transacoes.docs) {
      const data = transacaoDoc.data();
      
      // Pular se não é venda
      if (data.tipo !== 'venda') continue;
      
      // Se já tem COGS, pular
      if (data.valor_cogs !== undefined) {
        console.log(`⏭️ ${data.descricao} - Já migrada`);
        continue;
      }
      
      // Calcular COGS a partir dos produtos
      let cogsTotal = 0;
      const produtosComCusto = (data.produtos || []).map(p => {
        const custTotal = (p.custo_unitario || 0) * (p.quantidade || 1);
        cogsTotal += custTotal;
        return {
          ...p,
          custo_unitario: p.custo_unitario || 0,
          custo_total: parseFloat(custTotal.toFixed(2))
        };
      });
      
      const valorVenda = data.valor || 0;
      const margemBruta = valorVenda - cogsTotal;
      const percentualMargem = valorVenda > 0 
        ? ((margemBruta / valorVenda) * 100).toFixed(2)
        : 0;
      
      // Atualizar transação
      await updateDoc(doc(db, 'stores', storeId, 'transacoes_financeiras', transacaoDoc.id), {
        valor_venda: parseFloat(valorVenda.toFixed(2)),
        valor_cogs: parseFloat(cogsTotal.toFixed(2)),
        margem_bruta: parseFloat(margemBruta.toFixed(2)),
        percentual_margem_bruta: parseFloat(percentualMargem),
        produtos: produtosComCusto,
        migrado_v2: true,
        data_migracao: new Date()
      });
      
      console.log(`✅ ${data.descricao} - COGS R$ ${cogsTotal.toFixed(2)}`);
    }
  }
}

await adicionarCogsAsTransacoes();
```

---

## ✅ Passo 4: Criar Estrutura de Períodos

### Script Para Gerar Períodos Fechados do Histórico
```javascript
// gerar-periodos-historico.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';

const db = getFirestore();

async function gerarPeriodosDoHistorico() {
  const stores = await getDocs(collection(db, 'stores'));
  
  for (const storeDoc of stores.docs) {
    const storeId = storeDoc.id;
    console.log(`\n📅 Store: ${storeId} - Gerando períodos históricos`);
    
    // Buscar transações existentes
    const transacoesRef = collection(db, 'stores', storeId, 'transacoes_financeiras');
    const transacoes = await getDocs(transacoesRef);
    
    // Agrupar por mês/ano
    const periodosPorMes = {};
    
    transacoes.forEach(docSnap => {
      const data = docSnap.data();
      const dataTransacao = data.data_transacao?.toDate?.() || new Date(data.data_transacao);
      const mes = dataTransacao.getMonth() + 1;
      const ano = dataTransacao.getFullYear();
      const chave = `${ano}-${mes}`;
      
      if (!periodosPorMes[chave]) {
        periodosPorMes[chave] = {
          mes,
          ano,
          transacoes: []
        };
      }
      
      periodosPorMes[chave].transacoes.push(data);
    });
    
    // Criar período para cada mês
    const periodosRef = collection(db, 'stores', storeId, 'periodos_contabeis');
    
    for (const [chave, periodo] of Object.entries(periodosPorMes)) {
      // Calcular totais
      let receita = 0, cogs = 0, despesa = 0;
      const porCategoria = {};
      
      periodo.transacoes.forEach(t => {
        const cat = t.categoria || 'Sem categoria';
        
        if (!porCategoria[cat]) {
          porCategoria[cat] = { receita: 0, cogs: 0, despesa: 0, transacoes: 0 };
        }
        
        if (t.tipo === 'venda') {
          receita += t.valor_venda || t.valor || 0;
          cogs += t.valor_cogs || 0;
          porCategoria[cat].receita += t.valor_venda || t.valor || 0;
          porCategoria[cat].cogs += t.valor_cogs || 0;
        } else if (t.tipo === 'despesa') {
          despesa += t.valor || 0;
          porCategoria[cat].despesa += t.valor || 0;
        }
        
        porCategoria[cat].transacoes += 1;
      });
      
      const margemBruta = receita - cogs;
      const lucroLiquido = margemBruta - despesa;
      const percentualMargemBruta = receita > 0 ? ((margemBruta / receita) * 100).toFixed(2) : 0;
      const percentualMargemLiquida = receita > 0 ? ((lucroLiquido / receita) * 100).toFixed(2) : 0;
      
      // Salvar período
      await addDoc(periodosRef, {
        mes: periodo.mes,
        ano: periodo.ano,
        data_inicio: Timestamp.fromDate(new Date(periodo.ano, periodo.mes - 1, 1)),
        data_fim: Timestamp.fromDate(new Date(periodo.ano, periodo.mes, 0)),
        status: 'fechado',
        receita_total: receita,
        cogs_total: cogs,
        lucro_bruto: margemBruta,
        percentual_margem_bruta: parseFloat(percentualMargemBruta),
        despesa_total: despesa,
        lucro_liquido: lucroLiquido,
        percentual_margem_liquida: parseFloat(percentualMargemLiquida),
        receita_por_categoria: porCategoria,
        despesa_por_categoria: porCategoria,
        quantidade_vendas: periodo.transacoes.filter(t => t.tipo === 'venda').length,
        quantidade_despesas: periodo.transacoes.filter(t => t.tipo === 'despesa').length,
        quantidade_transacoes: periodo.transacoes.length,
        fechado_em: Timestamp.now(),
        notas: `Período ${periodo.mes}/${periodo.ano} gerado retroativamente`
      });
      
      console.log(`✅ Período ${periodo.mes}/${periodo.ano} - Lucro R$ ${lucroLiquido.toFixed(2)}`);
    }
  }
}

await gerarPeriodosDoHistorico();
```

---

## 🚀 Ordem de Execução

### 1️⃣ **Preparação** (30 min)
- [ ] Verificar quantidade de produtos sem custo
- [ ] Coletar custos dos fornecedores
- [ ] Fazer backup completo do Firestore

### 2️⃣ **Migração de Produtos** (1-2 horas)
- [ ] Executar script de adição de custo
- [ ] Validar todos os produtos têm custo > 0
- [ ] Verificar que custo < preço_venda

### 3️⃣ **Criar Estrutura** (30 min)
- [ ] Criar coleção `movimentacoes_estoque`
- [ ] Executar script de movimentações iniciais
- [ ] Verificar estoque está correto

### 4️⃣ **Migrar Transações** (1 hora)
- [ ] Executar script de COGS nas vendas
- [ ] Validar cálculos COGS
- [ ] Verificar dados antes/depois

### 5️⃣ **Gerar Histórico** (30 min)
- [ ] Executar script de períodos históricos
- [ ] Validar DRE dos períodos
- [ ] Comparar com registros anteriores

### 6️⃣ **Teste e Validação** (2-3 horas)
- [ ] Testar dashboard novo
- [ ] Comparar lucro novo vs antigo
- [ ] Explicar diferenças se houver

---

## ⚠️ Verificações Críticas

### Após Executar Scripts

```javascript
// 1. Verificar quantidade de produtos
db.collection('stores').doc(storeId).collection('itens').doc()
// Deve ter 100% com "custo" preenchido

// 2. Verificar transações migraram
db.collection('stores').doc(storeId).collection('transacoes_financeiras').where('tipo', '==', 'venda').doc()
// Deve ter "valor_cogs" preenchido

// 3. Verificar movimentações foram criadas
db.collection('stores').doc(storeId).collection('movimentacoes_estoque').get()
// Deve ter registros de entrada

// 4. Verificar períodos foram gerados
db.collection('stores').doc(storeId).collection('periodos_contabeis').get()
// Deve ter registros de períodos históricos
```

---

## 🔄 Rollback se Necessário

Se algo der errado:

### Opção 1: Restaurar do Backup
```bash
# Se tiver backup do Firestore
gcloud firestore import gs://seu-bucket/backup/
```

### Opção 2: Reverter Manualmente
```javascript
// Remover campos adicionados
db.collection('stores').doc(storeId)
  .collection('transacoes_financeiras')
  .doc(docId)
  .update({
    valor_cogs: firebase.firestore.FieldValue.delete(),
    margem_bruta: firebase.firestore.FieldValue.delete(),
    // etc...
  })
```

---

## 📊 Validação Pós-Migração

### Dashboard Antigo vs Novo
```
Antigo:
- Receita: R$ 15.000
- Despesa: R$ 2.000
- Lucro: R$ 13.000 ❌ (sem contar COGS)

Novo:
- Receita: R$ 15.000
- COGS: R$ 8.500
- Lucro Bruto: R$ 6.500
- Despesa: R$ 2.000
- Lucro Líquido: R$ 4.500 ✅ (CORRETO)
```

**Diferença esperada:** R$ 4.500 (lucro real)

---

## 📞 Suporte

Se encontrar erro durante migração:

1. **Parar tudo**
2. **Fazer backup**
3. **Verificar logs**
4. **Ajustar script**
5. **Testar em cópia primeiro**
6. **Executar novamente**

Quais dados você tem atualmente?

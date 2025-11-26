# 🔄 Script de Migração de Dados - Multi-Tenant

## ⚠️ IMPORTANTE - Leia Antes de Executar

Se você já tem dados no Firestore usando a estrutura antiga (coleções globais), 
use este script para migrar para a nova estrutura multi-tenant.

**ATENÇÃO:** Faça backup do seu banco de dados antes de executar!

---

## 📋 Opção 1: Migração Manual (Recomendado para Testes)

### Passo 1: Limpar dados antigos (se estiver testando)

No Console do Firebase:
1. Acesse Firestore Database
2. Delete as coleções antigas manualmente:
   - `clientes`
   - `ordens_servico`
   - `items` ou `itens`
   - `catalogo_servicos`

### Passo 2: Cadastrar novamente

Após limpar, faça login e cadastre novos dados.
Eles serão criados automaticamente na estrutura correta: `stores/{userId}/...`

---

## 📋 Opção 2: Script de Migração Automática

### Criar arquivo de migração:

Crie `migrate.js` na raiz do projeto:

```javascript
// migrate.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc 
} from 'firebase/firestore';

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID do usuário para quem migrar os dados
// IMPORTANTE: Este deve ser o UID de um usuário existente no Firebase Auth
const TARGET_USER_ID = 'SEU_USER_ID_AQUI';

async function migrateCollection(oldName, newName) {
  console.log(`\n🔄 Migrando ${oldName} → stores/${TARGET_USER_ID}/${newName}`);
  
  try {
    const oldCol = collection(db, oldName);
    const snapshot = await getDocs(oldCol);
    
    console.log(`   Encontrados ${snapshot.size} documentos`);
    
    let migrated = 0;
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const newDocRef = doc(db, 'stores', TARGET_USER_ID, newName, docSnap.id);
      
      await setDoc(newDocRef, data);
      migrated++;
      console.log(`   ✓ Migrado ${migrated}/${snapshot.size}`);
    }
    
    console.log(`   ✅ ${oldName} migrado com sucesso!`);
  } catch (error) {
    console.error(`   ❌ Erro ao migrar ${oldName}:`, error);
  }
}

async function migrate() {
  console.log('🚀 Iniciando migração multi-tenant...');
  console.log(`📦 Destino: stores/${TARGET_USER_ID}/`);
  console.log('');
  
  // Migrar cada coleção
  await migrateCollection('clientes', 'clientes');
  await migrateCollection('ordens_servico', 'ordens_servico');
  await migrateCollection('itens', 'items');
  await migrateCollection('items', 'items');
  await migrateCollection('catalogo_servicos', 'catalogo_servicos');
  await migrateCollection('kits', 'kits');
  
  console.log('\n✅ Migração concluída!');
  console.log('');
  console.log('📝 Próximos passos:');
  console.log('1. Verifique os dados em stores/${TARGET_USER_ID}/');
  console.log('2. Faça login com o usuário correspondente');
  console.log('3. Confirme que tudo está funcionando');
  console.log('4. Delete as coleções antigas (CUIDADO!)');
}

migrate().catch(console.error);
```

### Como executar:

```bash
# 1. Instalar dependências
npm install firebase

# 2. Obter o USER_ID
# Faça login na aplicação e no console do navegador digite:
# auth.currentUser.uid

# 3. Editar o script e colocar suas credenciais e USER_ID

# 4. Executar migração
node migrate.js
```

---

## 📋 Opção 3: Firebase CLI + Scripts

### Exportar dados antigos:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Exportar dados
firebase firestore:export backup-$(date +%Y%m%d)
```

### Importar na nova estrutura:

Após exportar, você precisará editar o JSON exportado para adicionar 
o prefixo `stores/{userId}/` em todos os paths.

---

## ✅ Validação Pós-Migração

### Checklist:

- [ ] Fazer login com o usuário
- [ ] Verificar se clientes aparecem na lista
- [ ] Verificar se ordens de serviço aparecem
- [ ] Tentar criar nova ordem de serviço
- [ ] Verificar se catálogo está carregando
- [ ] Testar edição de cliente
- [ ] Confirmar isolamento (criar outro usuário e verificar que não vê dados)

---

## 🆘 Troubleshooting

### "Permission denied" ao acessar dados

**Causa:** Security Rules não deployadas  
**Solução:** Deploy das rules do arquivo `firestore.rules`

```bash
firebase deploy --only firestore:rules
```

### "storeId is null"

**Causa:** Usuário não autenticado  
**Solução:** Fazer logout e login novamente

### Dados não aparecem

**Causa:** Dados ainda estão na estrutura antiga  
**Solução:** Executar script de migração ou recadastrar

---

## 🗑️ Limpeza (Apenas após confirmar migração)

### Deletar coleções antigas:

**⚠️ ATENÇÃO: Irreversível! Confirme backup antes!**

```javascript
// delete-old.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// ... seu firebaseConfig ...

async function deleteCollection(name) {
  console.log(`🗑️ Deletando ${name}...`);
  const col = collection(db, name);
  const snapshot = await getDocs(col);
  
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, name, docSnap.id));
  }
  
  console.log(`✓ ${name} deletada`);
}

async function cleanup() {
  const confirm = prompt('Digite "DELETAR" para confirmar: ');
  if (confirm !== 'DELETAR') {
    console.log('Cancelado');
    return;
  }
  
  await deleteCollection('clientes');
  await deleteCollection('ordens_servico');
  await deleteCollection('items');
  await deleteCollection('itens');
  await deleteCollection('catalogo_servicos');
  
  console.log('✅ Limpeza concluída!');
}

cleanup();
```

---

## 📞 Suporte

Problemas na migração? Verifique:
1. Logs do console (F12)
2. Console do Firebase → Firestore → Dados
3. Console do Firebase → Authentication → Users

---

**Criado por:** Hugo, BLK Studio  
**Data:** 2025

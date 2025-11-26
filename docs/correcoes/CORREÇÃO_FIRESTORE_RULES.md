# Correção: Regras do Firestore para Leitura do Inventário

## Problema

O inventário não estava sendo listado, mesmo no KitBuilder funcionando. O problema estava nas regras do Firestore Security Rules.

## Causa Raiz

### Regra Anterior (Problemática)
```
match /stores/{storeId}/{collection}/{document=**} {
  allow read, write: if request.auth != null 
                     && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.storeId == storeId;
}
```

### Por que não funcionava?

1. **Falta de permissão no nível pai**: Firestore requer permissão em TODOS os níveis da hierarquia. Mesmo que você tenha permissão para ler `/stores/{storeId}/itens/{itemId}`, você precisa de permissão para ler `/stores/{storeId}` também.

2. **Ordem das regras**: Regras mais específicas precisam vir ANTES de regras mais genéricas. A regra anterior tinha apenas uma pattern, o que pode causar conflitos.

3. **Falta de estrutura hierárquica**: A regra original "achatava" toda a estrutura em uma única regra, sem considerar a hierarquia aninhada.

## Solução Implementada

### Nova Estrutura (Corrigida)
```
function userOwnsStore(storeId) {
  return request.auth != null 
         && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.storeId == storeId;
}

match /stores/{storeId} {
  allow read: if userOwnsStore(storeId);
  allow write: if false; // Loja é criada apenas via backend/admin
  
  // Coleções dentro da loja
  match /{collection}/{document=**} {
    allow read, write: if userOwnsStore(storeId);
  }
}
```

### Melhorias

1. **Helper Function**: `userOwnsStore()` centraliza a lógica de validação
   - DRY (Don't Repeat Yourself)
   - Fácil de manter
   - Reutilizável

2. **Permissão Hierárquica Correta**:
   - Nível `/stores/{storeId}`: permissão de leitura
   - Nível `/stores/{storeId}/{collection}/{document}`: permissão completa
   - Garante que todas as subcoleções são acessíveis

3. **Segurança**: 
   - Write bloqueado no nível `stores`
   - Apenas leitura de lojas é permitida
   - Subcoleções (itens, kits, etc) com full access controlado

4. **Suporte a Múltiplas Coleções**:
   - `stores/{storeId}/itens/{itemId}` ✅
   - `stores/{storeId}/kits/{kitId}` ✅
   - `stores/{storeId}/clientes/{clienteId}` ✅
   - Qualquer `{collection}` ✅

## Fluxo de Autorização

Quando você chama `getDocs(collection(db, 'stores', storeId, 'itens'))`:

1. Firebase valida: `/stores/{storeId}/itens`
2. Primeira match: `match /stores/{storeId}` → valida `userOwnsStore(storeId)`
3. Segunda match: `match /{collection}/{document=**}` → valida `userOwnsStore(storeId)`
4. Se ambas passam: ✅ Acesso permitido
5. Se falha em qualquer uma: ❌ Acesso negado

## Arquivos Modificados

- `firestore.rules`

## Como Aplicar as Mudanças

1. Abrir [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Firestore Database** → **Rules**
4. Copie o conteúdo do arquivo `firestore.rules` atualizado
5. Clique **Publish**
6. Espere a confirmação ✅

## Como Testar

1. Abrir DevTools (F12)
2. Ir para **Inventário**
3. Verificar Console:
   - `🎯 InventarioListView - StoreId pronto: [ID]`
   - `✅ Itens encontrados: X`
   - `📦 Inventário carregado: X itens`

4. Se houver erro de permissão:
   - Erro aparecerá como: `"Missing or insufficient permissions"`
   - Isso significa que as rules ainda não foram publicadas ou há outro problema

## Checklist de Debug

- [ ] Rules foram publicadas no Firebase Console?
- [ ] Esperou a publicação completar (verde ✅)?
- [ ] Fez refresh da página (F5)?
- [ ] Está logado com um usuário que tem `storeId`?
- [ ] Console mostra o `storeId`?
- [ ] Há itens reais na coleção `stores/{storeId}/itens`?

## Estrutura Esperada no Firestore

```
/
├── users/
│   └── {uid}/
│       └── storeId: "store-abc-123"
│
└── stores/
    └── {storeId}/
        ├── itens/
        │   ├── {itemId}: { nome, tipo, quantidade, ... }
        │   └── {itemId}: { ... }
        │
        ├── kits/
        │   └── {kitId}: { ... }
        │
        └── clientes/
            └── {clienteId}: { ... }
```

## Próximas Melhorias Sugeridas

1. **Adicionar subcoleções específicas** (se necessário):
```
match /stores/{storeId}/itens/{itemId} {
  allow read, write: if userOwnsStore(storeId);
}
```

2. **Permitir criação de lojas** (para fluxo de sign-up):
```
match /stores/{storeId} {
  allow create: if request.auth != null 
                && storeId == request.auth.uid; // Cada usuário cria sua loja
}
```

3. **Adicionar suporte a compartilhamento** (múltiplos usuários por loja):
```
function isStoreUser(storeId) {
  return request.auth != null 
         && request.auth.uid in 
            get(/databases/$(database)/documents/stores/$(storeId)).data.users;
}
```


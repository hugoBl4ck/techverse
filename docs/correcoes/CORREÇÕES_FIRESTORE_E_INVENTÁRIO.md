# Correções - Firestore Rules e Botão de Deletar Inventário

## 1. Correção das Regras do Firestore

**Arquivo**: `firestore.rules`

### Problema
A regra original comparava `request.auth.uid == storeId`, mas o `storeId` é um ID aleatório armazenado no documento do usuário, não o UID do usuário. Isso causava acesso negado ao inventário.

### Solução
Alterado para buscar o `storeId` do documento do usuário e compará-lo com o `storeId` do path:

```
match /stores/{storeId}/{collection}/{document=**} {
  // Permitir acesso apenas se o storeId do path corresponder ao storeId armazenado no documento do usuário
  allow read, write: if request.auth != null 
                     && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.storeId == storeId;
}
```

**Como funciona:**
1. Verifica se o usuário está autenticado
2. Busca o documento `/users/{uid}` do usuário
3. Compara o `storeId` armazenado nesse documento com o `storeId` do path
4. Só permite acesso se forem iguais

**Resultado**: KitBuilder agora consegue carregar itens do inventário

---

## 2. Adição de Botão para Deletar Itens do Inventário

**Arquivo**: `src/views/inventario/InventarioListView.vue`

### Mudanças Implementadas

#### Imports Adicionados:
- `deleteDoc` do Firebase
- `toast` do vue-sonner
- `Trash2` icon do lucide-vue-next

#### Nova Função: `deleteItem(itemId, itemName)`
```javascript
async function deleteItem(itemId, itemName) {
  // 1. Confirmação com dialog nativo
  const confirmDelete = window.confirm(
    `Tem certeza que deseja deletar "${itemName}"?\n\nEsta ação não pode ser desfeita.`
  );

  if (!confirmDelete) return;

  // 2. Toast de carregamento
  const toastId = toast.loading('Deletando item...');

  try {
    // 3. Deleta do Firestore
    const itemDocRef = doc(db, 'stores', storeId.value, 'itens', itemId);
    await deleteDoc(itemDocRef);
    
    // 4. Remove do array local para feedback imediato
    items.value = items.value.filter(item => item.id !== itemId);
    
    // 5. Sucesso
    toast.success('Item deletado com sucesso!', { id: toastId });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    toast.error('Erro ao deletar item: ' + error.message, { id: toastId });
  }
}
```

#### UI Changes:
- Adicionado botão vermelho (destructive) com ícone de lixeira
- Botão fica ao lado do botão "Editar"
- Tooltip ao passar o mouse mostra "Deletar item"
- Confirmação via `window.confirm` antes de deletar

### Fluxo de Uso:
1. Usuário clica no botão vermelho de lixeira
2. Aparece dialog de confirmação
3. Se confirmar, item é deletado do Firestore
4. Toast mostra status (carregando → sucesso ou erro)
5. Item é removido da tela imediatamente

---

## Como Testar:

### Testar Firestore Rules:
1. Abra https://techverseapp.vercel.app/kits/builder
2. Verifique se os itens do inventário aparecem
3. Abra o console (F12) e procure por:
   - "✅ Itens encontrados: [número]"
   - Se houver erro, aparecerá "❌ Erro ao buscar itens"

### Testar Deletar Itens:
1. Abra https://techverseapp.vercel.app/inventario
2. Localize qualquer item
3. Clique no botão vermelho de lixeira (ao lado de "Editar")
4. Confirme a deletion na janela de diálogo
5. Veja o item ser removido da tela com feedback de toast

---

## Arquivos Modificados:
- ✅ `firestore.rules`
- ✅ `src/views/inventario/InventarioListView.vue`

## Observações Importantes:

1. **Regras do Firestore**: Você precisa fazer deploy das novas rules no Firebase:
   - `firebase deploy --only firestore:rules`
   - Ou pelo console do Firebase

2. **Deletar Item**: 
   - A confirmação é via `window.confirm()` (navegador nativo)
   - Feedback é via toast (notifications)
   - O item é removido do array local para feedback imediato

3. **Se KitBuilder ainda não funcionar**:
   - Verifique se as rules foram deployadas
   - Limpe cache do navegador (Ctrl+Shift+Del)
   - Recarregue a página
   - Verifique o console para erros específicos

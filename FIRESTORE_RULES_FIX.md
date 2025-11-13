# Corrigindo Permissões do Firestore

## Problema
Você está recebendo: `FirebaseError: Missing or insufficient permissions`

## Causa
1. **Nome da coleção errado** nas regras: estava `promocoes` mas o código usa `promos`
2. **Falta de regras** para outras coleções: `noticias`, `config`, `doacoes`

## Solução

### Opção 1: Deploy via CLI (Recomendado)
```bash
# 1. Instale Firebase CLI (se não tiver)
npm install -g firebase-tools

# 2. Faça login
firebase login

# 3. Deploy das regras
firebase deploy --only firestore:rules
```

### Opção 2: Deploy Manual via Console Firebase
1. Abra https://console.firebase.google.com
2. Selecione seu projeto **TechVerse**
3. Vá para **Firestore Database** → **Regras**
4. Cole o conteúdo do arquivo `firestore.rules`
5. Clique em **Publicar**

## O que foi corrigido

### Antes (Errado ❌)
```
match /promocoes/{document=**} {
  allow read: if request.auth != null;
  allow write, delete: if isSuperAdmin();
}
```

### Depois (Correto ✓)
```
match /promos/{document=**} {
  allow read: if request.auth != null;
  allow write, delete: if isSuperAdmin();
}

match /noticias/{document=**} {
  allow read: if request.auth != null;
  allow write, delete: if isSuperAdmin();
}

match /config/{document=**} {
  allow read, write: if isSuperAdmin();
}

match /doacoes/{document=**} {
  allow create: if request.auth != null;
  allow read, write: if isSuperAdmin();
}
```

## Novo Comportamento

| Coleção | Quem Lê | Quem Escreve | Quem Deleta |
|---------|---------|-------------|-----------|
| `promos` | Qualquer usuário autenticado | Apenas Superadmin | Apenas Superadmin |
| `noticias` | Qualquer usuário autenticado | Apenas Superadmin | Apenas Superadmin |
| `config` | Apenas Superadmin | Apenas Superadmin | Apenas Superadmin |
| `doacoes` | Apenas Superadmin | Qualquer usuário autenticado (criar) | Apenas Superadmin |

## Após publicar:

1. Atualize a página do navegador
2. Tente carregar as promoções novamente
3. Se persistir o erro, verifique:
   - ✓ Está autenticado?
   - ✓ É um superadmin?
   - ✓ As regras foram publicadas?

## Verificar se as Regras foram Aplicadas

No console do Firefox/Chrome:
```javascript
// Se tiver autenticado e for superadmin, isso deve funcionar:
const promos = await getDocs(collection(db, 'promos'))
console.log(promos.docs.length) // Deve mostrar número de promoções
```

Se não funcionar, volte ao Firestore console e verifique a aba **Regras**.

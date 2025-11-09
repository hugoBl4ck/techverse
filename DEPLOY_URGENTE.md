# 🚨 DEPLOY URGENTE - Firebase Rules

## ⚠️ PROBLEMA ATUAL

Você está recebendo erro: **"Missing or insufficient permissions"**

**CAUSA:** As Firebase Security Rules não foram deployadas ainda!

---

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### **Opção 1: Firebase Console** (MAIS FÁCIL) ⭐

1. Abra: https://console.firebase.google.com

2. Selecione o projeto **techverse-55592**

3. Menu lateral → **Firestore Database**

4. Clique na aba **Regras** (Rules)

5. **DELETE TUDO** que está lá

6. **COLE EXATAMENTE ISTO:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regra global: negar tudo por padrão
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Regra para stores multi-tenant
    // Cada usuário autenticado só pode acessar sua própria "loja"
    match /stores/{storeId}/{collection}/{document=**} {
      // Permitir acesso apenas se o storeId corresponder ao uid do usuário autenticado
      allow read, write: if request.auth != null 
                         && request.auth.uid == storeId;
    }
  }
}
```

7. **Clique em "Publicar"** (botão azul no topo)

8. ✅ **PRONTO!** Recarregue sua aplicação

---

## 🧪 TESTAR SE FUNCIONOU

1. **Faça logout** da aplicação
2. **Faça login novamente** 
3. Tente cadastrar um cliente
4. Tente cadastrar um item no inventário
5. Se funcionar = Rules deployadas com sucesso! 🎉

---

## 🆘 SE AINDA DER ERRO

### Erro: "Missing or insufficient permissions"

**Checklist:**

- [ ] Fez logout e login novamente?
- [ ] Publicou as rules no Firebase Console?
- [ ] Está usando o projeto correto (techverse-55592)?
- [ ] Aguardou 10-30 segundos após publicar?

### Limpar Cache do Navegador:

1. F12 → Console
2. Clique com direito no botão **Atualizar**
3. Escolha **"Esvaziar cache e atualizar página"**

---

## 📝 O QUE AS RULES FAZEM

```
stores/{storeId}/clientes       ← Cada usuário vê só seus clientes
stores/{storeId}/items          ← Cada usuário vê só seu inventário
stores/{storeId}/ordens_servico ← Cada usuário vê só suas ordens
```

**Security:** Usuário A **NUNCA** vê dados do Usuário B!

---

## ⚡ RESUMO RÁPIDO

```
1. https://console.firebase.google.com
2. Projeto: techverse-55592
3. Firestore → Regras
4. Colar as rules acima
5. Publicar
6. Recarregar app
7. ✅ FUNCIONA!
```

---

**Tempo estimado:** 5 minutos  
**Prioridade:** CRÍTICA  
**Status atual:** SEM RULES = APP NÃO FUNCIONA

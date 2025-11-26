# 🏪 Multi-Tenant Setup - TechVerse

## ✅ Implementação Concluída

Este projeto foi configurado com **Path-Scoped Multi-Tenancy** usando Firebase Firestore.

### 🎯 O que foi implementado:

#### 1. **Composable useCurrentStore** 
- Arquivo: `src/composables/useCurrentStore.js`
- Gerencia o `storeId` (que é o `auth.uid` do usuário)
- Fornece estado de autenticação global

#### 2. **Estrutura de Dados Firestore**

```
firestore/
└── stores/
    ├── {userId1}/              ← Loja do usuário 1
    │   ├── clientes/
    │   ├── ordens_servico/
    │   ├── items/
    │   └── catalogo_servicos/
    │
    └── {userId2}/              ← Loja do usuário 2
        ├── clientes/
        ├── ordens_servico/
        ├── items/
        └── catalogo_servicos/
```

#### 3. **Componentes Atualizados**

✅ **OrdemServicoForm.vue** - Criação/edição de ordens de serviço
✅ **OrdemServicoListView.vue** - Listagem e visualização
✅ **ClienteForm.vue** - Cadastro de clientes
✅ **ServicoPredefinidoFormView.vue** - Catálogo de serviços

#### 4. **Security Rules**

Arquivo: `firestore.rules`

Garante que:
- Cada usuário só acessa seus próprios dados
- Isolamento total entre "lojas"
- Proteção contra vazamento de dados

---

## 🚀 Como Funciona

### Para Usuários:

1. **Cadastro/Login**
   - Usuário se cadastra via Firebase Auth
   - Automaticamente recebe um `storeId` (seu `uid`)

2. **Dados Isolados**
   - Todos os dados ficam em: `stores/{storeId}/...`
   - Usuário A nunca vê dados do Usuário B

3. **Experiência**
   - Cada usuário tem sua própria "loja virtual"
   - Clientes, ordens, inventário 100% separados

---

## 📝 Deploy das Security Rules

### No Firebase Console:

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto TechVerse
3. Vá em **Firestore Database** → **Regras**
4. Copie o conteúdo de `firestore.rules`
5. Cole e clique em **Publicar**

### Via Firebase CLI:

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto (se necessário)
firebase init firestore

# Deploy das rules
firebase deploy --only firestore:rules
```

---

## 🔧 Componentes que Ainda Precisam Ser Atualizados

Os seguintes componentes ainda usam a estrutura antiga (coleções globais):

### Alta Prioridade:
- [ ] `ClienteListView.vue` - Lista de clientes
- [ ] `ServicoPredefinidoListView.vue` - Lista catálogo
- [ ] `InventarioListView.vue` - Lista inventário
- [ ] `ItemFormView.vue` - Formulário de itens

### Média Prioridade:
- [ ] `KitListView.vue`
- [ ] `KitBuilderView.vue`
- [ ] `DashboardView.vue`

### Padrão de Atualização:

```javascript
// ❌ ANTES (estrutura antiga)
const col = collection(db, 'clientes');

// ✅ DEPOIS (multi-tenant)
import { useCurrentStore } from '@/composables/useCurrentStore';
const { storeId } = useCurrentStore();
const col = collection(db, 'stores', storeId.value, 'clientes');
```

---

## 🧪 Testando

### 1. Criar dois usuários diferentes:
```
Usuário A: teste1@example.com
Usuário B: teste2@example.com
```

### 2. Cadastrar dados com Usuário A:
- Criar clientes
- Criar ordens de serviço
- Adicionar items

### 3. Fazer logout e login com Usuário B:
- Verificar que a lista está vazia
- Cadastrar dados próprios

### 4. Voltar para Usuário A:
- Confirmar que os dados do Usuário A ainda existem
- Confirmar que dados do Usuário B não aparecem

---

## 🐛 Problemas Resolvidos

### ✅ Ordem de Serviço não aparecia na listagem
**Causa:** Usava coleção global `ordens_servico`  
**Solução:** Agora usa `stores/{userId}/ordens_servico`

### ✅ Formulário montava 2 vezes
**Causa:** Navegação + auth state change  
**Solução:** Guard no `onMounted` verifica `storeId` antes

### ✅ Cliente não carregava em modo edição
**Causa:** `selectedCliente` usava objeto ao invés de ID  
**Solução:** Mudado para `selectedClienteId` (string)

---

## 📊 Vantagens desta Implementação

✅ **Segurança Total** - Impossível acessar dados de outro usuário  
✅ **Escalável** - Suporta milhares de lojas  
✅ **Simples** - Regras claras e fáceis de manter  
✅ **Performance** - Índices menores por tenant  
✅ **Futuro** - Fácil adicionar colaboradores/equipes

---

## 🔮 Próximos Passos (Opcional)

### 1. Perfil da Loja
Criar `stores/{storeId}/perfil` com:
- Nome da loja
- Logo
- Configurações

### 2. Colaboradores
Adicionar subcoleção `stores/{storeId}/membros`:
- Convites por email
- Roles (owner, editor, viewer)

### 3. Estatísticas
Dashboard com métricas da loja:
- Total de clientes
- Ordens por mês
- Faturamento

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se as Security Rules foram deployadas
2. Confirme que o usuário está autenticado (`console.log(storeId.value)`)
3. Verifique o Console do Firebase para erros de permissão

---

**Implementado por:** Hugo, BLK Studio  
**Data:** 2025  
**Versão:** 1.0 - Path-Scoped Multi-Tenant

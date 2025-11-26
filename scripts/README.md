# 🛠️ Scripts Utilitários - TechVerse

Esta pasta contém scripts utilitários para manutenção, migração e setup do projeto.

## 📋 Scripts Disponíveis

### 🔧 Setup e Configuração

#### `setup-superadmin.mjs`
**Propósito:** Criar usuário superadmin no Firebase

**Uso:**
```bash
node scripts/setup-superadmin.mjs
```

**Quando usar:**
- Setup inicial do projeto
- Criar novo usuário administrador
- Recuperar acesso administrativo

---

### 📰 Gestão de Notícias

#### `create-news.js`
**Propósito:** Criar notícias no Firestore via script

**Uso:**
```bash
node scripts/create-news.js
```

**Quando usar:**
- Popular banco com notícias de exemplo
- Criar notícias em lote
- Testes de conteúdo

#### `add-news-gestao-clientes.mjs`
**Propósito:** Adicionar notícia específica sobre gestão de clientes

**Uso:**
```bash
node scripts/add-news-gestao-clientes.mjs
```

**Quando usar:**
- Adicionar artigo específico
- Exemplo de criação de notícia

---

### 🔄 Migração de Dados

#### `migrate-global-to-multitenant.mjs`
**Propósito:** Migrar dados de estrutura global para multi-tenant

**Uso:**
```bash
node scripts/migrate-global-to-multitenant.mjs
```

**⚠️ Atenção:**
- Fazer backup antes de executar
- Executar apenas uma vez
- Verificar dados após migração

#### `migrate-items-to-itens.mjs` / `migrate-items-to-itens.js`
**Propósito:** Migrar coleção "items" para "itens"

**Uso:**
```bash
node scripts/migrate-items-to-itens.mjs
```

**⚠️ Atenção:**
- Script de migração única
- Fazer backup antes
- Verificar integridade após

---

### 🗑️ Limpeza de Dados

#### `delete-old-global-items.mjs`
**Propósito:** Deletar items globais antigos (com confirmação)

**Uso:**
```bash
node scripts/delete-old-global-items.mjs
```

**Quando usar:**
- Limpar dados de teste
- Remover dados antigos após migração

#### `delete-old-global-items-force.mjs`
**Propósito:** Deletar items globais antigos (sem confirmação)

**Uso:**
```bash
node scripts/delete-old-global-items-force.mjs
```

**⚠️ Atenção:**
- Não pede confirmação
- Usar com cuidado
- Fazer backup antes

#### `delete-old-items-collection.mjs` / `delete-old-items-collection.js`
**Propósito:** Deletar coleção antiga de items

**Uso:**
```bash
node scripts/delete-old-items-collection.mjs
```

**⚠️ Atenção:**
- Operação irreversível
- Fazer backup antes

---

### 🔍 Debug e Verificação

#### `check-items-location.mjs`
**Propósito:** Verificar localização de items no Firestore

**Uso:**
```bash
node scripts/check-items-location.mjs
```

**Quando usar:**
- Verificar estrutura de dados
- Debug de problemas de localização
- Auditoria de dados

#### `debug_pix_repro.mjs`
**Propósito:** Debug do gerador de PIX QR Code

**Uso:**
```bash
node scripts/debug_pix_repro.mjs
```

**Quando usar:**
- Testar geração de PIX
- Debug de problemas com QR Code
- Validar payload PIX

---

## 🚀 Como Usar

### Pré-requisitos

Todos os scripts requerem:
- Node.js 18+
- Variáveis de ambiente configuradas (.env)
- Credenciais do Firebase

### Configuração

1. **Configure o .env:**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

2. **Instale dependências:**
   ```bash
   npm install
   ```

3. **Execute o script:**
   ```bash
   node scripts/nome-do-script.mjs
   ```

---

## ⚠️ Avisos Importantes

### Antes de Executar Scripts de Migração/Deleção:

1. **Faça Backup:**
   ```bash
   # Exporte dados do Firestore
   firebase firestore:export backup-$(date +%Y%m%d)
   ```

2. **Teste em Ambiente de Dev:**
   - Use projeto Firebase de teste
   - Verifique resultados
   - Só então execute em produção

3. **Verifique Logs:**
   - Todos os scripts logam suas ações
   - Revise logs antes de prosseguir

4. **Tenha Rollback Plan:**
   - Saiba como reverter mudanças
   - Mantenha backup acessível

---

## 📊 Histórico de Uso

### Scripts de Migração (Executar apenas uma vez)

- [ ] `migrate-global-to-multitenant.mjs` - Migração para multi-tenant
- [ ] `migrate-items-to-itens.mjs` - Renomear coleção items

### Scripts de Limpeza (Conforme necessário)

- [ ] `delete-old-global-items.mjs` - Limpar items globais
- [ ] `delete-old-items-collection.mjs` - Remover coleção antiga

### Scripts de Setup (Conforme necessário)

- [ ] `setup-superadmin.mjs` - Criar superadmin
- [ ] `create-news.js` - Popular notícias

---

## 🔧 Manutenção

### Adicionar Novo Script

1. Crie o arquivo na pasta `scripts/`
2. Adicione documentação neste README
3. Teste em ambiente de dev
4. Commit com mensagem descritiva

### Remover Script Obsoleto

1. Verifique se não é mais usado
2. Documente motivo da remoção
3. Remova do README
4. Delete o arquivo

---

## 📝 Notas

- Scripts `.mjs` usam ES Modules
- Scripts `.js` usam CommonJS
- Preferir `.mjs` para novos scripts
- Manter consistência de estilo

---

## 🆘 Suporte

Se um script não funcionar:

1. Verifique variáveis de ambiente
2. Confirme credenciais do Firebase
3. Revise logs de erro
4. Verifique versão do Node.js
5. Abra issue no GitHub se necessário

---

**Última atualização:** 26/11/2025

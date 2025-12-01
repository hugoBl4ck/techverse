# 🎁 Como Adicionar Promoções no TechVerse

## 📋 Guia Completo para Adicionar Links de Afiliados

---

## 🎯 **Método 1: Via Dashboard (Recomendado)**

### **Passo a Passo:**

1. **Acesse o Dashboard:**
   ```
   https://techverseapp.vercel.app/dashboard
   ```

2. **Faça Login** com sua conta de superadmin

3. **Navegue para a seção de Promoções** (em desenvolvimento)

---

## 🔥 **Método 2: Via Firebase Console (Atual)**

Como o painel admin ainda não está implementado, você precisa adicionar diretamente no Firestore:

### **1. Acesse o Firebase Console:**
```
https://console.firebase.google.com
```

### **2. Navegue até Firestore Database:**
- Selecione seu projeto
- Clique em "Firestore Database" no menu lateral
- Clique em "Iniciar coleção" ou navegue até a coleção `promos`

### **3. Adicione um Novo Documento:**

Clique em "Adicionar documento" e preencha os campos:

#### **Estrutura do Documento:**

```javascript
{
  // ID do documento (deixe em branco para auto-gerar)
  
  // CAMPOS OBRIGATÓRIOS
  "titulo": "Nome do Produto",
  "descricao": "Descrição detalhada do produto e seus benefícios",
  "tipo": "afiliado",  // SEMPRE "afiliado" para links externos
  "link": "https://amzn.to/3KnjeQm",  // SEU LINK DE AFILIADO
  
  // DATAS (formato: Timestamp)
  "dataInicio": Timestamp(2025, 11, 26, 0, 0, 0),  // Data de início
  "dataFim": Timestamp(2025, 12, 31, 23, 59, 59),  // Data de fim
  "createdAt": Timestamp.now(),
  
  // INFORMAÇÕES DA PROMOÇÃO
  "desconto": 25,  // Percentual de desconto (número)
  "precoOriginal": 299.90,  // Preço original
  "precoPromocional": 224.90,  // Preço com desconto
  
  // VISUAL
  "fotos": [
    "https://url-da-imagem-1.jpg",
    "https://url-da-imagem-2.jpg"
  ],
  
  // DESTAQUE (opcional)
  "destaque": true,  // true para aparecer em destaque no topo
  
  // CATEGORIA (opcional)
  "categoria": "Hardware",  // ou "Periféricos", "Componentes", etc.
  
  // STATUS
  "ativo": true
}
```

---

## 📝 **Exemplo Prático: Adicionando seu Link Amazon**

### **Para o link: https://amzn.to/3KnjeQm**

```javascript
{
  "titulo": "Mouse Gamer RGB Logitech G502",  // Exemplo
  "descricao": "Mouse gamer de alta performance com sensor HERO 25K, 11 botões programáveis e iluminação RGB personalizável. Ideal para jogos competitivos e trabalho profissional.",
  "tipo": "afiliado",
  "link": "https://amzn.to/3KnjeQm",
  
  "dataInicio": Timestamp(2025, 11, 26, 0, 0, 0),
  "dataFim": Timestamp(2025, 12, 31, 23, 59, 59),
  "createdAt": Timestamp.now(),
  
  "desconto": 30,
  "precoOriginal": 399.90,
  "precoPromocional": 279.90,
  
  "fotos": [
    "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"
  ],
  
  "destaque": true,
  "categoria": "Periféricos",
  "ativo": true
}
```

---

## 🖼️ **Como Obter as Imagens do Produto:**

### **Para produtos Amazon:**

1. Abra o link do produto: `https://amzn.to/3KnjeQm`
2. Clique com botão direito na imagem principal
3. Selecione "Copiar endereço da imagem"
4. Cole no campo `fotos`

### **Dica:**
Use imagens de alta qualidade (mínimo 800x800px) para melhor apresentação.

---

## ⚙️ **Método 3: Via Script (Avançado)**

Criei um script para facilitar a adição de promoções via código:

### **1. Crie o arquivo: `scripts/add-promo.mjs`**

```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import dotenv from 'dotenv'

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addPromo() {
  const promo = {
    titulo: "Mouse Gamer RGB Logitech G502",
    descricao: "Mouse gamer de alta performance com sensor HERO 25K, 11 botões programáveis e iluminação RGB personalizável.",
    tipo: "afiliado",
    link: "https://amzn.to/3KnjeQm",
    
    dataInicio: Timestamp.fromDate(new Date('2025-11-26')),
    dataFim: Timestamp.fromDate(new Date('2025-12-31')),
    createdAt: Timestamp.now(),
    
    desconto: 30,
    precoOriginal: 399.90,
    precoPromocional: 279.90,
    
    fotos: [
      "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"
    ],
    
    destaque: true,
    categoria: "Periféricos",
    ativo: true
  }

  try {
    const docRef = await addDoc(collection(db, 'promos'), promo)
    console.log('✅ Promoção adicionada com ID:', docRef.id)
  } catch (error) {
    console.error('❌ Erro ao adicionar promoção:', error)
  }
}

addPromo()
```

### **2. Execute o script:**

```bash
node scripts/add-promo.mjs
```

---

## 🎨 **Tipos de Promoção**

### **1. Afiliado (Links Externos)**
```javascript
{
  "tipo": "afiliado",
  "link": "https://amzn.to/3KnjeQm",
  "destaque": true  // Aparece em destaque
}
```

### **2. Interna (Produtos da Loja)**
```javascript
{
  "tipo": "interna",
  "link": "/produto/123",  // Link interno
  "destaque": false
}
```

---

## 📊 **Campos Detalhados**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `titulo` | String | ✅ Sim | Nome do produto |
| `descricao` | String | ✅ Sim | Descrição detalhada |
| `tipo` | String | ✅ Sim | "afiliado" ou "interna" |
| `link` | String | ✅ Sim | URL do produto |
| `dataInicio` | Timestamp | ✅ Sim | Data de início |
| `dataFim` | Timestamp | ✅ Sim | Data de término |
| `createdAt` | Timestamp | ✅ Sim | Data de criação |
| `desconto` | Number | ✅ Sim | % de desconto |
| `precoOriginal` | Number | ✅ Sim | Preço sem desconto |
| `precoPromocional` | Number | ✅ Sim | Preço com desconto |
| `fotos` | Array | ✅ Sim | URLs das imagens |
| `destaque` | Boolean | ❌ Não | Destacar no topo |
| `categoria` | String | ❌ Não | Categoria do produto |
| `ativo` | Boolean | ✅ Sim | Se está ativa |

---

## 🔍 **Como Verificar se Funcionou**

1. **Acesse a página de promoções:**
   ```
   https://techverseapp.vercel.app/promocoes
   ```

2. **Verifique:**
   - ✅ A promoção aparece na lista
   - ✅ As imagens estão carregando
   - ✅ O link de afiliado está correto
   - ✅ O desconto está calculado corretamente
   - ✅ As datas estão corretas

---

## 🎯 **Dicas para Melhores Resultados**

### **1. Título Atraente:**
```javascript
// ❌ Ruim
"titulo": "Mouse"

// ✅ Bom
"titulo": "Mouse Gamer RGB Logitech G502 HERO 25K - 11 Botões"
```

### **2. Descrição Persuasiva:**
```javascript
// ❌ Ruim
"descricao": "Mouse gamer bom"

// ✅ Bom
"descricao": "Mouse gamer de alta performance com sensor HERO 25K DPI, 11 botões programáveis, iluminação RGB LIGHTSYNC e design ergonômico. Ideal para jogos competitivos como CS:GO, Valorant e trabalho profissional em design."
```

### **3. Imagens de Qualidade:**
- Use múltiplas imagens (2-4)
- Resolução mínima: 800x800px
- Mostre diferentes ângulos
- Inclua imagens de uso

### **4. Preços Realistas:**
```javascript
// Calcule corretamente
"precoOriginal": 399.90,
"desconto": 30,
"precoPromocional": 279.93  // 399.90 - 30% = 279.93
```

---

## 🚀 **Próximos Passos**

### **Funcionalidades Futuras:**

1. **Painel Admin** (em desenvolvimento)
   - Adicionar promoções via interface
   - Upload de imagens
   - Preview em tempo real

2. **Gerador de Promoções com IA**
   - Cole o link
   - IA extrai informações
   - Gera descrição automática

3. **Analytics**
   - Rastreamento de cliques
   - Conversões
   - ROI de afiliados

---

## 📞 **Precisa de Ajuda?**

### **Problemas Comuns:**

**1. Promoção não aparece:**
- ✅ Verifique se `ativo: true`
- ✅ Verifique se a data está correta
- ✅ Limpe o cache do navegador

**2. Imagens não carregam:**
- ✅ Use URLs diretas (não encurtadas)
- ✅ Verifique se a URL é acessível
- ✅ Use HTTPS

**3. Link não funciona:**
- ✅ Teste o link em uma aba anônima
- ✅ Verifique se o link de afiliado está ativo
- ✅ Confirme que não há espaços extras

---

## 📝 **Template Rápido**

Copie e cole este template no Firestore:

```javascript
{
  "titulo": "NOME DO PRODUTO",
  "descricao": "DESCRIÇÃO DETALHADA",
  "tipo": "afiliado",
  "link": "SEU_LINK_AQUI",
  "dataInicio": Timestamp(2025, 11, 26, 0, 0, 0),
  "dataFim": Timestamp(2025, 12, 31, 23, 59, 59),
  "createdAt": Timestamp.now(),
  "desconto": 0,
  "precoOriginal": 0,
  "precoPromocional": 0,
  "fotos": ["URL_IMAGEM"],
  "destaque": true,
  "categoria": "Hardware",
  "ativo": true
}
```

---

**Criado em:** 26/11/2025  
**Última atualização:** 26/11/2025  
**Versão:** 1.0

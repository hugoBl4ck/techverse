# 📢 Sistema de Promoções, Notícias e Doações PIX

Sistema completo para gerenciar promoções, notícias e doações via PIX no TechVerse.

## 📋 Componentes Criados

### 1. **PromoInfoPanel.vue** (`/src/components/`)
Componente principal com 3 abas:
- **🎁 Promoções**: Criar, editar e gerenciar promoções com desconto e datas
- **📰 Notícias**: Publicar notícias e atualizações para clientes
- **💝 Doações**: Configurar chave PIX e monitorar doações

### 2. **DonationPage.vue** (`/src/views/`)
Página pública elegante para doações:
- QR Code PIX dinâmico
- Valores sugeridos (R$ 10, 25, 50, 100, 250)
- Valor personalizado
- Link copiável
- Histórico de doadores anônimos

### 3. **useFirestore.js** (`/src/composables/`)
Composable com operações Firestore:
- `getPromos()` - Carrega promoções
- `savePromo()` - Criar/atualizar
- `deletePromo()` - Deletar promoção
- `getNews()` - Carrega notícias
- `saveNews()` - Criar/atualizar
- `deleteNews()` - Deletar notícia
- `getPixConfig()` - Carrega config PIX
- `savePixConfig()` - Salva chave PIX
- `recordDonation()` - Registra doação
- `getDonations()` - Histórico de doações
- `getDonationStats()` - Estatísticas

### 4. **pixGenerator.js** (`/src/lib/`)
Utilitária para gerar QR Codes e payloads PIX:
- `generatePixQRCode()` - Cria QR code estático
- `generatePixPayload()` - Payload BR Code
- `validatePixKey()` - Valida chave PIX
- `formatPixAmount()` - Formata valores
- `openBankAppWithPix()` - Deep linking para apps bancários

### 5. Componentes UI
Novos componentes criados:
- `Badge` - Badges com variantes
- `Separator` - Divisor de conteúdo
- `Dialog` - Modal/diálogo

## 🚀 Como Usar

### Acessar o Painel

1. Vá para: `http://localhost/test-visuals`
2. Scroll para baixo até **"📢 Promoções & Notícias"**

### Criar Promoção

```
1. Clique em "Nova Promoção"
2. Preencha:
   - Título (ex: "Black Friday 2024")
   - Descrição (ex: "50% de desconto em serviços")
   - Desconto (%) (ex: 50)
   - Data Início (ex: 2024-01-01)
   - Data Fim (ex: 2024-01-31)
   - Ativo? (marque para ativar)
3. Clique "Salvar"
```

### Publicar Notícia

```
1. Clique na aba "📰 Notícias"
2. Clique em "Publicar Notícia"
3. Preencha:
   - Título (ex: "Novo recurso lançado!")
   - Conteúdo (ex: "Descubra as melhorias...")
   - Data de Publicação (automática: hoje)
   - Publicada? (marque para publicar)
4. Clique "Salvar"
```

### Configurar PIX para Doações

```
1. Clique na aba "💝 Doações"
2. Insira sua **chave PIX** (pode ser):
   - Email (ex: seu@email.com)
   - Telefone (ex: 11999999999)
   - CPF (ex: 12345678901)
   - Chave aleatória (32 caracteres)
3. Preencha nome para recebimento (ex: "TechVerse" ou seu nome)
4. (Opcional) Adicione cidade
5. Clique "💾 Salvar"
```

### Compartilhar Página de Doações

```
1. Na aba "💝 Doações"
2. Clique no ícone 📋 para copiar o link
3. Compartilhe: https://seu-dominio.com/donate
```

### Visualizar Página de Doações

```
1. Na aba "💝 Doações"
2. Clique em "Preview Página de Doações"
3. Ou acesse: /donate
```

## 📊 Estrutura Firestore

```
firestore/
├── promos/
│   ├── {id}
│   │   ├── titulo: string
│   │   ├── descricao: string
│   │   ├── desconto: number
│   │   ├── dataInicio: timestamp
│   │   ├── dataFim: timestamp
│   │   ├── ativo: boolean
│   │   ├── criadoEm: timestamp
│   │   └── atualizadoEm: timestamp
│
├── noticias/
│   ├── {id}
│   │   ├── titulo: string
│   │   ├── conteudo: string
│   │   ├── dataPub: timestamp
│   │   ├── ativo: boolean
│   │   ├── criadoEm: timestamp
│   │   └── atualizadoEm: timestamp
│
├── config/
│   ├── {id}
│   │   ├── tipo: "pix"
│   │   ├── chave: string
│   │   ├── nomeRecebimento: string
│   │   ├── cidade: string
│   │   ├── criadoEm: timestamp
│   │   └── atualizadoEm: timestamp
│
└── doacoes/
    ├── {id}
    │   ├── valor: number
    │   ├── chaveOrigem: string
    │   ├── anonimo: boolean
    │   ├── transactionId: string (opcional)
    │   ├── status: "pendente|confirmada|rejeitada"
    │   └── criadoEm: timestamp
```

## 🔐 Firestore Rules

Adicione estas regras de segurança ao seu `firestore.rules`:

```javascript
// Leitura pública para promoções e notícias ativas
match /promos/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid != null && isAdmin();
}

match /noticias/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid != null && isAdmin();
}

// Config PIX apenas para admin
match /config/{document=**} {
  allow read: if request.auth.uid != null && isAdmin();
  allow write: if request.auth.uid != null && isAdmin();
}

// Doações: leitura pública de confirmadas, escrita pública
match /doacoes/{document=**} {
  allow read: if resource.data.status == "confirmada" || (request.auth.uid != null && isAdmin());
  allow create: if true;
  allow update: if request.auth.uid != null && isAdmin();
}

function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

## 💡 Exemplos de Uso

### Integração em Componentes

```vue
<script setup>
import { useFirestore } from '@/composables/useFirestore'

const { getActivePromos, getPublishedNews } = useFirestore()

const promos = ref([])
const news = ref([])

onMounted(async () => {
  promos.value = await getActivePromos()
  news.value = await getPublishedNews()
})
</script>

<template>
  <div>
    <!-- Exibir promoções ativas -->
    <div v-for="promo in promos" :key="promo.id">
      <h3>{{ promo.titulo }}</h3>
      <p>Desconto: {{ promo.desconto }}%</p>
    </div>

    <!-- Exibir notícias publicadas -->
    <div v-for="item in news" :key="item.id">
      <h3>{{ item.titulo }}</h3>
      <p>{{ item.conteudo }}</p>
    </div>
  </div>
</template>
```

### Registrar Doação (via webhook/API)

```javascript
const { recordDonation } = useFirestore()

// Após confirmação do PIX
await recordDonation({
  valor: 50.00,
  chaveOrigem: 'seu@email.com',
  anonimo: true,
  transactionId: 'abc123xyz',
  status: 'confirmada'
})
```

## 🎨 Personalizações

### Cores dos Cards

Edite em `PromoInfoPanel.vue`:

```vue
<!-- Promoção -->
from-blue-50/50 to-transparent dark:from-blue-950/20

<!-- Notícia -->
from-green-50/50 to-transparent dark:from-green-950/20

<!-- Doação -->
bg-amber-50/50 dark:bg-amber-950/20
```

### Valores Sugeridos de Doação

Edite em `DonationPage.vue`:

```javascript
const presetAmounts = [10, 25, 50, 100, 250]

// Customize os benefícios
const benefits = [
  'Acesso a recursos premium',
  'Suporte prioritário',
  'Seu nome nos agradecimentos',
  'Participação em votações'
]
```

## 🔗 Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/test-visuals` | TestVisualsView | Painel administrativo |
| `/donate` | DonationPage | Página pública de doações |

## 📱 Compatibilidade

- ✅ Desktop (responsivo)
- ✅ Tablet
- ✅ Mobile
- ✅ Dark mode automático

## 🚨 Troubleshooting

### QR Code não aparece
1. Verifique se a chave PIX está configurada
2. Abra o console e procure por erros
3. Teste com uma chave válida

### Firestore não salva
1. Verifique as permissões no `firestore.rules`
2. Confirme que você está autenticado
3. Verifique o limite de escrita do Firestore

### Componentes UI não aparecem
1. Certifique-se de que reka-ui está instalado
2. Verifique os imports em index.js

## 📞 Suporte

Para dúvidas ou sugestões sobre o painel:
1. Verifique a estrutura em `PromoInfoPanel.vue`
2. Consulte o `useFirestore.js` para operações
3. Use a página de doações como referência: `DonationPage.vue`

---

**Criado para TechVerse** ✨

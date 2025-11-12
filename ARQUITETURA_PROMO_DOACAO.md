# 🏗️ Arquitetura do Sistema de Promoções, Notícias e Doações

## 📐 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE DO USUÁRIO                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐             │
│  │ TestVisualsView  │      │  DonationPage    │             │
│  │   (Admin Panel)  │      │  (Public Page)   │             │
│  └────────┬─────────┘      └────────┬─────────┘             │
│           │                         │                        │
│  ┌────────▼────────────────────────▼────────┐               │
│  │       PromoInfoPanel.vue                 │               │
│  │  (Componente Principal)                  │               │
│  │  - Abas: Promos | Notícias | Doações    │               │
│  └────────┬─────────────────────────────────┘               │
│           │                                                   │
└───────────┼───────────────────────────────────────────────────┘
            │
            │ import { useFirestore }
            ▼
┌─────────────────────────────────────────────────────────────┐
│               CAMADA DE COMPOSABLES                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useFirestore.js                                            │
│  ├─ getPromos()           → list promos                     │
│  ├─ savePromo()           → create/update promo            │
│  ├─ deletePromo()         → delete promo                   │
│  ├─ getNews()             → list notícias                  │
│  ├─ saveNews()            → create/update notícia          │
│  ├─ deleteNews()          → delete notícia                 │
│  ├─ getPixConfig()        → load PIX key                   │
│  ├─ savePixConfig()       → save PIX key                   │
│  ├─ recordDonation()      → log donation                   │
│  ├─ getDonations()        → confirmed donations            │
│  ├─ getDonationStats()    → total & amount                 │
│  ├─ getActivePromos()     → public promos                  │
│  └─ getPublishedNews()    → public notícias                │
│                                                               │
└────────┬─────────────────────────────────────────────────────┘
         │
         │ Firebase/Firestore
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FIREBASE FIRESTORE                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Database Collections:                                       │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ promos/          │  │ noticias/        │                │
│  │ ├─ id            │  │ ├─ id            │                │
│  │ ├─ titulo        │  │ ├─ titulo        │                │
│  │ ├─ descricao     │  │ ├─ conteudo      │                │
│  │ ├─ desconto      │  │ ├─ dataPub       │                │
│  │ ├─ dataInicio    │  │ ├─ ativo         │                │
│  │ ├─ dataFim       │  │ ├─ criadoEm      │                │
│  │ ├─ ativo         │  │ └─ atualizadoEm  │                │
│  │ ├─ criadoEm      │  └──────────────────┘                │
│  │ └─ atualizadoEm  │                                       │
│  └──────────────────┘                                       │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ config/          │  │ doacoes/         │                │
│  │ ├─ tipo: "pix"   │  │ ├─ id            │                │
│  │ ├─ chave         │  │ ├─ valor         │                │
│  │ ├─ nomeReceb.    │  │ ├─ chaveOrigem   │                │
│  │ ├─ cidade        │  │ ├─ anonimo       │                │
│  │ ├─ criadoEm      │  │ ├─ status        │                │
│  │ └─ atualizadoEm  │  │ ├─ transId       │                │
│  └──────────────────┘  │ └─ criadoEm      │                │
│                        └──────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Ciclo de Vida - Promoção

```
USER INTERFACE
      │
      ▼
┌──────────────────────┐
│ PromoInfoPanel.vue   │
│  openFormModal()     │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ Modal Dialog │
    │  Formulário  │
    └──────┬───────┘
           │ Preenchimento
           ▼
    ┌──────────────┐
    │ saveFormData │
    │  Validação   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ useFirestore.js      │
    │ savePromo()          │
    └──────┬───────────────┘
           │
      ┌────┴────┐
      ▼         ▼
    CREATE   UPDATE
      │         │
      ▼         ▼
    addDoc   updateDoc
      │         │
      └────┬────┘
           │
           ▼
      FIRESTORE
      promos/{id}
           │
           ▼
      Salvação OK
           │
           ▼
    toast.success()
           │
           ▼
    Reload de dados
           │
           ▼
    Modal fechado
```

## 🎁 Ciclo de Vida - Doação

```
USER VISITS /donate
      │
      ▼
┌──────────────────────┐
│ DonationPage.vue     │
│ onMounted()          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ getPixConfig()       │
│ from Firestore       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│ pixGenerator.js          │
│ generatePixQRCode()      │
│ Generate via QR API      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ QR Code Display          │
│ + PIX Key                │
│ + Preset Amounts         │
└──────┬───────────────────┘
       │
       ▼
  USER SELECTS AMOUNT
       │
       ▼
  OPENS BANK APP / COPY PIX
       │
       ▼
  MAKE PAYMENT
       │
       ▼
  WEBHOOK/CONFIRMATION
       │
       ▼
┌──────────────────────────┐
│ recordDonation()         │
│ status: "confirmada"     │
└──────┬───────────────────┘
       │
       ▼
  FIRESTORE doacoes/{id}
       │
       ▼
  STATS UPDATED
```

## 🔐 Segurança - Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper função
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid))
        .data.isAdmin == true;
    }

    // Promoções: Público para leitura, Admin para escrita
    match /promos/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid != null && isAdmin();
    }

    // Notícias: Público para leitura, Admin para escrita
    match /noticias/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid != null && isAdmin();
    }

    // Config PIX: Admin apenas
    match /config/{document=**} {
      allow read, write: if request.auth.uid != null && isAdmin();
    }

    // Doações: Público para criar, Admin para ler/atualizar
    match /doacoes/{document=**} {
      allow read: if resource.data.status == "confirmada" || 
                     (request.auth.uid != null && isAdmin());
      allow create: if true;
      allow update, delete: if request.auth.uid != null && isAdmin();
    }
  }
}
```

## 🎨 Componentes Utilizados

```
PromoInfoPanel.vue
├─ Card (UI)
│  ├─ CardHeader
│  ├─ CardTitle
│  ├─ CardDescription
│  └─ CardContent
│
├─ Button (UI)
│  ├─ Default
│  ├─ Destructive
│  ├─ Outline
│  └─ Ghost
│
├─ Badge (UI) ← Novo
│  ├─ Default
│  ├─ Secondary
│  └─ Outline
│
├─ Input (UI)
│  └─ Text, Date, Number
│
├─ Skeleton (UI)
│  └─ Loading states
│
├─ Dialog (UI) ← Novo
│  ├─ DialogContent
│  ├─ DialogHeader
│  ├─ DialogTitle
│  └─ DialogFooter
│
└─ Separator (UI) ← Novo
   └─ Horizontal divider

DonationPage.vue
├─ Card (UI)
├─ Button (UI)
├─ Input (UI)
├─ Badge (UI)
├─ Skeleton (UI)
└─ Icons (lucide-vue-next)
  ├─ Heart
  ├─ Gift
  ├─ Star
  ├─ Copy
  ├─ Eye
  └─ etc...
```

## 📊 Fluxo de Dados - Tabular

| Ação | Componente | Função | Firestore | Status |
|------|-----------|--------|-----------|--------|
| Ver Promoções | PromoInfoPanel | getPromos() | Read promos/ | ✅ |
| Criar Promoção | Dialog Modal | savePromo() | Create promos/ | ✅ |
| Editar Promoção | Dialog Modal | savePromo() | Update promos/ | ✅ |
| Deletar Promoção | PromoInfoPanel | deletePromo() | Delete promos/ | ✅ |
| Publicar Notícia | Dialog Modal | saveNews() | Create noticias/ | ✅ |
| Editar Notícia | Dialog Modal | saveNews() | Update noticias/ | ✅ |
| Configurar PIX | Form | savePixConfig() | Write config/ | ✅ |
| Gerar QR Code | DonationPage | generatePixQRCode() | API QR | ✅ |
| Registrar Doação | API/Webhook | recordDonation() | Create doacoes/ | ✅ |

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading**
   - Componentes importados dinamicamente via router

2. **Caching**
   - useFirestore com estado em ref()
   - Reload apenas quando necessário

3. **Validação Client-side**
   - Antes de enviar ao Firestore
   - Feedback imediato ao usuário

4. **Paginação**
   - getDonations() com limite padrão
   - Pode ser expandido

## 🔄 Integrações Futuras

```javascript
// Webhook para confirmação PIX (exemplo)
app.post('/api/pix-webhook', async (req, res) => {
  const { valor, chaveOrigem, transactionId } = req.body;
  
  // Confirmar no Firestore
  await recordDonation({
    valor,
    chaveOrigem,
    transactionId,
    status: 'confirmada'
  });
  
  res.json({ success: true });
});

// Email notification
await sendEmail({
  to: 'admin@techverse.com',
  subject: `Doação recebida: R$ ${valor}`,
  template: 'donation-received'
});

// SMS notification
await sendSMS({
  to: '+5511999999999',
  message: `💝 Doação recebida: R$ ${valor}`
});
```

---

**Diagrama atualizado:** 12/11/2025

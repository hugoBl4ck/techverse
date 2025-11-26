# 💡 Exemplos de Integração - Sistema de Promoções e Doações

## 📌 Índice
1. [Exibir Promoções Ativas](#exibir-promoções-ativas)
2. [Exibir Notícias Publicadas](#exibir-notícias-publicadas)
3. [Widget de Doação](#widget-de-doação)
4. [Banner de Promoção](#banner-de-promoção)
5. [Integração com Webhook PIX](#integração-com-webhook-pix)
6. [Dashboard de Doações](#dashboard-de-doações)

---

## Exibir Promoções Ativas

### No Dashboard

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Loading -->
    <div v-if="loading" v-for="i in 3" :key="i" class="p-4 border rounded-lg">
      <Skeleton height="3rem" class="mb-2" />
      <Skeleton height="2rem" />
    </div>

    <!-- Promoções -->
    <Card v-for="promo in activePromos" :key="promo.id" class="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Gift class="h-5 w-5 text-orange-500" />
          {{ promo.titulo }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">{{ promo.descricao }}</p>
          
          <!-- Badge com desconto -->
          <Badge class="text-lg py-1" variant="default">
            -{{ promo.desconto }}%
          </Badge>

          <!-- Datas -->
          <div class="text-xs text-muted-foreground space-y-1">
            <p>📅 Válida até: {{ formatDate(promo.dataFim) }}</p>
          </div>

          <Button class="w-full mt-4" @click="verPromoDetails(promo.id)">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <div v-if="!loading && activePromos.length === 0" class="col-span-full text-center py-12">
      <Gift class="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
      <p class="text-muted-foreground">Nenhuma promoção ativa no momento</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift } from 'lucide-vue-next';

const { getActivePromos } = useFirestore();

const activePromos = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    activePromos.value = await getActivePromos();
  } finally {
    loading.value = false;
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function verPromoDetails(promoId) {
  // Navegar para página de detalhes
  console.log('Ver promo:', promoId);
}
</script>
```

---

## Exibir Notícias Publicadas

### Componente de Notícias

```vue
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-8">📰 Últimas Notícias</h2>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-4 border rounded-lg">
        <Skeleton height="2rem" class="mb-2" />
        <Skeleton height="4rem" />
      </div>
    </div>

    <!-- Notícias -->
    <div v-else class="space-y-6">
      <article
        v-for="news in publishedNews"
        :key="news.id"
        class="p-6 border rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-semibold">{{ news.titulo }}</h3>
          <span class="text-xs text-muted-foreground whitespace-nowrap ml-4">
            {{ formatDate(news.dataPub) }}
          </span>
        </div>

        <p class="text-muted-foreground mb-4">{{ news.conteudo }}</p>

        <Button variant="outline" size="sm">
          Ler Mais →
        </Button>
      </article>

      <!-- Empty State -->
      <div v-if="publishedNews.length === 0" class="text-center py-12">
        <Newspaper class="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p class="text-muted-foreground">Nenhuma notícia publicada</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper } from 'lucide-vue-next';

const { getPublishedNews } = useFirestore();

const publishedNews = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    publishedNews.value = await getPublishedNews();
  } finally {
    loading.value = false;
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>
```

---

## Widget de Doação

### Pequeno banner para incluir em qualquer página

```vue
<template>
  <div class="p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30 rounded-lg border border-pink-200 dark:border-pink-800">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <Heart class="h-5 w-5 text-red-500 animate-pulse" />
        <div>
          <p class="font-semibold text-sm">💝 Apoie o TechVerse</p>
          <p class="text-xs text-muted-foreground">Sua doação faz a diferença</p>
        </div>
      </div>
      <router-link to="/donate">
        <Button size="sm" variant="default">
          Doar Agora
        </Button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
```

### Uso em qualquer página:
```vue
<template>
  <div class="space-y-6">
    <h1>Minha Página</h1>
    <ConteúdoPrincipal />
    
    <!-- Widget de doação -->
    <DonationWidget />
  </div>
</template>

<script setup>
import DonationWidget from '@/components/DonationWidget.vue';
</script>
```

---

## Banner de Promoção

### Destaque na página principal

```vue
<template>
  <div v-if="currentPromo" class="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 mb-8">
    <!-- Background decorativo -->
    <div class="absolute right-0 top-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-10"></div>
    
    <!-- Conteúdo -->
    <div class="relative z-10">
      <div class="flex items-center justify-between gap-6">
        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-2">{{ currentPromo.titulo }}</h2>
          <p class="text-blue-100 mb-4">{{ currentPromo.descricao }}</p>
          
          <div class="flex items-center gap-4">
            <Badge class="text-lg px-4 py-2 bg-white text-blue-600">
              {{ currentPromo.desconto }}% OFF
            </Badge>
            <p class="text-sm text-blue-100">
              Válida até {{ formatDate(currentPromo.dataFim) }}
            </p>
          </div>
        </div>

        <!-- Ícone grande -->
        <Gift class="h-32 w-32 opacity-20" />
      </div>

      <!-- Botão CTA -->
      <Button class="mt-6 bg-white text-blue-600 hover:bg-blue-50">
        Aproveitar Promoção →
      </Button>
    </div>

    <!-- Navegação -->
    <div class="absolute bottom-0 right-0 flex gap-2 p-4">
      <button
        @click="previousPromo"
        class="p-2 hover:bg-white/20 rounded transition"
      >
        ←
      </button>
      <button
        @click="nextPromo"
        class="p-2 hover:bg-white/20 rounded transition"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-vue-next';

const { getActivePromos } = useFirestore();

const promos = ref([]);
const currentIndex = ref(0);

const currentPromo = computed(() => {
  return promos.value[currentIndex.value] || null;
});

onMounted(async () => {
  promos.value = await getActivePromos();
});

function nextPromo() {
  currentIndex.value = (currentIndex.value + 1) % promos.value.length;
}

function previousPromo() {
  currentIndex.value = (currentIndex.value - 1 + promos.value.length) % promos.value.length;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}
</script>
```

---

## Integração com Webhook PIX

### Backend (Node.js/Express)

```javascript
// routes/webhooks.js
import express from 'express';
import { admin } from '../firebase.js';

const router = express.Router();

// Webhook de confirmação PIX
router.post('/pix-confirmation', async (req, res) => {
  try {
    const { 
      valor, 
      chaveOrigem, 
      transactionId, 
      nomePagador 
    } = req.body;

    // Validar assinatura (importante!)
    // const isValid = validateSignature(req);
    // if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // Registrar doação no Firestore
    const db = admin.firestore();
    const donationRef = await db.collection('doacoes').add({
      valor: parseFloat(valor),
      chaveOrigem,
      transactionId,
      nomePagador: nomePagador || 'Doador Anônimo',
      anonimo: !nomePagador,
      status: 'confirmada',
      criadoEm: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Doação registrada:', donationRef.id);

    // Enviar email de confirmação
    await enviarEmailConfirmacao({
      valor,
      transactionId,
      nomePagador
    });

    // Enviar notificação para admin
    await notificarAdmin({
      tipo: 'nova_doacao',
      valor,
      nomePagador,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      donationId: donationRef.id,
      message: 'Doação confirmada com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao processar doação:', error);
    res.status(500).json({ error: 'Erro ao processar doação' });
  }
});

export default router;
```

### Frontend - Simular webhook (para testes)

```javascript
// Função para teste de webhook
async function simularConfirmacaoPix(valor) {
  try {
    const response = await fetch('/api/webhooks/pix-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valor,
        chaveOrigem: 'seu@email.com',
        transactionId: `PIX_${Date.now()}`,
        nomePagador: 'João Silva'
      })
    });

    const data = await response.json();
    if (data.success) {
      toast.success('Doação confirmada!');
    }
  } catch (error) {
    toast.error('Erro ao confirmar doação');
  }
}
```

---

## Dashboard de Doações

### Visualizar estatísticas

```vue
<template>
  <div class="space-y-6">
    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total de Doações -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Total de Doações</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground mt-1">doadores confirmados</p>
        </CardContent>
      </Card>

      <!-- Valor Total -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Valor Total Arrecadado</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-green-600">
            R$ {{ stats.amount }}
          </div>
          <p class="text-xs text-muted-foreground mt-1">em todas as doações</p>
        </CardContent>
      </Card>

      <!-- Ticket Médio -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Ticket Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">
            R$ {{ averageTicket }}
          </div>
          <p class="text-xs text-muted-foreground mt-1">por doação</p>
        </CardContent>
      </Card>
    </div>

    <!-- Gráfico de Doações (Opcional - com Chart.js)-->
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Doações (Últimos 30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="h-64 bg-muted rounded flex items-center justify-center">
          <p class="text-muted-foreground">Gráfico será exibido aqui</p>
        </div>
      </CardContent>
    </Card>

    <!-- Últimas Doações -->
    <Card>
      <CardHeader>
        <CardTitle>Últimas Doações</CardTitle>
      </CardHeader>
      <CardContent>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Doador</th>
              <th class="text-left py-2">Valor</th>
              <th class="text-left py-2">Data</th>
              <th class="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="donation in lastDonations" :key="donation.id" class="border-b hover:bg-muted/50">
              <td class="py-3">{{ donation.nomePagador || 'Anônimo' }}</td>
              <td class="py-3 font-semibold text-green-600">R$ {{ donation.valor.toFixed(2) }}</td>
              <td class="py-3 text-xs text-muted-foreground">{{ formatDate(donation.criadoEm) }}</td>
              <td class="py-3">
                <Badge variant="default" v-if="donation.status === 'confirmada'">
                  ✓ Confirmada
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const { getDonations, getDonationStats } = useFirestore();

const stats = ref({ total: 0, amount: '0.00' });
const lastDonations = ref([]);

const averageTicket = computed(() => {
  if (stats.value.total === 0) return '0.00';
  return (parseFloat(stats.value.amount) / stats.value.total).toFixed(2);
});

onMounted(async () => {
  stats.value = await getDonationStats();
  lastDonations.value = await getDonations(10);
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}
</script>
```

---

## 🔧 Integração com Routes

### Adicionar rotas de doação/admin

```javascript
// router/index.js
{
  path: '/admin/doacoes',
  name: 'AdminDonations',
  component: () => import('@/views/admin/AdminDonationsView.vue'),
  meta: { title: 'Gerenciar Doações', requiresAdmin: true }
},
{
  path: '/admin/promos',
  name: 'AdminPromos',
  component: () => import('@/views/admin/AdminPromosView.vue'),
  meta: { title: 'Gerenciar Promoções', requiresAdmin: true }
}
```

---

## 🚀 Checklist de Integração

- [ ] Importar `useFirestore` em componentes
- [ ] Testar carregamento de dados
- [ ] Validar Firestore rules
- [ ] Implementar webhook PIX
- [ ] Testar em mobile
- [ ] Adicionar analytics
- [ ] Notificações por email
- [ ] Backups automáticos

---

**Última Atualização:** 12/11/2025

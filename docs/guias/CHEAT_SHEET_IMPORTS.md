# 📋 Cheat Sheet - Imports & Snippets

## 🔗 Importes Principais

### Componente PromoInfoPanel
```javascript
import PromoInfoPanel from '@/components/PromoInfoPanel.vue'

// Em template:
<PromoInfoPanel />
```

### Página de Doações
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/donate')
// ou
window.location.href = '/donate'
```

### Composable useFirestore
```javascript
import { useFirestore } from '@/composables/useFirestore'

const {
  getPromos,
  savePromo,
  deletePromo,
  getNews,
  saveNews,
  deleteNews,
  getPixConfig,
  savePixConfig,
  recordDonation,
  getDonations,
  getDonationStats,
  getActivePromos,
  getPublishedNews
} = useFirestore()
```

### Gerador de PIX
```javascript
import { generatePixQRCode, validatePixKey } from '@/lib/pixGenerator'

// Gerar QR Code
const qrUrl = await generatePixQRCode('seu@email.com', 50)

// Validar chave
const isValid = validatePixKey('seu@email.com')
```

### Componentes UI
```javascript
// Card
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Button
import { Button } from '@/components/ui/button'

// Badge (novo)
import { Badge } from '@/components/ui/badge'

// Dialog (novo)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'

// Separator (novo)
import { Separator } from '@/components/ui/separator'

// Input
import { Input } from '@/components/ui/input'

// Skeleton
import { Skeleton } from '@/components/ui/skeleton'
```

### Icons
```javascript
import {
  Heart,
  Gift,
  Star,
  Copy,
  Eye,
  Edit2,
  Trash2,
  Megaphone,
  Newspaper,
  PlusCircle,
  CheckCircle,
  Loader2
} from 'lucide-vue-next'
```

### Toast Notifications
```javascript
import { toast } from 'vue-sonner'

// Uso
toast.success('Operação bem-sucedida!')
toast.error('Erro ao processar')
toast.info('Informação útil')
toast.warning('Atenção!')
toast.loading('Carregando...')
```

---

## 💻 Snippets Comuns

### Carregar Promoções Ativas
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '@/composables/useFirestore'

const { getActivePromos } = useFirestore()
const promos = ref([])

onMounted(async () => {
  promos.value = await getActivePromos()
})
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="promo in promos" :key="promo.id">
      <h3>{{ promo.titulo }}</h3>
      <p>{{ promo.desconto }}% OFF</p>
    </div>
  </div>
</template>
```

### Carregar Notícias Publicadas
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '@/composables/useFirestore'

const { getPublishedNews } = useFirestore()
const news = ref([])

onMounted(async () => {
  news.value = await getPublishedNews()
})
</script>

<template>
  <div class="space-y-4">
    <article v-for="item in news" :key="item.id">
      <h2>{{ item.titulo }}</h2>
      <p>{{ item.conteudo }}</p>
    </article>
  </div>
</template>
```

### Widget de Doação Simples
```vue
<template>
  <div class="p-4 bg-pink-50 rounded-lg border border-pink-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold">💝 Apoie o TechVerse</p>
        <p class="text-sm text-muted-foreground">Sua doação faz diferença</p>
      </div>
      <router-link to="/donate">
        <Button size="sm">Doar Agora</Button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
</script>
```

### Exibir Doações Recentes
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '@/composables/useFirestore'

const { getDonations } = useFirestore()
const donations = ref([])

onMounted(async () => {
  donations.value = await getDonations(5)
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="d in donations" :key="d.id" class="flex justify-between">
      <span>{{ d.nomePagador || 'Anônimo' }}</span>
      <span class="text-green-600">R$ {{ d.valor.toFixed(2) }}</span>
    </div>
  </div>
</template>
```

### Validar Chave PIX
```javascript
import { validatePixKey } from '@/lib/pixGenerator'

const chave = 'seu@email.com'
if (validatePixKey(chave)) {
  console.log('Chave PIX válida!')
} else {
  toast.error('Chave PIX inválida')
}
```

### Registrar Doação
```javascript
import { useFirestore } from '@/composables/useFirestore'
import { toast } from 'vue-sonner'

const { recordDonation } = useFirestore()

async function salvarDoacao(valor) {
  try {
    const id = await recordDonation({
      valor: parseFloat(valor),
      chaveOrigem: 'seu@email.com',
      anonimo: true,
      transactionId: `PIX_${Date.now()}`,
      status: 'pendente'
    })
    toast.success('Doação registrada!')
  } catch (error) {
    toast.error('Erro ao registrar doação')
  }
}
```

---

## 🎨 Snippets de Template

### Card com Badge
```vue
<Card>
  <CardHeader>
    <div class="flex justify-between items-center">
      <CardTitle>{{ promo.titulo }}</CardTitle>
      <Badge variant="default">{{ promo.desconto }}%</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p class="text-muted-foreground">{{ promo.descricao }}</p>
  </CardContent>
</Card>
```

### Dialog Modal
```vue
<Dialog :open="showDialog" @update:open="showDialog = $event">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
    </DialogHeader>
    <!-- Conteúdo aqui -->
    <DialogFooter>
      <Button variant="outline" @click="showDialog = false">
        Cancelar
      </Button>
      <Button @click="salvar">Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Abas
```vue
<div class="flex gap-2 border-b">
  <button
    @click="tab = 'promos'"
    :class="tab === 'promos' ? 'text-primary border-b-2 border-b-primary' : ''"
  >
    🎁 Promoções
  </button>
  <button
    @click="tab = 'news'"
    :class="tab === 'news' ? 'text-primary border-b-2 border-b-primary' : ''"
  >
    📰 Notícias
  </button>
</div>

<div v-if="tab === 'promos'"><!-- Conteúdo promos --></div>
<div v-if="tab === 'news'"><!-- Conteúdo notícias --></div>
```

### Loading Skeleton
```vue
<div v-if="loading">
  <Skeleton height="3rem" class="mb-2" />
  <Skeleton height="2rem" />
</div>
<div v-else>
  <!-- Conteúdo carregado -->
</div>
```

### Grid Responsivo
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card v-for="item in items" :key="item.id">
    <!-- Card content -->
  </Card>
</div>
```

### Form Validado
```vue
<form @submit.prevent="submit">
  <div class="space-y-4">
    <div>
      <label>Titulo</label>
      <Input v-model="form.titulo" />
    </div>
    <div>
      <label>Descricao</label>
      <textarea v-model="form.descricao" class="w-full p-2 border rounded" />
    </div>
  </div>
  <Button :disabled="!form.titulo">Salvar</Button>
</form>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const form = ref({ titulo: '', descricao: '' })

async function submit() {
  if (!form.value.titulo) {
    toast.error('Preencha o título')
    return
  }
  // Salvar...
}
</script>
```

---

## 🔧 Configuração de Rota

### Adicionar em src/router/index.js
```javascript
{
  path: '/donate',
  name: 'Donate',
  component: () => import('@/views/DonationPage.vue'),
  meta: { title: 'Apoie o TechVerse', requiresAuth: false }
},
{
  path: '/admin/doacoes',
  name: 'AdminDonations',
  component: () => import('@/views/admin/AdminDonationsView.vue'),
  meta: { title: 'Gerenciar Doações', requiresAuth: true, requiresAdmin: true }
}
```

---

## 🎨 Tailwind Classes Úteis

### Cores (Doação)
```
Amarelo/Âmbar para doações:
- bg-amber-50
- bg-amber-100
- text-amber-600
- border-amber-200
```

### Cores (Promo)
```
Azul para promoções:
- bg-blue-50
- bg-blue-100
- text-blue-600
- border-blue-200
```

### Cores (Notícia)
```
Verde para notícias:
- bg-green-50
- bg-green-100
- text-green-600
- border-green-200
```

### Grid Responsivo
```
grid-cols-1          → Mobile
md:grid-cols-2       → Tablet
lg:grid-cols-3       → Desktop
xl:grid-cols-4       → Wide
```

### Flexbox Útil
```
flex items-center justify-between   → Nav, Headers
flex-col space-y-4                 → Formulários
flex gap-2                         → Botões
```

---

## 📱 Breakpoints Tailwind

```
sm: 640px   (telefone médio)
md: 768px   (tablet)
lg: 1024px  (laptop)
xl: 1280px  (desktop)
2xl: 1536px (wide screen)
```

---

## 🔐 Firestore Patterns

### Read
```javascript
// Um documento
const doc = await getDoc(docRef)

// Coleção
const snapshot = await getDocs(collection(db, 'promos'))

// Com filtro
const q = query(
  collection(db, 'promos'),
  where('ativo', '==', true),
  orderBy('titulo')
)
const snapshot = await getDocs(q)
```

### Write
```javascript
// Criar
await addDoc(collection(db, 'promos'), {
  titulo: 'Nova Promo',
  ativo: true,
  criadoEm: new Date()
})

// Atualizar
await updateDoc(doc(db, 'promos', 'id'), {
  titulo: 'Promo Atualizada'
})

// Deletar
await deleteDoc(doc(db, 'promos', 'id'))
```

---

## 🚨 Tratamento de Erros

### Try/Catch Padrão
```javascript
try {
  const promos = await getPromos()
  // processar
} catch (error) {
  console.error('Erro:', error)
  toast.error('Erro ao carregar promoções')
}
```

### Validação
```javascript
if (!valor || valor < 0) {
  toast.error('Valor inválido')
  return
}

if (!chave) {
  toast.error('Preencha a chave PIX')
  return
}
```

---

## 🎯 Casos de Teste

### Testar Promo
```
[ ] Criar promoção
[ ] Editar promoção
[ ] Deletar promoção
[ ] Ativar/desativar
[ ] Validar datas
[ ] Validar desconto
```

### Testar Notícia
```
[ ] Publicar notícia
[ ] Editar notícia
[ ] Deletar notícia
[ ] Publicar/despublicar
[ ] Validar conteúdo
```

### Testar Doação
```
[ ] Configurar PIX
[ ] Gerar QR Code
[ ] Copiar chave
[ ] Acessar /donate
[ ] Valores sugeridos
[ ] Valor personalizado
[ ] Histórico anônimo
```

---

## 📦 Dependências Necessárias

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "firebase": "^10.x",
  "tailwindcss": "^3.x",
  "reka-ui": "^latest",
  "lucide-vue-next": "^0.x",
  "vue-sonner": "^latest"
}
```

---

## 🔗 URLs Importantes

```
Admin: http://localhost:5173/test-visuals
Doação: http://localhost:5173/donate
Produção: https://seu-dominio.com/donate
```

---

**Última Atualização:** 12/11/2025
**Versão:** 1.0.0

Para mais detalhes, veja:
- `PAINEL_PROMO_NOTICIAS.md`
- `EXEMPLOS_INTEGRACAO.md`
- `QUICK_START.md`

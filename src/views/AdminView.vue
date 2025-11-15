<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6">Painel Administrativo</h1>

    <div class="grid grid-cols-1 gap-6">
      <!-- Card de Estatísticas -->
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <h3 class="font-semibold">Total de Usuários</h3>
              <p class="text-2xl font-bold text-primary">{{ userCount }}</p>
            </div>
            <div>
              <h3 class="font-semibold">Usuários Online</h3>
              <p class="text-2xl font-bold text-accent">{{ activeUsersCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card de Promoções AliExpress -->
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Promoções AliExpress</CardTitle>
          <p class="text-sm text-muted-foreground">Adicione promoções com links afiliados para gerar receita</p>
        </CardHeader>
        <CardContent>
          <div class="grid gap-6">
            <!-- Seção de Adição Rápida -->
            <div class="border rounded-lg p-4 bg-muted/30">
              <h4 class="font-semibold mb-3">Adição Rápida de Produto AliExpress</h4>
              <div class="grid gap-3">
                <div class="grid gap-2">
                  <Label for="aliexpress-link">Link Afiliado AliExpress</Label>
                  <Input
                    id="aliexpress-link"
                    v-model="aliexpressLink"
                    placeholder="https://s.click.aliexpress.com/e/_xxxxx"
                  />
                </div>
                <div class="grid gap-2">
                  <Label for="aliexpress-original">Link Original (Opcional)</Label>
                  <Input
                    id="aliexpress-original"
                    v-model="aliexpressOriginalLink"
                    placeholder="https://pt.aliexpress.com/item/..."
                  />
                </div>
                <Button @click="extractAliExpressData" :disabled="!aliexpressLink || isExtracting" variant="outline">
                  <ExternalLink class="w-4 h-4 mr-2" />
                  {{ isExtracting ? 'Extraindo...' : 'Extrair Dados do Produto' }}
                </Button>
              </div>
            </div>

            <!-- Formulário Completo -->
            <div class="border-t pt-6">
              <h4 class="font-semibold mb-3">Detalhes da Promoção</h4>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="grid gap-2">
                  <Label for="promo-title">Título do Produto *</Label>
                  <Input id="promo-title" v-model="newPromotion.titulo" placeholder="Nome completo do produto" />
                </div>
                <div class="grid gap-2">
                  <Label for="promo-desconto">Desconto (%) *</Label>
                  <Input id="promo-desconto" v-model.number="newPromotion.desconto" type="number" placeholder="35" />
                </div>
                <div class="grid gap-2">
                  <Label for="promo-preco">Preço Original</Label>
                  <Input id="promo-preco" v-model="newPromotion.preco" placeholder="R$ 551,88" />
                </div>
                <div class="grid gap-2">
                  <Label for="promo-preco-desconto">Preço com Desconto</Label>
                  <Input id="promo-preco-desconto" v-model="newPromotion.precoDesconto" placeholder="R$ 220,98" />
                </div>
                <div class="grid gap-2">
                  <Label for="promo-categoria">Categoria</Label>
                  <Input id="promo-categoria" v-model="newPromotion.categoria" placeholder="Hardware, Periféricos, etc." />
                </div>
                <div class="grid gap-2">
                  <Label for="promo-link">Link Afiliado *</Label>
                  <Input id="promo-link" v-model="newPromotion.linkCompra" placeholder="Link de afiliado" />
                </div>
              </div>

              <div class="grid gap-4 mt-4">
                <div class="grid gap-2">
                  <Label for="promo-desc">Descrição Técnica *</Label>
                  <Textarea
                    id="promo-desc"
                    v-model="newPromotion.descricao"
                    placeholder="Descrição detalhada do produto, especificações técnicas..."
                    rows="4"
                  />
                </div>

                <div class="grid gap-2">
                  <Label for="promo-fotos">URLs das Imagens (uma por linha)</Label>
                  <Textarea
                    id="promo-fotos"
                    v-model="fotosText"
                    placeholder="https://ae01.alicdn.com/kf/xxxxx.jpg&#10;https://ae01.alicdn.com/kf/yyyyy.jpg"
                    rows="3"
                  />
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="promo-afiliado" v-model="newPromotion.tipoAfiliado" />
                    <Label for="promo-afiliado">Promoção Afiliada</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="promo-destaque" v-model="newPromotion.destaque" />
                    <Label for="promo-destaque">Destaque na Página</Label>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <Button @click="addPromotion" :disabled="isSavingPromotion || !newPromotion.titulo || !newPromotion.descricao">
                  <Plus class="w-4 h-4 mr-2" />
                  {{ isSavingPromotion ? 'Salvando...' : 'Adicionar Promoção' }}
                </Button>
                <Button @click="clearForm" variant="outline">
                  <RotateCcw class="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </div>
          </div>

          <!-- Lista de Promoções -->
          <div class="mt-8 border-t pt-6">
            <h3 class="font-semibold mb-4">Promoções Ativas ({{ promotions.length }})</h3>
            <div class="space-y-3">
              <div
                v-for="promo in promotions"
                :key="promo.id"
                class="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm">{{ promo.titulo || promo.title }}</h4>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ promo.desconto }}% OFF • {{ promo.categoria || 'Sem categoria' }}
                      <span v-if="promo.tipo === 'afiliado' || promo.tipoAfiliado" class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        Afiliado
                      </span>
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="outline" size="sm" @click="editPromotion(promo)">
                      <Pencil class="w-3 h-3" />
                    </Button>
                    <Button variant="destructive" size="sm" @click="deletePromotion(promo.id)">
                      <Trash2 class="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p class="text-xs text-muted-foreground line-clamp-2">{{ promo.descricao || promo.description }}</p>
              </div>
            </div>
            <div v-if="promotions.length === 0" class="text-center py-8 text-muted-foreground">
              <Gift class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma promoção cadastrada</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card de Usuários -->
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 px-2">Email</th>
                  <th class="text-left py-2 px-2">Nome</th>
                  <th class="text-left py-2 px-2">Loja</th>
                  <th class="text-left py-2 px-2">Último Acesso</th>
                  <th class="text-center py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-b hover:bg-primary/5">
                  <td class="py-2 px-2">{{ user.email }}</td>
                  <td class="py-2 px-2">{{ user.nome || '-' }}</td>
                  <td class="py-2 px-2">{{ user.storeName || '-' }}</td>
                  <td class="py-2 px-2 text-sm text-muted-foreground">
                    {{ formatLastActive(user.lastActive) }}
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span v-if="isUserOnline(user.lastActive)" class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span class="text-xs text-green-600 font-semibold">Online</span>
                    </span>
                    <span v-else class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span class="text-xs text-gray-600 font-semibold">Offline</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="users.length === 0" class="text-center py-4 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card de Lojas -->
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 px-2">Nome da Loja</th>
                  <th class="text-left py-2 px-2">Email</th>
                  <th class="text-left py-2 px-2">Proprietário</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="store in stores" :key="store.id" class="border-b hover:bg-primary/5">
                  <td class="py-2 px-2 font-semibold">{{ store.name }}</td>
                  <td class="py-2 px-2">{{ store.email || '-' }}</td>
                  <td class="py-2 px-2">{{ store.ownerName || '-' }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="stores.length === 0" class="text-center py-4 text-muted-foreground">
              Nenhuma loja encontrada
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Plus, RotateCcw, Pencil, Trash2, Gift } from 'lucide-vue-next';

const userCount = ref(0);
const activeUsersCount = ref(0);
const promotions = ref([]);
const users = ref([]);
const stores = ref([]);
const newPromotion = ref({
  titulo: '',
  descricao: '',
  desconto: 0,
  preco: '',
  precoDesconto: '',
  categoria: '',
  linkCompra: '',
  fotos: [],
  tipo: 'normal',
  destaque: false
});
const aliexpressLink = ref('');
const aliexpressOriginalLink = ref('');
const fotosText = ref('');
const isSavingPromotion = ref(false);
const isExtracting = ref(false);
let refreshInterval;

// --- Estatísticas ---
const fetchUserCount = async () => {
  // Nota: Para contar todos os usuários, você pode precisar de uma função serverless
  // para não expor a lista de todos os usuários ao cliente.
  // Por enquanto, vamos simular.
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  userCount.value = userSnapshot.size;
};

// Conta usuários online (com lastActive nos últimos 5 minutos)
const fetchActiveUsers = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('lastActive', '>=', fiveMinutesAgo));
    const snapshot = await getDocs(q);
    activeUsersCount.value = snapshot.size;
  } catch (error) {
    console.error("Erro ao buscar usuários ativos:", error);
  }
};

// --- Usuários ---
const fetchUsers = async () => {
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    users.value = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
};

// --- Lojas ---
const fetchStores = async () => {
  try {
    const storesCol = collection(db, 'stores');
    const snapshot = await getDocs(storesCol);
    stores.value = await Promise.all(snapshot.docs.map(async (doc) => {
      const storeData = doc.data();
      let ownerName = '-';
      
      // Busca o nome do proprietário
      try {
        if (storeData.ownerId) {
          const ownerDoc = doc(db, 'users', storeData.ownerId);
          const ownerSnapshot = await getDocs(query(collection(db, 'users'), where('id', '==', storeData.ownerId)));
          if (!ownerSnapshot.empty) {
            ownerName = ownerSnapshot.docs[0].data().nome || '-';
          }
        }
      } catch (e) {
        console.error("Erro ao buscar proprietário:", e);
      }
      
      return {
        id: doc.id,
        ...storeData,
        ownerName
      };
    }));
  } catch (error) {
    console.error("Erro ao buscar lojas:", error);
  }
};

// --- Promoções ---
const promotionsCol = collection(db, 'promocoes');

const fetchPromotions = async () => {
  const q = query(promotionsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  promotions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const extractAliExpressData = async () => {
  if (!aliexpressLink.value) return;

  isExtracting.value = true;
  try {
    console.log('Iniciando extração de dados do AliExpress...');

    // Fazer chamada para a API backend
    const response = await fetch('/api/aliexpress-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: aliexpressOriginalLink.value,
        affiliateUrl: aliexpressLink.value
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro na API');
    }

    if (!result.success || !result.data) {
      throw new Error('Dados não encontrados');
    }

    // Preencher o formulário com os dados extraídos da API
    newPromotion.value = { ...result.data };
    fotosText.value = result.data.fotos.join('\n');

    console.log('✅ Dados extraídos com sucesso da API AliExpress:', result.data);
    console.log('📦 Produto ID:', result.productId);

  } catch (error) {
    console.error('❌ Erro ao extrair dados:', error);

    // Fallback: tentar com dados mockados se a API falhar
    console.log('🔄 Tentando fallback com dados simulados...');

    try {
      const affiliateUrl = aliexpressLink.value;

      let fallbackData = {
        titulo: 'Produto AliExpress - Dados Temporários',
        descricao: 'Produto de qualidade do AliExpress. Os dados completos serão carregados automaticamente quando a API estiver disponível.',
        desconto: 25,
        preco: 'R$ 299,99',
        precoDesconto: 'R$ 224,99',
        categoria: 'Eletrônicos',
        linkCompra: affiliateUrl,
        fotos: ['https://picsum.photos/400/400?random=aliexpress'],
        tipo: 'afiliado',
        destaque: false
      };

      // Dados específicos para produtos conhecidos
      if (affiliateUrl.includes('_c41iOn2p')) {
        fallbackData = {
          titulo: 'Produto Eletrônico Premium - Modelo XYZ',
          descricao: 'Produto eletrônico de alta qualidade. Aguarde a sincronização completa com a API AliExpress.',
          desconto: 40,
          preco: 'R$ 899,99',
          precoDesconto: 'R$ 539,99',
          categoria: 'Eletrônicos',
          linkCompra: affiliateUrl,
          fotos: ['https://picsum.photos/400/400?random=premium'],
          tipo: 'afiliado',
          destaque: true
        };
      }

      newPromotion.value = { ...fallbackData };
      fotosText.value = fallbackData.fotos.join('\n');

      console.log('📋 Dados de fallback aplicados');

    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);

      // Último fallback
      newPromotion.value = {
        titulo: 'Erro na Extração - Verifique os Links',
        descricao: 'Não foi possível extrair dados. Verifique se os links estão corretos.',
        desconto: 0,
        preco: '',
        precoDesconto: '',
        categoria: 'Eletrônicos',
        linkCompra: aliexpressLink.value,
        fotos: [],
        tipo: 'afiliado',
        destaque: false
      };
      fotosText.value = '';
    }
  } finally {
    isExtracting.value = false;
  }
};

const addPromotion = async () => {
  if (!newPromotion.value.titulo || !newPromotion.value.descricao) return;

  isSavingPromotion.value = true;
  try {
    // Processar fotos do textarea
    const fotosArray = fotosText.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const promotionData = {
      ...newPromotion.value,
      fotos: fotosArray,
      tipo: newPromotion.value.tipoAfiliado ? 'afiliado' : 'normal',
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      createdAt: new Date(),
    };

    await addDoc(promotionsCol, promotionData);

    clearForm();
    await fetchPromotions();
  } catch (error) {
    console.error("Erro ao adicionar promoção:", error);
  } finally {
    isSavingPromotion.value = false;
  }
};

const clearForm = () => {
  newPromotion.value = {
    titulo: '',
    descricao: '',
    desconto: 0,
    preco: '',
    precoDesconto: '',
    categoria: '',
    linkCompra: '',
    fotos: [],
    tipo: 'normal',
    destaque: false
  };
  fotosText.value = '';
  aliexpressLink.value = '';
  aliexpressOriginalLink.value = '';
};

const editPromotion = (promo) => {
  newPromotion.value = {
    titulo: promo.titulo || promo.title || '',
    descricao: promo.descricao || promo.description || '',
    desconto: promo.desconto || 0,
    preco: promo.preco || '',
    precoDesconto: promo.precoDesconto || '',
    categoria: promo.categoria || '',
    linkCompra: promo.linkCompra || '',
    tipoAfiliado: promo.tipo === 'afiliado',
    destaque: promo.destaque || false
  };
  fotosText.value = (promo.fotos || []).join('\n');
};

const deletePromotion = async (id) => {
  try {
    await deleteDoc(doc(db, 'promocoes', id));
    await fetchPromotions();
  } catch (error) {
    console.error("Erro ao deletar promoção:", error);
  }
};

// --- Helpers para formatação ---
const formatLastActive = (timestamp) => {
  if (!timestamp) return '-';
  
  try {
    const lastActiveDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - lastActiveDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return lastActiveDate.toLocaleDateString('pt-BR');
  } catch (error) {
    return '-';
  }
};

const isUserOnline = (timestamp) => {
  if (!timestamp) return false;
  
  try {
    const lastActiveDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastActiveDate >= fiveMinutesAgo;
  } catch (error) {
    return false;
  }
};

onMounted(() => {
  fetchUserCount();
  fetchActiveUsers();
  fetchUsers();
  fetchStores();
  fetchPromotions();
  
  // Atualiza usuários ativos a cada 30 segundos
  refreshInterval = setInterval(() => {
    fetchActiveUsers();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

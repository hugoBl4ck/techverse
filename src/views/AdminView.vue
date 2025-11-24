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

      <!-- Card de Configuração PIX -->
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Doação (PIX)</CardTitle>
          <p class="text-sm text-muted-foreground">Configure sua chave PIX para receber doações diretamente</p>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <Label for="pix-key">Chave PIX *</Label>
              <Input 
                id="pix-key" 
                v-model="pixConfig.chave" 
                placeholder="CPF, Email, Telefone ou Chave Aleatória" 
              />
            </div>
            <div class="grid gap-2">
              <Label for="pix-name">Nome do Beneficiário *</Label>
              <Input 
                id="pix-name" 
                v-model="pixConfig.nomeRecebimento" 
                placeholder="Nome completo (como no banco)" 
              />
            </div>
            <div class="grid gap-2">
              <Label for="pix-city">Cidade *</Label>
              <Input 
                id="pix-city" 
                v-model="pixConfig.cidade" 
                placeholder="Cidade do banco" 
              />
            </div>
            <div class="grid gap-2">
              <Label for="pix-cep">CEP (Opcional)</Label>
              <Input 
                id="pix-cep" 
                v-model="pixConfig.cep" 
                placeholder="00000-000" 
              />
            </div>
            <div class="flex items-end">
              <Button 
                @click="handleSavePixConfig" 
                :disabled="isSavingPix || !pixConfig.chave || !pixConfig.nomeRecebimento || !pixConfig.cidade"
                class="w-full"
              >
                <Gift class="w-4 h-4 mr-2" />
                {{ isSavingPix ? 'Salvando...' : 'Salvar Configuração' }}
              </Button>
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
                  <th class="text-center py-2 px-2">Clientes Criados</th>
                  <th class="text-center py-2 px-2">Serviços Criados</th>
                  <th class="text-left py-2 px-2">IP</th>
                  <th class="text-left py-2 px-2">Localização</th>
                  <th class="text-left py-2 px-2">Último Acesso</th>
                  <th class="text-center py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-b hover:bg-primary/5">
                  <td class="py-2 px-2">{{ user.email }}</td>
                  <td class="py-2 px-2">{{ user.nome || '-' }}</td>
                  <td class="py-2 px-2">{{ user.storeName || '-' }}</td>
                  <td class="py-2 px-2 text-center">{{ user.stats?.clientsCreated || 0 }}</td>
                  <td class="py-2 px-2 text-center">{{ user.stats?.servicesCreated || 0 }}</td>
                  <td class="py-2 px-2 text-xs text-muted-foreground">{{ user.lastIp || '-' }}</td>
                  <td class="py-2 px-2 text-xs text-muted-foreground">{{ user.lastLocation || '-' }}</td>
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
                  <td class="py-2 px-2">
                    <div class="flex flex-col">
                      <span class="font-medium text-foreground">{{ user.nome || 'Sem nome' }}</span>
                      <span class="text-xs text-muted-foreground">{{ user.email }}</span>
                    </div>
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

      <!-- Card de Ranking CPU -->
      <Card>
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <span>Gerenciar Ranking CPU</span>
            <Button size="sm" variant="outline" @click="seedCpuDatabase">
              <Database class="w-4 h-4 mr-2" />
              Seed Inicial
            </Button>
          </CardTitle>
          <p class="text-sm text-muted-foreground">Aprove envios de usuários ou gerencie o ranking atual.</p>
        </CardHeader>
        <CardContent>
          <Tabs default-value="pending" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pendentes ({{ pendingSubmissions.length }})</TabsTrigger>
              <TabsTrigger value="active">Ranking Ativo</TabsTrigger>
            </TabsList>
            
            <!-- Pendentes -->
            <TabsContent value="pending" class="space-y-4 pt-4">
              <div v-if="pendingSubmissions.length === 0" class="text-center py-8 text-muted-foreground">
                Nenhum envio pendente.
              </div>
              <div v-else class="grid gap-4">
                <div v-for="sub in pendingSubmissions" :key="sub.id" class="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start">
                  <div v-if="sub.imageUrl" class="w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <a :href="sub.imageUrl" target="_blank">
                      <img :src="sub.imageUrl" class="w-full h-full object-cover hover:scale-110 transition-transform" />
                    </a>
                  </div>
                  <div class="flex-1 space-y-1">
                    <h4 class="font-bold text-lg">{{ sub.model }}</h4>
                    <p class="text-sm text-muted-foreground">Memória: {{ sub.memoryFreq }}</p>
                    <div class="flex gap-4 mt-2">
                      <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Single: {{ sub.single }}</div>
                      <div class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">Multi: {{ sub.multi }}</div>
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">Enviado em: {{ sub.createdAt?.toDate().toLocaleString() }}</p>
                  </div>
                  <div class="flex flex-col gap-2 w-full sm:w-auto">
                    <Button size="sm" @click="openEditModal(sub, true)">
                      <CheckCircle2 class="w-4 h-4 mr-2" /> Aprovar/Editar
                    </Button>
                    <Button size="sm" variant="destructive" @click="rejectSubmission(sub.id)">
                      <XCircle class="w-4 h-4 mr-2" /> Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <!-- Ativos -->
            <TabsContent value="active" class="space-y-4 pt-4">
               <div class="flex justify-end mb-4">
                 <Button size="sm" @click="openEditModal({}, false)">
                   <Plus class="w-4 h-4 mr-2" /> Adicionar Manualmente
                 </Button>
               </div>
               <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2 px-2">CPU</th>
                      <th class="text-right py-2 px-2">Single</th>
                      <th class="text-right py-2 px-2">Multi</th>
                      <th class="text-center py-2 px-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="cpu in activeRanking" :key="cpu.id" class="border-b hover:bg-muted/20">
                      <td class="py-2 px-2 font-medium">{{ cpu.name }}</td>
                      <td class="py-2 px-2 text-right">{{ cpu.single }}</td>
                      <td class="py-2 px-2 text-right">{{ cpu.multi }}</td>
                      <td class="py-2 px-2 text-center">
                        <div class="flex justify-center gap-2">
                          <Button size="icon" variant="ghost" @click="openEditModal(cpu, false)">
                            <Pencil class="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" class="text-destructive" @click="deleteRankingItem(cpu.id)">
                            <Trash2 class="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <!-- Modal de Edição/Aprovação -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-background rounded-lg shadow-xl w-full max-w-md p-6 border border-border">
          <h3 class="text-lg font-bold mb-4">{{ isApproving ? 'Aprovar e Editar' : 'Editar CPU' }}</h3>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>Modelo da CPU</Label>
              <Input v-model="editForm.name" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Single Score</Label>
                <Input type="number" v-model.number="editForm.single" />
              </div>
              <div class="space-y-2">
                <Label>Multi Score</Label>
                <Input type="number" v-model.number="editForm.multi" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Categoria (Ex: Forte, Médio)</Label>
              <Input v-model="editForm.category" />
            </div>
            <div class="flex items-center gap-2">
               <input type="checkbox" id="isNew" v-model="editForm.new" class="rounded border-gray-300" />
               <Label for="isNew">Marcar como NOVO</Label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <Button variant="outline" @click="showEditModal = false">Cancelar</Button>
            <Button @click="saveCpuData">
              {{ isApproving ? 'Aprovar e Publicar' : 'Salvar Alterações' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Plus, RotateCcw, Pencil, Trash2, Gift, Save, CheckCircle2, XCircle, Database } from 'lucide-vue-next';
import { useFirestore } from '@/composables/useFirestore';
import { toast } from 'vue-sonner';

const { getPixConfig, savePixConfig } = useFirestore();

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

const isSavingPix = ref(false);
const pixConfig = ref({
  chave: '',
  nomeRecebimento: '',
  cidade: '',
  cep: ''
});
let refreshInterval;

// --- CPU Ranking State ---
const pendingSubmissions = ref([])
const activeRanking = ref([])
const showEditModal = ref(false)
const isApproving = ref(false)
const editForm = ref({
  id: '',
  name: '',
  single: 0,
  multi: 0,
  category: '',
  new: false,
  memoryFreq: '', // Optional, for reference
  imageUrl: '' // Optional, for reference
})

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
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simular resposta baseada no link fornecido
    let mockData;

    if (aliexpressLink.value.includes('_c41iOn2p')) {
      // Dados específicos para o produto fornecido pelo usuário
      mockData = {
        titulo: 'Produto Eletrônico Premium - Modelo XYZ',
        descricao: 'Produto eletrônico de alta qualidade com tecnologia avançada. Design moderno, performance excepcional e garantia estendida. Ideal para profissionais e entusiastas que buscam o melhor em qualidade e inovação tecnológica.',
        desconto: 40,
        preco: 'R$ 899,99',
        precoDesconto: 'R$ 539,99',
        categoria: 'Eletrônicos',
        linkCompra: aliexpressLink.value,
        fotos: [
          'https://ae-pic-a1.aliexpress-media.com/kf/S2b5e4a0d93004dc0843febdbe9eff720X.jpg_960x960q75.jpg_.avif',
          'https://ae01.alicdn.com/kf/S2b5e4a0d93004dc0843febdbe9eff720X.jpg_350x350.jpg'
        ],
        tipo: 'afiliado',
        destaque: true
      };
    } else if (aliexpressOriginalLink.value.includes('1005006997378224')) {
      // Placa-mãe B450
      mockData = {
        titulo: 'MACHINIST B450 Motherboard AMD Processor Dual-channel DDR4 Memory AM4 Mainboard M.2 NVME',
        descricao: 'Placa-mãe B450 de alta performance com suporte aos processadores AMD Ryzen 5000 series. Dual-channel DDR4 até 128GB, slots M.2 NVMe PCIe 3.0 para SSDs ultrarrápidos, USB 3.1 Gen1, HDMI 2.0, DisplayPort 1.4, Gigabit Ethernet, e todas as features necessárias para builds gaming e workstation.',
        desconto: 35,
        preco: 'R$ 551,88',
        precoDesconto: 'R$ 220,98',
        categoria: 'Hardware',
        linkCompra: aliexpressLink.value,
        fotos: [
          'https://ae-pic-a1.aliexpress-media.com/kf/S38903a9e49484defa52d952d76394200A.jpg_960x960q75.jpg_.avif',
          'https://ae01.alicdn.com/kf/S38903a9e49484defa52d952d76394200A.jpg_350x350.jpg'
        ],
        tipo: 'afiliado',
        destaque: true
      };
    } else {
      // Dados genéricos para outros produtos
      mockData = {
        titulo: 'Produto AliExpress Extraído',
        descricao: 'Produto de qualidade do AliExpress com garantia e frete internacional. Verifique as especificações completas no link do produto para mais detalhes técnicos.',
        desconto: 25,
        preco: 'R$ 299,99',
        precoDesconto: 'R$ 224,99',
        categoria: 'Eletrônicos',
        linkCompra: aliexpressLink.value,
        fotos: [
          'https://picsum.photos/400/400?random=aliexpress'
        ],
        tipo: 'afiliado',
        destaque: false
      };
    }

    // Simular resposta da API
    const mockResponse = {
      success: true,
      productId: 'mock-product-id',
      data: mockData,
      extractedAt: new Date().toISOString(),
      mock: true,
      message: 'Dados simulados - API real funcionará no Vercel'
    };
    
    // Preencher o formulário com os dados simulados
    newPromotion.value = { ...mockData };
    fotosText.value = mockData.fotos.join('\n');
    
  } catch (error) {
    console.error('❌ Erro na simulação:', error);

    // Fallback básico
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

// --- PIX Config ---
const loadPixConfig = async () => {
  try {
    const config = await getPixConfig();
    if (config) {
      pixConfig.value = {
        chave: config.chave || '',
        nomeRecebimento: config.nomeRecebimento || '',
        cidade: config.cidade || '',
        cep: config.cep || ''
      };
    }
  } catch (error) {
    console.error("Erro ao carregar config PIX:", error);
  }
};

const handleSavePixConfig = async () => {
  if (!pixConfig.value.chave || !pixConfig.value.nomeRecebimento || !pixConfig.value.cidade) return;
  
  isSavingPix.value = true;
  try {
    await savePixConfig(pixConfig.value);
    toast.success('Configuração PIX salva com sucesso!');
  } catch (error) {
    console.error("Erro ao salvar config PIX:", error);
    toast.error('Erro ao salvar configuração.');
  } finally {
    isSavingPix.value = false;
  }
};

// --- CPU Ranking Logic ---
const fetchPendingSubmissions = async () => {
  try {
    const q = query(collection(db, 'cpu_submissions'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    pendingSubmissions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Erro ao buscar envios pendentes:', error)
  }
}

const fetchActiveRanking = async () => {
  try {
    const q = query(collection(db, 'cpu_ranking'), orderBy('multi', 'desc'))
    const snapshot = await getDocs(q)
    activeRanking.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Erro ao buscar ranking ativo:', error)
  }
}

const openEditModal = (item, approving) => {
  isApproving.value = approving
  editForm.value = {
    id: item.id || '',
    name: item.model || item.name || '',
    single: item.single || 0,
    multi: item.multi || 0,
    category: item.category || 'Médio',
    new: item.new || false,
    memoryFreq: item.memoryFreq || '',
    imageUrl: item.imageUrl || ''
  }
  showEditModal.value = true
}

const saveCpuData = async () => {
  try {
    const data = {
      name: editForm.value.name,
      single: editForm.value.single,
      multi: editForm.value.multi,
      category: editForm.value.category,
      new: editForm.value.new,
      updatedAt: serverTimestamp()
    }

    if (isApproving.value) {
      // Add to ranking
      await addDoc(collection(db, 'cpu_ranking'), data)
      // Delete from submissions
      await deleteDoc(doc(db, 'cpu_submissions', editForm.value.id))
      toast.success('CPU Aprovada e Adicionada ao Ranking!')
    } else {
      if (editForm.value.id) {
        // Update existing
        await updateDoc(doc(db, 'cpu_ranking', editForm.value.id), data)
        toast.success('CPU Atualizada!')
      } else {
        // Create new manual
        await addDoc(collection(db, 'cpu_ranking'), data)
        toast.success('CPU Criada!')
      }
    }
    
    showEditModal.value = false
    fetchPendingSubmissions()
    fetchActiveRanking()
  } catch (error) {
    console.error('Erro ao salvar CPU:', error)
    toast.error('Erro ao salvar.')
  }
}

const rejectSubmission = async (id) => {
  if (!confirm('Tem certeza que deseja rejeitar este envio?')) return
  try {
    await deleteDoc(doc(db, 'cpu_submissions', id))
    toast.success('Envio rejeitado.')
    fetchPendingSubmissions()
  } catch (error) {
    console.error('Erro ao rejeitar:', error)
    toast.error('Erro ao rejeitar.')
  }
}

const deleteRankingItem = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta CPU do ranking?')) return
  try {
    await deleteDoc(doc(db, 'cpu_ranking', id))
    toast.success('CPU removida.')
    fetchActiveRanking()
  } catch (error) {
    console.error('Erro ao remover:', error)
    toast.error('Erro ao remover.')
  }
}

const seedCpuDatabase = async () => {
  if (!confirm('Isso vai adicionar os dados iniciais ao banco. Continuar?')) return
  
  const initialCpuData = [
    { name: 'Intel Core i9-14900K', single: 978, multi: 17100, category: 'Extremamente Forte', new: true },
    { name: 'AMD Ryzen 9 7950X', single: 790, multi: 15800, category: 'Extremamente Forte' },
    { name: 'Intel Core i9-13900K', single: 945, multi: 16800, category: 'Extremamente Forte' },
    { name: 'AMD Ryzen 9 7950X3D', single: 780, multi: 15500, category: 'Extremamente Forte' },
    { name: 'Intel Core i7-14700K', single: 930, multi: 15200, category: 'Extremamente Forte', new: true },
    { name: 'Intel Core i7-13700K', single: 870, multi: 12500, category: 'Muito Forte' },
    { name: 'AMD Ryzen 9 5950X', single: 690, multi: 11900, category: 'Muito Forte' },
    { name: 'Intel Core i5-14600K', single: 860, multi: 10400, category: 'Muito Forte', new: true },
    { name: 'Intel Core i5-13600K', single: 830, multi: 9900, category: 'Muito Forte' },
    { name: 'AMD Ryzen 7 7800X3D', single: 710, multi: 7800, category: 'Forte (Gaming King)', special: 'Gaming King' },
    { name: 'Intel Core i9-12900K', single: 810, multi: 11400, category: 'Muito Forte' },
    { name: 'AMD Ryzen 7 7700X', single: 770, multi: 8000, category: 'Forte' },
    { name: 'AMD Ryzen 9 5900X', single: 680, multi: 9500, category: 'Forte' },
    { name: 'Intel Core i7-12700K', single: 790, multi: 9300, category: 'Forte' },
    { name: 'AMD Ryzen 7 5800X3D', single: 620, multi: 6400, category: 'Forte (Gaming)' },
    { name: 'AMD Ryzen 5 5500X3D', single: 590, multi: 4500, category: 'Custo-Benefício', new: true, special: 'Budget King' },
    { name: 'AMD Ryzen 7 5800X', single: 650, multi: 6600, category: 'Forte' },
    { name: 'Intel Core i5-12600K', single: 770, multi: 7200, category: 'Forte' },
    { name: 'AMD Ryzen 5 7600X', single: 750, multi: 6100, category: 'Médio-Alto' },
    { name: 'Intel Core i5-13400F', single: 730, multi: 6600, category: 'Médio-Alto' },
    { name: 'AMD Ryzen 5 5600X', single: 640, multi: 4800, category: 'Médio' },
    { name: 'Intel Core i5-12400F', single: 700, multi: 4900, category: 'Médio' },
    { name: 'AMD Ryzen 5 5600', single: 610, multi: 4700, category: 'Médio' },
    { name: 'Intel Core i9-9900K', single: 580, multi: 5500, category: 'Médio' },
    { name: 'AMD Ryzen 7 3700X', single: 520, multi: 5400, category: 'Médio' },
    { name: 'Intel Core i7-8700K', single: 550, multi: 3700, category: 'Médio-Baixo' },
    { name: 'AMD Ryzen 5 3600', single: 510, multi: 4000, category: 'Médio-Baixo' },
    { name: 'Intel Core i3-12100F', single: 680, multi: 3400, category: 'Entrada Forte' },
    { name: 'AMD Ryzen 5 5500', single: 580, multi: 4300, category: 'Médio-Baixo' },
    { name: 'Intel Core i5-10400F', single: 490, multi: 3100, category: 'Entrada' },
    { name: 'AMD Ryzen 5 1600', single: 380, multi: 2800, category: 'Entrada' },
  ]

  const batch = writeBatch(db)
  initialCpuData.forEach(cpu => {
    const docRef = doc(collection(db, 'cpu_ranking'))
    batch.set(docRef, cpu)
  })
  await batch.commit()
  toast.success('Database seeded!')
  fetchActiveRanking()
}

onMounted(() => {
  fetchUserCount();
  fetchActiveUsers();
  fetchUsers();
  fetchStores();
  fetchPromotions();
  loadPixConfig();
  fetchPendingSubmissions();
  fetchActiveRanking();
  
  // Atualiza usuários ativos a cada 30 segundos
  refreshInterval = setInterval(() => {
    fetchActiveUsers();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

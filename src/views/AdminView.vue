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

      <!-- Card de Promoções -->
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Promoções</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="promo-title">Título da Promoção</Label>
              <Input id="promo-title" v-model="newPromotion.title" placeholder="Ex: Desconto de 20% em CPUs" />
            </div>
            <div class="grid gap-2">
              <Label for="promo-desc">Descrição</Label>
              <Textarea id="promo-desc" v-model="newPromotion.description" placeholder="Detalhes da promoção..." />
            </div>
            <Button @click="addPromotion" :disabled="isSavingPromotion">
              {{ isSavingPromotion ? 'Salvando...' : 'Adicionar Promoção' }}
            </Button>
          </div>
          <div class="mt-6">
            <h3 class="font-semibold mb-2">Promoções Ativas</h3>
            <ul>
              <li v-for="promo in promotions" :key="promo.id" class="border-b py-2 flex justify-between items-center">
                <span>{{ promo.title }}</span>
                <Button variant="destructive" size="sm" @click="deletePromotion(promo.id)">Excluir</Button>
              </li>
            </ul>
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

const userCount = ref(0);
const activeUsersCount = ref(0);
const promotions = ref([]);
const users = ref([]);
const stores = ref([]);
const newPromotion = ref({ title: '', description: '' });
const isSavingPromotion = ref(false);
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

const addPromotion = async () => {
  if (!newPromotion.value.title) return;
  isSavingPromotion.value = true;
  try {
    await addDoc(promotionsCol, {
      ...newPromotion.value,
      createdAt: new Date(),
    });
    newPromotion.value.title = '';
    newPromotion.value.description = '';
    await fetchPromotions();
  } catch (error) {
    console.error("Erro ao adicionar promoção:", error);
  } finally {
    isSavingPromotion.value = false;
  }
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

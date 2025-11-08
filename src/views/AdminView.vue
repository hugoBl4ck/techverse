<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6">Painel Administrativo</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card de Estatísticas -->
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div>
              <h3 class="font-semibold">Total de Usuários</h3>
              <p>{{ userCount }}</p>
            </div>
            <div>
              <h3 class="font-semibold">Usuários Online</h3>
              <p>Em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card de Promoções -->
      <Card class="md:col-span-2">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const userCount = ref(0);
const promotions = ref([]);
const newPromotion = ref({ title: '', description: '' });
const isSavingPromotion = ref(false);

// --- Estatísticas ---
const fetchUserCount = async () => {
  // Nota: Para contar todos os usuários, você pode precisar de uma função serverless
  // para não expor a lista de todos os usuários ao cliente.
  // Por enquanto, vamos simular.
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  userCount.value = userSnapshot.size;
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

onMounted(() => {
  fetchUserCount();
  fetchPromotions();
});
</script>

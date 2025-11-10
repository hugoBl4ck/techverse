<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Calendar from '@/components/ui/calendar/Calendar.vue';

const { storeId } = useCurrentStore();

const allServices = ref([]);
const isLoading = ref(true);
const selectedDate = ref(new Date());
const promotions = ref([]);

const loadServices = async () => {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const servicesCol = collection(db, 'stores', storeId.value, 'ordens_servico');
    const q = query(servicesCol, orderBy('date', 'desc'));
    const servicesSnapshot = await getDocs(q);
    allServices.value = servicesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchPromotions = async () => {
  const promotionsCol = collection(db, 'promocoes');
  const q = query(promotionsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  promotions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};



onMounted(() => {
  fetchPromotions();
  loadServices(); // Added this line
});

const monthlyRevenue = computed(() => {
  if (!allServices.value) return 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return allServices.value
    .filter(service => {
      const serviceDate = new Date(service.date);
      return serviceDate.getMonth() === currentMonth && serviceDate.getFullYear() === currentYear;
    })
    .reduce((total, service) => total + (service.totalAmount || 0), 0);
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Serviços Realizados</h1>
      <router-link to="/servicos/novo">
        <Button>+ Novo Serviço</Button>
      </router-link>
    </div>
    <div v-if="isLoading" class="text-center">
      <p>Carregando...</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Todos os Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="allServices.length > 0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Configuração do Computador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow v-for="service in allServices" :key="service.id">
                <TableCell class="font-medium">{{ service.customerName }}</TableCell>
                <TableCell>{{ service.date.toLocaleDateString() }}</TableCell>
                <TableCell>R$ {{ (service.totalAmount || 0).toFixed(2) }}</TableCell>
                <TableCell>
                <ul class="list-disc list-inside">
                <li v-for="(obs, index) in service.observations" :key="index">{{ obs }}</li>
                </ul>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">{{ service.computerConfiguration }}</TableCell>
                </TableRow>
                </TableBody>
              </Table>
            </div>
            <div v-else class="text-center mt-8">
              <p>Nenhum serviço registrado ainda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="lg:col-span-1 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">R$ {{ monthlyRevenue.toFixed(2) }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar v-model="selectedDate" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="promotions.length > 0" class="space-y-4">
              <div v-for="promo in promotions" :key="promo.id">
                <h3 class="font-semibold">{{ promo.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ promo.description }}</p>
              </div>
            </div>
            <p v-else class="text-muted-foreground">Nenhuma promoção ativa no momento.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

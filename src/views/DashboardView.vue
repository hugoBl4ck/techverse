<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/firebase/config.js";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useCurrentStore } from "@/composables/useCurrentStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, User, Zap } from "lucide-vue-next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const { storeId } = useCurrentStore();

const allServices = ref([]);
const clients = ref([]);
const isLoading = ref(true);
const promotions = ref([]);
const selectedPeriod = ref("current-month");

// Número de serviços no período
const servicesCount = computed(() => filteredServices.value.length);

// Total de clientes
const totalClients = computed(() => clients.value.length);

// Clientes novos no período
const newClientsInPeriod = computed(() => {
  const { startDate, endDate } = getPeriodDates();
  return clients.value.filter(client =>
    client.createdAt &&
    client.createdAt >= startDate &&
    client.createdAt <= endDate
  ).length;
});

// Opções de período
const periodOptions = [
  { value: "current-month", label: "Mês Atual" },
  { value: "last-month", label: "Mês Anterior" },
  { value: "last-3-months", label: "Últimos 3 Meses" },
  { value: "last-6-months", label: "Últimos 6 Meses" },
  { value: "current-year", label: "Ano Atual" },
];

const loadServices = async () => {

  if (!storeId.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const servicesCol = collection(
      db,
      "stores",
      storeId.value,
      "ordens_servico"
    );
    const q = query(servicesCol, orderBy("date", "desc"));
    const servicesSnapshot = await getDocs(q);

    allServices.value = servicesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });

  } catch (error) {
    console.error('❌ Erro ao carregar serviços:', error);
    allServices.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchPromotions = async () => {
  try {
    const promotionsCol = collection(db, "promos");
    const q = query(promotionsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    promotions.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao carregar promoções:', error);
    promotions.value = [];
  }
};

const loadClients = async () => {
  if (!storeId.value) return;

  try {
    const clientesCol = collection(db, 'stores', storeId.value, 'clientes');
    const snapshot = await getDocs(clientesCol);
    clients.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
    }));
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    clients.value = [];
  }
};

onMounted(() => {
  fetchPromotions();
});

// Monitora mudanças no storeId para carregar dados quando disponível
watch(
  () => storeId.value,
  (newStoreId) => {
    if (newStoreId) {
      loadServices();
      loadClients();
    }
  },
  { immediate: true }
);

// Função para obter datas do período selecionado
const getPeriodDates = () => {
  const now = new Date();
  let startDate, endDate;

  switch (selectedPeriod.value) {
    case "current-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "last-month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "last-3-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      endDate = now;
      break;
    case "last-6-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      endDate = now;
      break;
    case "current-year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  return { startDate, endDate };
};

// Serviços filtrados por período
const filteredServices = computed(() => {
  const { startDate, endDate } = getPeriodDates();
  return allServices.value.filter((service) => {
    const serviceDate = new Date(service.date);
    return (
      serviceDate >= startDate &&
      serviceDate <= endDate &&
      service.status !== "cancelada"
    );
  });
});

// Faturamento do período selecionado
const periodRevenue = computed(() => {
  return filteredServices.value.reduce(
    (total, service) => total + (service.totalAmount || 0),
    0
  );
});

</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Serviços Realizados</h1>
      <router-link to="/ordens-servico/nova">
        <Button>+ Nova Ordem de Serviço</Button>
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p>Carregando dados...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <div class="flex justify-between items-center">
              <CardTitle>Serviços - {{selectedPeriod === 'current-month' ? 'Mês Atual' : periodOptions.find(p =>
                p.value === selectedPeriod)?.label }}</CardTitle>
              <select v-model="selectedPeriod"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option v-for="option in periodOptions" :key="option.value" :value="option.value"
                  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="filteredServices.length > 0">
              <Table>
                <TableHeader>
                  <TableRow class="border-b border-border/50 bg-muted/50 hover:bg-muted/50">
                    <TableHead class="font-semibold text-foreground">Cliente</TableHead>
                    <TableHead class="font-semibold text-foreground">Data</TableHead>
                    <TableHead class="font-semibold text-foreground">Valor</TableHead>
                    <TableHead class="font-semibold text-foreground">Observações</TableHead>
                    <TableHead class="font-semibold text-foreground">Configuração do Computador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="service in filteredServices" :key="service.id">
                    <TableCell class="font-medium">{{
                      service.customerName
                      }}</TableCell>
                    <TableCell>{{
                      service.date?.toLocaleDateString?.() || "N/A"
                      }}</TableCell>
                    <TableCell>R$ {{ (service.totalAmount || 0).toFixed(2) }}</TableCell>
                    <TableCell>
                      <ul v-if="service.observations" class="list-disc list-inside">
                        <li v-for="(obs, index) in Array.isArray(
                          service.observations
                        )
                          ? service.observations
                          : [service.observations]" :key="index">
                          {{ obs }}
                        </li>
                      </ul>
                      <span v-else class="text-muted-foreground text-sm">-</span>
                    </TableCell>
                    <TableCell class="text-sm text-muted-foreground">{{
                      service.computerConfiguration || "-"
                      }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div v-else class="text-center mt-8">
              <p>Nenhum serviço registrado neste período.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="lg:col-span-1 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento do Período</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-3xl font-bold text-purple-600">R$ {{ periodRevenue.toFixed(2) }}</p>
            <p class="text-sm text-gray-600">{{ servicesCount }} serviço(s)</p>
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
                <p class="text-sm text-muted-foreground">
                  {{ promo.description }}
                </p>
              </div>
            </div>
            <p v-else class="text-muted-foreground">
              Nenhuma promoção ativa no momento.
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Métricas Adicionais -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-medium text-foreground flex items-center justify-between">
              Total de Clientes
              <Users class="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-foreground">
              {{ totalClients }}
            </div>
            <p class="text-xs text-muted-foreground mt-2">Clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-medium text-foreground flex items-center justify-between">
              Clientes Novos
              <User class="w-4 h-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-foreground">
              {{ newClientsInPeriod }}
            </div>
            <p class="text-xs text-muted-foreground mt-2">No período selecionado</p>
          </CardContent>
        </Card>

        <Card class="border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-medium text-foreground flex items-center justify-between">
              Serviços Realizados
              <Zap class="w-4 h-4 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-foreground">
              {{ servicesCount }}
            </div>
            <p class="text-xs text-muted-foreground mt-2">No período selecionado</p>
          </CardContent>
        </Card>
      </div>
    </div>

  </div>
</template>

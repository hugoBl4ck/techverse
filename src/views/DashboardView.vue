<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/firebase/config.js";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useCurrentStore } from "@/composables/useCurrentStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { storeId } = useCurrentStore();

const allServices = ref([]);
const isLoading = ref(true);
const promotions = ref([]);
const selectedPeriod = ref("current-month");

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
    console.error("StoreId não disponível no Dashboard");
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  console.log("Dashboard - Carregando serviços para store:", storeId.value);

  try {
    const servicesCol = collection(
      db,
      "stores",
      storeId.value,
      "ordens_servico"
    );
    const q = query(servicesCol, orderBy("date", "desc"));
    const servicesSnapshot = await getDocs(q);

    console.log(
      `Dashboard - ${servicesSnapshot.docs.length} serviços carregados`
    );

    allServices.value = servicesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });
    console.log("Dashboard - Serviços processados:", allServices.value.length);
  } catch (error) {
    console.error("Erro ao carregar serviços no Dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchPromotions = async () => {
  const promotionsCol = collection(db, "promocoes");
  const q = query(promotionsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  promotions.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
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

// Dados para o gráfico de barras (valores diários)
const dailyRevenueData = computed(() => {
  const servicesByDay = {};

  filteredServices.value.forEach((service) => {
    const dateKey = new Date(service.date).toLocaleDateString("pt-BR");
    servicesByDay[dateKey] = (servicesByDay[dateKey] || 0) + (service.totalAmount || 0);
  });

  return Object.entries(servicesByDay)
    .map(([date, value]) => ({
      name: date,
      value: parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.name) - new Date(b.name));
});

// Dados para o gráfico de linha (todos os dias do período)
const monthlyLineData = computed(() => {
  const servicesByDay = {};

  filteredServices.value.forEach((service) => {
    const dateKey = new Date(service.date).toLocaleDateString("pt-BR");
    servicesByDay[dateKey] = (servicesByDay[dateKey] || 0) + (service.totalAmount || 0);
  });

  return Object.entries(servicesByDay)
    .map(([date, value]) => ({
      name: date,
      value: parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.name) - new Date(b.name));
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
              <CardTitle>Serviços - {{ selectedPeriod === 'current-month' ? 'Mês Atual' : periodOptions.find(p => p.value === selectedPeriod)?.label }}</CardTitle>
              <select
                v-model="selectedPeriod"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option v-for="option in periodOptions" :key="option.value" :value="option.value" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="filteredServices.length > 0">
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
                  <TableRow v-for="service in filteredServices" :key="service.id">
                    <TableCell class="font-medium">{{
                      service.customerName
                    }}</TableCell>
                    <TableCell>{{
                      service.date?.toLocaleDateString?.() || "N/A"
                    }}</TableCell>
                    <TableCell
                      >R$ {{ (service.totalAmount || 0).toFixed(2) }}</TableCell
                    >
                    <TableCell>
                      <ul
                        v-if="service.observations"
                        class="list-disc list-inside"
                      >
                        <li
                          v-for="(obs, index) in Array.isArray(
                            service.observations
                          )
                            ? service.observations
                            : [service.observations]"
                          :key="index"
                        >
                          {{ obs }}
                        </li>
                      </ul>
                      <span v-else class="text-muted-foreground text-sm"
                        >-</span
                      >
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
            <p class="text-sm text-gray-600">{{ filteredServices.length }} serviço(s)</p>
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
    </div>

    <!-- Gráfico de barras - Faturamento por dia -->
    <div class="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="dailyRevenueData.length > 0" style="width: 100%; height: 400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                :data="dailyRevenueData"
                margin="{ top: 20, right: 30, left: 0, bottom: 80 }"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  :formatter="(value) => `R$ ${value.toFixed(2)}`"
                  contentStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px', color: '#fff' }"
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-muted-foreground">
              Nenhum faturamento registrado neste período.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Gráfico de linha - Faturamento acumulado -->
    <div class="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="monthlyLineData.length > 0" style="width: 100%; height: 400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                :data="monthlyLineData"
                margin="{ top: 20, right: 30, left: 0, bottom: 80 }"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  :formatter="(value) => `R$ ${value.toFixed(2)}`"
                  contentStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px', color: '#fff' }"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot="{ fill: '#8b5cf6', r: 4 }"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-muted-foreground">
              Nenhum faturamento registrado neste período.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

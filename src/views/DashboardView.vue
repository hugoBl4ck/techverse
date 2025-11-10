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
import Calendar from "@/components/ui/calendar/Calendar.vue";
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
const selectedDate = ref(new Date());
const promotions = ref([]);

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

const monthlyRevenue = computed(() => {
  if (!allServices.value) return 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return allServices.value
    .filter((service) => {
      const serviceDate = new Date(service.date);
      return (
        serviceDate.getMonth() === currentMonth &&
        serviceDate.getFullYear() === currentYear
      );
    })
    .reduce((total, service) => total + (service.totalAmount || 0), 0);
});

// Dados para o gráfico de barras (valores diários)
const dailyRevenueData = computed(() => {
  if (!allServices.value) return [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dailyData = {};

  // Inicializar todos os dias com 0
  for (let i = 1; i <= daysInMonth; i++) {
    dailyData[i] = 0;
  }

  // Somar os valores por dia
  allServices.value
    .filter((service) => {
      const serviceDate = new Date(service.date);
      return (
        serviceDate.getMonth() === currentMonth &&
        serviceDate.getFullYear() === currentYear
      );
    })
    .forEach((service) => {
      const day = new Date(service.date).getDate();
      dailyData[day] = (dailyData[day] || 0) + (service.totalAmount || 0);
    });

  // Converter para array para o gráfico, mostrando apenas dias com valores
  return Object.entries(dailyData)
    .map(([day, value]) => ({
      day: day,
      name: `Dia ${day}`,
      value: parseFloat(value.toFixed(2)),
    }))
    .filter((item) => item.value > 0)
    .slice(-15); // Mostrar apenas os últimos 15 dias com movimento
});

// Dados para o gráfico de linha (todos os dias do mês)
const monthlyLineData = computed(() => {
  if (!allServices.value) return [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dailyData = {};

  // Inicializar todos os dias com 0
  for (let i = 1; i <= daysInMonth; i++) {
    dailyData[i] = 0;
  }

  // Somar os valores por dia
  allServices.value
    .filter((service) => {
      const serviceDate = new Date(service.date);
      return (
        serviceDate.getMonth() === currentMonth &&
        serviceDate.getFullYear() === currentYear
      );
    })
    .forEach((service) => {
      const day = new Date(service.date).getDate();
      dailyData[day] = (dailyData[day] || 0) + (service.totalAmount || 0);
    });

  // Converter para array
  return Object.entries(dailyData)
    .map(([day, value]) => ({
      day: parseInt(day),
      name: `${day}`,
      value: parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => a.day - b.day);
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
          <CardContent class="space-y-4">
            <p class="text-2xl font-bold">R$ {{ monthlyRevenue.toFixed(2) }}</p>
            <!-- Gráfico de barras compacto -->
            <div v-if="dailyRevenueData.length > 0" class="mt-4 -mx-4">
              <ResponsiveContainer width="100%" height="{150}">
                <BarChart :data="dailyRevenueData">
                  <Bar dataKey="value" fill="#8b5cf6" radius="{[4," 4, 0, 0]} />
                  <Tooltip
                    :formatter="(value) => `R$ ${value.toFixed(2)}`"
                    :contentStyle="{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                    }"
                    :cursor="{ fill: 'rgba(139, 92, 246, 0.1)' }"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
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

    <!-- Gráfico de linha - Faturamento ao longo do mês -->
    <div class="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Diário do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="monthlyLineData.length > 0" class="-mx-4 -mb-4">
            <ResponsiveContainer width="100%" height="{300}">
              <LineChart :data="monthlyLineData">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  :label="{
                    value: 'Dia do Mês',
                    position: 'insideBottom',
                    offset: -5,
                  }"
                />
                <YAxis
                  :label="{
                    value: 'Valor (R$)',
                    angle: -90,
                    position: 'insideLeft',
                  }"
                />
                <Tooltip
                  :formatter="(value) => `R$ ${value.toFixed(2)}`"
                  :contentStyle="{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                  }"
                  :cursor="{ fill: 'rgba(139, 92, 246, 0.1)' }"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  :dot="false"
                  :strokeWidth="2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-muted-foreground">
              Nenhum faturamento registrado neste mês.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

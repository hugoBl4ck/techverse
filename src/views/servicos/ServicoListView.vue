<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { db } from '@/firebase/config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTenant } from '@/composables/useTenant';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-vue-next';

const { tenant } = useTenant();
const services = ref([]);
const isLoading = ref(true);
const selectedDate = ref(new Date());

const loadServices = async () => {
  if (!tenant.value) return;
  isLoading.value = true;
  const servicesCol = collection(db, 'stores', tenant.value, 'servicos');
  const servicesSnapshot = await getDocs(servicesCol);
  services.value = servicesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
  }));
  isLoading.value = false;
};

watch(tenant, (newTenant) => {
  if (newTenant) {
    loadServices();
  }
}, { immediate: true });

const filteredServices = computed(() => {
  if (!services.value) return [];
  return services.value.filter((service) => {
    const serviceDate = new Date(service.date);
    serviceDate.setUTCHours(0, 0, 0, 0);
    const selected = new Date(selectedDate.value);
    selected.setUTCHours(0, 0, 0, 0);
    return serviceDate.getTime() === selected.getTime();
  });
});
</script>

<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="flex items-center mb-4">
      <h1 class="text-2xl font-bold">Agenda de Serviços</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="md:col-span-1">
        <CardHeader>
          <CardTitle>Selecione uma data</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar v-model="selectedDate" />
        </CardContent>
      </Card>
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Serviços para {{ selectedDate.toLocaleDateString() }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul v-if="filteredServices.length > 0" class="space-y-2">
            <li v-for="service in filteredServices" :key="service.id" class="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
              <div>
                <strong>{{ service.client }}</strong> - {{ service.service }}
              </div>
              <router-link :to="{ name: 'ServicoEditar', params: { id: service.id } }">
                <Button variant="ghost" size="icon">
                  <Pencil class="h-4 w-4" />
                </Button>
              </router-link>
            </li>
          </ul>
          <p v-else class="text-muted-foreground">Nenhum serviço agendado para esta data.</p>
        </CardContent>
      </Card>
      </div>
    </main>
</template>

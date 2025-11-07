<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const latestServices = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  const servicesCol = collection(db, 'servicos');
  const q = query(servicesCol, orderBy('date', 'desc'), limit(5));
  const servicesSnapshot = await getDocs(q);
  latestServices.value = servicesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(), // Convert Firestore Timestamp to JavaScript Date
  }));
  isLoading.value = false;
});
</script>

<template>
  <div class="container mx-auto py-8">
<div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Últimos Serviços Realizados</h1>
      <router-link to="/servicos/novo">
        <Button>+ Novo Serviço</Button>
      </router-link>
    </div>
    <div v-if="isLoading" class="text-center">
      <p>Carregando...</p>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="service in latestServices" :key="service.id">
        <CardHeader>
          <CardTitle>{{ service.customerName }}</CardTitle>
          <CardDescription>{{ service.date.toLocaleDateString() }} - R$ {{ service.price.toFixed(2) }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h4 class="font-semibold">Observações:</h4>
            <ul class="list-disc list-inside">
              <li v-for="(obs, index) in service.observations" :key="index">{{ obs }}</li>
            </ul>
          </div>
          <div class="mt-4">
            <h4 class="font-semibold">Configuração do Computador:</h4>
            <p class="text-sm text-muted-foreground">{{ service.computerConfiguration }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-if="!isLoading && latestServices.length === 0" class="text-center mt-8">
      <p>Nenhum serviço registrado ainda.</p>
    </div>
  </div>
</template>

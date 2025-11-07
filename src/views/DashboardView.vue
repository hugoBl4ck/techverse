<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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

const allServices = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  const servicesCol = collection(db, 'servicos');
  const q = query(servicesCol, orderBy('date', 'desc'));
  const servicesSnapshot = await getDocs(q);
  allServices.value = servicesSnapshot.docs.map(doc => ({
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
                    <TableCell>R$ {{ service.price.toFixed(2) }}</TableCell>
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
            <CardTitle>Notícias</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Em breve: Últimas notícias e atualizações!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Em breve: Promoções e ofertas especiais!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

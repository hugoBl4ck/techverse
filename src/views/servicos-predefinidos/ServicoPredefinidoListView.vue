<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const { storeId } = useCurrentStore();
const servicosPredefinidos = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  try {
    const servicosCol = collection(db, 'stores', storeId.value, 'catalogo_servicos');
    const servicosSnapshot = await getDocs(servicosCol);
    servicosPredefinidos.value = servicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    alert('Erro ao carregar serviços: ' + error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Catálogo de Serviços</h1>
      <router-link to="/catalogo-servicos/novo">
        <Button>+ Novo Serviço</Button>
      </router-link>
    </div>
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="servico in servicosPredefinidos" :key="servico.id">
              <TableCell>{{ servico.nome }}</TableCell>
              <TableCell>{{ servico.descricao }}</TableCell>
              <TableCell>R$ {{ (servico.preco || 0).toFixed(2) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

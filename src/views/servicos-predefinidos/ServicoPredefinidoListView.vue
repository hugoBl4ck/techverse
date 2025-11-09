'''<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const servicosPredefinidos = ref([]);

onMounted(async () => {
  const servicosCol = collection(db, 'servicos_predefinidos');
  const servicosSnapshot = await getDocs(servicosCol);
  servicosPredefinidos.value = servicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Serviços Predefinidos</h1>
      <router-link to="/servicos-predefinidos/novo">
        <Button>+ Novo Serviço Predefinido</Button>
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
              <TableCell>R$ {{ servico.preco.toFixed(2) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
'''
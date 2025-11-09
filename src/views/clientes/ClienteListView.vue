<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { useCurrentStore } from '@/composables/useCurrentStore'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { RouterLink } from 'vue-router'
import { Pencil } from 'lucide-vue-next'

const { storeId } = useCurrentStore()
const clients = ref([])
const isLoading = ref(true)

async function fetchClients() {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'stores', storeId.value, 'clientes'))
    clients.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    alert('Erro ao carregar clientes: ' + error.message);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchClients();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <RouterLink to="/clientes/novo">
        <Button>Novo Cliente</Button>
      </RouterLink>
    </div>
    <Table>
      <TableCaption>Uma lista de seus clientes cadastrados.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead class="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="client in clients" :key="client.id">
          <TableCell class="font-medium">
            {{ client.nome }}
          </TableCell>
          <TableCell>{{ client.email }}</TableCell>
          <TableCell>{{ client.telefone }}</TableCell>
          <TableCell class="text-right">
            <RouterLink :to="`/clientes/${client.id}/editar`">
              <Button variant="outline" size="sm">
                <Pencil class="h-4 w-4 mr-2" />
                Editar
              </Button>
            </RouterLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

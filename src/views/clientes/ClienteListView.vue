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
import { Pencil, Users, PlusCircle } from 'lucide-vue-next'

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
    <div class="flex justify-between items-center mb-4 fade-in">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <RouterLink to="/clientes/novo">
        <Button>Novo Cliente</Button>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && clients.length === 0" class="text-center py-16 fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Users class="h-10 w-10 text-primary" />
      </div>
      <h3 class="text-xl font-semibold mb-2">Nenhum cliente cadastrado</h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        Comece adicionando seu primeiro cliente para gerenciar ordens de serviço e histórico de atendimentos
      </p>
      <Button size="lg" as-child>
        <RouterLink to="/clientes/novo">
          <PlusCircle class="mr-2 h-5 w-5" />
          Cadastrar Primeiro Cliente
        </RouterLink>
      </Button>
    </div>

    <Table v-else>
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
        <TableRow 
          v-for="(client, index) in clients" 
          :key="client.id"
          :class="`fade-in fade-in-delay-${Math.min(index + 1, 5)} hover:bg-muted/50 transition-colors`"
        >
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

<script setup>
import { ref, watchEffect } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
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

async function getUltimmoServico(clientId, customerId) {
  try {
    // Busca a última ordem de serviço do cliente
    const q = query(
      collection(db, 'stores', storeId.value, 'ordens_servico'),
      where('customerId', '==', customerId),
      where('status', '!=', 'cancelada'),
      orderBy('status'),
      orderBy('date', 'desc')
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return { servico: 'Nenhum serviço', data: '-' }
    }
    
    const ultimoServico = snapshot.docs[0].data()
    const data = ultimoServico.date?.toDate ? ultimoServico.date.toDate() : new Date(ultimoServico.date)
    
    return {
      servico: Array.isArray(ultimoServico.observations) 
        ? ultimoServico.observations.join(', ').substring(0, 50)
        : (ultimoServico.observations || 'Serviço').substring(0, 50),
      data: data.toLocaleDateString('pt-BR')
    }
  } catch (error) {
    console.error('Erro ao buscar último serviço:', error)
    return { servico: '-', data: '-' }
  }
}

async function fetchClients() {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'stores', storeId.value, 'clientes'))
    clients.value = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const clientData = {
          id: doc.id,
          ...doc.data()
        }
        
        // Busca o último serviço para cada cliente
        const ultimoServico = await getUltimmoServico(doc.id, doc.id)
        clientData.ultimoServico = ultimoServico.servico
        clientData.dataServico = ultimoServico.data
        
        return clientData
      })
    )
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    alert('Erro ao carregar clientes: ' + error.message);
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  if (storeId.value) {
    fetchClients();
  }
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
      <TableCaption>Uma lista de seus clientes cadastrados com histórico de serviços.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Último Serviço</TableHead>
          <TableHead>Data do Serviço</TableHead>
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
          <TableCell class="text-sm" :title="client.ultimoServico">
            {{ client.ultimoServico || '-' }}
          </TableCell>
          <TableCell class="text-sm font-medium">
            <span :class="client.dataServico !== '-' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'">
              {{ client.dataServico || '-' }}
            </span>
          </TableCell>
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

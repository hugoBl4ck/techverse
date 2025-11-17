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
    // Busca todas as ordens de serviço do cliente, ordenadas por data descendente
    const q = query(
      collection(db, 'stores', storeId.value, 'ordens_servico'),
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return { servico: 'Nenhum serviço', data: '-' }
    }

    // Encontra a primeira ordem que não está cancelada
    const ultimoServico = snapshot.docs.find(doc => {
      const data = doc.data()
      return data.status !== 'cancelada'
    })

    if (!ultimoServico) {
      return { servico: 'Nenhum serviço ativo', data: '-' }
    }

    const servicoData = ultimoServico.data()
    const data = servicoData.date?.toDate ? servicoData.date.toDate() : new Date(servicoData.date)

    // Formatar data mantendo horário local
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${day}/${month}/${year}`;

    return {
      servico: Array.isArray(servicoData.observations)
        ? servicoData.observations.join(', ').substring(0, 50)
        : (servicoData.observations || 'Serviço').substring(0, 50),
      data: dataFormatada
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
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <RouterLink to="/clientes/novo">
        <Button>Novo Cliente</Button>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && clients.length === 0" class="text-center py-16">
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
          v-for="client in clients"
          :key="client.id"
          class="hover:bg-muted/50 transition-colors"
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

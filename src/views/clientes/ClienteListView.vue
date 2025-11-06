<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
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

const clients = ref([])

async function fetchClients() {
  const querySnapshot = await getDocs(collection(db, 'clientes'))
  clients.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  fetchClients()
})
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
              <Button variant="outline" size="sm">Editar</Button>
            </RouterLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

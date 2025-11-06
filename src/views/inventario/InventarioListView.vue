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

const pecas = ref([])

async function fetchPecas() {
  const querySnapshot = await getDocs(collection(db, 'pecas'))
  pecas.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  fetchPecas()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Inventário de Peças</h1>
      <RouterLink to="/inventario/novo">
        <Button>Nova Peça</Button>
      </RouterLink>
    </div>
    <Table>
      <TableCaption>Uma lista de peças no seu inventário.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Peça</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Preço de Custo</TableHead>
          <TableHead>Preço de Venda</TableHead>
          <TableHead class="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="peca in pecas" :key="peca.id">
          <TableCell class="font-medium">
            {{ peca.nome }}
          </TableCell>
          <TableCell>{{ peca.quantidade }}</TableCell>
          <TableCell>R$ {{ peca.precoCusto?.toFixed(2) }}</TableCell>
          <TableCell>R$ {{ peca.precoVenda?.toFixed(2) }}</TableCell>
          <TableCell class="text-right">
            <RouterLink :to="`/inventario/${peca.id}/editar`">
              <Button variant="outline" size="sm">Editar</Button>
            </RouterLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

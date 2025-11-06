<script setup>
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

const pecas = [
  {
    id: '1',
    nome: 'Filtro de Óleo',
    quantidade: 10,
    preco: 'R$ 25,00'
  },
  {
    id: '2',
    nome: 'Pastilha de Freio',
    quantidade: 5,
    preco: 'R$ 120,00'
  },
  {
    id: '3',
    nome: 'Vela de Ignição',
    quantidade: 20,
    preco: 'R$ 15,00'
  }
]
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
          <TableHead class="text-right">Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="peca in pecas" :key="peca.id">
          <TableCell class="font-medium">
            {{ peca.nome }}
          </TableCell>
          <TableCell>{{ peca.quantidade }}</TableCell>
          <TableCell class="text-right">{{ peca.preco }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

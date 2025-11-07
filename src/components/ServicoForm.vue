'''<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const router = useRouter();

const clientes = ref([]);
const selectedCliente = ref(null);
const price = ref(0);
const observations = ref('');
const computerConfiguration = ref('');
const isLoading = ref(false);

onMounted(async () => {
  const clientesCol = collection(db, 'clientes');
  const clientesSnapshot = await getDocs(clientesCol);
  clientes.value = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

async function handleSubmit() {
  if (!selectedCliente.value) {
    alert('Por favor, selecione um cliente.');
    return;
  }

  isLoading.value = true;
  try {
    await addDoc(collection(db, 'servicos'), {
      customerId: selectedCliente.value.id,
      customerName: selectedCliente.value.nome,
      date: new Date(),
      price: price.value,
      observations: observations.value.split('\n'),
      computerConfiguration: computerConfiguration.value,
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Erro ao salvar serviço: ', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Registrar Novo Serviço</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="cliente">Cliente</Label>
          <Select v-model="selectedCliente">
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cliente in clientes" :key="cliente.id" :value="cliente">
                {{ cliente.nome }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-2">
          <Label for="price">Valor</Label>
          <Input id="price" v-model.number="price" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="observations">Observações</Label>
          <Textarea id="observations" v-model="observations" placeholder="Digite cada observação em uma nova linha." />
        </div>
        <div class="grid gap-2">
          <Label for="computerConfiguration">Configuração do Computador</Label>
          <Textarea id="computerConfiguration" v-model="computerConfiguration" placeholder="Descreva a configuração do computador." />
        </div>
        <Button @click="handleSubmit" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar Serviço' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
'''
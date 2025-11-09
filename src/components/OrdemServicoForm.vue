<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MinusCircle, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  id: {
    type: String,
    default: null
  }
});

const router = useRouter();

const isEditMode = computed(() => !!props.id);

onMounted(() => {
  console.log('OrdemServicoForm Mounted:');
  console.log('  props.id:', props.id);
  console.log('  isEditMode:', isEditMode.value);
  loadData();
});

const clientes = ref([]);
const ordemServico = ref({
  customerId: null,
  customerName: '',
  date: new Date(),
  price: 0,
  observations: '',
  computerConfiguration: '',
  items: [],
});
const selectedClienteId = ref('');
const catalogoServicos = ref([]);
const selectedServicoId = ref('');
const isLoading = ref(false);

const selectedCliente = computed(() => 
  clientes.value.find(c => c.id === selectedClienteId.value) || null
);

const selectedServicoCatalogo = computed(() => 
  catalogoServicos.value.find(s => s.id === selectedServicoId.value) || null
);

// Item management
const inventoryItems = ref([]);
const itemSearch = ref('');
const addedItems = ref([]);

const filteredItems = computed(() => {
  if (!itemSearch.value) return [];
  return inventoryItems.value.filter(item =>
    item.nome.toLowerCase().includes(itemSearch.value.toLowerCase())
  );
});

const totalAmount = computed(() => {
  const itemsTotal = addedItems.value.reduce((total, item) => total + (item.preco * item.quantity), 0);
  return (ordemServico.value.price || 0) + itemsTotal;
});

const loadData = async () => {
  isLoading.value = true;
  // Add console.log here
  console.log('loadData called:');
  console.log('  isEditMode (inside loadData):', isEditMode.value);

  // Load services from catalog (global)
  const catalogoServicosCol = collection(db, 'catalogo_servicos');
  const catalogoServicosSnapshot = await getDocs(catalogoServicosCol);
  catalogoServicos.value = catalogoServicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Load clients
  const clientesCol = collection(db, 'clientes');
  const clientesSnapshot = await getDocs(clientesCol);
  clientes.value = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Load inventory items
  const inventoryCol = collection(db, 'items');
  const inventorySnapshot = await getDocs(inventoryCol);
  inventoryItems.value = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // If in edit mode, load service order data
  if (isEditMode.value) {
    console.log('loadData: Fetching existing service order with ID:', props.id);
    const osDocRef = doc(db, 'ordens_servico', props.id);
    const osDoc = await getDoc(osDocRef);
    if (osDoc.exists()) {
      const osData = osDoc.data();
      ordemServico.value = {
        ...osData,
        observations: Array.isArray(osData.observations) ? osData.observations.join('\n') : osData.observations,
      };
      addedItems.value = osData.items || [];
      selectedClienteId.value = osData.customerId || '';
      console.log('loadData: Service order data loaded successfully.');
    } else {
      console.error('Ordem de Serviço não encontrada para ID:', props.id);
      router.push('/ordens-servico');
    }
  }
  isLoading.value = false;
};



watch(selectedServicoId, (id) => {
  const newServico = catalogoServicos.value.find(s => s.id === id);
  if (newServico) {
    ordemServico.value.observations = newServico.descricao || '';
    ordemServico.value.price = newServico.preco || 0;
  }
});

function addItem(item) {
  const existingItem = addedItems.value.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    addedItems.value.push({ ...item, quantity: 1 });
  }
  itemSearch.value = '';
}

function removeItem(itemId) {
  addedItems.value = addedItems.value.filter(i => i.id !== itemId);
}

function increaseQuantity(itemId) {
  const item = addedItems.value.find(i => i.id === itemId);
  if (item) item.quantity++;
}

function decreaseQuantity(itemId) {
  const item = addedItems.value.find(i => i.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
  } else if (item && item.quantity === 1) {
    removeItem(itemId);
  }
}

async function handleSubmit() {
  const cliente = selectedCliente.value;
  if (!cliente) {
    alert('Por favor, selecione um cliente.');
    return;
  }

  isLoading.value = true;
  
  const osData = {
    ...ordemServico.value,
    customerId: cliente.id,
    customerName: cliente.nome,
    observations: String(ordemServico.value.observations || '').split('\n'),
    items: addedItems.value,
    totalAmount: totalAmount.value,
  };

  try {
    const osCol = collection(db, 'ordens_servico');
    if (isEditMode.value) {
      console.log('handleSubmit: Updating service order with ID:', props.id);
      const osDocRef = doc(osCol, props.id);
      await updateDoc(osDocRef, osData);
      console.log('Ordem de Serviço atualizada com sucesso!');
    } else {
      console.log('handleSubmit: Creating new service order.');
      osData.date = new Date();
      await addDoc(osCol, osData);
      console.log('Ordem de Serviço salva com sucesso!');
    }
    router.push('/ordens-servico');
  } catch (error) {
    console.error('Erro ao salvar Ordem de Serviço: ', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ isEditMode ? 'Editar Ordem de Serviço' : 'Registrar Nova Ordem de Serviço' }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading && isEditMode" class="text-center">
        <p>Carregando dados da Ordem de Serviço...</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Coluna da Esquerda: Dados da OS -->
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="cliente">Cliente</Label>
            <Select v-model="selectedClienteId">
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                  {{ cliente.nome }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="servico-catalogo">Serviço do Catálogo (Opcional)</Label>
            <Select v-model="selectedServicoId">
              <SelectTrigger>
                <SelectValue placeholder="Selecione para preencher automaticamente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="servico in catalogoServicos" :key="servico.id" :value="servico.id">
                  {{ servico.nome }} - R$ {{ (servico.preco || 0).toFixed(2) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="price">Valor do Serviço</Label>
            <Input id="price" v-model.number="ordemServico.price" type="number" placeholder="0.00" />
          </div>
          <div class="grid gap-2">
            <Label for="observations">Observações e Serviços Realizados</Label>
            <Textarea id="observations" v-model="ordemServico.observations" placeholder="Digite cada observação em uma nova linha." />
          </div>
          <div class="grid gap-2">
            <Label for="computerConfiguration">Configuração do Equipamento</Label>
            <Textarea id="computerConfiguration" v-model="ordemServico.computerConfiguration" placeholder="Descreva a configuração do equipamento." />
          </div>
        </div>

        <!-- Coluna da Direita: Itens/Produtos -->
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="item-search">Adicionar Peça/Produto</Label>
            <Input id="item-search" v-model="itemSearch" type="text" placeholder="Digite para buscar no inventário..." />
            <ScrollArea v-if="filteredItems.length > 0" class="h-40 w-full rounded-md border">
              <div class="p-2">
                <div v-for="item in filteredItems" :key="item.id" @click="addItem(item)" class="cursor-pointer p-2 hover:bg-muted rounded-md">
                  <p class="font-medium">{{ item.nome }}</p>
                  <p class="text-sm text-muted-foreground">R$ {{ item.preco.toFixed(2) }} - Estoque: {{ item.estoque }}</p>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div class="grid gap-2">
            <Label>Peças/Produtos Adicionados</Label>
            <ScrollArea class="h-60 w-full rounded-md border">
              <div class="p-4">
                <p v-if="addedItems.length === 0" class="text-sm text-muted-foreground">Nenhuma peça adicionada.</p>
                <div v-for="item in addedItems" :key="item.id" class="flex items-center justify-between mb-2 p-2 rounded-md bg-secondary/20">
                  <div>
                    <p class="font-semibold">{{ item.nome }}</p>
                    <p class="text-sm">R$ {{ item.preco.toFixed(2) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button @click="decreaseQuantity(item.id)" variant="ghost" size="icon" class="h-7 w-7">
                      <MinusCircle class="h-4 w-4" />
                    </Button>
                    <span class="font-bold">{{ item.quantity }}</span>
                    <Button @click="increaseQuantity(item.id)" variant="ghost" size="icon" class="h-7 w-7">
                      <PlusCircle class="h-4 w-4" />
                    </Button>
                    <Button @click="removeItem(item.id)" variant="ghost" size="icon" class="h-7 w-7 text-destructive">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex justify-between items-center mt-4">
        <div class="text-2xl font-bold">
            <span>Total: </span>
            <span>R$ {{ totalAmount.toFixed(2) }}</span>
        </div>
        <Button @click="handleSubmit" :disabled="isLoading">
          {{ isLoading ? (isEditMode ? 'Salvando...' : 'Criando...') : (isEditMode ? 'Salvar Alterações' : 'Salvar Ordem de Serviço') }}
        </Button>
    </CardFooter>
  </Card>
</template>
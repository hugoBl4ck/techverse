<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { useTransacoes } from '@/composables/useTransacoes';
import { toast } from 'vue-sonner';

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
const { storeId, isAuthenticated } = useCurrentStore();
const { registrarVenda } = useTransacoes(storeId);

const isEditMode = computed(() => !!props.id);

onMounted(() => {
  console.log('OrdemServicoForm Mounted - Multi-tenant');
  console.log('  props.id:', props.id);
  console.log('  isEditMode:', isEditMode.value);
  console.log('  storeId:', storeId.value);
  
  if (!storeId.value) {
    console.error('Usuário não autenticado!');
    toast.error('Erro: Usuário não autenticado');
    router.push('/');
    return;
  }
  
  loadData();
});

// Carrega dados novamente quando o ID muda (útil para edição)
watch(
  () => props.id,
  (newId) => {
    if (newId && storeId.value) {
      loadData();
    }
  }
);

const clientes = ref([]);
const ordemServico = ref({
  customerId: null,
  customerName: '',
  date: new Date(),
  price: 0,
  observations: '',
  computerConfiguration: '',
  items: [],
  discount: 0,
  surcharge: 0,
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

// Format date for datetime-local input
const dateForInput = computed({
  get() {
    try {
      if (!ordemServico.value.date) return '';
      
      let date;
      if (ordemServico.value.date instanceof Date) {
        date = ordemServico.value.date;
      } else if (typeof ordemServico.value.date === 'string') {
        date = new Date(ordemServico.value.date);
      } else if (ordemServico.value.date?.toDate) {
        // Firebase Timestamp
        date = ordemServico.value.date.toDate();
      } else {
        date = new Date(ordemServico.value.date);
      }
      
      if (isNaN(date.getTime())) {
        console.warn('Data inválida:', ordemServico.value.date);
        return new Date().toISOString().slice(0, 16);
      }
      
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return new Date().toISOString().slice(0, 16);
    }
  },
  set(value) {
    ordemServico.value.date = value ? new Date(value) : new Date();
  }
});

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

const subtotal = computed(() => {
  const itemsTotal = addedItems.value.reduce((total, item) => total + ((item.precoVenda || item.preco || 0) * item.quantity), 0);
  return (ordemServico.value.price || 0) + itemsTotal;
});

const totalAmount = computed(() => {
  const discount = ordemServico.value.discount || 0;
  const surcharge = ordemServico.value.surcharge || 0;
  return Math.max(0, subtotal.value - discount + surcharge);
});

const loadData = async () => {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    return;
  }

  isLoading.value = true;
  console.log('Carregando dados para store:', storeId.value);

  try {
    // Load services from catalog (per store)
    const catalogoServicosCol = collection(db, 'stores', storeId.value, 'catalogo_servicos');
    const catalogoServicosSnapshot = await getDocs(catalogoServicosCol);
    catalogoServicos.value = catalogoServicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Catálogo carregado:', catalogoServicos.value.length);

    // Load clients
    const clientesCol = collection(db, 'stores', storeId.value, 'clientes');
    const clientesSnapshot = await getDocs(clientesCol);
    clientes.value = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Clientes carregados:', clientes.value.length);

    // Load inventory items
    const inventoryCol = collection(db, 'stores', storeId.value, 'itens');
    const inventorySnapshot = await getDocs(inventoryCol);
    inventoryItems.value = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Inventário carregado:', inventoryItems.value.length);

    // If in edit mode, load service order data
    if (isEditMode.value) {
    console.log('Modo edição: carregando ordem de serviço ID:', props.id);
    const osDocRef = doc(db, 'stores', storeId.value, 'ordens_servico', props.id);
    const osDoc = await getDoc(osDocRef);
    if (osDoc.exists()) {
    const osData = osDoc.data();
    ordemServico.value = {
    ...osData,
    observations: Array.isArray(osData.observations) ? osData.observations.join('\n') : osData.observations,
    };
    // Merge loaded items with inventory data to restore preco and estoque
    addedItems.value = (osData.items || []).map(loadedItem => {
      const inventoryItem = inventoryItems.value.find(inv => inv.id === loadedItem.id);
        return inventoryItem ? { ...loadedItem, ...inventoryItem } : loadedItem;
    });
    selectedClienteId.value = osData.customerId || '';
    console.log('Ordem de serviço carregada com sucesso');
    } else {
        console.error('Ordem de Serviço não encontrada');
         toast.error('Ordem de serviço não encontrada!');
         router.push('/ordens-servico');
       }
     }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    toast.error('Erro ao carregar dados: ' + error.message);
  } finally {
    isLoading.value = false;
  }
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
     toast.error('Por favor, selecione um cliente.');
     return;
   }

   if (!storeId.value) {
     toast.error('Erro: Usuário não autenticado.');
     return;
   }

   isLoading.value = true;
   const loadingToast = toast.loading(isEditMode.value ? 'Atualizando ordem...' : 'Criando ordem...');
   
   const osData = {
     customerId: cliente.id,
     customerName: cliente.nome,
     price: ordemServico.value.price || 0,
     observations: String(ordemServico.value.observations || '').split('\n').filter(o => o.trim()),
     computerConfiguration: ordemServico.value.computerConfiguration || '',
     items: addedItems.value,
     subtotal: subtotal.value,
     discount: ordemServico.value.discount || 0,
     surcharge: ordemServico.value.surcharge || 0,
     totalAmount: totalAmount.value,
     date: ordemServico.value.date instanceof Date 
       ? ordemServico.value.date 
       : new Date(ordemServico.value.date || new Date()),
   };

   try {
     const osCol = collection(db, 'stores', storeId.value, 'ordens_servico');
     let osId;
     
     if (isEditMode.value) {
       console.log('Atualizando ordem de serviço ID:', props.id);
       const osDocRef = doc(osCol, props.id);
       await updateDoc(osDocRef, osData);
       osId = props.id;
       console.log('Ordem de Serviço atualizada com sucesso!');
       toast.success('Ordem de serviço atualizada!', { id: loadingToast });
     } else {
       console.log('Criando nova ordem de serviço');
       const docRef = await addDoc(osCol, osData);
       osId = docRef.id;
       console.log('Ordem de Serviço criada com sucesso!');
       
       // Registra automaticamente como transação no financeiro
       await registrarVenda({
         descricao: `Ordem de Serviço #${osId} - ${cliente.nome}`,
         valor: totalAmount.value,
         categoria: 'servico',
         cliente_id: cliente.id,
         ordem_servico_id: osId,
         metodo_pagamento: 'pix',
         produtos: addedItems.value.map(item => ({
           produtoId: item.id,
           quantidade: item.quantity,
           preco_unitario: item.precoVenda || item.preco || 0,
           subtotal: (item.precoVenda || item.preco || 0) * item.quantity
         }))
       });
       
       console.log('✅ Transação registrada automaticamente no financeiro');
       toast.success('Ordem de serviço criada!', { id: loadingToast });
     }
     router.push('/ordens-servico');
   } catch (error) {
     console.error('Erro ao salvar Ordem de Serviço:', error);
     toast.error('Erro: ' + error.message, { id: loadingToast });
   } finally {
     isLoading.value = false;
   }
}
</script>

<template>
  <Card class="fade-in">
    <CardHeader>
      <CardTitle>{{ isEditMode ? 'Editar Ordem de Serviço' : 'Registrar Nova Ordem de Serviço' }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading && isEditMode" class="text-center py-8">
        <p>Carregando dados da Ordem de Serviço...</p>
      </div>
      <div v-else-if="!storeId" class="text-center py-8">
        <p class="text-destructive">Erro: Usuário não autenticado</p>
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
            <Label for="data">Data da Ordem de Serviço</Label>
            <Input id="data" v-model="dateForInput" type="datetime-local" />
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
            <Textarea id="observations" v-model="ordemServico.observations" placeholder="Digite cada observação em uma nova linha." rows="5" />
          </div>
          <div class="grid gap-2">
            <Label for="computerConfiguration">Configuração do Equipamento</Label>
            <Textarea id="computerConfiguration" v-model="ordemServico.computerConfiguration" placeholder="Descreva a configuração do equipamento." rows="3" />
          </div>

          <div class="grid gap-4 pt-4 border-t">
            <h3 class="font-semibold">Ajustes Financeiros</h3>
            <div class="grid gap-2">
              <Label for="discount">Desconto</Label>
              <Input id="discount" v-model.number="ordemServico.discount" type="number" placeholder="0.00" min="0" step="0.01" />
            </div>
            <div class="grid gap-2">
              <Label for="surcharge">Acréscimo</Label>
              <Input id="surcharge" v-model.number="ordemServico.surcharge" type="number" placeholder="0.00" min="0" step="0.01" />
            </div>
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
              <p class="text-sm text-muted-foreground">R$ {{ (item.precoVenda || item.preco || 0).toFixed(2) }} - Estoque: {{ item.quantidade || 0 }}</p>
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
                <p class="text-sm">R$ {{ (item.precoVenda || item.preco || 0).toFixed(2) }}</p>
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
    <CardFooter class="flex flex-col gap-4 mt-4">
        <div class="w-full">
          <div class="flex justify-between text-sm mb-2">
            <span>Subtotal:</span>
            <span>R$ {{ subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="ordemServico.discount > 0" class="flex justify-between text-sm mb-2 text-red-600">
            <span>Desconto:</span>
            <span>- R$ {{ ordemServico.discount.toFixed(2) }}</span>
          </div>
          <div v-if="ordemServico.surcharge > 0" class="flex justify-between text-sm mb-2 text-orange-600">
            <span>Acréscimo:</span>
            <span>+ R$ {{ ordemServico.surcharge.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-2xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span>R$ {{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        <Button @click="handleSubmit" :disabled="isLoading || !storeId" class="w-full">
          {{ isLoading ? (isEditMode ? 'Salvando...' : 'Criando...') : (isEditMode ? 'Salvar Alterações' : 'Salvar Ordem de Serviço') }}
        </Button>
    </CardFooter>
  </Card>
</template>

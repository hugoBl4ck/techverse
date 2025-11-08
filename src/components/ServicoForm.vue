'''<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useTenant } from '@/composables/useTenant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps({
  id: {
    type: String,
    default: null
  }
});

const router = useRouter();
const { tenant } = useTenant();
const storeId = tenant;

const isEditMode = computed(() => !!props.id);

const clientes = ref([]);
const service = ref({
  customerId: null,
  customerName: '',
  date: new Date(),
  price: 0,
  observations: '',
  computerConfiguration: '',
});
const selectedCliente = ref(null);
const isLoading = ref(false);

const loadData = async () => {
  if (!storeId.value) return;
  isLoading.value = true;

  // Carregar clientes
  const clientesCol = collection(db, 'stores', storeId.value, 'clientes');
  const clientesSnapshot = await getDocs(clientesCol);
  clientes.value = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Se for modo de edição, carregar dados do serviço
  if (isEditMode.value) {
    const serviceDocRef = doc(db, 'stores', storeId.value, 'servicos', props.id);
    const serviceDoc = await getDoc(serviceDocRef);
    if (serviceDoc.exists()) {
      const serviceData = serviceDoc.data();
      service.value = {
        ...serviceData,
        observations: Array.isArray(serviceData.observations) ? serviceData.observations.join('\n') : serviceData.observations,
      };
      // Encontrar e definir o cliente selecionado
      selectedCliente.value = clientes.value.find(c => c.id === serviceData.customerId);
    } else {
      console.error('Serviço não encontrado!');
      router.push('/servicos'); // Redireciona se o ID for inválido
    }
  }
  isLoading.value = false;
};

watch(storeId, (newStoreId) => {
  if (newStoreId) {
    loadData();
  }
}, { immediate: true });

async function handleSubmit() {
  if (!selectedCliente.value || !storeId.value) {
    alert('Por favor, selecione um cliente e verifique se a loja está configurada.');
    return;
  }

  isLoading.value = true;
  
  const serviceData = {
    ...service.value,
    customerId: selectedCliente.value.id,
    customerName: selectedCliente.value.nome,
    observations: service.value.observations.split('\n'),
  };

  try {
    const servicosCol = collection(db, 'stores', storeId.value, 'servicos');
    if (isEditMode.value) {
      // Atualizar documento existente
      const serviceDocRef = doc(servicosCol, props.id);
      await updateDoc(serviceDocRef, serviceData);
      console.log('Serviço atualizado com sucesso!');
    } else {
      // Criar novo documento
      serviceData.date = new Date(); // Definir a data apenas na criação
      await addDoc(servicosCol, serviceData);
      console.log('Serviço salvo com sucesso!');
    }
    router.push('/servicos');
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
      <CardTitle>{{ isEditMode ? 'Editar Serviço' : 'Registrar Novo Serviço' }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading && isEditMode" class="text-center">
        <p>Carregando dados do serviço...</p>
      </div>
      <div v-else class="grid gap-4">
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
          <Input id="price" v-model.number="service.price" type="number" placeholder="0.00" />
        </div>
        <div class="grid gap-2">
          <Label for="observations">Observações</Label>
          <Textarea id="observations" v-model="service.observations" placeholder="Digite cada observação em uma nova linha." />
        </div>
        <div class="grid gap-2">
          <Label for="computerConfiguration">Configuração do Computador</Label>
          <Textarea id="computerConfiguration" v-model="service.computerConfiguration" placeholder="Descreva a configuração do computador." />
        </div>
        <Button @click="handleSubmit" :disabled="isLoading">
          {{ isLoading ? (isEditMode ? 'Salvando...' : 'Criando...') : (isEditMode ? 'Salvar Alterações' : 'Salvar Serviço') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';

import Calendar from '@/components/ui/calendar/Calendar.vue';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, ClipboardCopy, X } from 'lucide-vue-next';

const { storeId } = useCurrentStore();

const ordensServico = ref([]);
const isLoading = ref(true);
const selectedDate = ref(new Date());
const receiptText = ref('');
const showReceiptModal = ref(false);

function generateReceipt(os) {
  const serviceDate = new Date(os.date);
  const warrantyDate = new Date(serviceDate);
  warrantyDate.setDate(serviceDate.getDate() + 15);

  const formattedServiceDate = serviceDate.toLocaleDateString('pt-BR');
  const formattedWarrantyDate = warrantyDate.toLocaleDateString('pt-BR');

  const observations = Array.isArray(os.observations) 
    ? os.observations.join('\n- ') 
    : os.observations;

  const itemsList = (os.items || []).map(item => 
    `- ${item.nome} (x${item.quantity}) - R$ ${(item.preco * item.quantity).toFixed(2)}`
  ).join('\n');

  receiptText.value = `*RECIBO E GARANTIA DE SERVIÇO - TechVerse*

*Cliente:* ${os.customerName}
*Data do Serviço:* ${formattedServiceDate}
*Valor Total:* R$ ${os.totalAmount.toFixed(2)}

*Serviço(s) Realizado(s):*
- ${observations}

${itemsList ? `*Peças/Produtos:*
${itemsList}` : ''}

---
*Garantia:* Este serviço possui garantia de 15 dias, válida até ${formattedWarrantyDate}.
A garantia cobre defeitos relacionados ao serviço prestado e às peças fornecidas. Não cobre mau uso ou problemas não relacionados ao serviço original.

Agradecemos a preferência!`;

  showReceiptModal.value = true;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  } catch (err) {
    console.error('Falha ao copiar texto: ', err);
    alert('Não foi possível copiar o texto.');
  }
}

const loadOrdensServico = async () => {
  if (!storeId.value) {
    console.error('StoreId não disponível');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  console.log('Carregando ordens de serviço para store:', storeId.value);

  try {
    const osCol = collection(db, 'stores', storeId.value, 'ordens_servico');
    const osSnapshot = await getDocs(osCol);
    ordensServico.value = osSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });
    console.log('Ordens carregadas:', ordensServico.value.length);
  } catch (error) {
    console.error('Erro ao carregar ordens de serviço:', error);
    alert('Erro ao carregar ordens de serviço: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadOrdensServico();
});

const filteredOrdensServico = computed(() => {
  if (!ordensServico.value) return [];
  return ordensServico.value.filter((os) => {
    const serviceDate = new Date(os.date);
    serviceDate.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate.value);
    selected.setHours(0, 0, 0, 0);
    return serviceDate.getTime() === selected.getTime();
  });
});
</script>

<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Agenda de Ordens de Serviço</h1>
      <RouterLink to="/ordens-servico/nova">
        <Button>Nova Ordem de Serviço</Button>
      </RouterLink>
    </div>

    <div v-if="!storeId" class="text-center py-8">
      <p class="text-destructive">Erro: Usuário não autenticado</p>
    </div>

    <div v-else-if="isLoading" class="text-center py-8">
      <p>Carregando ordens de serviço...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="md:col-span-1">
        <CardHeader>
          <CardTitle>Selecione uma data</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar v-model="selectedDate" />
        </CardContent>
      </Card>
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Ordens de Serviço para {{ selectedDate.toLocaleDateString('pt-BR') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul v-if="filteredOrdensServico.length > 0" class="space-y-2">
            <li v-for="os in filteredOrdensServico" :key="os.id" class="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border">
              <div>
                <strong class="text-lg">{{ os.customerName }}</strong>
                <p class="text-sm text-muted-foreground mt-1">
                  {{ Array.isArray(os.observations) ? os.observations.join(', ') : os.observations }}
                </p>
                <p class="text-sm font-semibold mt-1">Total: R$ {{ (os.totalAmount || 0).toFixed(2) }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" @click="generateReceipt(os)">
                  Gerar Recibo
                </Button>
                <RouterLink :to="{ name: 'OrdemServicoEditar', params: { id: os.id } }">
                  <Button variant="ghost" size="icon">
                    <Pencil class="h-4 w-4" />
                  </Button>
                </RouterLink>
              </div>
            </li>
          </ul>
          <p v-else class="text-muted-foreground text-center py-8">
            Nenhuma Ordem de Serviço agendada para esta data.
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Modal for Receipt -->
    <div v-if="showReceiptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card class="w-full max-w-2xl">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            Recibo e Garantia
            <Button variant="ghost" size="icon" @click="showReceiptModal = false">
              <X class="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea v-model="receiptText" rows="15" class="whitespace-pre-wrap font-mono text-sm" />
        </CardContent>
        <CardFooter>
          <Button @click="copyToClipboard(receiptText)" class="w-full">
            <ClipboardCopy class="mr-2 h-4 w-4" />
            Copiar para Área de Transferência
          </Button>
        </CardFooter>
      </Card>
    </div>
  </main>
</template>

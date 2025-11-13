<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { db } from '@/firebase/config.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { useTransacoes } from '@/composables/useTransacoes';
import { toast } from 'vue-sonner';

import Calendar from '@/components/ui/calendar/Calendar.vue';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, ClipboardCopy, X, XCircle } from 'lucide-vue-next';

const { storeId } = useCurrentStore();
const { registrarVenda } = useTransacoes(storeId);

const ordensServico = ref([]);
const isLoading = ref(true);
const selectedDate = ref(new Date());
const receiptText = ref('');
const showReceiptModal = ref(false);
const cancelingOsId = ref(null);

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

const cancelarOrdem = async (os) => {
  if (!confirm(`Tem certeza que deseja cancelar a ordem de serviço de ${os.customerName}?\n\nIsso vai reverter a transação financeira e restaurar o estoque.`)) {
    return;
  }

  cancelingOsId.value = os.id;
  const toastId = toast.loading('Cancelando ordem...');

  try {
    // 1. Marca a ordem como cancelada
    const osDocRef = doc(db, 'stores', storeId.value, 'ordens_servico', os.id);
    await updateDoc(osDocRef, { status: 'cancelada' });
    console.log('✅ Ordem marcada como cancelada');

    // 2. Restaura o estoque dos itens
    for (const item of (os.items || [])) {
      const itemDocRef = doc(db, 'stores', storeId.value, 'itens', item.id);
      const novaQuantidade = (item.quantidade || 0) + (item.quantity || 0);
      await updateDoc(itemDocRef, { quantidade: novaQuantidade });
      console.log(`✅ Estoque restaurado - ${item.nome}: ${novaQuantidade} unidades`);
    }

    // 3. Registra uma transação reversa no financeiro (cancelamento)
    await registrarVenda({
      descricao: `CANCELAMENTO - Ordem de Serviço #${os.id} - ${os.customerName}`,
      valor: -(os.totalAmount || 0),
      categoria: 'cancelamento',
      cliente_id: os.customerId,
      ordem_servico_id: os.id,
      metodo_pagamento: 'reembolso',
      produtos: (os.items || []).map(item => ({
        produtoId: item.id,
        quantidade: -(item.quantity || 0),
        preco_unitario: item.precoVenda || item.preco || 0,
        subtotal: -((item.precoVenda || item.preco || 0) * (item.quantity || 0))
      }))
    });

    console.log('✅ Transação reversa registrada no financeiro');
    
    // 4. Atualiza a lista localmente
    const osIndex = ordensServico.value.findIndex(o => o.id === os.id);
    if (osIndex >= 0) {
      ordensServico.value[osIndex].status = 'cancelada';
    }

    toast.success('Ordem cancelada com sucesso!', { id: toastId });
  } catch (error) {
    console.error('Erro ao cancelar ordem:', error);
    toast.error('Erro ao cancelar: ' + error.message, { id: toastId });
  } finally {
    cancelingOsId.value = null;
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
          <ul v-if="filteredOrdensServico.length > 0" class="space-y-3">
            <li 
              v-for="(os, index) in filteredOrdensServico" 
              :key="os.id" 
              :class="`fade-in fade-in-delay-${Math.min(index + 1, 5)} flex items-center justify-between p-4 rounded-lg border card-hover ${os.status === 'cancelada' ? 'bg-red-50 dark:bg-red-950 opacity-60' : 'hover:bg-muted/50 cursor-pointer'}`"
            >
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <strong class="text-lg">{{ os.customerName }}</strong>
                  <span 
                    v-if="os.status === 'cancelada'"
                    class="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                  >
                    Cancelada
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">
                  {{ Array.isArray(os.observations) ? os.observations.join(', ') : os.observations }}
                </p>
                <p class="text-sm font-semibold mt-1">Total: R$ {{ (os.totalAmount || 0).toFixed(2) }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <Button 
                  v-if="os.status !== 'cancelada'"
                  variant="outline" 
                  size="sm" 
                  @click="generateReceipt(os)"
                >
                  Gerar Recibo
                </Button>
                <RouterLink 
                  v-if="os.status !== 'cancelada'"
                  :to="{ name: 'OrdemServicoEditar', params: { id: os.id } }"
                >
                  <Button variant="ghost" size="icon">
                    <Pencil class="h-4 w-4" />
                  </Button>
                </RouterLink>
                <Button 
                  v-if="os.status !== 'cancelada'"
                  variant="destructive" 
                  size="icon"
                  :disabled="cancelingOsId === os.id"
                  @click="cancelarOrdem(os)"
                  title="Cancelar ordem de serviço"
                >
                  <XCircle class="h-4 w-4" />
                </Button>
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

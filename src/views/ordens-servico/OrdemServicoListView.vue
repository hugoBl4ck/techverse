<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { db } from '@/firebase/config.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import { useTransacoes } from '@/composables/useTransacoes';
import { toast } from 'vue-sonner';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, ClipboardCopy, X, XCircle, Ban } from 'lucide-vue-next';

const { storeId } = useCurrentStore();
const { registrarVenda } = useTransacoes(storeId);

const ordensServico = ref([]);
const isLoading = ref(true);
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
    alert('Não foi possível copiar o texto.');
  }
}

const loadOrdensServico = async () => {
  if (!storeId.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

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
  } catch (error) {
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

     // 2. Restaura o estoque dos itens
     for (const item of (os.items || [])) {
       const itemDocRef = doc(db, 'stores', storeId.value, 'itens', item.id);
       const novaQuantidade = (item.quantidade || 0) + (item.quantity || 0);
       await updateDoc(itemDocRef, { quantidade: novaQuantidade });
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
     
     // 4. Atualiza a lista localmente
     const osIndex = ordensServico.value.findIndex(o => o.id === os.id);
     if (osIndex >= 0) {
       ordensServico.value[osIndex].status = 'cancelada';
     }

     toast.success('Ordem cancelada com sucesso!', { id: toastId });
   } catch (error) {
     toast.error('Erro ao cancelar: ' + error.message, { id: toastId });
   } finally {
     cancelingOsId.value = null;
   }
};

onMounted(() => {
  loadOrdensServico();
});

const ordensAtivas = computed(() => {
   if (!ordensServico.value) return [];
   return ordensServico.value
     .filter(os => os.status !== 'cancelada')
     .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const ordensCanceladas = computed(() => {
   if (!ordensServico.value) return [];
   return ordensServico.value
     .filter(os => os.status === 'cancelada')
     .sort((a, b) => new Date(b.date) - new Date(a.date));
});
</script>

<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Ordens de Serviço</h1>
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

    <div v-else class="space-y-6">
      <!-- Ordens Ativas -->
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table v-if="ordensAtivas.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead class="text-right">Valor</TableHead>
                <TableHead class="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="os in ordensAtivas"
                :key="os.id"
                class="hover:bg-muted/50"
              >
                <TableCell>
                  <strong>{{ os.customerName }}</strong>
                </TableCell>
                <TableCell>
                  {{ new Date(os.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                </TableCell>
                <TableCell>
                  {{ Array.isArray(os.observations) ? os.observations.join(', ') : os.observations }}
                </TableCell>
                <TableCell class="text-right font-semibold">
                  R$ {{ (os.totalAmount || 0).toFixed(2) }}
                </TableCell>
                <TableCell class="text-center">
                  <div class="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="generateReceipt(os)"
                    >
                      Recibo
                    </Button>
                    <RouterLink :to="{ name: 'OrdemServicoEditar', params: { id: os.id } }">
                      <Button variant="ghost" size="icon">
                        <Pencil class="h-4 w-4" />
                      </Button>
                    </RouterLink>
                    <Button
                      variant="destructive"
                      size="icon"
                      :disabled="cancelingOsId === os.id"
                      @click="cancelarOrdem(os)"
                      title="Cancelar ordem de serviço"
                    >
                      <XCircle class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p v-else class="text-muted-foreground text-center py-8">
            Nenhuma ordem de serviço ativa encontrada.
          </p>
        </CardContent>
      </Card>

      <!-- Ordens Canceladas -->
      <Card v-if="ordensCanceladas.length > 0">
        <CardHeader>
          <CardTitle>Ordens de Serviço Canceladas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead class="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="os in ordensCanceladas"
                :key="os.id"
              >
                <TableCell>
                  <strong>{{ os.customerName }}</strong>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Ban class="h-4 w-4" />
                    <span class="text-sm font-medium">Cancelada</span>
                  </div>
                </TableCell>
                <TableCell>
                  {{ new Date(os.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                </TableCell>
                <TableCell>
                  {{ Array.isArray(os.observations) ? os.observations.join(', ') : os.observations }}
                </TableCell>
                <TableCell class="text-right font-semibold">
                  R$ {{ (os.totalAmount || 0).toFixed(2) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { db } from '@/firebase/config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTenant } from '@/composables/useTenant';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, ClipboardCopy, X } from 'lucide-vue-next';

const { tenant } = useTenant();
const services = ref([]);
const isLoading = ref(true);
const selectedDate = ref(new Date());
const receiptText = ref('');
const showReceiptModal = ref(false);

function generateReceipt(service) {
  const serviceDate = new Date(service.date);
  const warrantyDate = new Date(serviceDate);
  warrantyDate.setDate(serviceDate.getDate() + 15);

  const formattedServiceDate = serviceDate.toLocaleDateString('pt-BR');
  const formattedWarrantyDate = warrantyDate.toLocaleDateString('pt-BR');

  const observations = Array.isArray(service.observations) 
    ? service.observations.join('\n- ') 
    : service.observations;

  receiptText.value = `*RECIBO E GARANTIA DE SERVIÇO - TechVerse*

*Cliente:* ${service.customerName}
*Data do Serviço:* ${formattedServiceDate}
*Valor:* R$ ${service.price.toFixed(2)}

*Serviço(s) Realizado(s):*
- ${observations}

---\n*Garantia:* Este serviço possui garantia de 15 dias, válida até ${formattedWarrantyDate}.
A garantia cobre defeitos relacionados ao serviço prestado. Não cobre mau uso ou problemas não relacionados ao serviço original.

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

const loadServices = async () => {
  if (!tenant.value) return;
  isLoading.value = true;
  const servicesCol = collection(db, 'stores', tenant.value, 'servicos');
  const servicesSnapshot = await getDocs(servicesCol);
  services.value = servicesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
  }));
  isLoading.value = false;
};

watch(tenant, (newTenant) => {
  if (newTenant) {
    loadServices();
  }
}, { immediate: true });

const filteredServices = computed(() => {
  if (!services.value) return [];
  return services.value.filter((service) => {
    const serviceDate = new Date(service.date);
    serviceDate.setUTCHours(0, 0, 0, 0);
    const selected = new Date(selectedDate.value);
    selected.setUTCHours(0, 0, 0, 0);
    return serviceDate.getTime() === selected.getTime();
  });
});
</script>

<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="flex items-center mb-4">
      <h1 class="text-2xl font-bold">Agenda de Serviços</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <CardTitle>Serviços para {{ selectedDate.toLocaleDateString() }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul v-if="filteredServices.length > 0" class="space-y-2">
            <li v-for="service in filteredServices" :key="service.id" class="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
              <div>
                <strong>{{ service.customerName }}</strong>
                <p class="text-sm text-muted-foreground">{{ (service.observations || []).join(', ') }}</p>
              </div>
              <div class="flex items-center flex-shrink-0">
                <Button variant="outline" size="sm" @click="generateReceipt(service)" class="mr-2">
                  Gerar Recibo
                </Button>
                <router-link :to="{ name: 'ServicoEditar', params: { id: service.id } }">
                  <Button variant="ghost" size="icon">
                    <Pencil class="h-4 w-4" />
                  </Button>
                </router-link>
              </div>
            </li>
          </ul>
          <p v-else class="text-muted-foreground">Nenhum serviço agendado para esta data.</p>
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
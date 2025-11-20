<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
      <!-- Logo -->
      <div class="text-center mb-12 fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Heart class="h-8 w-8 text-primary" />
        </div>
        <h1 class="text-4xl font-bold mb-2">Apoie o TechVerse</h1>
        <p class="text-lg text-muted-foreground">
          Sua doação nos ajuda a melhorar e oferecer ainda mais recursos
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Left: QR Code & Info -->
        <div class="fade-in fade-in-delay-1">
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Smartphone class="h-5 w-5" />
                Doação Rápida
              </CardTitle>
              <CardDescription>Escaneie o QR Code e digite o valor no seu app</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- QR Code -->
              <div class="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div
                  v-if="qrCodeUrl"
                  class="w-64 h-64 p-2 bg-white rounded-lg shadow-lg"
                >
                  <img :src="qrCodeUrl" alt="QR Code PIX" class="w-full h-full" />
                </div>
                <div v-else-if="isLoading" class="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <div v-else class="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-4">
                  <Info class="h-8 w-8 text-muted-foreground mb-2" />
                  <p class="text-sm text-muted-foreground">Configuração PIX pendente.</p>
                  <p class="text-xs text-muted-foreground mt-1">Contate o administrador.</p>
                </div>
              </div>

              <!-- PIX Key Info -->
              <div class="space-y-2">
                <p class="text-sm font-medium text-center">Chave PIX:</p>
                <div class="flex gap-2">
                  <div class="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p class="text-xs text-muted-foreground mb-1">{{ pixKeyType }}</p>
                    <p class="font-mono text-sm font-semibold break-all">{{ pixKey }}</p>
                  </div>
                  <Button
                    @click="copyPixKey"
                    variant="outline"
                    size="icon"
                    class="h-auto"
                  >
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <!-- Instructions -->
              <div class="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p class="text-xs font-medium flex items-center gap-2">
                  <Info class="h-4 w-4" />
                  Como funciona
                </p>
                <ol class="text-xs text-muted-foreground space-y-1 ml-6 list-decimal">
                  <li>Abra seu app de banco</li>
                  <li>Selecione PIX → Pagar</li>
                  <li>Escaneie o QR code ou copie a chave</li>
                  <li>Escolha o valor desejado</li>
                  <li>Confirme a transação</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right: Donation Options -->
        <div class="fade-in fade-in-delay-2 flex flex-col gap-4">
          <!-- Preset Amounts -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Gift class="h-5 w-5" />
                Valores Sugeridos
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <button
                v-for="amount in presetAmounts"
                :key="amount"
                @click="selectedAmount = amount"
                :class="[
                  'w-full p-4 rounded-lg border-2 transition-all duration-200',
                  selectedAmount === amount
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                ]"
              >
                <p class="text-2xl font-bold text-primary">R$ {{ amount.toFixed(2).replace('.', ',') }}</p>
                <p class="text-xs text-muted-foreground">{{ getAmountDescription(amount) }}</p>
              </button>

              <div class="space-y-2 pt-2">
                <p class="text-sm font-medium">Valor personalizado</p>
                <div class="flex gap-2">
                  <div class="flex-1 relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <input
                      v-model.number="customAmount"
                      type="number"
                      placeholder="0,00"
                      min="0.01"
                      step="0.01"
                      @focus="selectedAmount = null"
                      class="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Benefits -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base flex items-center gap-2">
                <Star class="h-5 w-5" />
                Seus Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div v-for="benefit in benefits" :key="benefit" class="flex gap-3">
                <CheckCircle class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p class="text-sm text-muted-foreground">{{ benefit }}</p>
              </div>
            </CardContent>
          </Card>

          <!-- Alternative Methods -->
          <Card class="border-dashed">
            <CardHeader>
              <CardTitle class="text-base">Outras Formas de Apoiar</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button variant="outline" class="w-full justify-start h-auto py-2">
                <CreditCard class="mr-2 h-4 w-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">Cartão de Crédito</p>
                  <p class="text-xs text-muted-foreground">Via PayPal ou PagSeguro</p>
                </div>
              </Button>
              <Button variant="outline" class="w-full justify-start h-auto py-2">
                <Globe class="mr-2 h-4 w-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">Criptomoedas</p>
                  <p class="text-xs text-muted-foreground">Bitcoin, Ethereum e outras</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Recent Donations (Anonymous) -->
      <div class="mt-12 fade-in fade-in-delay-3">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Users class="h-5 w-5" />
              Apoiadores Recentes
            </CardTitle>
            <CardDescription>Últimas doações recebidas (valores anônimos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="donation in recentDonations"
                :key="donation.id"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium">{{ donation.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ donation.date }}</p>
                  </div>
                </div>
                <p class="text-sm font-semibold text-green-600">+ R$ {{ donation.amount }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center text-sm text-muted-foreground pb-8">
        <p>💝 Obrigado por apoiar o TechVerse!</p>
        <p class="mt-2">Suas doações nos ajudam a manter e melhorar a plataforma</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Smartphone,
  Copy,
  Info,
  Gift,
  Star,
  CheckCircle,
  CreditCard,
  Globe,
  Users,
  Loader2
} from 'lucide-vue-next';
import { useFirestore } from '@/composables/useFirestore';
import { generatePixQRCode } from '@/lib/pixGenerator';

const { getPixConfig } = useFirestore();

const pixKey = ref('');
const pixKeyType = ref('');
const qrCodeUrl = ref('');
const selectedAmount = ref(50);
const customAmount = ref(0);
const storedConfig = ref(null);
const isLoading = ref(true);

const presetAmounts = [10, 25, 50, 100, 250];

const benefits = [
  'Acesso a recursos premium',
  'Suporte prioritário',
  'Seu nome nos agradecimentos',
  'Participação em votações de features'
];

const recentDonations = [
  { id: 1, name: 'Doador Anônimo', amount: '100,00', date: 'há 2 horas' },
  { id: 2, name: 'Apoiador Especial', amount: '50,00', date: 'há 5 horas' },
  { id: 3, name: 'Fã do TechVerse', amount: '25,00', date: 'há 1 dia' },
  { id: 4, name: 'Doador Anônimo', amount: '75,00', date: 'há 2 dias' },
  { id: 5, name: 'Comunidade Tech', amount: '150,00', date: 'há 3 dias' }
];

const finalAmount = computed(() => {
  return selectedAmount.value || customAmount.value;
});

onMounted(async () => {
  await loadPixConfig();
});

import { watch } from 'vue';

// Watch removed as QR code is now static
// watch(finalAmount, async () => {
//   if (storedConfig.value) {
//     await generateQRCode();
//   }
// });

async function generateQRCode() {
  if (!storedConfig.value) return;
  
  const { chave, nomeRecebimento, cidade } = storedConfig.value;
  // Definir nome e cidade do beneficiário
  const name = (nomeRecebimento && nomeRecebimento.trim()) ? nomeRecebimento.trim() : 'TechVerse';
  const city = (cidade && cidade.trim()) ? cidade.trim() : '';
  if (!city) {
    toast.warning('Cidade não configurada. Defina a cidade no painel admin para gerar QR Code válido.');
  }
  
  // Gerar QR Code estático (valor 0 = livre)
  const generatedUrl = await generatePixQRCode(chave, 0, name, city);
  if (generatedUrl) {
    qrCodeUrl.value = generatedUrl;
    toast.success('QR Code gerado com sucesso');
  } else {
    toast.error('Falha ao gerar QR Code. Verifique a configuração PIX.');
  }
}

async function loadPixConfig() {
  isLoading.value = true;
  try {
    const config = await getPixConfig();
    if (config && config.chave) {
      storedConfig.value = config;
      pixKey.value = config.chave;
      pixKeyType.value = detectPixKeyType(config.chave);
      await generateQRCode();
    }
  } catch (error) {
    console.error('Erro ao carregar configuração PIX:', error);
    toast.error('Erro ao carregar PIX');
  } finally {
    isLoading.value = false;
  }
}

function detectPixKeyType(key) {
  if (key.includes('@')) return 'Email';
  if (key.match(/^\d{11}$/)) return 'CPF';
  if (key.match(/^\d{10,11}$/)) return 'Telefone';
  return 'Chave Aleatória';
}

function copyPixKey() {
  navigator.clipboard.writeText(pixKey.value);
  toast.success('Chave PIX copiada!');
}

function getAmountDescription(amount) {
  const descriptions = {
    10: 'Café ☕',
    25: 'Almoço 🍽️',
    50: 'Suporte Mensal 💪',
    100: 'Supporter 🌟',
    250: 'Herói 🦸'
  };
  return descriptions[amount] || '';
}
</script>

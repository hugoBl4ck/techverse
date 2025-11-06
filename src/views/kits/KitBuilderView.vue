<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import draggable from 'vuedraggable';
import LegoBrick from '@/components/kit/LegoBrick.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Estado do Inventário e Kit
const inventario = ref([]);
const kitPlacaMae = ref([]);
const kitCpu = ref([]);
const kitRam = ref([]);
const kitGpu = ref([]);
const kitArmazenamento = ref([]);
const kitFonte = ref([]);
const kitGabinete = ref([]);

// Regras de Compatibilidade
const regrasKit = ref({ socket: null, tipoRam: null, formatoPlaca: null });

// Estado da IA
const chatInput = ref('');
const isLoadingIA = ref(false);

// Carregar Peças do Firebase
async function fetchPecas() {
  try {
    const pecasCol = collection(db, 'pecas');
    const pecasSnapshot = await getDocs(pecasCol);
    inventario.value = pecasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar peças:", error);
  }
}

onMounted(fetchPecas);

watch(kitPlacaMae, (novasPecas) => {
  if (novasPecas.length > 0) {
    // Pega a compatibilidade da primeira (e única) placa-mãe
    const comp = novasPecas[0].compatibilidade;
    if (comp) {
      regrasKit.value.socket = comp.socket || null;
      regrasKit.value.tipoRam = comp.tipoRam || null;
      regrasKit.value.formatoPlaca = comp.formato || null;
    }
  } else {
    // Limpa as regras se o slot da placa-mãe estiver vazio
    regrasKit.value = { socket: null, tipoRam: null, formatoPlaca: null };
  }
});

// Listas de Peças Computadas por Tipo com Filtro de Compatibilidade
const cpus = computed(() => {
  return inventario.value.filter(p => {
    if (p.tipo !== 'cpu') return false;
    // Se uma regra de socket estiver ativa, a CPU DEVE dar match
    if (regrasKit.value.socket && p.compatibilidade?.socket !== regrasKit.value.socket) {
      return false;
    }
    return true;
  });
});

const placasMae = computed(() => inventario.value.filter(p => p.tipo === 'placa-mae'));

const rams = computed(() => {
  return inventario.value.filter(p => {
    if (p.tipo !== 'ram') return false;
    // Se uma regra de RAM estiver ativa, a RAM DEVE dar match
    if (regrasKit.value.tipoRam && p.compatibilidade?.tipoRam !== regrasKit.value.tipoRam) {
      return false;
    }
    return true;
  });
});

const gabinetes = computed(() => {
    return inventario.value.filter(p => {
        if (p.tipo !== 'gabinete') return false;
        // Se uma regra de formato de placa estiver ativa, o gabinete DEVE ser compatível
        if (regrasKit.value.formatoPlaca && p.compatibilidade?.formatosAceitos && !p.compatibilidade.formatosAceitos.includes(regrasKit.value.formatoPlaca)) {
            return false;
        }
        return true;
    });
});

const gpus = computed(() => inventario.value.filter(p => p.tipo === 'gpu'));
const armazenamentos = computed(() => inventario.value.filter(p => p.tipo === 'armazenamento'));
const fontes = computed(() => inventario.value.filter(p => p.tipo === 'fonte'));

// Lógica do Assistente de IA
async function handleIAChat() {
  if (!chatInput.value.trim()) return;
  isLoadingIA.value = true;
  try {
    // Simulação de chamada de API
    // Em um projeto real, isso seria:
    // const response = await fetch('/api/parse-kit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: chatInput.value })
    // });
    // const data = await response.json();

    // Mock da resposta da IA para fins de desenvolvimento
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = {
      componentes: [
        { tipo: 'cpu', componente: 'Ryzen 5 5600X' },
        { tipo: 'placa-mae', componente: 'ASUS TUF B550M' },
        { tipo: 'ram', componente: 'Corsair Vengeance 16GB' },
        { tipo: 'gpu', componente: 'NVIDIA RTX 3060' },
      ]
    };

    // Limpa os slots
    kitCpu.value = [];
    kitPlacaMae.value = [];
    kitRam.value = [];
    kitGpu.value = [];
    kitArmazenamento.value = [];
    kitFonte.value = [];
    kitGabinete.value = [];

    // Preenche os slots com base na resposta da IA
    data.componentes.forEach(pecaIA => {
      const pecaFormatada = { nome: pecaIA.componente, tipo: pecaIA.tipo, id: `ia-${Date.now()}` };
      switch (pecaIA.tipo) {
        case 'cpu':
          kitCpu.value = [pecaFormatada];
          break;
        case 'placa-mae':
          kitPlacaMae.value = [pecaFormatada];
          break;
        case 'ram':
          kitRam.value.push(pecaFormatada);
          break;
        case 'gpu':
          kitGpu.value = [pecaFormatada];
          break;
        case 'armazenamento':
          kitArmazenamento.value = [pecaFormatada];
          break;
        case 'fonte':
          kitFonte.value = [pecaFormatada];
          break;
        case 'gabinete':
          kitGabinete.value = [pecaFormatada];
          break;
      }
    });

  } catch (error) {
    console.error("Erro ao processar o kit com IA:", error);
  } finally {
    isLoadingIA.value = false;
  }
}

const dragOptions = {
  animation: 200,
  ghostClass: "ghost"
};

</script>

<template>
  <div class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Coluna 1: Estoque de Peças -->
      <div class="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Estoque de Peças (Lego)</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 max-h-[80vh] overflow-y-auto">
            <div v-if="!inventario.length">Carregando peças...</div>
            
            <div v-if="cpus.length">
              <h3 class="font-semibold mb-2">CPUs</h3>
              <draggable :list="cpus" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>
            
            <div v-if="placasMae.length">
              <h3 class="font-semibold mb-2">Placas-Mãe</h3>
              <draggable :list="placasMae" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

            <div v-if="rams.length">
              <h3 class="font-semibold mb-2">Memória RAM</h3>
              <draggable :list="rams" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

            <div v-if="gpus.length">
              <h3 class="font-semibold mb-2">Placas de Vídeo</h3>
              <draggable :list="gpus" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

             <div v-if="armazenamentos.length">
              <h3 class="font-semibold mb-2">Armazenamento</h3>
              <draggable :list="armazenamentos" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

             <div v-if="fontes.length">
              <h3 class="font-semibold mb-2">Fontes</h3>
              <draggable :list="fontes" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

             <div v-if="gabinetes.length">
              <h3 class="font-semibold mb-2">Gabinetes</h3>
              <draggable :list="gabinetes" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-wrap gap-2">
                <template #item="{element}">
                  <LegoBrick :peca="element" class="w-full"/>
                </template>
              </draggable>
            </div>

          </CardContent>
        </Card>
      </div>

      <!-- Coluna 2: Montagem do Kit -->
      <div class="lg:col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>Montagem do Kit Atual</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            
            <div>
              <label class="font-semibold">CPU</label>
              <draggable v-model="kitCpu" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1" :disabled="kitPlacaMae.length === 0">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Placa-Mãe</label>
              <draggable v-model="kitPlacaMae" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Memória RAM</label>
              <draggable v-model="kitRam" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1" :disabled="kitPlacaMae.length === 0">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Placa de Vídeo (GPU)</label>
              <draggable v-model="kitGpu" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Armazenamento</label>
              <draggable v-model="kitArmazenamento" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Fonte de Alimentação</label>
              <draggable v-model="kitFonte" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Gabinete</label>
              <draggable v-model="kitGabinete" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <LegoBrick :peca="element" />
                </template>
              </draggable>
            </div>

          </CardContent>
        </Card>
      </div>

      <!-- Coluna 3: Assistente de IA -->
      <div class="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Assistente de IA</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">Cole a descrição de um kit para pré-montá-lo.</p>
            <Textarea 
              v-model="chatInput"
              placeholder="Ex: Kit com Ryzen 5 5600X, RTX 3060 e 16GB de RAM..."
              class="min-h-[200px]"
              :disabled="isLoadingIA"
            />
            <Button @click="handleIAChat" class="w-full" :disabled="isLoadingIA">
              <span v-if="isLoadingIA">Analisando...</span>
              <span v-else>Analisar Kit</span>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  </div>
</template>

<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
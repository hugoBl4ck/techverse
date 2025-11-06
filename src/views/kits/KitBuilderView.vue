<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import draggable from 'vuedraggable';
import PecaChip from '@/components/kit/PecaChip.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Estado do Inventário
const inventario = ref([]);

// Estado do Kit Builder Atual
const kitPlacaMae = ref([]);
const kitCpu = ref([]);
const kitRam = ref([]);
const kitGpu = ref([]);
const kitArmazenamento = ref([]);
const kitFonte = ref([]);
const kitGabinete = ref([]);

// Canvas de Kits Salvos
const savedKits = ref([]);

// Regras de Compatibilidade
const regrasKit = ref({ socket: null, tipoRam: null, formatoPlaca: null });

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

// Watcher para atualizar regras de compatibilidade
watch(kitPlacaMae, (novasPecas) => {
  if (novasPecas.length > 0) {
    const comp = novasPecas[0].compatibilidade;
    if (comp) {
      regrasKit.value.socket = comp.socket || null;
      regrasKit.value.tipoRam = comp.tipoRam || null;
      regrasKit.value.formatoPlaca = comp.formato || null;
    }
  } else {
    regrasKit.value = { socket: null, tipoRam: null, formatoPlaca: null };
  }
});

// Funções do Canvas
function salvarKitAtual() {
  const novoKit = {
    id: Date.now(),
    placaMae: kitPlacaMae.value,
    cpu: kitCpu.value,
    ram: kitRam.value,
    gpu: kitGpu.value,
    armazenamento: kitArmazenamento.value,
    fonte: kitFonte.value,
    gabinete: kitGabinete.value,
  };

  // Verifica se o kit não está vazio
  const temPecas = Object.values(novoKit).some(arr => Array.isArray(arr) && arr.length > 0);
  if (temPecas) {
    savedKits.value.push(novoKit);
    limparKitAtual();
  }
}

function limparKitAtual() {
  kitPlacaMae.value = [];
  kitCpu.value = [];
  kitRam.value = [];
  kitGpu.value = [];
  kitArmazenamento.value = [];
  kitFonte.value = [];
  kitGabinete.value = [];
}

function removerKitSalvo(kitId) {
  savedKits.value = savedKits.value.filter(k => k.id !== kitId);
}

// Listas de Peças Computadas por Tipo com Filtro de Compatibilidade
const cpus = computed(() => {
  return inventario.value.filter(p => {
    if (p.tipo !== 'cpu') return false;
    if (regrasKit.value.socket && p.compatibilidade?.socket !== regrasKit.value.socket) return false;
    return true;
  });
});

const placasMae = computed(() => inventario.value.filter(p => p.tipo === 'placa-mae'));

const rams = computed(() => {
  return inventario.value.filter(p => {
    if (p.tipo !== 'ram') return false;
    if (regrasKit.value.tipoRam && p.compatibilidade?.tipoRam !== regrasKit.value.tipoRam) return false;
    return true;
  });
});

const gabinetes = computed(() => {
    return inventario.value.filter(p => {
        if (p.tipo !== 'gabinete') return false;
        if (regrasKit.value.formatoPlaca && p.compatibilidade?.formatosAceitos && !p.compatibilidade.formatosAceitos.includes(regrasKit.value.formatoPlaca)) return false;
        return true;
    });
});

const gpus = computed(() => inventario.value.filter(p => p.tipo === 'gpu'));
const armazenamentos = computed(() => inventario.value.filter(p => p.tipo === 'armazenamento'));
const fontes = computed(() => inventario.value.filter(p => p.tipo === 'fonte'));

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
            <CardTitle>Estoque de Peças</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 max-h-[80vh] overflow-y-auto">
            <div v-if="!inventario.length">Carregando peças...</div>
            
            <div v-if="cpus.length">
              <h3 class="font-semibold mb-2">CPUs</h3>
              <draggable :list="cpus" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
            
            <div v-if="placasMae.length">
              <h3 class="font-semibold mb-2">Placas-Mãe</h3>
              <draggable :list="placasMae" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div v-if="rams.length">
              <h3 class="font-semibold mb-2">Memória RAM</h3>
              <draggable :list="rams" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div v-if="gpus.length">
              <h3 class="font-semibold mb-2">Placas de Vídeo</h3>
              <draggable :list="gpus" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

             <div v-if="armazenamentos.length">
              <h3 class="font-semibold mb-2">Armazenamento</h3>
              <draggable :list="armazenamentos" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

             <div v-if="fontes.length">
              <h3 class="font-semibold mb-2">Fontes</h3>
              <draggable :list="fontes" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

             <div v-if="gabinetes.length">
              <h3 class="font-semibold mb-2">Gabinetes</h3>
              <draggable :list="gabinetes" :group="{ name: 'pecas', pull: 'clone', put: false }" item-key="id" :sort="false" class="flex flex-col gap-2">
                <template #item="{element}">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

          </CardContent>
        </Card>
      </div>

      <!-- Coluna 2: Canvas de Montagem -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Card de Montagem do Kit Atual -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle>Montagem do Kit Atual</CardTitle>
            <div class="space-x-2">
              <Button variant="outline" @click="limparKitAtual">Limpar</Button>
              <Button @click="salvarKitAtual">Salvar Kit</Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            
            <div>
              <label class="font-semibold">Placa-Mãe</label>
              <draggable v-model="kitPlacaMae" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">CPU</label>
              <draggable v-model="kitCpu" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1" :disabled="kitPlacaMae.length === 0">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Memória RAM</label>
              <draggable v-model="kitRam" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1" :disabled="kitPlacaMae.length === 0">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Placa de Vídeo (GPU)</label>
              <draggable v-model="kitGpu" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Armazenamento</label>
              <draggable v-model="kitArmazenamento" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Fonte de Alimentação</label>
              <draggable v-model="kitFonte" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

            <div>
              <label class="font-semibold">Gabinete</label>
              <draggable v-model="kitGabinete" group="pecas" item-key="id" class="min-h-20 p-2 border-dashed border-border rounded-lg mt-1">
                 <template #item="{element}">
                    <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>

          </CardContent>
        </Card>

        <!-- Canvas de Kits Salvos -->
        <div v-if="savedKits.length > 0" class="space-y-4">
            <h2 class="text-2xl font-bold">Canvas de Kits Salvos</h2>
            <Card v-for="kit in savedKits" :key="kit.id">
                <CardHeader class="flex flex-row items-center justify-between">
                    <CardTitle>Kit Salvo #{{ kit.id }}</CardTitle>
                    <Button variant="destructive" size="sm" @click="removerKitSalvo(kit.id)">Remover</Button>
                </CardHeader>
                <CardContent class="flex flex-wrap gap-2">
                    <!-- Renderiza todos os chips de peças do kit salvo -->
                    <PecaChip v-for="peca in kit.placaMae" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.cpu" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.ram" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.gpu" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.armazenamento" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.fonte" :key="peca.id" :peca="peca" />
                    <PecaChip v-for="peca in kit.gabinete" :key="peca.id" :peca="peca" />
                </CardContent>
            </Card>
        </div>

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

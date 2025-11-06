<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import draggable from 'vuedraggable';
import PecaChip from '@/components/kit/PecaChip.vue';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import KitMount from '@/components/kit/KitMount.vue';

// --- STATE ---
const inventario = ref([]);
const kitsNaTela = ref([]);
const kitCounter = ref(0);

// --- LIFECYCLE ---
onMounted(fetchPecas);

// --- COMPUTED ---
const cpus = computed(() => inventario.value.filter(p => p.tipo === 'cpu'));
const rams = computed(() => inventario.value.filter(p => p.tipo === 'ram'));
const placasMae = computed(() => inventario.value.filter(p => p.tipo === 'placa-mae'));
const gpus = computed(() => inventario.value.filter(p => p.tipo === 'gpu'));
const armazenamentos = computed(() => inventario.value.filter(p => p.tipo === 'armazenamento'));
const fontes = computed(() => inventario.value.filter(p => p.tipo === 'fonte'));
const gabinetes = computed(() => inventario.value.filter(p => p.tipo === 'gabinete'));

// --- METHODS ---
async function fetchPecas() {
  try {
    const pecasCol = collection(db, 'pecas');
    const pecasSnapshot = await getDocs(pecasCol);
    inventario.value = pecasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar peças:", error);
  }
}

function adicionarNovoKit() {
  kitCounter.value++;
  kitsNaTela.value.push({ id: kitCounter.value });
}

function removerKit(index) {
  kitsNaTela.value.splice(index, 1);
}
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="h-full w-full">
    <!-- Coluna Esquerda: Estoque de Peças -->
    <ResizablePanel :default-size="30" class="p-4">
      <Card class="h-full flex flex-col">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold font-display">Estoque de Peças</h2>
        </div>
        <ScrollArea class="flex-1">
          <div class="p-4 space-y-4">
            <!-- CPUs -->
            <div>
              <h3 class="font-semibold mb-2">CPUs</h3>
              <draggable :list="cpus" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
            <!-- Placas-Mãe -->
            <div>
              <h3 class="font-semibold mb-2">Placas-Mãe</h3>
              <draggable :list="placasMae" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
            <!-- Memória RAM -->
            <div>
              <h3 class="font-semibold mb-2">Memória RAM</h3>
              <draggable :list="rams" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
            <!-- Placas de Vídeo -->
            <div>
              <h3 class="font-semibold mb-2">Placas de Vídeo</h3>
              <draggable :list="gpus" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
            <!-- Armazenamento -->
            <div>
              <h3 class="font-semibold mb-2">Armazenamento</h3>
              <draggable :list="armazenamentos" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
             <!-- Fontes -->
            <div>
              <h3 class="font-semibold mb-2">Fontes</h3>
              <draggable :list="fontes" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
             <!-- Gabinetes -->
            <div>
              <h3 class="font-semibold mb-2">Gabinetes</h3>
              <draggable :list="gabinetes" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'pecas', pull: 'clone', put: false }">
                <template #item="{ element }">
                  <PecaChip :peca="element" />
                </template>
              </draggable>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </ResizablePanel>

    <ResizableHandle with-handle />

    <!-- Coluna Direita: Área de Trabalho (Canvas) -->
    <ResizablePanel :default-size="70">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold font-display">Área de Trabalho</h2>
          <Button @click="adicionarNovoKit">+ Adicionar Novo Kit</Button>
        </div>
        <ScrollArea class="flex-1 bg-muted/30">
          <div class="flex flex-wrap gap-6 p-6">
            <div v-for="(kit, index) in kitsNaTela" :key="kit.id">
              <KitMount :kit-id="kit.id" @delete="removerKit(index)" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
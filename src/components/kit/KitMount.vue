<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import ItemChip from '@/components/kit/ItemChip.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pin, PinOff, Trash2, AlertTriangle, Save } from 'lucide-vue-next'; // Added Save icon
import { db } from '@/firebase/config'; // Added db import
import { collection, addDoc } from 'firebase/firestore'; // Added collection and addDoc imports

// --- PROPS & EMITS ---
const props = defineProps({ kitId: Number });
const emits = defineEmits(['delete']);

// --- STATE ---
const nomeKit = ref('Novo Kit ' + props.kitId);
const isPinned = ref(false);
const regrasKit = ref({ socket: null, tipoRam: null });

// Kit Slots
const kitPlacaMae = ref([]);
const kitCpu = ref([]);
const kitRam = ref([]);
const kitGpu = ref([]);
const kitArmazenamento = ref([]);
const kitFonte = ref([]);
const kitGabinete = ref([]);
const kitWatercooler = ref([]);
const kitAircooler = ref([]);
const kitVentoinhas = ref([]);
const kitPastaTermica = ref([]);
const kitMouse = ref([]);
const kitTeclado = ref([]);
const kitControle = ref([]);
const kitControladoras = ref([]);

// Error State
const erroCpu = ref(null);
const erroRam = ref(null);

// --- WATCHERS ---
watch(kitPlacaMae, (newItems) => {
  if (newItems.length > 0) {
    const item = newItems[0];
    isPinned.value = true;
    regrasKit.value.socket = item.compatibilidade?.socket || null;
    regrasKit.value.tipoRam = item.compatibilidade?.tipoRam || null;
  } else {
    isPinned.value = false;
    regrasKit.value = { socket: null, tipoRam: null };
    // Clear dependent components
    kitCpu.value = [];
    kitRam.value = [];
  }
});

// --- DRAG & DROP LOGIC ---
function putPlacaMae(to, from, dragEl) {
  if (kitPlacaMae.value.length > 0) return false;
  return dragEl.getAttribute('data-tipo') === 'placa-mae';
}

function putCpu(to, from, dragEl) {
  erroCpu.value = null;
  if (!isPinned.value) {
    erroCpu.value = "Fixe uma Placa-Mãe primeiro.";
    return false;
  }
  if (kitCpu.value.length > 0) return false;
  if (dragEl.getAttribute('data-tipo') !== 'cpu') return false;
  
  const itemCpu = JSON.parse(dragEl.getAttribute('data-item'));
  if (itemCpu.compatibilidade?.socket !== regrasKit.value.socket) {
    erroCpu.value = `Socket incompatível! (Requer: ${regrasKit.value.socket})`;
    return false;
  }
  return true;
}

function putRam(to, from, dragEl) {
    erroRam.value = null;
    if (!isPinned.value) {
        erroRam.value = "Fixe uma Placa-Mãe primeiro.";
        return false;
    }
    if (dragEl.getAttribute('data-tipo') !== 'ram') return false;

    const itemRam = JSON.parse(dragEl.getAttribute('data-item'));
    if (itemRam.compatibilidade?.tipoRam !== regrasKit.value.tipoRam) {
        erroRam.value = `Tipo de RAM incompatível! (Requer: ${regrasKit.value.tipoRam})`;
        return false;
    }
    return true;
}

// Generic put for other slots
function putGenerico(to, from, dragEl, tipo) {
    return dragEl.getAttribute('data-tipo') === tipo;
}

// --- METHODS ---
async function saveKitToInventory() {
  const assembledKit = {
    placaMae: kitPlacaMae.value[0] || null,
    cpu: kitCpu.value[0] || null,
    ram: kitRam.value,
    gpu: kitGpu.value[0] || null,
    armazenamento: kitArmazenamento.value,
    fonte: kitFonte.value[0] || null,
    gabinete: kitGabinete.value[0] || null,
    watercooler: kitWatercooler.value[0] || null,
    aircooler: kitAircooler.value[0] || null,
    ventoinhas: kitVentoinhas.value,
    pastaTermica: kitPastaTermica.value[0] || null,
    mouse: kitMouse.value[0] || null,
    teclado: kitTeclado.value[0] || null,
    controle: kitControle.value[0] || null,
    controladoras: kitControladoras.value,
  };

  // Basic validation: ensure at least a motherboard is present
  if (!assembledKit.placaMae) {
    alert('Por favor, adicione uma Placa-Mãe ao kit antes de salvar no inventário.');
    return;
  }

  let totalPrecoVenda = 0;
  const itemsIds = [];
  const itemsDetalhes = []; // To store details for the new item's description

  // Helper to process each piece or array of pieces
  const processPiece = (pieceOrArray) => {
    if (pieceOrArray) {
      if (Array.isArray(pieceOrArray)) {
        pieceOrArray.forEach(p => {
          totalPrecoVenda += p.precoVenda || 0;
          itemsIds.push(p.id);
          itemsDetalhes.push(`${p.nome} (${p.tipo})`);
        });
      } else {
        totalPrecoVenda += pieceOrArray.precoVenda || 0;
        itemsIds.push(pieceOrArray.id);
        itemsDetalhes.push(`${pieceOrArray.nome} (${pieceOrArray.tipo})`);
      }
    }
  };

  // Process all slots
  processPiece(assembledKit.placaMae);
  processPiece(assembledKit.cpu);
  processPiece(assembledKit.ram);
  processPiece(assembledKit.gpu);
  processPiece(assembledKit.armazenamento);
  processPiece(assembledKit.fonte);
  processPiece(assembledKit.gabinete);
  processPiece(assembledKit.watercooler);
  processPiece(assembledKit.aircooler);
  processPiece(assembledKit.ventoinhas);
  processPiece(assembledKit.pastaTermica);
  processPiece(assembledKit.mouse);
  processPiece(assembledKit.teclado);
  processPiece(assembledKit.controle);
  processPiece(assembledKit.controladoras);

  const newItem = {
    nome: nomeKit.value,
    tipo: 'kit', // Mark as a kit
    precoVenda: totalPrecoVenda,
    quantidade: 1,
    itemsComponentes: itemsIds, // Store IDs of component items
    descricao: `Kit montado: ${itemsDetalhes.join(', ')}.`,
    createdAt: new Date(),
  };

  try {
    await addDoc(collection(db, 'items'), newItem);
    alert('Kit salvo no inventário com sucesso!');
    // Optionally, clear the kit after saving
    // kitPlacaMae.value = [];
    // ... clear other slots
  } catch (error) {
    console.error('Erro ao salvar kit no inventário:', error);
    alert('Houve um erro ao salvar o kit no inventário.');
  }
}
</script>

<template>
  <Card class="w-full max-w-md bg-card/80">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
      <Input v-model="nomeKit" class="text-lg font-semibold font-display bg-transparent border-none focus-visible:ring-0" />
      <div class="flex items-center gap-1">
        <Button @click="saveKitToInventory" variant="ghost" size="icon" title="Salvar Kit no Inventário">
          <Save class="size-5 text-green-500" />
        </Button>
        <Button @click="isPinned = !isPinned" variant="ghost" size="icon">
          <Pin v-if="isPinned" class="size-5 text-primary" />
          <PinOff v-else class="size-5" />
        </Button>
        <Button @click="$emit('delete')" variant="ghost" size="icon" class="text-destructive hover:text-destructive">
          <Trash2 class="size-5" />
        </Button>
      </div>
    </CardHeader>
    <CardContent class="p-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Slot Placa-Mãe -->
        <div class="col-span-2">
          <label class="text-sm font-medium">Placa-Mãe</label>
          <draggable v-model="kitPlacaMae" :group="{ name: 'items', put: putPlacaMae }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1 transition-colors" :class="{'border-primary': isPinned}">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot CPU -->
        <div>
          <label class="text-sm font-medium">CPU</label>
          <draggable v-model="kitCpu" :group="{ name: 'items', put: putCpu }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
          <div v-if="erroCpu" class="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertTriangle class="size-4" />
            <span>{{ erroCpu }}</span>
          </div>
        </div>

        <!-- Slot RAM -->
        <div>
          <label class="text-sm font-medium">Memória RAM</label>
          <draggable v-model="kitRam" :group="{ name: 'items', put: putRam }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
           <div v-if="erroRam" class="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertTriangle class="size-4" />
            <span>{{ erroRam }}</span>
          </div>
        </div>

         <!-- Slot GPU -->
        <div class="col-span-2">
          <label class="text-sm font-medium">Placa de Vídeo</label>
          <draggable v-model="kitGpu" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'gpu') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Armazenamento -->
        <div>
          <label class="text-sm font-medium">Armazenamento</label>
          <draggable v-model="kitArmazenamento" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'armazenamento') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Fonte -->
        <div>
          <label class="text-sm font-medium">Fonte</label>
          <draggable v-model="kitFonte" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'fonte') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Gabinete -->
        <div class="col-span-2">
          <label class="text-sm font-medium">Gabinete</label>
          <draggable v-model="kitGabinete" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'gabinete') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Watercooler -->
        <div>
          <label class="text-sm font-medium">Watercooler</label>
          <draggable v-model="kitWatercooler" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'watercooler') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Air Cooler -->
        <div>
          <label class="text-sm font-medium">Air Cooler</label>
          <draggable v-model="kitAircooler" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'aircooler') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Ventoinhas -->
        <div>
          <label class="text-sm font-medium">Ventoinhas</label>
          <draggable v-model="kitVentoinhas" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'ventoinhas') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Pasta Térmica -->
        <div>
          <label class="text-sm font-medium">Pasta Térmica</label>
          <draggable v-model="kitPastaTermica" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'pasta termica') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Mouse -->
        <div>
          <label class="text-sm font-medium">Mouse</label>
          <draggable v-model="kitMouse" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'mouse') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Teclado -->
        <div>
          <label class="text-sm font-medium">Teclado</label>
          <draggable v-model="kitTeclado" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'teclado') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Controle -->
        <div>
          <label class="text-sm font-medium">Controle</label>
          <draggable v-model="kitControle" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'controle') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Controladoras -->
        <div>
          <label class="text-sm font-medium">Controladoras</label>
          <draggable v-model="kitControladoras" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'controladoras') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

      </div>
    </CardContent>
  </Card>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import PecaChip from '@/components/kit/PecaChip.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pin, PinOff, Trash2, AlertTriangle } from 'lucide-vue-next';

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

// Error State
const erroCpu = ref(null);
const erroRam = ref(null);

// --- WATCHERS ---
watch(kitPlacaMae, (newPecas) => {
  if (newPecas.length > 0) {
    const peca = newPecas[0];
    isPinned.value = true;
    regrasKit.value.socket = peca.compatibilidade?.socket || null;
    regrasKit.value.tipoRam = peca.compatibilidade?.tipoRam || null;
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
  
  const pecaCpu = JSON.parse(dragEl.getAttribute('data-peca'));
  if (pecaCpu.compatibilidade?.socket !== regrasKit.value.socket) {
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

    const pecaRam = JSON.parse(dragEl.getAttribute('data-peca'));
    if (pecaRam.compatibilidade?.tipoRam !== regrasKit.value.tipoRam) {
        erroRam.value = `Tipo de RAM incompatível! (Requer: ${regrasKit.value.tipoRam})`;
        return false;
    }
    return true;
}

// Generic put for other slots
function putGenerico(to, from, dragEl, tipo) {
    return dragEl.getAttribute('data-tipo') === tipo;
}

</script>

<template>
  <Card class="w-full max-w-md bg-card/80 backdrop-blur-sm">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
      <Input v-model="nomeKit" class="text-lg font-semibold font-display bg-transparent border-none focus-visible:ring-0" />
      <div class="flex items-center gap-1">
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
          <draggable v-model="kitPlacaMae" :group="{ name: 'pecas', put: putPlacaMae }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1 transition-colors" :class="{'border-primary': isPinned}">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot CPU -->
        <div>
          <label class="text-sm font-medium">CPU</label>
          <draggable v-model="kitCpu" :group="{ name: 'pecas', put: putCpu }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
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
          <draggable v-model="kitRam" :group="{ name: 'pecas', put: putRam }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
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
          <draggable v-model="kitGpu" :group="{ name: 'pecas', put: (to, from, el) => putGenerico(to, from, el, 'gpu') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Armazenamento -->
        <div>
          <label class="text-sm font-medium">Armazenamento</label>
          <draggable v-model="kitArmazenamento" :group="{ name: 'pecas', put: (to, from, el) => putGenerico(to, from, el, 'armazenamento') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

        <!-- Slot Fonte -->
        <div>
          <label class="text-sm font-medium">Fonte</label>
          <draggable v-model="kitFonte" :group="{ name: 'pecas', put: (to, from, el) => putGenerico(to, from, el, 'fonte') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">
            <template #item="{ element }">
              <PecaChip :peca="element" :data-tipo="element.tipo" :data-peca="JSON.stringify(element)"/>
            </template>
          </draggable>
        </div>

      </div>
    </CardContent>
  </Card>
</template>

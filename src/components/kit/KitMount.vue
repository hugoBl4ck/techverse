<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({ kit: Object });

onMounted(() => {
  console.log(`KitMount component for kitId ${props.kit.id} mounted.`);
});

import draggable from 'vuedraggable';
import ItemChip from '@/components/kit/ItemChip.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pin, PinOff, Trash2, AlertTriangle, Save } from 'lucide-vue-next';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const emits = defineEmits(['delete']);

const isPinned = ref(false);
const regrasKit = ref({ socket: null, tipoRam: null });

const erroCpu = ref(null);
const erroRam = ref(null);

watch(() => props.kit.slots.placaMae, (newItems) => {
  if (newItems.length > 0) {
    const item = newItems[0];
    isPinned.value = true;
    regrasKit.value.socket = item.compatibilidade?.socket || null;
    regrasKit.value.tipoRam = item.compatibilidade?.tipoRam || null;
  } else {
    isPinned.value = false;
    regrasKit.value = { socket: null, tipoRam: null };
    props.kit.slots.cpu = [];
    props.kit.slots.ram = [];
  }
}, { deep: true });
function putPlacaMae(to, from, dragEl) {
  if (props.kit.slots.placaMae.length > 0) return false;
  return dragEl.getAttribute('data-tipo') === 'placa-mae';
}

function putCpu(to, from, dragEl) {
  erroCpu.value = null;
  if (!isPinned.value) {
    erroCpu.value = "Fixe uma Placa-Mãe primeiro.";
    return false;
  }
  if (props.kit.slots.cpu.length > 0) return false;
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

    if (Array.isArray(tipo)) {

        return tipo.includes(dragEl.getAttribute('data-tipo'));

    }

    return dragEl.getAttribute('data-tipo') === tipo;

}



async function saveKitToInventory() {

  const assembledKit = {

    placaMae: props.kit.slots.placaMae[0] || null,

    cpu: props.kit.slots.cpu[0] || null,

    ram: props.kit.slots.ram,

    gpu: props.kit.slots.gpu[0] || null,

    armazenamento: props.kit.slots.armazenamento,

    fonte: props.kit.slots.fonte[0] || null,

    gabinete: props.kit.slots.gabinete[0] || null,

    outros: props.kit.slots.outros,

  };



  if (!assembledKit.placaMae) {

    alert('Por favor, adicione uma Placa-Mãe ao kit antes de salvar no inventário.');

    return;

  }



  let totalPrecoVenda = 0;

  const itemsIds = [];

  const itemsDetalhes = [];



  Object.values(assembledKit).forEach(component => {

    if (!component) return;



    const items = Array.isArray(component) ? component : [component];

    items.forEach(item => {

      totalPrecoVenda += item.precoVenda || 0;

      itemsIds.push(item.id);

      itemsDetalhes.push(`${item.nome} (${item.tipo})`);

    });

  });



  const newItem = {

    nome: props.kit.nome,

    tipo: 'kit',

    precoVenda: totalPrecoVenda,

    quantidade: 1,

    itemsComponentes: itemsIds,

    descricao: `Kit montado: ${itemsDetalhes.join(', ')}.`, 

    createdAt: new Date(),

  };



  try {

    await addDoc(collection(db, 'itens'), newItem);

    alert('Kit salvo no inventário com sucesso!');

  } catch (error) {

    console.error('Erro ao salvar kit no inventário:', error);

    alert('Houve um erro ao salvar o kit no inventário.');

  }

}

</script>



<template>

  <Card class="w-full max-w-md bg-card/80">

    <CardHeader class="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">

      <Input v-model="kit.nome" class="text-lg font-semibold font-display bg-transparent border-none focus-visible:ring-0" />

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

          <draggable v-model="kit.slots.placaMae" :group="{ name: 'items', put: putPlacaMae }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1 transition-colors" :class="{'border-primary': isPinned}">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



        <!-- Slot CPU -->

        <div>

          <label class="text-sm font-medium">CPU</label>

          <draggable v-model="kit.slots.cpu" :group="{ name: 'items', put: putCpu }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

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

          <draggable v-model="kit.slots.ram" :group="{ name: 'items', put: putRam }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

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

          <draggable v-model="kit.slots.gpu" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'gpu') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



        <!-- Slot Armazenamento -->

        <div>

          <label class="text-sm font-medium">Armazenamento</label>

          <draggable v-model="kit.slots.armazenamento" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'armazenamento') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



        <!-- Slot Fonte -->

        <div>

          <label class="text-sm font-medium">Fonte</label>

          <draggable v-model="kit.slots.fonte" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'fonte') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



        <!-- Slot Gabinete -->

        <div class="col-span-2">

          <label class="text-sm font-medium">Gabinete</label>

          <draggable v-model="kit.slots.gabinete" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, 'gabinete') }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



        <!-- Slot Outros -->

        <div class="col-span-2">

          <label class="text-sm font-medium">Outros</label>

          <draggable v-model="kit.slots.outros" :group="{ name: 'items', put: (to, from, el) => putGenerico(to, from, el, ['watercooler', 'aircooler', 'ventoinhas', 'pasta termica', 'mouse', 'teclado', 'controle', 'controladoras']) }" item-key="id" class="min-h-20 p-2 border-2 border-dashed rounded-lg mt-1">

            <template #item="{ element }">

              <ItemChip :item="element" :data-tipo="element.tipo" :data-item="JSON.stringify(element)"/>

            </template>

          </draggable>

        </div>



      </div>

    </CardContent>

  </Card>

</template>
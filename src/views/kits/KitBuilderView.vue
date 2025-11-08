<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useStore } from '@/composables/useStore';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import KitMount from '@/components/kit/KitMount.vue';
import ItemList from '@/components/kit/ItemList.vue';

const { storeId } = useStore();
const inventario = ref([]);
const kitsNaTela = ref([]);
const kitCounter = ref(0);
const isLoading = ref(true);

const fetchItems = async () => {
  if (!storeId.value) return;
  isLoading.value = true;
  try {
    const itemsCol = collection(db, 'stores', storeId.value, 'itens');
    const itemsSnapshot = await getDocs(itemsCol);
    inventario.value = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(storeId, (newStoreId) => {
  if (newStoreId) {
    fetchItems();
  }
}, { immediate: true });


const groupedItems = computed(() => {
  const importantTypes = {
    cpu: 'CPUs',
    'placa-mae': 'Placas-Mãe',
    ram: 'Memória RAM',
    gpu: 'Placas de Vídeo',
    armazenamento: 'Armazenamento',
    fonte: 'Fontes',
    gabinete: 'Gabinetes',
    watercooler: 'Watercoolers',
    aircooler: 'Aircoolers',
    ventoinhas: 'Ventoinhas',
  };

  const groups = Object.entries(importantTypes).reduce((acc, [type, title]) => {
    acc[type] = { title, items: [] };
    return acc;
  }, { outro: { title: 'Outros Itens', items: [] } });

  inventario.value.forEach(item => {
    if (groups[item.tipo]) {
      groups[item.tipo].items.push(item);
    } else {
      groups.outro.items.push(item);
    }
  });

  return Object.values(groups).filter(group => group.items.length > 0);
});
const usedItemIds = computed(() => {
  const ids = new Set();
  kitsNaTela.value.forEach(kit => {
    Object.values(kit.slots).forEach(slot => {
      slot.forEach(item => {
        ids.add(item.id);
      });
    });
  });
  return ids;
});

function adicionarNovoKit() {
  kitCounter.value++;
  kitsNaTela.value.push({
    id: kitCounter.value,
    nome: `Novo Kit ${kitCounter.value}`,
    slots: {
      placaMae: [],
      cpu: [],
      ram: [],
      gpu: [],
      armazenamento: [],
      fonte: [],
      gabinete: [],
      outros: [],
    }
  });
}

function removerKit(index) {
  kitsNaTela.value.splice(index, 1);
}
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="h-full w-full">
    <ResizablePanel :default-size="30" class="p-4">
      <Card class="h-full flex flex-col">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold font-display">Estoque de Itens</h2>
        </div>
        <ScrollArea class="flex-1">
          <div class="p-4 space-y-4">
            <ItemList
              v-for="group in groupedItems"
              :key="group.title"
              :title="group.title"
              :list="group.items"
              :used-item-ids="usedItemIds"
            />          </div>
        </ScrollArea>
      </Card>
    </ResizablePanel>

    <ResizableHandle with-handle />

    <ResizablePanel :default-size="70">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold font-display">Área de Trabalho</h2>
          <Button @click="adicionarNovoKit">+ Adicionar Novo Kit</Button>
        </div>
        <ScrollArea class="flex-1 bg-muted/30">
          <div class="flex flex-wrap gap-6 p-6">
<div v-for="(kit, index) in kitsNaTela" :key="kit.id">
              <KitMount :kit="kit" @delete="removerKit(index)" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
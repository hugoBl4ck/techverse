<script setup>
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import KitItemCard from '@/components/kit/KitItemCard.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  kit: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'save']);

const allItems = computed(() => {
  if (!props.kit) return [];
  return [
    ...props.kit.placaMae,
    ...props.kit.cpu,
    ...props.kit.ram,
    ...props.kit.gpu,
    ...props.kit.armazenamento,
    ...props.kit.fonte,
    ...props.kit.gabinete
  ].filter(item => item); // Filtra qualquer valor nulo/indefinido
});

function handleSave() {
  emit('save');
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-card text-card-foreground rounded-lg shadow-lg w-full max-w-md m-4">
      <div class="p-6">
        <h2 class="text-lg font-semibold">Salvar Kit</h2>
        <p class="text-sm text-muted-foreground mt-1">Por favor, revise os itens do kit antes de salvar.</p>
        
        <div class="mt-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
          <div v-if="allItems.length === 0" class="text-center text-muted-foreground">
            Nenhum item no kit.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <KitItemCard v-for="item in allItems" :key="item.id" :item="item" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <Button variant="outline" @click="handleClose">Cancelar</Button>
          <Button @click="handleSave" :disabled="allItems.length === 0">Confirmar e Salvar</Button>
        </div>
      </div>
    </div>
  </div>
</template>
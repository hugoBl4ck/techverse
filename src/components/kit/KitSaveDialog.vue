<script setup>
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import PecaChip from '@/components/kit/PecaChip.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  kit: { type: Object, default: () => null }
});

const emit = defineEmits(['close', 'save']);

const allParts = computed(() => {
  if (!props.kit) return [];
  return [
    ...props.kit.placaMae,
    ...props.kit.cpu,
    ...props.kit.ram,
    ...props.kit.gpu,
    ...props.kit.armazenamento,
    ...props.kit.fonte,
    ...props.kit.gabinete
  ].filter(p => p); // Filtra qualquer valor nulo/indefinido
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
        <p class="text-sm text-muted-foreground mt-1">Por favor, revise as peças do kit antes de salvar.</p>
        
        <div class="mt-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
          <div v-if="allParts.length === 0" class="text-center text-muted-foreground">
            Nenhuma peça no kit.
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <PecaChip v-for="peca in allParts" :key="peca.id" :peca="peca" />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <Button variant="outline" @click="handleClose">Cancelar</Button>
          <Button @click="handleSave" :disabled="allParts.length === 0">Confirmar e Salvar</Button>
        </div>
      </div>
    </div>
  </div>
</template>

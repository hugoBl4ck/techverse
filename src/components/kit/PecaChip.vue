<script setup>
import { computed } from 'vue';
import { Cpu, CircuitBoard, MemoryStick, HardDrive, Plug, PcCase, HelpCircle, Gpu } from 'lucide-vue-next';

const props = defineProps({
  peca: {
    type: Object,
    required: true,
  },
});

const chipConfig = computed(() => {
  switch (props.peca.tipo) {
    case 'cpu': return { icon: Cpu, color: 'border-l-red-500 bg-red-500/10' };
    case 'placa-mae': return { icon: CircuitBoard, color: 'border-l-blue-500 bg-blue-500/10' };
    case 'ram': return { icon: MemoryStick, color: 'border-l-yellow-500 bg-yellow-500/10' };
    case 'gpu': return { icon: Gpu, color: 'border-l-green-500 bg-green-500/10' };
    case 'armazenamento': return { icon: HardDrive, color: 'border-l-purple-500 bg-purple-500/10' };
    case 'fonte': return { icon: Plug, color: 'border-l-gray-500 bg-gray-500/10' };
    case 'gabinete': return { icon: PcCase, color: 'border-l-indigo-500 bg-indigo-500/10' };
    default: return { icon: HelpCircle, color: 'border-l-gray-300 bg-gray-300/10' };
  }
});
</script>

<template>
  <div
    :class="chipConfig.color"
    class="flex items-center gap-2 p-2 rounded-md border-l-4 shadow-sm bg-card hover:bg-muted cursor-grab"
  >
    <component :is="chipConfig.icon" class="size-5 shrink-0" />
    <div class="truncate font-medium text-sm">{{ peca.nome }}</div>
  </div>
</template>

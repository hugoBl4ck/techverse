<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const brickStyle = computed(() => {
  switch (props.item.tipo) {
    case 'cpu': return 'bg-red-500 border-red-700';
    case 'gpu': return 'bg-green-500 border-green-700';
    case 'ram': return 'bg-blue-500 border-blue-700';
    case 'placa-mae': return 'bg-yellow-400 border-yellow-600';
    case 'fonte': return 'bg-gray-500 border-gray-700';
    case 'armazenamento': return 'bg-purple-500 border-purple-700';
    case 'gabinete': return 'bg-indigo-500 border-indigo-700';
    default: return 'bg-gray-300 border-gray-500';
  }
});
</script>

<template>
  <div
    :class="brickStyle"
    class="rounded-lg border-b-4 shadow-md p-2 text-white font-bold cursor-grab"
  >
    <div class="flex gap-1 mb-1">
      <div class="w-3 h-3 bg-white bg-opacity-25 rounded-full"></div>
      <div class="w-3 h-3 bg-white bg-opacity-25 rounded-full"></div>
      <div class="w-3 h-3 bg-white bg-opacity-25 rounded-full"></div>
      <div class="w-3 h-3 bg-white bg-opacity-25 rounded-full"></div>
    </div>
    <div class="truncate">{{ item.nome }}</div>
  </div>
</template>
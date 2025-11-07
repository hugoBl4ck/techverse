<script setup>
import { computed } from 'vue';
import {
  Cpu, CircuitBoard, MemoryStick, HardDrive, Plug, Server, HelpCircle,
  Mouse, Keyboard, Gamepad2, Waves, Wind, Fan, SquareTerminal, Brush, Gpu
} from 'lucide-vue-next';

const props = defineProps({ item: Object });

const categoryConfig = computed(() => {
  const tipo = props.item?.tipo || 'outro';
  switch (tipo) {
    // Hardware Principal
    case 'cpu': return { icon: Cpu, color: 'text-red-500', border: 'border-red-500' };
    case 'placa-mae': return { icon: CircuitBoard, color: 'text-blue-500', border: 'border-blue-500' };
    case 'ram': return { icon: MemoryStick, color: 'text-yellow-500', border: 'border-yellow-500' };
    case 'gpu': return { icon: Gpu, color: 'text-green-500', border: 'border-green-500' };
    case 'armazenamento': return { icon: HardDrive, color: 'text-purple-500', border: 'border-purple-500' };
    case 'fonte': return { icon: Plug, color: 'text-gray-500', border: 'border-gray-500' };
    case 'gabinete': return { icon: Server, color: 'text-indigo-500', border: 'border-indigo-500' };

    // Refrigeração
    case 'watercooler': return { icon: Waves, color: 'text-sky-500', border: 'border-sky-500' };
    case 'aircooler': return { icon: Wind, color: 'text-sky-300', border: 'border-sky-300' };
    case 'ventoinhas': return { icon: Fan, color: 'text-zinc-400', border: 'border-zinc-400' };
    case 'pasta termica': return { icon: Brush, color: 'text-zinc-600', border: 'border-zinc-600' };

    // Periféricos
    case 'mouse': return { icon: Mouse, color: 'text-pink-500', border: 'border-pink-500' };
    case 'teclado': return { icon: Keyboard, color: 'text-orange-500', border: 'border-orange-500' };
    case 'controle': return { icon: Gamepad2, color: 'text-cyan-500', border: 'border-cyan-500' };

    // Outros
    case 'controladoras': return { icon: SquareTerminal, color: 'text-teal-500', border: 'border-teal-500' };
    default: return { icon: HelpCircle, color: 'text-gray-300', border: 'border-gray-300' };
  }
});

const glowStyle = computed(() => {
  const colorMap = {
    'text-red-500': '255, 0, 0',
    'text-blue-500': '0, 0, 255',
    'text-yellow-500': '255, 255, 0',
    'text-green-500': '0, 128, 0',
    'text-purple-500': '128, 0, 128',
    'text-gray-500': '128, 128, 128',
    'text-indigo-500': '75, 0, 130',
    'text-sky-500': '0, 191, 255',
    'text-sky-300': '135, 206, 250',
    'text-zinc-400': '161, 161, 170',
    'text-zinc-600': '82, 82, 91',
    'text-pink-500': '255, 105, 180',
    'text-orange-500': '255, 165, 0',
    'text-cyan-500': '0, 255, 255',
    'text-teal-500': '0, 128, 128',
    'text-gray-300': '209, 213, 219',
  };
  const rgb = colorMap[categoryConfig.value.color] || '0, 0, 0';
  return {
    '--glow-rgb': rgb,
    'box-shadow': `0 0 8px 2px rgba(var(--glow-rgb), 0.6)`
  };
});
</script>

<template>
  <div
    :class="categoryConfig.border"
    class="flex items-center gap-4 p-3 rounded-lg border-l-4 bg-white/10 hover:bg-white/20 cursor-grab transition-colors"
  >
    <component :is="categoryConfig.icon" :class="categoryConfig.color" :style="glowStyle" class="size-6 shrink-0" />
    <div class="flex-1 truncate min-w-0">
      <h3 class="font-semibold truncate text-sm text-foreground max-w-full">{{ item.nome }}</h3>
      <span class="text-xs uppercase opacity-70">{{ item.tipo }}</span>
    </div>
  </div>
</template>

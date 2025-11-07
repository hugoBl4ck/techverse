<script setup>
import { computed } from 'vue'
import {
  Cpu, CircuitBoard, MemoryStick, HardDrive, Plug, PcCase, HelpCircle,
  Mouse, Keyboard, Gamepad2, Waves, Wind, Fan, SquareTerminal, Brush, Gpu
} from 'lucide-vue-next'

const props = defineProps({
  item: Object
})

const chipConfig = computed(() => {
  const tipo = props.item?.tipo || 'outro';
  switch (tipo) {
    // Hardware Principal (Cores Vibrantes)
    case 'cpu': return { icon: Cpu, colorHex: '#ef4444' }; // red-500
    case 'placa-mae': return { icon: CircuitBoard, colorHex: '#3b82f6' }; // blue-500
    case 'ram': return { icon: MemoryStick, colorHex: '#eab308' }; // yellow-500
    case 'gpu': return { icon: Gpu, colorHex: '#22c55e' }; // green-500
    case 'armazenamento': return { icon: HardDrive, colorHex: '#a855f7' }; // purple-500
    case 'fonte': return { icon: Plug, colorHex: '#6b7280' }; // gray-500
    case 'gabinete': return { icon: PcCase, colorHex: '#4f46e5' }; // indigo-500
    
    // Refrigeração (Tons de Azul/Ciano)
    case 'watercooler': return { icon: Waves, colorHex: '#06b6d4' }; // cyan-500
    case 'aircooler': return { icon: Wind, colorHex: '#38bdf8' }; // sky-400
    case 'ventoinhas': return { icon: Fan, colorHex: '#a1a1aa' }; // zinc-400
    
    // Periféricos (Tons Quentes)
    case 'mouse': return { icon: Mouse, colorHex: '#ec4899' }; // pink-500
    case 'teclado': return { icon: Keyboard, colorHex: '#f97316' }; // orange-500
    case 'controle': return { icon: Gamepad2, colorHex: '#14b8a6' }; // teal-500
    
    // Outros
    case 'controladoras': return { icon: SquareTerminal, colorHex: '#0d9488' }; // teal-600
    case 'pasta termica': return { icon: Brush, colorHex: '#a1a1aa' }; // zinc-400
    default: return { icon: HelpCircle, colorHex: '#9ca3af' }; // gray-400
  }
});
</script>

<template>
  <div
    class="relative flex items-center gap-3 p-3 w-full rounded-lg border-l-4 overflow-hidden 
           bg-card/60 cursor-grab
           hover:scale-[1.02] transition-transform duration-150"
    :style="{
      'border-left-color': chipConfig.colorHex,
    }"
  >
    
    <div class="relative z-10 flex items-center gap-3 min-w-0">
      <component 
        :is="chipConfig.icon" 
        class="size-6 shrink-0" 
        :style="{ color: chipConfig.colorHex }" 
      />
      
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold truncate text-sm text-foreground max-w-full">
          {{ item.nome }}
        </h3>
        <p class="text-xs text-muted-foreground uppercase">{{ item.tipo }}</p>
      </div>
    </div>
    
  </div>
</template>

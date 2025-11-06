<script setup>
import { computed } from 'vue'
import { 
  Cpu, CircuitBoard, MemoryStick, HardDrive, Plug, Codepen, HelpCircle,
  Mouse, Keyboard, Gamepad2, Waves, Wind, Fan, SquareTerminal, Brush, Gpu // Gpu também
} from 'lucide-vue-next'

const props = defineProps({
  peca: Object
})

const chipConfig = computed(() => {
  // Garantir que 'peca' e 'peca.tipo' existam
  const tipo = props.peca?.tipo || 'outro';

  switch (tipo) {
    // Hardware Principal
    case 'cpu': return { icon: Cpu, color: 'border-l-red-500 bg-red-500/10' };
    case 'placa-mae': return { icon: CircuitBoard, color: 'border-l-blue-500 bg-blue-500/10' };
    case 'ram': return { icon: MemoryStick, color: 'border-l-yellow-500 bg-yellow-500/10' };
    case 'gpu': return { icon: Gpu, color: 'border-l-green-500 bg-green-500/10' }; // Adicionei 'Gpu' aqui
    case 'armazenamento': return { icon: HardDrive, color: 'border-l-purple-500 bg-purple-500/10' };
    case 'fonte': return { icon: Plug, color: 'border-l-gray-500 bg-gray-500/10' };
    case 'gabinete': return { icon: Codepen, color: 'border-l-indigo-500 bg-indigo-500/10' };
    
    // Novas Categorias (Refrigeração)
    case 'watercooler': return { icon: Waves, color: 'border-l-sky-500 bg-sky-500/10' };
    case 'aircooler': return { icon: Wind, color: 'border-l-sky-300 bg-sky-300/10' };
    case 'ventoinhas': return { icon: Fan, color: 'border-l-zinc-400 bg-zinc-400/10' };
    case 'pasta termica': return { icon: Brush, color: 'border-l-zinc-600 bg-zinc-600/10' };
    
    // Novas Categorias (Periféricos)
    case 'mouse': return { icon: Mouse, color: 'border-l-pink-500 bg-pink-500/10' };
    case 'teclado': return { icon: Keyboard, color: 'border-l-orange-500 bg-orange-500/10' };
    case 'controle': return { icon: Gamepad2, color: 'border-l-cyan-500 bg-cyan-500/10' };
    
    // Outros
    case 'controladoras': return { icon: SquareTerminal, color: 'border-l-teal-500 bg-teal-500/10' };
    default: return { icon: HelpCircle, color: 'border-l-gray-300 bg-gray-300/10' };
  }
});
</script>

<template>
  <div
    :class="chipConfig.color"
    class="flex items-center gap-2 p-2 rounded-md border-l-4 shadow-sm bg-card hover:bg-muted cursor-grab"
    :data-tipo="peca.tipo"
    :data-peca="JSON.stringify(peca)"
  >
    <component :is="chipConfig.icon" class="size-5 shrink-0" />
    <div class="truncate font-medium text-sm">{{ peca.nome }}</div>
  </div>
</template>

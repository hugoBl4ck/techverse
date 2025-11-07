
import {
  Cpu, CircuitBoard, MemoryStick, HardDrive, Plug, PcCase, HelpCircle,
  Mouse, Keyboard, Gamepad2, Waves, Wind, Fan, SquareTerminal, Brush, Gpu
} from 'lucide-vue-next';

const itemConfig = {
  // Hardware Principal (Cores Vibrantes)
  cpu: { icon: Cpu, colorHex: '#ef4444' }, // red-500
  'placa-mae': { icon: CircuitBoard, colorHex: '#3b82f6' }, // blue-500
  ram: { icon: MemoryStick, colorHex: '#eab308' }, // yellow-500
  gpu: { icon: Gpu, colorHex: '#22c55e' }, // green-500
  armazenamento: { icon: HardDrive, colorHex: '#a855f7' }, // purple-500
  fonte: { icon: Plug, colorHex: '#6b7280' }, // gray-500
  gabinete: { icon: PcCase, colorHex: '#4f46e5' }, // indigo-500

  // Refrigeração (Tons de Azul/Ciano)
  watercooler: { icon: Waves, colorHex: '#06b6d4' }, // cyan-500
  aircooler: { icon: Wind, colorHex: '#38bdf8' }, // sky-400
  ventoinhas: { icon: Fan, colorHex: '#a1a1aa' }, // zinc-400

  // Periféricos (Tons Quentes)
  mouse: { icon: Mouse, colorHex: '#ec4899' }, // pink-500
  teclado: { icon: Keyboard, colorHex: '#f97316' }, // orange-500
  controle: { icon: Gamepad2, colorHex: '#14b8a6' }, // teal-500

  // Outros
  controladoras: { icon: SquareTerminal, colorHex: '#0d9488' }, // teal-600
  'pasta termica': { icon: Brush, colorHex: '#a1a1aa' }, // zinc-400
  outro: { icon: HelpCircle, colorHex: '#9ca3af' }, // gray-400
};

export function getItemConfig(tipo) {
  return itemConfig[tipo] || itemConfig.outro;
}

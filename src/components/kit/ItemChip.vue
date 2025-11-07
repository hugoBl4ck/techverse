<script setup>
import { computed } from 'vue';
import { getItemConfig } from '@/lib/item-config.js';

const props = defineProps({
  item: Object,
  isUsed: { type: Boolean, default: false },
});

const chipConfig = computed(() => getItemConfig(props.item?.tipo));
</script>

<template>
  <div
    class="relative flex items-center gap-3 p-3 w-full rounded-lg border-l-4 overflow-hidden 
           bg-card/60 transition-transform duration-150"
    :class="{ 'opacity-50 cursor-not-allowed': isUsed, 'cursor-grab hover:scale-[1.02]': !isUsed }"
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

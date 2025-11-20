<script setup>
import { HelpCircle } from "lucide-vue-next";

defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="relative inline-block group">
    <HelpCircle class="w-4 h-4 text-muted-foreground hover:text-primary cursor-help inline ml-1 transition-colors" />
    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm text-popover-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 max-w-xs w-max">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="
      cn('rounded-xl border bg-background text-card-foreground shadow-md', props.class)
    "
  >
    <slot />
  </div>
</template>

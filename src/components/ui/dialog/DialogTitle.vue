<script setup>
import { DialogTitle as DialogTitlePrimitive } from "reka-ui";
import { cn } from "@/lib/utils";

defineProps({
  class: {
    type: null,
    required: false,
  },
});
</script>

<template>
  <DialogTitlePrimitive :class="cn('text-lg font-semibold leading-none tracking-tight', $props.class)">
    <slot />
  </DialogTitlePrimitive>
</template>

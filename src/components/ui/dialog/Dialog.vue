<script setup>
import { DialogRoot } from "reka-ui";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:open"]);

const handleOpenChange = (value) => {
  emit("update:open", value);
};
</script>

<template>
  <DialogRoot :open="open" @update:open="handleOpenChange" v-bind="$attrs">
    <slot />
  </DialogRoot>
</template>

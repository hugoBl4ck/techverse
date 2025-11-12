<script setup>
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  orientation: {
    type: String,
    default: "horizontal",
    validator: (value) => ["horizontal", "vertical"].includes(value),
  },
  decorative: {
    type: Boolean,
    default: true,
  },
  class: {
    type: null,
    required: false,
  },
  as: {
    type: null,
    required: false,
    default: "div",
  },
});

const className = computed(() => {
  const baseClasses = "shrink-0 bg-border";
  const orientationClasses =
    props.orientation === "vertical"
      ? "h-full w-px"
      : "h-px w-full";
  return cn(baseClasses, orientationClasses, props.class);
});
</script>

<template>
  <Primitive
    :as="as"
    :class="className"
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="orientation"
  />
</template>

<script>
import { computed } from "vue";
</script>

<script setup>
import { cn } from "@/lib/utils";
import { Primitive } from "reka-ui";

const props = defineProps({
  variant: {
    type: String,
    default: "default",
  },
  class: {
    type: null,
    required: false,
  },
  asChild: {
    type: Boolean,
    required: false,
  },
  as: {
    type: null,
    required: false,
    default: "div",
  },
});

const badgeVariants = (variant) => {
  const variants = {
    default: "border border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-foreground",
  };
  return variants[variant] || variants.default;
};
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      badgeVariants(variant),
      props.class
    )"
  >
    <slot />
  </Primitive>
</template>

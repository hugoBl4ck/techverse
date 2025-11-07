<template>
  <router-link
    :to="to"
    custom
    v-slot="{ href, navigate, isExactActive }"
  >
    <a
      :href="href"
      @click="navigate"
      class="flex items-center p-2 rounded-lg transition-colors duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      :class="{
        'bg-destructive text-destructive-foreground shadow-lg': isExactActive,
      }"
    >
      <slot></slot>
    </a>
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: String,
});
</script>

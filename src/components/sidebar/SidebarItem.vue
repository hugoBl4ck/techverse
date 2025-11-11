<template>
  <router-link
    :to="to"
    custom
    v-slot="{ href, navigate, isExactActive }"
  >
    <a
      :href="href"
      @click="navigate"
      class="sidebar-item flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-primary group relative overflow-hidden"
      :class="{
        'bg-gradient-to-r from-primary/20 to-accent/10 text-primary shadow-md shadow-primary/20 border border-primary/30': isExactActive,
        'hover:bg-primary/10': !isExactActive,
      }"
    >
      <!-- Animated background on hover -->
      <div v-if="!isExactActive" class="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      
      <slot></slot>
    </a>
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: String,
});
</script>

<style scoped>
.sidebar-item {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-item:has(& [class*="router-link-active"])::before,
.sidebar-item.bg-gradient-to-r::before {
  opacity: 1;
}
</style>

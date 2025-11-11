<template>
  <div class="sidebar-header">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(var(--color-border), 0.2);
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.05) 0%, rgba(var(--color-accent), 0.05) 100%);
  backdrop-filter: blur(8px);
}
</style>

<template>
  <div class="sidebar">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 250px;
  background: linear-gradient(135deg, rgba(var(--color-background), 0.9) 0%, rgba(var(--color-background), 0.95) 100%);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(var(--color-border), 0.2);
  box-shadow: inset -1px 0 0 rgba(var(--color-primary), 0.1);
}
</style>

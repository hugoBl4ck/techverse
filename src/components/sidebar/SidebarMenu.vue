<template>
  <div class="sidebar-menu">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
}
</style>

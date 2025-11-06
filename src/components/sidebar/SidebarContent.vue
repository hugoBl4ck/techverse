<template>
  <div class="sidebar-content">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>

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
  background-color: #f0f0f0;
}
</style>

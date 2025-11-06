<template>
  <router-link :to="to" class="sidebar-item">
    <slot></slot>
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: String
});
</script>

<style scoped>
.sidebar-item {
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  color: #333;
  text-decoration: none;
}

.sidebar-item:hover {
  background-color: #e0e0e0;
}
</style>

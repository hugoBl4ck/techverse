<template>
  <div class="sidebar-group">
    <h3 class="sidebar-group-title" v-if="title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String
});
</script>

<style scoped>
.sidebar-group {
  padding: 1rem;
}

.sidebar-group-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
</style>

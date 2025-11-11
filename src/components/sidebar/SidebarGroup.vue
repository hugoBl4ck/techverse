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
  padding: 0.75rem 0.5rem;
  margin-bottom: 0.5rem;
}

.sidebar-group-title {
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--color-muted-foreground), 0.8);
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  background: linear-gradient(90deg, transparent, rgba(var(--color-primary), 0.1), transparent);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  position: relative;
}

.sidebar-group-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 12px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 1px;
  opacity: 0.5;
}
</style>

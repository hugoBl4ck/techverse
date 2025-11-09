<template>
  <div 
    class="skeleton"
    :class="className"
    :style="{ height, width }"
  ></div>
</template>

<script setup>
const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '1rem'
  },
  width: {
    type: String,
    default: '100%'
  }
});
</script>

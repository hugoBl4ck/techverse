<script setup>
import { defineProps } from 'vue';
import OrdemServicoForm from '@/components/OrdemServicoForm.vue';

defineProps({
  id: {
    type: String,
    default: null
  }
});
</script>

<template>
  <div class="container mx-auto py-8">
    <OrdemServicoForm :id="id" />
  </div>
</template>

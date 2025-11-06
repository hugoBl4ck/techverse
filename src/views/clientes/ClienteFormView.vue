<script setup>
import ClienteForm from '@/components/ClienteForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const clienteId = route.params.id;
</script>

<template>
  <div class="p-4">
    <ClienteForm :id="clienteId" />
  </div>
</template>

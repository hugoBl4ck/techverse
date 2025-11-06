<script setup>
import PecaForm from '@/components/PecaForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pecaId = route.params.id;
</script>

<template>
  <div class="container mx-auto py-8">
    <PecaForm :id="pecaId" />
  </div>
</template>

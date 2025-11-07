<script setup>
import ItemForm from '@/components/ItemForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const itemId = route.params.id;
</script>

<template>
  <div class="container mx-auto py-8">
    <ItemForm :id="itemId" />
  </div>
</template>

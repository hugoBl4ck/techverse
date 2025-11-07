<script setup>
import draggable from 'vuedraggable';
import ItemChip from '@/components/kit/ItemChip.vue';

defineProps({
  title: { type: String, required: true },
  list: { type: Array, required: true },
  usedItemIds: { type: Set, required: true },
});
</script>

<template>
  <div>
    <h3 class="font-semibold mb-2">{{ title }}</h3>
    <draggable :list="list" item-key="id" tag="div" class="flex flex-col gap-2" :group="{ name: 'items', pull: true, put: false }">
      <template #item="{ element }">
        <ItemChip :item="element" :is-used="usedItemIds.has(element.id)" />
      </template>
    </draggable>
  </div>
</template>

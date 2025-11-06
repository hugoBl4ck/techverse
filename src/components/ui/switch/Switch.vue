<script setup>
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { cn } from '@/lib/utils'
import { Sun, Moon } from 'lucide-vue-next'

const props = defineProps({
  checked: { type: Boolean, required: false },
  defaultChecked: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  class: { type: String, required: false, default: '' },
})
const emits = defineEmits(['update:checked'])
</script>

<template>
  <SwitchRoot
    :id="id"
    :name="name"
    :disabled="disabled"
    :checked="checked"
    :defaultChecked="defaultChecked"
    @update:checked="(value) => emits('update:checked', value)"
    :class="cn(
      'peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary' : 'bg-input',
      props.class,
    )"
    :data-state="checked ? 'checked' : 'unchecked'"
  >
    <SwitchThumb
      :class="cn(
        'bg-background pointer-events-none flex size-5 items-center justify-center rounded-full shadow-lg ring-0 transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0',
      )"
      :data-state="checked ? 'checked' : 'unchecked'"
    >
      <Moon v-if="checked" class="size-3" />
      <Sun v-else class="size-3" />
    </SwitchThumb>
  </SwitchRoot>
</template>

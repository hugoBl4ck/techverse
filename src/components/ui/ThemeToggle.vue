<template>
  <div class="flex items-center space-x-2">
    <Label for="theme-toggle" class="text-sm font-medium">
      {{ isDark ? 'Dark' : 'Light' }}
    </Label>
    <Switch
      id="theme-toggle"
      :checked="isDark"
      @update:checked="toggleDark"
    />
  </div>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const isDark = useDark({ selector: 'html', attribute: 'class' })
const toggleDark = useToggle(isDark)
</script>
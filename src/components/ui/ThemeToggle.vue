<template>
  <Button @click="toggleDark()" variant="outline" class="size-9 p-0">
    <Sun class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>

<script setup>
// Esta biblioteca fantástica gerencia o dark mode automaticamente
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-vue-next' // Pacote de ícones

// 'isDark' lê e aplica a classe 'dark' no <html>
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

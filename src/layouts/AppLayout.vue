<template>
  <div class="flex flex-col h-screen overflow-hidden bg-background text-foreground">

    <div v-if="isDark" class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_70%,var(--muted),transparent_10%)] blur-3xl"></div>

    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="font-display text-2xl font-bold">
          TechVerse
        </div>
        <Avatar>
          <AvatarFallback>HL</AvatarFallback>
        </Avatar>
      </div>
    </header>

    <div class="border-b bg-muted/50 shadow-inner">
      <div class="container mx-auto flex h-12 items-center justify-between px-4">
        <h1 class="text-lg font-display font-semibold">
          {{ $route.meta.title || 'Dashboard' }} 
        </h1>
      </div>
    </div>

    <div class="border-b">
      <div class="container mx-auto flex h-12 items-center justify-between px-4">
        <div class="flex-1">
          </div>
        
        <ThemeToggle @theme-changed="handleThemeChange" />
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <SplitterGroup direction="horizontal" class="h-full">

        <SplitterPanel 
          :default-size="20" 
          :min-size="15" 
          :max-size="30" 
          class="p-4 pt-6"
        >
          <SidebarMenu />
        </SplitterPanel>

        <SplitterResizeHandle class="relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[state=active]:after:bg-border">
          <div class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
            <GripVertical class="h-2.5 w-2.5" />
          </div>
        </SplitterResizeHandle>

        <SplitterPanel :default-size="80">
          <div class="h-full overflow-y-auto p-6">
            <RouterView />
          </div>
        </SplitterPanel>

      </SplitterGroup>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import SidebarMenu from '@/components/ui/SidebarMenu.vue'

// Importando o NOVO Toggle (Switch)
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { GripVertical } from 'lucide-vue-next'

const isDark = ref(false)

const handleThemeChange = (newIsDark) => {
  isDark.value = newIsDark
}
</script>

<style>
/* Estilo global para forçar altura total */
html, body, #app {
  height: 100%;
}
</style>
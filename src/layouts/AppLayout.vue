<script setup>
import { RouterView } from 'vue-router'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Importando nossos componentes customizados
import SidebarMenu from '@/components/ui/SidebarMenu.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-background text-foreground">

    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="font-display text-2xl font-bold">
          TechVerse
        </div>
        
        <Avatar>
          <AvatarFallback>HL</AvatarFallback> </Avatar>
      </div>
    </header>

    <div class="border-b bg-muted/50 shadow-inner">
      <div class="container mx-auto flex h-12 items-center justify-end px-4">
        <ThemeToggle />
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      
      <ResizablePanelGroup direction="horizontal" class="h-full">

        <ResizablePanel 
          :default-size="20" 
          :min-size="15" 
          :max-size="30" 
          class="p-4 pt-6"
        >
          <SidebarMenu />
        </ResizablePanel>

        <ResizableHandle with-grip />

        <ResizablePanel :default-size="80">
          <div class="h-full overflow-y-auto p-6">
            <RouterView />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>

  </div>
</template>

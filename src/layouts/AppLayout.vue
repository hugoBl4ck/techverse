<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import SidebarHeader from '@/components/sidebar/SidebarHeader.vue'
import SidebarContent from '@/components/sidebar/SidebarContent.vue'
import SidebarMenu from '@/components/sidebar/SidebarMenu.vue'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <Sidebar>
      <SidebarHeader>
        <h1 class="text-2xl font-bold text-primary">TechVerse</h1>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarItem to="/">Dashboard</SidebarItem>
          <SidebarItem to="/clientes">Clientes</SidebarItem>
          <SidebarItem to="/servicos">Serviços</SidebarItem>
          <SidebarItem to="/inventario">Inventário</SidebarItem>
          <SidebarItem to="/kits">Kits</SidebarItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

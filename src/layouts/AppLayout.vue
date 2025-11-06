<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 border-r border-border p-4">
      <h1 class="text-2xl font-bold text-primary mb-8">TechVerse</h1>
      <nav class="flex flex-col space-y-2">
        <RouterLink to="/" class="hover:text-primary">Dashboard</RouterLink>
        <RouterLink to="/clientes" class="hover:text-primary">Clientes</RouterLink>
        <RouterLink to="/servicos" class="hover:text-primary">Serviços</RouterLink>
        <RouterLink to="/inventario" class="hover:text-primary">Inventário</RouterLink>
        <RouterLink to="/kits" class="hover:text-primary">Kits</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

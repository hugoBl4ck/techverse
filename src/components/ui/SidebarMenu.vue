<template>
  <h2 class="mb-4 text-xl font-display font-semibold">Menu</h2>
  <nav class="flex flex-col gap-1">
    
    <RouterLink to="/">
      <Button variant="ghost" class="w-full justify-start gap-2">
        <Home class="size-4" />
        Dashboard
      </Button>
    </RouterLink>

    <RouterLink to="/clientes">
      <Button variant="ghost" class="w-full justify-start gap-2">
        <Users class="size-4" />
        Clientes
      </Button>
    </RouterLink>

    <Accordion type="single" collapsible class="w-full">
      <AccordionItem value="item-1" class="border-none">
        
        <AccordionTrigger class="py-2.5 px-4 font-normal hover:bg-muted hover:no-underline rounded-md [&[data-state=open]>svg]:rotate-180">
          <span class="flex items-center gap-2">
            <Package class="size-4" />
            Inventário
          </span>
        </AccordionTrigger>

        <AccordionContent class="pl-6 pt-1">
          <RouterLink to="/inventario">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
              <Archive class="size-4" />
              Listar Peças
            </Button>
          </RouterLink>
          <RouterLink to="/inventario/novo">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
              <PlusCircle class="size-4" />
              Cadastrar Peça
            </Button>
          </RouterLink>
        </AccordionContent>

      </AccordionItem>
    </Accordion>

    <RouterLink to="/kits/builder">
      <Button variant="ghost" class="w-full justify-start gap-2">
        <Blocks class="size-4" />
        Montador de Kits
      </Button>
    </RouterLink>

  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Home, Users, Package, Archive, PlusCircle, Blocks } from 'lucide-vue-next'
</script>
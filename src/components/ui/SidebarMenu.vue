<template>
  <h2 class="mb-4 text-xl font-display font-semibold">Menu</h2>
  <nav class="flex flex-col gap-1">
    
    <RouterLink to="/" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
      >
        <Home class="size-4" />
        Dashboard
      </Button>
    </RouterLink>

    <RouterLink to="/clientes" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
      >
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
              Listar Itens
            </Button>
          </RouterLink>
          <RouterLink to="/inventario/novo">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
              <PlusCircle class="size-4" />
              Cadastrar Itens
                        </Button>
          </RouterLink>
          <RouterLink to="/inventario/importar-ia">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
              <Wand2 class="size-4" />
              Importar com IA
            </Button>
          </RouterLink>
        </AccordionContent>

      </AccordionItem>
        <AccordionItem value="item-2" class="border-none">
            <AccordionTrigger class="py-2.5 px-4 font-normal hover:bg-muted hover:no-underline rounded-md [&[data-state=open]>svg]:rotate-180">
              <span class="flex items-center gap-2">
                <Wrench class="size-4" />
                Serviços
              </span>
            </AccordionTrigger>
            <AccordionContent class="pl-6 pt-1">
              <RouterLink to="/servicos/novo">
                <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
                  <PlusCircle class="size-4" />
                  Registrar Serviço
                </Button>
              </RouterLink>
              <RouterLink to="/servicos-predefinidos">
                <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal">
                  <ListChecks class="size-4" />
                  Serviços Predefinidos
                </Button>
              </RouterLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    
    <RouterLink to="/kits/builder" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
      >
        <Blocks class="size-4" />
        Montador de Kits
      </Button>
    </RouterLink>

    <RouterLink to="/marketing" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
      >
        <Sparkles class="size-4" />
        Assistente de Marketing
      </Button>
    </RouterLink>

    <RouterLink v-if="isAdmin" to="/admin" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
      >
        <Shield class="size-4" />
        Admin
      </Button>
    </RouterLink>

  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Home, Users, Package, Archive, PlusCircle, Blocks, Wand2, Wrench, ListChecks, Shield, Sparkles } from 'lucide-vue-next'

const isAdmin = ref(false)
const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // A verificação do e-mail é uma solução temporária e INSEGURA.
      // A forma correta é usar Firebase Custom Claims.
      isAdmin.value = user.email === 'hugovieira.eng@gmail.com'
    } else {
      isAdmin.value = false
    }
  })
})
</script>
<template>
  <h2 class="mb-4 text-xl font-display font-semibold">Menu</h2>
  <nav class="flex flex-col gap-1">
    
    <RouterLink to="dashboard" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Home class="size-4" />
        Dashboard
      </Button>
    </RouterLink>

    <RouterLink to="clientes" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
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
          <RouterLink to="inventario">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
              <Archive class="size-4" />
              Listar Itens
            </Button>
          </RouterLink>
          <RouterLink to="inventario/novo">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
              <PlusCircle class="size-4" />
              Cadastrar Itens
            </Button>
          </RouterLink>
          <RouterLink to="inventario/importar-ia">
            <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
              <Wand2 class="size-4" />
              Importar com IA
            </Button>
          </RouterLink>
        </AccordionContent>

      </AccordionItem>
        <AccordionItem value="item-2" class="border-none">
            <AccordionTrigger class="py-2.5 px-4 font-normal hover:bg-muted hover:no-underline rounded-md [&[data-state=open]>svg]:rotate-180">
              <span class="flex items-center gap-2">
                <ClipboardList class="size-4" />
                Ordens de Serviço
              </span>
            </AccordionTrigger>
            <AccordionContent class="pl-6 pt-1">
              <RouterLink to="ordens-servico/nova">
                <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
                  <PlusCircle class="size-4" />
                  Nova Ordem de Serviço
                </Button>
              </RouterLink>
              <RouterLink to="ordens-servico">
                <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
                  <List class="size-4" />
                  Listar Ordens de Serviço
                </Button>
              </RouterLink>
              <RouterLink to="catalogo-servicos">
                <Button variant="ghost" class="w-full justify-start gap-2 text-sm font-normal" @click="handleNavigate">
                  <ListChecks class="size-4" />
                  Catálogo de Serviços
                </Button>
              </RouterLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    
    <RouterLink to="financeiro" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <TrendingUp class="size-4" />
        Financeiro
      </Button>
    </RouterLink>

    <RouterLink to="kits/builder" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Blocks class="size-4" />
        Montador de Kits
      </Button>
    </RouterLink>

    <RouterLink v-if="isAdmin" to="marketing" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Sparkles class="size-4" />
        Assistente de Marketing
      </Button>
    </RouterLink>

    <!-- Seção PÚBLICA (Aparece para todos) -->
    <Separator class="my-2" />
    <div class="px-4 py-2 text-xs font-medium text-muted-foreground">ACOMPANHAR</div>

    <RouterLink to="/promocoes" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Gift class="size-4" />
        Promoções
      </Button>
    </RouterLink>

    <RouterLink to="/noticias" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Newspaper class="size-4" />
        Notícias
      </Button>
    </RouterLink>

    <!-- Seção ADMIN (Apenas Admin) -->
    <Separator v-if="isAdmin" class="my-2" />
    <div v-if="isAdmin" class="px-4 py-2 text-xs font-medium text-muted-foreground">ADMINISTRAÇÃO</div>

    <RouterLink v-if="isAdmin" to="test-visuals" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Edit class="size-4" />
        Gerenciar Promoções
      </Button>
    </RouterLink>

    <RouterLink v-if="isAdmin" to="exportar-dados" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Download class="size-4" />
        Exportar Dados
      </Button>
    </RouterLink>

    <RouterLink v-if="isAdmin" to="/admin" v-slot="{ isExactActive }">
      <Button
        variant="ghost"
        class="w-full justify-start gap-2"
        :class="{
          'border-l-4 border-sidebar-active-border shadow-lg': isExactActive,
        }"
        @click="handleNavigate"
      >
        <Shield class="size-4" />
        Admin
      </Button>
    </RouterLink>

  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Home, Users, Package, Archive, PlusCircle, Blocks, Wand2, Wrench, ListChecks, Shield, Sparkles, ClipboardList, List, Download, TrendingUp, Newspaper, Gift, Edit } from 'lucide-vue-next'
import Separator from './separator/Separator.vue'

const props = defineProps({
  onNavigate: {
    type: Function,
    required: false
  }
})

const { currentUser } = useCurrentStore()

const isAdmin = computed(() => {
  // A verificação do e-mail é uma solução temporária e INSEGURA.
  // A forma correta é usar Firebase Custom Claims.
  return currentUser.value?.email === 'hugovieira.eng@gmail.com'
})

const handleNavigate = () => {
  if (props.onNavigate) {
    props.onNavigate()
  }
}
</script>

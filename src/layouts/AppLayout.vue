<template>
  <div 
    class="flex flex-col h-screen overflow-hidden text-foreground relative"
    :class="isDark ? 'dark' : 'light'"
  >

    <div class="app-background-stripes"></div>

    <header class="sticky top-0 z-40 w-full border-b border-white/10 bg-transparent backdrop-blur-sm">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <Button v-if="isMobile" variant="ghost" size="icon" @click="showMobileSidebar = !showMobileSidebar">
            <Menu class="size-6" />
          </Button>
          <div class="font-display text-2xl font-bold">
            TechVerse
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="!isMobile" class="flex items-center space-x-2">
            <a href="#" target="_blank" rel="noopener" class="btn-social" data-tooltip="Discord">
              <i class="fa-brands fa-discord"></i>
            </a>
            <a href="#" target="_blank" rel="noopener" class="btn-social" data-tooltip="Gmail">
              <i class="fa-regular fa-envelope"></i>
            </a>
            <a href="#" target="_blank" rel="noopener" class="btn-social" data-tooltip="Telegram">
              <i class="fa-brands fa-telegram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener" class="btn-social" data-tooltip="Whatsapp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button @click="logout" class="btn-social" data-tooltip="Sair">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
          <ThemeToggle @theme-changed="handleThemeChange" />
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar Overlay -->
    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="-translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="-translate-x-full opacity-0"
    >
      <div v-if="isMobile && showMobileSidebar" class="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 pt-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Menu</h2>
          <Button variant="ghost" size="icon" @click="showMobileSidebar = false">
            <X class="size-6" />
          </Button>
        </div>
        <SidebarMenu @click="showMobileSidebar = false" />
      </div>
    </Transition>

    <div v-if="!isMobile" class="border-b border-white/10 bg-black/10 shadow-inner">
      <div class="container mx-auto flex h-12 items-center justify-between px-4">
        <h1 class="text-lg font-display font-semibold">
          {{ $route.meta.title || 'Dashboard' }} 
        </h1>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <SplitterGroup v-if="!isMobile" direction="horizontal" class="h-full">

        <SplitterPanel 
          :default-size="20" 
          :min-size="15" 
          :max-size="30" 
          class="p-4 pt-6 bg-black/20 rounded-lg m-2"
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
      <div v-else class="h-full overflow-y-auto p-6">
        <RouterView />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import SidebarMenu from '@/components/ui/SidebarMenu.vue'

// Importando o NOVO Toggle (Switch)
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { GripVertical, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button';

const router = useRouter()
const auth = getAuth()

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const isDark = ref(false)
const isMobile = ref(false)
const showMobileSidebar = ref(false)

const handleThemeChange = (newIsDark) => {
  isDark.value = newIsDark
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // Tailwind's 'md' breakpoint is 768px
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style>
/* Estilo global para forçar altura total */
html, body, #app {
  height: 100%;
}
</style>

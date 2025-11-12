<template>
  <div 
    class="flex flex-col h-screen overflow-hidden text-foreground relative"
    :class="isDark ? 'dark' : 'light'"
  >

    <div class="app-background-gradient"></div>
    <div class="app-background-stripes"></div>

    <!-- Header Premium -->
    <header class="navbar-premium sticky top-0 z-40 w-full">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <Button v-if="isMobile" variant="ghost" size="icon" @click="showMobileSidebar = !showMobileSidebar" class="hover:bg-primary/20">
            <Menu class="size-6" />
          </Button>
          <div class="flex items-center gap-2">
            <TechVerseLogo />
            <div class="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              TechVerse
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Notification Bell -->
          <button 
            @click="showNotifications = !showNotifications"
            class="relative p-2 rounded-lg hover:bg-primary/20 transition-all group"
            title="Notificações"
          >
            <Bell class="size-5 text-primary group-hover:text-accent transition-colors" />
            <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </button>

          <!-- Admin Panel (only superadmin) -->
          <button 
            v-if="isSuperAdmin"
            @click="showAdminPanel = !showAdminPanel"
            class="relative p-2 rounded-lg hover:bg-primary/20 transition-all group"
            title="Painel de Avisos"
          >
            <AlertCircle class="size-5 text-primary group-hover:text-accent transition-colors" />
            <span v-if="unreadAlerts > 0" class="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </button>

          <!-- Social Links -->
          <div v-if="!isMobile" class="flex items-center space-x-1">
            <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" class="btn-social-mini" data-tooltip="Discord">
              <i class="fa-brands fa-discord"></i>
            </a>
            <a href="mailto:hugovieira.eng@gmail.com" target="_blank" rel="noopener noreferrer" class="btn-social-mini" data-tooltip="Gmail">
              <i class="fa-regular fa-envelope"></i>
            </a>
            <a href="https://t.me/+EePYIRUrki40YTkx" target="_blank" rel="noopener noreferrer" class="btn-social-mini" data-tooltip="Telegram">
              <i class="fa-brands fa-telegram"></i>
            </a>
            <a href="https://wa.me/5577998267548?text=gostaria%20de%20saber%20mais%20sobre%20o%20TECHVERSE" target="_blank" rel="noopener noreferrer" class="btn-social-mini" data-tooltip="Whatsapp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button @click="logout" class="btn-social-mini" data-tooltip="Sair">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
          <ThemeToggle @theme-changed="handleThemeChange" />
        </div>
      </div>

      <!-- Notifications Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-[-10px]"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-[-10px]"
      >
        <div v-if="showNotifications" class="absolute right-4 top-16 z-50 w-80 bg-background border border-border/50 rounded-lg shadow-2xl shadow-primary/10 backdrop-blur-sm overflow-hidden">
          <div class="border-b border-border/30 p-4">
            <h3 class="font-semibold text-foreground">Notificações</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-4 text-sm text-muted-foreground text-center">
              Nenhuma notificação
            </div>
            <div v-for="notif in notifications" :key="notif.id" class="p-4 border-b border-border/20 hover:bg-primary/5 transition-colors cursor-pointer">
              <p class="text-sm font-medium text-foreground">{{ notif.title }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ notif.message }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Admin Panel Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-[-10px]"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-[-10px]"
      >
        <div v-if="showAdminPanel && isSuperAdmin" class="absolute right-4 top-16 z-50 w-96 bg-background border border-border/50 rounded-lg shadow-2xl shadow-accent/10 backdrop-blur-sm overflow-hidden">
          <div class="border-b border-border/30 p-4 bg-gradient-to-r from-accent/10 to-primary/10">
            <h3 class="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle class="w-5 h-5 text-accent" />
              Painel de Avisos
            </h3>
          </div>
          <div class="max-h-96 overflow-y-auto p-4 space-y-3">
            <div v-if="alerts.length === 0" class="text-sm text-muted-foreground text-center py-4">
              Nenhum aviso
            </div>
            <div v-for="alert in alerts" :key="alert.id" class="p-3 rounded-lg border-l-4" :class="alert.type === 'error' ? 'border-destructive bg-destructive/10' : 'border-primary bg-primary/10'">
              <p class="text-sm font-medium text-foreground">{{ alert.title }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ alert.message }}</p>
              <p class="text-xs text-muted-foreground mt-2">{{ new Date(alert.timestamp).toLocaleString('pt-BR') }}</p>
            </div>
          </div>
          <div class="border-t border-border/30 p-3 flex gap-2">
            <button class="flex-1 px-3 py-2 text-sm rounded-lg hover:bg-primary/20 transition-colors text-primary font-medium">
              Ver Todos
            </button>
            <button @click="clearAlerts" class="flex-1 px-3 py-2 text-sm rounded-lg hover:bg-destructive/20 transition-colors text-destructive font-medium">
              Limpar
            </button>
          </div>
        </div>
      </Transition>
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
        <SidebarMenu :on-navigate="closeMobileSidebar" />
      </div>
    </Transition>

    <div v-if="!isMobile" class="border-b border-border/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
      <div class="container mx-auto flex h-12 items-center justify-between px-4">
        <h1 class="text-lg font-display font-semibold text-foreground">
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
          class="sidebar-premium rounded-lg m-2"
        >
          <SidebarMenu />
        </SplitterPanel>

        <SplitterResizeHandle class="relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[state=active]:after:bg-border">
          <div class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background hover:bg-primary/20 transition-colors">
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import SidebarMenu from '@/components/ui/SidebarMenu.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import TechVerseLogo from '@/components/TechVerseLogo.vue'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { GripVertical, Menu, X, Bell, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUserActivity } from '@/composables/useUserActivity'

const router = useRouter()
const auth = getAuth()

// Rastrear atividade do usuário
useUserActivity()

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const isDark = ref(false)
const isMobile = ref(false)
const showMobileSidebar = ref(false)
const showNotifications = ref(false)
const showAdminPanel = ref(false)
const isSuperAdmin = ref(true) // TODO: Verificar com Firebase Auth se é superadmin

// Notificações - Carregadas do painel administrativo via Firebase
const notifications = ref([
  // TODO: Carregar do Firestore/Painel Administrativo
])

const unreadNotifications = computed(() => notifications.value.length)

// Avisos (apenas superadmin) - Carregados do painel administrativo
const alerts = ref([
  // TODO: Carregar do Firestore/Painel Administrativo
])

const unreadAlerts = computed(() => alerts.value.length)

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
}

const clearAlerts = () => {
  alerts.value = []
  showAdminPanel.value = false
}

const handleThemeChange = (newIsDark) => {
  isDark.value = newIsDark
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Botão social mini (melhorado) */
.btn-social-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: transparent;
  color: oklch(var(--color-muted-foreground));
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.btn-social-mini:hover {
  color: oklch(var(--color-primary));
  background-color: oklch(var(--color-primary) / 0.1);
  transform: translateY(-2px);
}

/* Tooltip */
.btn-social-mini[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: oklch(var(--color-foreground));
  color: oklch(var(--color-background));
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  z-index: 10;
}

.btn-social-mini[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>

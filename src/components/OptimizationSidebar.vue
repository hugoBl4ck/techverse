<script setup>
import { ref } from 'vue'
import { Button } from "@/components/ui/button"
import { Settings, X } from 'lucide-vue-next'

const showSidebar = ref(false)
</script>

<template>
  <div>
    <!-- Floating Action Button for Optimization Info -->
    <Button
      @click="showSidebar = true"
      class="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white border-0 shadow-xl"
      title="Dicas de Otimização - Get-MMAgent"
    >
      <Settings class="w-6 h-6" />
    </Button>

    <!-- Sidebar Overlay -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      @click="showSidebar = false"
    ></div>

    <!-- Sidebar Panel -->
    <div
      class="fixed top-0 right-0 z-50 h-full w-96 bg-background border-l border-border/40 shadow-2xl transform transition-transform duration-300 overflow-y-auto"
      :class="showSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Sidebar Header -->
      <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-foreground">Otimização de Memória</h3>
          <Button @click="showSidebar = false" variant="ghost" size="icon" class="hover:bg-primary/20">
            <X class="w-5 h-5" />
          </Button>
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="p-4 space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-foreground mb-3">Get-MMAgent do PowerShell</h4>
          <div class="space-y-4 text-sm text-muted-foreground">
            <div>
              <p class="font-medium text-foreground mb-1">Para que serve?</p>
              <p>Exibe configurações do Agente de Gerenciamento de Memória do Windows para diagnosticar e otimizar o uso de RAM.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Como usar:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Abra PowerShell como Administrador</li>
                <li>Execute: <code class="bg-muted px-1 py-0.5 rounded text-xs">Get-MMAgent</code></li>
              </ol>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Configurações principais:</p>
              <ul class="space-y-1">
                <li><strong>MemoryCompression:</strong> Compressão de memória</li>
                <li><strong>PageCombining:</strong> Combinação de páginas</li>
                <li><strong>ApplicationLaunchPrefetching:</strong> Pré-carregamento</li>
              </ul>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Análise da sua saída:</p>
              <div class="bg-muted/50 p-3 rounded text-sm">
                <p class="mb-2"><strong>PageCombining: False</strong> ⚠️ Problema!</p>
                <p>Essa função combina páginas idênticas de memória, economizando RAM. Deve estar ativa.</p>
              </div>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Correção recomendada:</p>
              <div class="bg-primary/10 border border-primary/20 p-3 rounded">
                <p class="text-primary font-medium mb-2">Ativar PageCombining</p>
                <code class="bg-background px-2 py-1 rounded text-sm block">Enable-MMAgent -PageCombining</code>
                <p class="text-xs mt-2">Execute como Administrador, reinicie o sistema.</p>
              </div>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Outros comandos úteis:</p>
              <ul class="space-y-2 text-sm">
                <li><code class="bg-muted px-2 py-1 rounded text-xs block">Disable-MMAgent -ApplicationLaunchPrefetching</code></li>
                <li><code class="bg-muted px-2 py-1 rounded text-xs block">Set-MMAgent -MaxOperationAPIFiles 512</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Zap, Cpu, HardDrive, Monitor, Activity } from 'lucide-vue-next'

const activeSection = ref('memory')

const optimizationSections = [
  {
    id: 'memory',
    title: 'Memória RAM',
    icon: HardDrive,
    description: 'Otimização de memória e gerenciamento'
  },
  {
    id: 'cpu',
    title: 'Processador',
    icon: Cpu,
    description: 'Ajustes de CPU e performance'
  },
  {
    id: 'gpu',
    title: 'Placa de Vídeo',
    icon: Monitor,
    description: 'Configurações de GPU e drivers'
  },
  {
    id: 'system',
    title: 'Sistema',
    icon: Activity,
    description: 'Otimização geral do Windows'
  }
]
</script>

<template>
  <div class="hidden lg:block fixed left-0 top-0 h-full w-80 bg-background border-r border-border/40 shadow-xl overflow-y-auto z-30">
    <!-- Sidebar Header -->
    <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 p-4">
      <div class="flex items-center gap-3">
        <Zap class="w-6 h-6 text-primary" />
        <h3 class="text-lg font-semibold text-foreground">Dicas de Otimização</h3>
      </div>
    </div>

      <!-- Navigation Menu -->
      <div class="border-b border-border/40 p-4">
        <div class="space-y-2">
          <div
            v-for="section in optimizationSections"
            :key="section.id"
            @click="activeSection = section.id"
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-primary/10"
            :class="activeSection === section.id ? 'bg-primary/20 border border-primary/30' : ''"
          >
            <component :is="section.icon" class="w-5 h-5 text-primary" />
            <div>
              <p class="font-medium text-sm">{{ section.title }}</p>
              <p class="text-xs text-muted-foreground">{{ section.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="p-4 space-y-6">
        <!-- Memory Section -->
        <div v-if="activeSection === 'memory'">
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

        <!-- CPU Section -->
        <div v-if="activeSection === 'cpu'">
          <h4 class="text-sm font-semibold text-foreground mb-3">Otimização de Processador</h4>
          <div class="space-y-4 text-sm text-muted-foreground">
            <div>
              <p class="font-medium text-foreground mb-1">Precision Boost Overdrive (PBO)</p>
              <p>Para processadores AMD Ryzen, ative o PBO na BIOS para melhor performance dinâmica.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Verificar frequência:</p>
              <p>Use HWiNFO64 para verificar se a CPU está rodando em sua frequência base/turbo correta.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Temperaturas ideais:</p>
              <ul class="space-y-1">
                <li><strong>Carga máxima:</strong> Até 85°C</li>
                <li><strong>Uso diário:</strong> Até 75°C</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- GPU Section -->
        <div v-if="activeSection === 'gpu'">
          <h4 class="text-sm font-semibold text-foreground mb-3">Otimização de Placa de Vídeo</h4>
          <div class="space-y-4 text-sm text-muted-foreground">
            <div>
              <p class="font-medium text-foreground mb-1">Resize BAR (ReBAR)</p>
              <p>Ative o ReBAR na BIOS para acesso completo à memória de vídeo da GPU.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Drivers atualizados:</p>
              <p>Mantenha sempre os drivers mais recentes da NVIDIA ou AMD.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Temperaturas ideais:</p>
              <ul class="space-y-1">
                <li><strong>Jogos:</strong> Até 85°C</li>
                <li><strong>Uso intenso:</strong> Até 90°C</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- System Section -->
        <div v-if="activeSection === 'system'">
          <h4 class="text-sm font-semibold text-foreground mb-3">Otimização Geral do Sistema</h4>
          <div class="space-y-4 text-sm text-muted-foreground">
            <div>
              <p class="font-medium text-foreground mb-1">Secure Boot</p>
              <p>Certifique-se que Secure Boot está ativado na BIOS para compatibilidade com jogos modernos.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Serviços desnecessários:</p>
              <p>Desative serviços do Windows que não usa para liberar recursos.</p>
            </div>

            <div>
              <p class="font-medium text-foreground mb-1">Limpeza de disco:</p>
              <p>Use a ferramenta de limpeza de disco integrada do Windows regularmente.</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

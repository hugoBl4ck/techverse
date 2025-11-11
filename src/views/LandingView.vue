<script setup>
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, Wand2, Blocks } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToApp = () => {
  router.push('/app/clientes')
}
</script>

<template>
  <!-- Header Fixo -->
  <header class="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="font-display text-2xl font-bold text-foreground">
        TechVerse
      </div>
      <Button @click="navigateToApp" variant="default" class="font-body">
        Acessar App
      </Button>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Seu Gerenciador de TI. Do Cliente ao Kit.
        </h1>
        <p class="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-body">
          TechVerse é a ferramenta gratuita para técnicos autônomos gerenciarem clientes, inventário e montagens de PC. Tudo em um só lugar.
        </p>
        <Button 
          @click="navigateToApp" 
          size="lg" 
          class="font-body text-base h-12 px-8"
        >
          Comece a Gerenciar Agora
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-muted/30 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="font-display text-4xl font-bold text-foreground text-center mb-16">
          Sua Bancada de Trabalho Digital
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature Card 1: Gestão -->
          <Card class="p-8 bg-background border border-border hover:border-primary/50 transition-colors">
            <div class="flex justify-center mb-4">
              <Users class="w-12 h-12 text-primary" />
            </div>
            <h3 class="font-display text-xl font-bold text-foreground text-center mb-4">
              Gestão de Clientes
            </h3>
            <p class="text-sm text-muted-foreground text-center font-body">
              Cadastre clientes e mantenha um histórico completo de todos os serviços prestados, de formatações a otimizações.
            </p>
          </Card>

          <!-- Feature Card 2: IA -->
          <Card class="p-8 bg-background border border-border hover:border-primary/50 transition-colors">
            <div class="flex justify-center mb-4">
              <Wand2 class="w-12 h-12 text-primary" />
            </div>
            <h3 class="font-display text-xl font-bold text-foreground text-center mb-4">
              Cadastro Inteligente com IA
            </h3>
            <p class="text-sm text-muted-foreground text-center font-body">
              Cole qualquer anúncio de PC (Facebook, WhatsApp) e nossa IA identifica, extrai e pré-cadastra as peças para você.
            </p>
          </Card>

          <!-- Feature Card 3: Canvas -->
          <Card class="p-8 bg-background border border-border hover:border-primary/50 transition-colors">
            <div class="flex justify-center mb-4">
              <Blocks class="w-12 h-12 text-primary" />
            </div>
            <h3 class="font-display text-xl font-bold text-foreground text-center mb-4">
              Canvas de Montagem
            </h3>
            <p class="text-sm text-muted-foreground text-center font-body">
              Use nosso "Workbench" interativo. Arraste peças do seu inventário e monte múltiplos kits com lógica de compatibilidade.
            </p>
          </Card>
        </div>
      </div>
    </section>

    <!-- Monetização Section -->
    <section class="py-20 bg-background px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <Card class="p-12 bg-background border-2 border-primary">
          <h3 class="font-display text-3xl font-bold text-foreground mb-4 text-center">
            🔥 Promoções Selecionadas
          </h3>
          <p class="text-base text-muted-foreground text-center font-body">
            O TechVerse é gratuito. Para manter o app, oferecemos um painel com as melhores promoções de hardware (AliExpress, etc.) com nossos links de afiliado.
          </p>
          <div class="mt-8 text-center">
            <Button 
              @click="navigateToApp" 
              variant="default" 
              class="font-body"
            >
              Explorar Promoções
            </Button>
          </div>
        </Card>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-border bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto text-center">
      <p class="text-sm text-muted-foreground font-body">
        © {{ new Date().getFullYear() }} TechVerse. Desenvolvido por HugoBl4ck.
      </p>
    </div>
  </footer>
</template>

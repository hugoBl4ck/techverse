<script setup>
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, Wand2, Blocks, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import TechVerseLogo from '@/components/TechVerseLogo.vue' // logo tech animado

const router = useRouter()
const hoveredFeature = ref(null)

const navigateToApp = () => {
  router.push('/app/clientes')
}
</script>

<template>
  <div class="relative bg-background overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Gradient Orbs -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/25 to-primary/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/20 to-secondary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(0deg, transparent 24%, rgba(var(--color-primary)) 25%, rgba(var(--color-primary)) 26%, transparent 27%, transparent 74%, rgba(var(--color-primary)) 75%, rgba(var(--color-primary)) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(var(--color-primary)) 25%, rgba(var(--color-primary)) 26%, transparent 27%, transparent 74%, rgba(var(--color-primary)) 75%, rgba(var(--color-primary)) 76%, transparent 77%, transparent); background-size: 50px 50px; background-position: 0 0, 25px 25px;"></div>
    </div>

    <!-- Header Fixo -->
    <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
        <div class="flex items-center gap-2">
          <TechVerseLogo />
          <span class="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            TechVerse
          </span>
        </div>
        <Button 
          @click="navigateToApp" 
          class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white border-0 transition-all"
        >
          Acessar App
          <ArrowRight class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </header>

    <main class="relative z-10">
      <!-- Hero Section com Efeito Moderno -->
      <section class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden">
        <!-- Animated circles behind hero -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
          <div class="absolute top-40 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-blob" style="animation-delay: 2s"></div>
          <div class="absolute -bottom-20 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob" style="animation-delay: 4s"></div>
        </div>

        <div class="max-w-4xl mx-auto text-center relative z-10">
          <div class="inline-block mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur">
            <p class="text-sm font-body text-primary font-semibold">🚀 A Ferramenta que Todo Técnico Precisa</p>
          </div>

          <h1 class="font-display text-6xl md:text-7xl font-bold text-foreground mb-8 leading-tight max-w-3xl mx-auto">
            Seu Gerenciador de <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">TI</span> Completo
          </h1>

          <p class="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body leading-relaxed">
            Do cadastro de clientes até montagem de PCs. <span class="text-foreground font-semibold">TechVerse</span> é a plataforma gratuita para técnicos autônomos que querem trabalhar mais inteligente, não mais intenso.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              @click="navigateToApp" 
              size="lg" 
              class="font-body text-base h-14 px-10 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/40 text-white border-0 rounded-full transition-all group"
            >
              Comece Agora (Gratuito)
              <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              class="font-body text-base h-14 px-10 rounded-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
            >
              Ver Demonstração
            </Button>
          </div>

          <!-- Feature Pills -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-border/20">
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap class="w-5 h-5 text-primary" />
              </div>
              <div class="text-left">
                <p class="text-xs text-muted-foreground">Rápido</p>
                <p class="text-sm font-semibold text-foreground">Sem configuração</p>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Shield class="w-5 h-5 text-accent" />
              </div>
              <div class="text-left">
                <p class="text-xs text-muted-foreground">Seguro</p>
                <p class="text-sm font-semibold text-foreground">Seus dados</p>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <TrendingUp class="w-5 h-5 text-secondary" />
              </div>
              <div class="text-left">
                <p class="text-xs text-muted-foreground">Inteligente</p>
                <p class="text-sm font-semibold text-foreground">Com IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section com Cards Interativos -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-20">
            <p class="text-sm font-semibold text-primary mb-4 font-body uppercase tracking-wider">Poderosa & Intuitiva</p>
            <h2 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
              Sua Bancada de <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Trabalho Digital</span>
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
              Três funcionalidades poderosas que transformam como você trabalha
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature Card 1 -->
            <div 
              @mouseenter="hoveredFeature = 1"
              @mouseleave="hoveredFeature = null"
              class="group relative"
            >
              <Card class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-primary/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="hoveredFeature === 1 ? 'shadow-2xl shadow-primary/20' : 'shadow-lg shadow-foreground/5'"
              >
                <!-- Animated background on hover -->
                <div v-if="hoveredFeature === 1" class="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg -z-10 transition-all duration-500"></div>

                <div class="flex justify-center mb-6">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500">
                    <Users class="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 class="font-display text-2xl font-bold text-foreground text-center mb-4">
                  Gestão de Clientes
                </h3>
                <p class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6">
                  Cadastre clientes e mantenha um histórico completo de todos os serviços prestados, de formatações a otimizações.
                </p>
                <div class="flex items-center justify-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>

            <!-- Feature Card 2 -->
            <div 
              @mouseenter="hoveredFeature = 2"
              @mouseleave="hoveredFeature = null"
              class="group relative md:scale-105 md:translate-y-8"
            >
              <Card class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-accent/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="hoveredFeature === 2 ? 'shadow-2xl shadow-accent/20' : 'shadow-lg shadow-foreground/5'"
              >
                <!-- Animated background on hover -->
                <div v-if="hoveredFeature === 2" class="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-lg -z-10 transition-all duration-500"></div>

                <div class="flex justify-center mb-6">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-500">
                    <Wand2 class="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h3 class="font-display text-2xl font-bold text-foreground text-center mb-4">
                  Importação com IA
                </h3>
                <p class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6">
                  Cole qualquer anúncio de PC (Facebook, WhatsApp) e nossa IA identifica, extrai e pré-cadastra as peças automaticamente.
                </p>
                <div class="flex items-center justify-center gap-2 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>

            <!-- Feature Card 3 -->
            <div 
              @mouseenter="hoveredFeature = 3"
              @mouseleave="hoveredFeature = null"
              class="group relative"
            >
              <Card class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-secondary/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="hoveredFeature === 3 ? 'shadow-2xl shadow-secondary/20' : 'shadow-lg shadow-foreground/5'"
              >
                <!-- Animated background on hover -->
                <div v-if="hoveredFeature === 3" class="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-lg -z-10 transition-all duration-500"></div>

                <div class="flex justify-center mb-6">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-secondary/30 transition-all duration-500">
                    <Blocks class="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <h3 class="font-display text-2xl font-bold text-foreground text-center mb-4">
                  Canvas de Montagem
                </h3>
                <p class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6">
                  Use nosso Workbench interativo. Arraste peças do seu inventário e monte múltiplos kits com lógica de compatibilidade.
                </p>
                <div class="flex items-center justify-center gap-2 text-secondary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- Monetização Section com Design Premium -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <!-- Background with gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 -z-10"></div>

        <div class="max-w-4xl mx-auto">
          <Card class="relative overflow-hidden p-12 md:p-16 bg-gradient-to-br from-background/80 via-background/70 to-background/80 border-2 border-primary/50 backdrop-blur-xl shadow-2xl shadow-primary/20">
            <!-- Animated elements inside card -->
            <div class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl -z-10 opacity-30"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/15 to-secondary/5 rounded-full blur-3xl -z-10 opacity-20"></div>

            <div class="relative z-10">
              <div class="text-center mb-8">
                <span class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-4">
                  <span class="text-primary font-semibold font-body text-sm">✨ Modelo de Negócio Transparente</span>
                </span>
              </div>

              <h3 class="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
                🔥 Promoções <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">Selecionadas</span>
              </h3>

              <p class="text-lg text-muted-foreground text-center font-body mb-8 leading-relaxed max-w-2xl mx-auto">
                TechVerse é <span class="font-semibold text-foreground">100% gratuito</span>. Para manter a plataforma rodando, oferecemos um painel com as melhores <span class="font-semibold text-foreground">promoções de hardware</span> (AliExpress, componentes internacionais) com nossos links de afiliado. Você ganha tempo, nós ganhamos uma comissão. Win-win.
              </p>

              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  @click="navigateToApp" 
                  class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 text-white border-0 h-12 px-8 rounded-full transition-all"
                >
                  Explorar Promoções
                  <ArrowRight class="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  class="font-body border-2 border-primary/40 hover:bg-primary/5 h-12 px-8 rounded-full transition-all"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- CTA Final Section -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
            Pronto para <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">transformar</span> seu fluxo de trabalho?
          </h2>
          <p class="text-xl text-muted-foreground mb-10 font-body max-w-2xl mx-auto">
            Sem cartão de crédito. Sem limitações. Sem spam. Apenas a ferramenta que você precisa.
          </p>
          <Button 
            @click="navigateToApp" 
            size="lg" 
            class="font-body text-lg h-16 px-12 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white border-0 rounded-full transition-all group"
          >
            Acessar TechVerse Agora
            <ArrowRight class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-border/30 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-border/20">
          <div>
             <div class="flex items-center gap-2 mb-4">
               <TechVerseLogo />
               <span class="font-display text-lg font-bold text-foreground">TechVerse</span>
             </div>
            <p class="text-sm text-muted-foreground">A plataforma completa para técnicos autônomos.</p>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Produto</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" class="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Recurso</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Preços</a></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Empresa</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" class="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Legal</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" class="hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Termos</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm text-muted-foreground font-body">
            © {{ new Date().getFullYear() }} <span class="text-foreground font-semibold">TechVerse</span>. Desenvolvido com ❤️ por <span class="text-primary font-semibold">HugoBl4ck</span>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}
</style>

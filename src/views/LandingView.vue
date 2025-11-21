<script setup>
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Tooltip from "@/components/ui/Tooltip.vue";
import HeroBackground from "@/components/landing/HeroBackground.vue";
import FAQSection from "@/components/landing/FAQSection.vue";
import {
  Users,
  Wand2,
  Blocks,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  LogIn,
  Cpu,
  User,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Coffee,
  MessageCircle,
  CheckCircle
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const router = useRouter();
const hoveredFeature = ref(null);
const currentTestimonial = ref(0);

// Quiz state
const quizStep = ref(0);
const quizAnswers = ref([]);
const selectedAnswer = ref(null);

const clientesOtimizados = computed(() => {
  const hoje = new Date();
  const dataInicial = new Date('2023-01-01');
  const diffTime = hoje - dataInicial;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return 21 + (diffDays * 2);
});

const navigateToApp = () => {
  window.location.href = "https://techverseapp.vercel.app/dashboard";
};

const navigateToLogin = () => {
  window.location.href = "https://techverseapp.vercel.app/login";
};

const navigateToOtimizacao = () => {
  window.location.href = "https://techverseapp.vercel.app/otimizacao";
};

const navigateToFeature = (feature) => {
  const routes = {
    'gestao-clientes': 'https://techverseapp.vercel.app/clientes',
    'importacao-ia': 'https://techverseapp.vercel.app/inventario/importar-ia',
    'canvas-montagem': 'https://techverseapp.vercel.app/kits/builder'
  };
  window.location.href = routes[feature] || "https://techverseapp.vercel.app/dashboard";
};

// Dados dos depoimentos
const testimonials = [
  {
    id: 1,
    name: "João S., São Paulo-SP",
    image: "/depoimentogamer1.jpg",
    color: "bg-primary",
    text: "Eu tinha percebido que o meu pc estava travando sem explicação, quando fui ver a minha frequencia estava limitada, minha placa de vídeo estava só usando 256mb por vez em vez de 8gb, isso fez total diferença em minha gameplay"
  },
  {
    id: 2,
    name: "Maria S., Curitiba-PR",
    image: "/girlgamer1.jpg",
    color: "bg-accent",
    text: "Comprei um par de memória 3600mhz e estava somente usando 2400mhz, pensei se que só era comprar e instalar, agora sim estou usando os 3600mhz"
  },
  {
    id: 3,
    name: "Pedro O., Rio de Janeiro-RJ",
    image: "/depoimentogamer2.jpg",
    color: "bg-secondary",
    text: "Comprei um notebook gamer e ele veio com linux, com a otimização consegui instalar o windows 11, e agora estou jogando todos os jogos, inclusive o BF6 com o secureboot"
  },
  {
    id: 4,
    name: "Ana C., Belo Horizonte-MG",
    image: "/depoimentogamer1.jpg",
    color: "bg-primary",
    text: "Agora consigo jogar os jogos que exigem secure boot com essa otimização, recomendo."
  },
  {
    id: 5,
    name: "Carlos P., Salvador-BA",
    image: "/depoimentogamer2.jpg",
    color: "bg-accent",
    text: "Solicitei a limpeza do meu pc pois estava com super aquecimento, quando fui ver, as configurações do PBO estavam todas erradas."
  }
];

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length;
};

const prevTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value - 1 + testimonials.length) % testimonials.length;
};

const goToTestimonial = (index) => {
  currentTestimonial.value = index;
};

const answerQuiz = (answer) => {
  selectedAnswer.value = answer;
  quizAnswers.value.push(answer);
  if (quizStep.value < 2) {
    quizStep.value++;
    selectedAnswer.value = null;
  }
};

const resetQuiz = () => {
  quizStep.value = 0;
  quizAnswers.value = [];
  selectedAnswer.value = null;
};

const contactSpecialist = () => {
  const message = quizAnswers.value.includes('frequent') || quizAnswers.value.includes('sometimes')
    ? "Olá! Fiz o quiz no site e meu PC está precisando de uma Otimização Completa. Gostaria de saber mais!"
    : "Olá! Fiz o quiz no site e gostaria de agendar uma Manutenção Preventiva para meu PC."
  
  const phone = "5511999999999" // Substitua pelo número real
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
}


</script>

<template>
  <div class="relative bg-background overflow-hidden">
    <HeroBackground />
    
    <!-- Navbar Fixa (Estilo Floating) -->
    <div class="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav class="w-full max-w-5xl bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-3 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:bg-white/80">
        
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <img src="/techLOGO.svg" alt="TechVerse Logo" class="w-8 h-8" />
          <span class="font-display font-bold text-xl text-slate-900">TechVerse</span>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          <router-link 
            to="/otimizacao" 
            class="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all"
          >
            Otimização
          </router-link>
          <router-link 
            to="/promocoes" 
            class="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all"
          >
            Promoções
          </router-link>
          <router-link 
            to="/noticias" 
            class="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all"
          >
            Notícias
          </router-link>
          <router-link 
            to="/donate" 
            class="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all flex items-center gap-2"
          >
            <Coffee class="w-4 h-4" />
            Me pague um cafezinho!
          </router-link>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <Button 
            @click="navigateToLogin" 
            variant="ghost" 
            size="sm" 
            class="font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            Entrar
          </Button>
          
          <router-link to="/dashboard">
            <div class="relative group cursor-pointer">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
              <button class="relative px-6 py-2 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                <span class="flex items-center space-x-2">
                  <span class="text-white font-semibold text-sm">Teste agora</span>
                </span>
              </button>
            </div>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Hero Section -->
    <section class="relative border-b border-border/40 shadow-sm pt-32 pb-20 overflow-hidden">
      <!-- Background with Topography and Gradient Overlay -->
      <div class="absolute inset-0 z-0">
        <!-- New Soft Tech BG -->
        <div class="absolute inset-0 bg-cover bg-center opacity-40 blur-sm" style="background-image: url('/soft-tech-bg.png?v=2');"></div>
        
        <!-- Overlays for better text contrast -->
        <div class="absolute inset-0 bg-[url('/topography-gradient.svg')] opacity-20 bg-repeat mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Left Column: Text Content -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-8 animate-fade-in">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <p class="text-sm font-body text-primary font-semibold">
                A Revolução para Técnicos de TI
              </p>
            </div>

            <h1 class="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Gerencie seu <br/>
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-600">Império Tech</span>
            </h1>

            <p class="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
              Do cadastro de clientes à montagem de PCs com IA. O 
              <span class="text-foreground font-semibold">TechVerse</span> é a plataforma definitiva para técnicos que buscam eficiência e profissionalismo.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                @click="navigateToApp"
                size="lg"
                class="font-body text-base h-14 px-8 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/40 text-white border-0 rounded-full transition-all group btn-glow"
              >
                Começar Gratuitamente
                <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                @click="navigateToLogin"
                variant="outline"
                size="lg"
                class="font-body text-base h-14 px-8 rounded-full border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all backdrop-blur-sm"
              >
                <LogIn class="w-5 h-5 mr-2" />
                Acessar Conta
              </Button>
            </div>

            <!-- Trust Indicators -->
            <div class="mt-12 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500" />
                <span class="text-sm">Plano Gratuito</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500" />
                <span class="text-sm">Sem Cartão</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500" />
                <span class="text-sm">Setup Instantâneo</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Visuals -->
          <div class="relative hidden lg:block">
            <!-- Main Floating Image -->
            <div class="relative z-10 animate-float">
              <div class="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <img 
                src="/gamer-girl-hero.png" 
                alt="Gamer Girl Tech Setup" 
                class="relative w-full max-w-[600px] mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 rounded-2xl"
              />
              
              <!-- Floating Cards/Elements -->
              <div class="absolute -right-8 top-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl animate-float" style="animation-delay: 1s;">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp class="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p class="text-xs text-gray-300">Produtividade</p>
                    <p class="text-lg font-bold text-white">+300%</p>
                  </div>
                </div>
              </div>

              <div class="absolute -left-4 bottom-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl animate-float" style="animation-delay: 2s;">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Cpu class="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p class="text-xs text-gray-300">IA Integrada</p>
                    <p class="text-sm font-bold text-white">Análise em Tempo Real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

      <!-- Features Section com Cards Interativos -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-20">
            <p
              class="text-sm font-semibold text-primary mb-4 font-body uppercase tracking-wider"
            >
              Poderosa & Intuitiva
            </p>
            <h2
              class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6"
            >
              Sua Bancada de
              <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                >Trabalho Digital</span
              >
            </h2>
            <p
              class="text-lg text-muted-foreground max-w-2xl mx-auto font-body"
            >
              Três funcionalidades poderosas que transformam como você trabalha
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature Card 1 -->
            <div
              @mouseenter="hoveredFeature = 1"
              @mouseleave="hoveredFeature = null"
              @click="navigateToFeature('gestao-clientes')"
              class="group relative"
            >
              <Card
                class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-primary/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="
                  hoveredFeature === 1
                    ? 'shadow-2xl shadow-primary/20'
                    : 'shadow-lg shadow-foreground/5'
                "
              >
                <!-- Animated background on hover -->
                <div
                  v-if="hoveredFeature === 1"
                  class="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg -z-10 transition-all duration-500"
                ></div>

                <div class="flex justify-center mb-6">
                  <div
                    class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500"
                  >
                    <Users class="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3
                  class="font-display text-2xl font-bold text-foreground text-center mb-4"
                >
                  Gestão de Clientes
                </h3>
                <p
                  class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6"
                >
                  Cadastre clientes e mantenha um histórico completo de todos os
                  serviços prestados, de formatações a otimizações.
                </p>
                <div
                  class="flex items-center justify-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>

            <!-- Feature Card 2 -->
            <div
              @mouseenter="hoveredFeature = 2"
              @mouseleave="hoveredFeature = null"
              @click="navigateToFeature('importacao-ia')"
              class="group relative md:scale-105 md:translate-y-8"
            >
              <Card
                class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-accent/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="
                  hoveredFeature === 2
                    ? 'shadow-2xl shadow-accent/20'
                    : 'shadow-lg shadow-foreground/5'
                "
              >
                <!-- Animated background on hover -->
                <div
                  v-if="hoveredFeature === 2"
                  class="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-lg -z-10 transition-all duration-500"
                ></div>

                <div class="flex justify-center mb-6">
                  <div
                    class="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-500"
                  >
                    <Wand2 class="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h3
                  class="font-display text-2xl font-bold text-foreground text-center mb-4"
                >
                  Importação com IA
                </h3>
                <p
                  class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6"
                >
                  Cole qualquer anúncio de PC (Facebook, WhatsApp) e nossa IA
                  identifica, extrai e pré-cadastra as peças automaticamente.
                </p>
                <div
                  class="flex items-center justify-center gap-2 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>

            <!-- Feature Card 3 -->
            <div
              @mouseenter="hoveredFeature = 3"
              @mouseleave="hoveredFeature = null"
              @click="navigateToFeature('canvas-montagem')"
              class="group relative"
            >
              <Card
                class="p-8 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-secondary/50 transition-all duration-500 h-full backdrop-blur-sm cursor-pointer"
                :class="
                  hoveredFeature === 3
                    ? 'shadow-2xl shadow-secondary/20'
                    : 'shadow-lg shadow-foreground/5'
                "
              >
                <!-- Animated background on hover -->
                <div
                  v-if="hoveredFeature === 3"
                  class="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-lg -z-10 transition-all duration-500"
                ></div>

                <div class="flex justify-center mb-6">
                  <div
                    class="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-secondary/30 transition-all duration-500"
                  >
                    <Blocks class="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <h3
                  class="font-display text-2xl font-bold text-foreground text-center mb-4"
                >
                  Canvas de Montagem
                </h3>
                <p
                  class="text-sm text-muted-foreground text-center font-body leading-relaxed mb-6"
                >
                  Use nosso Workbench interativo. Arraste peças do seu
                  inventário e monte múltiplos kits com lógica de
                  compatibilidade.
                </p>
                <div
                  class="flex items-center justify-center gap-2 text-secondary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                  Explorar <ArrowRight class="w-4 h-4" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- Otimização Section -->
      <section class="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-4xl mx-auto">
          <Card
            class="relative overflow-hidden p-12 md:p-16 bg-gradient-to-br from-background/80 via-background/70 to-background/80 border-2 border-accent/50 backdrop-blur-xl shadow-2xl shadow-accent/20"
          >
            <!-- Animated elements inside card -->
            <div
              class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-3xl -z-10 opacity-30"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/15 to-secondary/5 rounded-full blur-3xl -z-10 opacity-20"
            ></div>

            <div class="relative z-10">
              <div class="text-center mb-8">
                <span
                  class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 mb-4"
                >
                  <span class="text-accent font-semibold font-body text-sm"
                    >⚡ Serviço Premium de Otimização</span
                  >
                </span>
              </div>

              <div class="flex justify-center mb-6">
                <div
                  class="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center"
                >
                  <Cpu class="w-10 h-10 text-accent" />
                </div>
              </div>

              <h3
                class="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 text-center"
              >
                Seu PC está
                <span
                  class="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary"
                  >100% Otimizado</span
                >?
              </h3>

              <div class="text-lg text-muted-foreground text-center font-body mb-12 leading-relaxed max-w-3xl mx-auto">
                <h4 class="font-display text-2xl font-bold text-foreground mb-8">Otimização Profissional vs. Comum</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <!-- Problemas -->
                  <div class="space-y-6">
                    <div class="flex gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div class="shrink-0">
                        <AlertTriangle class="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h5 class="font-semibold text-foreground mb-1">O Problema</h5>
                        <p class="text-sm text-muted-foreground">
                          Frequências de RAM limitadas, XMP desativado e gargalos térmicos que sabotam seu desempenho.
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div class="shrink-0">
                        <Gauge class="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h5 class="font-semibold text-foreground mb-1">A Realidade</h5>
                        <p class="text-sm text-muted-foreground">
                          Hardware caro rodando a 60% da capacidade por falta de configuração técnica adequada.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Soluções -->
                  <div class="space-y-6">
                    <div class="flex gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <div class="shrink-0">
                        <CheckCircle2 class="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h5 class="font-semibold text-foreground mb-1">Nossa Solução</h5>
                        <p class="text-sm text-muted-foreground">
                          Análise via IA + Especialista para ativar Resize BAR<Tooltip text="Tecnologia que permite acesso direto à memória da GPU" />, PBO e curvas de fan customizadas.
                        </p>
                      </div>
                    </div>

                    <div class="flex gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <div class="shrink-0">
                        <Zap class="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h5 class="font-semibold text-foreground mb-1">O Resultado</h5>
                        <p class="text-sm text-muted-foreground">
                          Máxima estabilidade e performance desbloqueada. Seu hardware valendo cada centavo investido.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quiz Interativo -->
              <div class="mb-8 fade-in">
                <Card class="p-6 bg-background/50 border border-border/50 card-premium">
                  <h4 class="font-display text-xl font-bold text-foreground mb-4 text-center">Descubra se seu PC precisa de otimização</h4>
                  <div v-if="quizStep < 3" class="text-center">
                    <!-- Progress Indicator -->
                    <div class="mb-6">
                      <div class="flex justify-center items-center gap-2 mb-2">
                        <div v-for="step in 3" :key="step" class="w-3 h-3 rounded-full" :class="step <= quizStep + 1 ? 'bg-accent' : 'bg-muted-foreground/30'"></div>
                      </div>
                      <p class="text-sm text-muted-foreground">Pergunta {{ quizStep + 1 }} de 3</p>
                    </div>
                    <div v-if="quizStep === 0" role="radiogroup" aria-labelledby="quiz-q1">
                      <p id="quiz-q1" class="text-muted-foreground mb-4">Como você usa seu computador?</p>
                      <div class="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button @click="answerQuiz('gaming')" :variant="selectedAnswer === 'gaming' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'gaming' ? 'bg-accent text-white' : ''">Jogos e entretenimento</Button>
                        <Button @click="answerQuiz('work')" :variant="selectedAnswer === 'work' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'work' ? 'bg-accent text-white' : ''">Trabalho profissional</Button>
                        <Button @click="answerQuiz('general')" :variant="selectedAnswer === 'general' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'general' ? 'bg-accent text-white' : ''">Uso geral</Button>
                      </div>
                    </div>
                    <div v-if="quizStep === 1" role="radiogroup" aria-labelledby="quiz-q2">
                      <p id="quiz-q2" class="text-muted-foreground mb-4">Você enfrenta travamentos ou lentidão?</p>
                      <div class="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button @click="answerQuiz('frequent')" :variant="selectedAnswer === 'frequent' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'frequent' ? 'bg-accent text-white' : ''">Frequentemente</Button>
                        <Button @click="answerQuiz('sometimes')" :variant="selectedAnswer === 'sometimes' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'sometimes' ? 'bg-accent text-white' : ''">Às vezes</Button>
                        <Button @click="answerQuiz('rarely')" :variant="selectedAnswer === 'rarely' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'rarely' ? 'bg-accent text-white' : ''">Raramente</Button>
                      </div>
                    </div>
                    <div v-if="quizStep === 2" role="radiogroup" aria-labelledby="quiz-q3">
                      <p id="quiz-q3" class="text-muted-foreground mb-4">Você já configurou BIOS ou overclock?</p>
                      <div class="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button @click="answerQuiz('yes')" :variant="selectedAnswer === 'yes' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'yes' ? 'bg-accent text-white' : ''">Sim, já tentei</Button>
                        <Button @click="answerQuiz('no')" :variant="selectedAnswer === 'no' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'no' ? 'bg-accent text-white' : ''">Não, nunca</Button>
                        <Button @click="answerQuiz('unsure')" :variant="selectedAnswer === 'unsure' ? 'default' : 'outline'" class="flex-1" :class="selectedAnswer === 'unsure' ? 'bg-accent text-white' : ''">Não tenho certeza</Button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center animate-fade-in">
                    <div class="mb-6">
                      <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle class="w-8 h-8 text-accent" />
                      </div>
                      <h5 class="text-lg font-bold text-foreground mb-2">Análise Concluída!</h5>
                      <p class="text-muted-foreground mb-4">Baseado nas suas respostas, recomendamos:</p>
                      <p class="text-xl font-semibold text-accent mb-6">
                        {{ quizAnswers.includes('frequent') || quizAnswers.includes('sometimes') ? 'Otimização Completa de Hardware & Software' : 'Manutenção Preventiva & Tuning' }}
                      </p>
                    </div>
                    
                    <div class="flex flex-col gap-3">
                      <Button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg hover:shadow-green-500/20 transition-all" @click="contactSpecialist">
                        <MessageCircle class="w-4 h-4 mr-2" />
                        Falar com Especialista
                      </Button>
                      <Button @click="resetQuiz" variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground">
                        Refazer Quiz
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div class="text-center mb-6 fade-in" style="animation-delay: 0.1s">
                <p class="text-2xl font-bold text-accent">{{ clientesOtimizados }} clientes já otimizados</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                <div class="text-center animate-fade-in" style="animation-delay: 0.2s">
                  <div class="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Zap class="w-8 h-8 text-accent" />
                  </div>
                  <h4 class="font-semibold text-foreground mb-3">Gamers</h4>
                  <p class="text-sm text-muted-foreground">Que sabem que seu setup pode rodar jogos em máxima performance</p>
                </div>
                <div class="text-center animate-fade-in" style="animation-delay: 0.4s">
                  <div class="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp class="w-8 h-8 text-primary" />
                  </div>
                  <h4 class="font-semibold text-foreground mb-3">Profissionais</h4>
                  <p class="text-sm text-muted-foreground">Que precisam de resposta instantânea em softwares pesados</p>
                </div>
                <div class="text-center animate-fade-in" style="animation-delay: 0.6s">
                  <div class="w-16 h-16 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Shield class="w-8 h-8 text-secondary" />
                  </div>
                  <h4 class="font-semibold text-foreground mb-3">Streamers</h4>
                  <p class="text-sm text-muted-foreground">Que exigem estabilidade máxima para transmissões ao vivo</p>
                </div>
                <div class="text-center animate-fade-in" style="animation-delay: 0.8s">
                  <div class="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Cpu class="w-8 h-8 text-accent" />
                  </div>
                  <h4 class="font-semibold text-foreground mb-3">Designers</h4>
                  <p class="text-sm text-muted-foreground">Que trabalham com renderização e edição de vídeo</p>
                </div>
                <div class="text-center animate-fade-in" style="animation-delay: 1s">
                  <div class="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <User class="w-8 h-8 text-primary" />
                  </div>
                  <h4 class="font-semibold text-foreground mb-3">Todos</h4>
                  <p class="text-sm text-muted-foreground">Que querem verificar se estão usando o hardware que pagaram</p>
                </div>
              </div>

              <!-- Carousel de Depoimentos -->
              <div class="max-w-4xl mx-auto mb-12">
                <div class="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/10">
                  <!-- Slide atual -->
                  <div class="relative h-80 md:h-96 transition-all duration-500">
                    <div 
                      :key="currentTestimonial"
                      class="absolute inset-0 transition-opacity duration-500"
                    >
                      <div 
                        class="relative w-full h-full rounded-2xl overflow-hidden"
                        :style="{
                          backgroundImage: `url('${testimonials[currentTestimonial].image}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }"
                      >
                        <div class="absolute inset-0 bg-black/60"></div>
                        <div class="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center">
                          <div class="flex justify-center mb-4">
                            <div :class="`w-14 h-14 rounded-full ${testimonials[currentTestimonial].color}/20 flex items-center justify-center`">
                              <User class="w-7 h-7" :class="`text-${testimonials[currentTestimonial].color.replace('bg-', '')}`" />
                            </div>
                          </div>
                          <h4 class="font-semibold text-white mb-4 text-lg">{{ testimonials[currentTestimonial].name }}</h4>
                          <p class="text-sm md:text-base text-gray-200 max-w-2xl">{{ testimonials[currentTestimonial].text }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Controles de navegação -->
                  <button
                    @click="prevTestimonial"
                    class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all hover:scale-110"
                    aria-label="Depoimento anterior"
                  >
                    <ArrowRight class="w-5 h-5 rotate-180" />
                  </button>

                  <button
                    @click="nextTestimonial"
                    class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all hover:scale-110"
                    aria-label="Próximo depoimento"
                  >
                    <ArrowRight class="w-5 h-5" />
                  </button>

                  <!-- Indicadores de slide -->
                  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    <button
                      v-for="(testimonial, index) in testimonials"
                      :key="index"
                      @click="goToTestimonial(index)"
                      :class="[
                        'w-2 h-2 rounded-full transition-all',
                        index === currentTestimonial
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/70'
                      ]"
                      :aria-label="`Ir para depoimento ${index + 1}`"
                      :aria-current="index === currentTestimonial"
                    />
                  </div>
                </div>

                <!-- Contador de slides -->
                <div class="text-center mt-4 text-muted-foreground text-sm">
                  {{ currentTestimonial + 1 }} / {{ testimonials.length }}
                </div>
              </div>

              <!-- Galeria de Imagens com Overlay de Gradiente -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="relative overflow-hidden rounded-lg shadow-lg">
                  <img src="/Captura-de-tela-comparativo-pbo.png" alt="Gráfico de benchmark mostrando ganhos de performance com PBO ativado." class="w-full h-48 object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40"></div>
                </div>
                <div class="relative overflow-hidden rounded-lg shadow-lg">
                  <img src="/Captura-de-tela-comparativo-pbo1.png" alt="Tela de configuração da BIOS com a opção Precision Boost Overdrive destacada." class="w-full h-48 object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40"></div>
                </div>
                <div class="relative overflow-hidden rounded-lg shadow-lg">
                  <img src="/Captura-de-tela-comparativo-pbo2.png" alt="Comparativo de temperatura do processador antes e depois da otimização PBO." class="w-full h-48 object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40"></div>
                </div>
              </div>

              <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in ab-test-variant-a"
                style="animation-delay: 1.8s"
              >
                <Button
                  @click="() => { navigateToOtimizacao(); }"
                  class="font-body bg-gradient-to-r from-accent to-primary hover:shadow-xl hover:shadow-accent/40 text-white border-0 h-12 px-8 rounded-full transition-all btn-glow quiz-button"
                >
                  Solicitar Análise Agora
                  <ArrowRight class="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  class="font-body border-2 border-accent/40 hover:bg-accent/5 h-12 px-8 rounded-full transition-all opacity-50 cursor-not-allowed"
                  disabled
                >
                  Saiba Como Funciona
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="font-body text-muted-foreground hover:text-primary h-8 px-4 rounded-full transition-all quiz-button"
                >
                  💬 Dar Feedback
                </Button>
              </div>

              <!-- Notas para Casos Extremos -->
              <div class="mt-8 pt-8 border-t border-border/20 fade-in" style="animation-delay: 2s">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                  <div class="flex items-start gap-3 card-premium p-4 rounded-lg">
                    <Shield class="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p class="font-semibold text-foreground mb-1">Compatibilidade</p>
                      <p>Suportamos desktops, notebooks gamers, workstations e setups customizados. Para notebooks com BIOS limitado, oferecemos alternativas seguras.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 card-premium p-4 rounded-lg">
                    <User class="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p class="font-semibold text-foreground mb-1">Acessibilidade</p>
                      <p>Processo adaptado para usuários com necessidades especiais. Suporte remoto completo e orientações passo-a-passo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Monetização Section com Design Premium -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <!-- Background with gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 -z-10"
        ></div>

        <div class="max-w-4xl mx-auto">
          <Card
            class="relative overflow-hidden p-12 md:p-16 bg-gradient-to-br from-background/80 via-background/70 to-background/80 border-2 border-primary/50 backdrop-blur-xl shadow-2xl shadow-primary/20"
          >
            <!-- Animated elements inside card -->
            <div
              class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl -z-10 opacity-30"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/15 to-secondary/5 rounded-full blur-3xl -z-10 opacity-20"
            ></div>

            <div class="relative z-10">
              <div class="text-center mb-8">
                <span
                  class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-4"
                >
                  <span class="text-primary font-semibold font-body text-sm"
                    >✨ Modelo de Negócio Transparente</span
                  >
                </span>
              </div>

              <h3
                class="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 text-center"
              >
                🔥 Promoções
                <span
                  class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                  >Selecionadas</span
                >
              </h3>

              <p
                class="text-lg text-muted-foreground text-center font-body mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                TechVerse é
                <span class="font-semibold text-foreground">100% gratuito</span
                >. Para manter a plataforma rodando, oferecemos um painel com as
                melhores
                <span class="font-semibold text-foreground"
                  >promoções de hardware</span
                >
                (AliExpress, componentes internacionais) com nossos links de
                afiliado. Você ganha tempo, nós ganhamos uma comissão. Win-win.
              </p>

              <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  @click="navigateToApp"
                  class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 text-white border-0 h-12 px-8 rounded-full transition-all"
                >
                  Explorar Promoções
                  <ArrowRight class="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  class="font-body border-2 border-primary/40 hover:bg-primary/5 h-12 px-8 rounded-full transition-all opacity-50 cursor-not-allowed"
                  disabled
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
          <h2
            class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6"
          >
            Pronto para
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
              >transformar</span
            >
            seu fluxo de trabalho?
          </h2>
          <p
            class="text-xl text-muted-foreground mb-10 font-body max-w-2xl mx-auto"
          >
            Sem cartão de crédito. Sem limitações. Sem spam. Apenas a ferramenta
            que você precisa.
          </p>
          <Button
            @click="navigateToApp"
            size="lg"
            class="font-body text-lg h-16 px-12 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white border-0 rounded-full transition-all group"
          >
            Acessar TechVerse Agora
            <ArrowRight
              class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </section>
    <!-- FAQ Section -->
    <FAQSection />


    <!-- Footer -->
    <footer
      class="relative z-10 border-t border-border/30 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-border/20"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <img src="/techLOGO.svg" alt="TechVerse Logo" class="w-6 h-6" />
              <span class="font-display text-lg font-bold text-foreground"
                >TechVerse</span
              >
            </div>
            <p class="text-sm text-muted-foreground">
              A plataforma completa para técnicos autônomos.
            </p>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Produto</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/otimizacao"
                  class="hover:text-primary transition-colors"
                  >Otimização</a
                >
              </li>
              <li>
                <a
                  href="/atualizacoes"
                  class="hover:text-primary transition-colors"
                  >Atualizações</a
                >
              </li>
              <li>
                <a
                  href="/promocoes"
                  class="hover:text-primary transition-colors"
                  >Promoções</a
                >
              </li>
              <li>
                <a href="/noticias" class="hover:text-primary transition-colors"
                  >Notícias</a
                >
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Empresa</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <span class="opacity-50">Blog</span>
              </li>
              <li>
                <span class="opacity-50">Contato</span>
              </li>
              <li>
                <span class="opacity-50">Status</span>
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Legal</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <span class="opacity-50">Privacidade</span>
              </li>
              <li>
                <span class="opacity-50">Termos</span>
              </li>
              <li>
                <span class="opacity-50">Cookies</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm text-muted-foreground font-body">
            © {{ new Date().getFullYear() }}
            <span class="text-foreground font-semibold">TechVerse</span>.
            Desenvolvido com ❤️ por
            <span class="text-primary font-semibold">HugoBl4ck</span>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
}

/* A/B Testing Variants */
.ab-test-variant-a .quiz-button {
  border-radius: 8px;
}

.ab-test-variant-b .quiz-button {
  border-radius: 50px;
}

/* Mobile Responsiveness Adjustments */
@media (max-width: 640px) {
  .quiz-button {
    font-size: 14px;
    padding: 12px 16px;
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-blob {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>

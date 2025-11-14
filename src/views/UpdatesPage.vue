<script setup>
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Zap,
  Star,
  Calendar,
  Users,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import TechVerseLogo from "@/components/TechVerseLogo.vue";
import { ref } from "vue";

const router = useRouter();
const selectedCategory = ref("todos");

const updates = [
  {
    id: 1,
    titulo: "Dashboard Financeiro Completo",
    categoria: "financeiro",
    data: "15 de Novembro, 2025",
    tipo: "feature",
    descricao:
      "Sistema completo de gestão financeira com relatórios, gráficos e análise de lucratividade.",
    features: [
      "Dashboard interativo com gráficos em tempo real",
      "Relatórios de receita e despesa",
      "Análise de margem de lucro",
      "Exportação de dados financeiros",
    ],
    imagem:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    titulo: "Importador com IA - v2.0",
    categoria: "ia",
    data: "10 de Novembro, 2025",
    tipo: "melhoria",
    descricao:
      "Improved AI recognition with support for more hardware listings and better accuracy.",
    features: [
      "Suporte para Facebook Marketplace",
      "Reconhecimento de mais modelos de placas-mãe",
      "Melhor detecção de processadores",
      "Compatibilidade automática entre peças",
    ],
    imagem:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    titulo: "Nova Interface de Kits",
    categoria: "ui",
    data: "05 de Novembro, 2025",
    tipo: "feature",
    descricao:
      "Interface completamente redesenhada para o Kit Builder com melhor usabilidade.",
    features: [
      "Drag and drop melhorado",
      "Visualização 3D dos componentes",
      "Checklist de compatibilidade",
      "Salvamento automático",
    ],
    imagem:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    titulo: "Sistema de Notificações",
    categoria: "features",
    data: "01 de Novembro, 2025",
    tipo: "feature",
    descricao:
      "Receba notificações em tempo real sobre seus clientes, ordens e promoções.",
    features: [
      "Notificações de novas ordens",
      "Alertas de promoções",
      "Lembretes de seguimento de clientes",
      "Integração com Email",
    ],
    imagem:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    titulo: "API REST Disponível",
    categoria: "developer",
    data: "28 de Outubro, 2025",
    tipo: "feature",
    descricao:
      "API pública para integração com seus próprios sistemas e ferramentas.",
    features: [
      "Documentação completa com Swagger",
      "Autenticação com API Keys",
      "Rate limiting generoso",
      "SDKs para JavaScript e Python",
    ],
    imagem:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    titulo: "Modo Offline Melhorado",
    categoria: "features",
    data: "25 de Outubro, 2025",
    tipo: "melhoria",
    descricao:
      "Trabalhe sem conexão e sincronize automaticamente quando voltar online.",
    features: [
      "Sincronização automática",
      "Banco de dados local com IndexedDB",
      "Cache inteligente",
      "Indicador de status de conexão",
    ],
    imagem:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
  },
];

const categorias = [
  { id: "todos", label: "Todas as Atualizações" },
  { id: "feature", label: "Novas Funcionalidades" },
  { id: "melhoria", label: "Melhorias" },
  { id: "financeiro", label: "Financeiro" },
  { id: "ia", label: "IA & Automação" },
  { id: "ui", label: "Interface" },
  { id: "developer", label: "Developer" },
];

const getUpdatesFiltered = () => {
  if (selectedCategory.value === "todos") return updates;
  return updates.filter(
    (u) =>
      u.categoria === selectedCategory.value ||
      u.tipo === selectedCategory.value
  );
};

const getTipoColor = (tipo) => {
  const colors = {
    feature:
      "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30",
    melhoria:
      "bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/30",
  };
  return colors[tipo] || colors.feature;
};

const getTipoLabel = (tipo) => {
  return tipo === "feature" ? "✨ Nova Funcionalidade" : "🚀 Melhoria";
};

const getCategoryIcon = (categoria) => {
  const icons = {
    financeiro: "💰",
    ia: "🤖",
    ui: "🎨",
    features: "⚡",
    developer: "👨‍💻",
  };
  return icons[categoria] || "📦";
};

const navigateToApp = () => {
  router.push("/app/clientes");
};
</script>

<template>
  <div class="relative bg-background overflow-hidden min-h-screen">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/25 to-primary/15 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/20 to-secondary/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 4s"
      ></div>

      <!-- Grid -->
      <div
        class="absolute inset-0 opacity-5"
        style="
          background-image: linear-gradient(
              0deg,
              transparent 24%,
              rgba(var(--color-primary)) 25%,
              rgba(var(--color-primary)) 26%,
              transparent 27%,
              transparent 74%,
              rgba(var(--color-primary)) 75%,
              rgba(var(--color-primary)) 76%,
              transparent 77%,
              transparent
            ),
            linear-gradient(
              90deg,
              transparent 24%,
              rgba(var(--color-primary)) 25%,
              rgba(var(--color-primary)) 26%,
              transparent 27%,
              transparent 74%,
              rgba(var(--color-primary)) 75%,
              rgba(var(--color-primary)) 76%,
              transparent 77%,
              transparent
            );
          background-size: 50px 50px;
        "
      ></div>
    </div>

    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10"
      >
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="router.push('/landing')"
        >
          <TechVerseLogo />
          <span
            class="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
          >
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
      <!-- Hero Section -->
      <section class="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto text-center">
          <div
            class="inline-block mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur"
          >
            <p
              class="text-sm font-body text-primary font-semibold flex items-center gap-2"
            >
              <Sparkles class="w-4 h-4" /> Novidades em Desenvolvimento
            </p>
          </div>

          <h1
            class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Atualizações e
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
              >Melhorias</span
            >
          </h1>

          <p
            class="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-body leading-relaxed"
          >
            Fique por dentro de todas as novidades, funcionalidades e melhorias
            que estamos trazendo para o TechVerse
          </p>

          <!-- Filter Categories -->
          <div class="flex flex-wrap gap-3 justify-center mb-12">
            <button
              v-for="cat in categorias"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              :class="[
                'px-4 py-2 rounded-full font-body text-sm font-semibold transition-all duration-300',
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/40'
                  : 'bg-border/30 text-muted-foreground hover:bg-border/50 hover:text-foreground',
              ]"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- Updates Grid -->
      <section class="py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <!-- Timeline vertical -->
          <div class="space-y-6">
            <div
              v-for="(update, index) in getUpdatesFiltered()"
              :key="update.id"
              class="group relative"
            >
              <!-- Timeline line -->
              <div
                v-if="index < getUpdatesFiltered().length - 1"
                class="absolute left-8 top-24 w-1 h-16 bg-gradient-to-b from-primary/50 to-transparent -z-10"
              ></div>

              <div class="flex gap-6 items-start">
                <!-- Timeline dot -->
                <div class="flex flex-col items-center pt-1">
                  <div
                    class="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/50 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300"
                  >
                    <Rocket
                      v-if="update.tipo === 'feature'"
                      class="w-8 h-8 text-primary"
                    />
                    <Zap v-else class="w-8 h-8 text-accent" />
                  </div>
                </div>

                <!-- Content Card -->
                <Card
                  class="flex-1 p-6 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-primary/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 overflow-hidden"
                >
                  <!-- Header with badge -->
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="text-2xl">{{
                          getCategoryIcon(update.categoria)
                        }}</span>
                        <span
                          :class="[
                            'px-3 py-1 rounded-full text-xs font-semibold border',
                            getTipoColor(update.tipo),
                          ]"
                        >
                          {{ getTipoLabel(update.tipo) }}
                        </span>
                      </div>
                      <h3
                        class="font-display text-2xl font-bold text-foreground mb-2"
                      >
                        {{ update.titulo }}
                      </h3>
                      <div
                        class="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Calendar class="w-4 h-4" />
                        {{ update.data }}
                      </div>
                    </div>
                  </div>

                  <p class="text-muted-foreground font-body mb-6">
                    {{ update.descricao }}
                  </p>

                  <!-- Features List -->
                  <div class="mb-6 space-y-2">
                    <div
                      v-for="(feature, i) in update.features"
                      :key="i"
                      class="flex items-start gap-3"
                    >
                      <CheckCircle2
                        class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      />
                      <span class="text-sm text-muted-foreground font-body">{{
                        feature
                      }}</span>
                    </div>
                  </div>

                  <!-- Image Preview -->
                  <div
                    class="mb-6 overflow-hidden rounded-lg h-64 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                  >
                    <img
                      :src="update.imagem"
                      :alt="update.titulo"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onerror="this.style.display='none'"
                    />
                  </div>

                  <!-- CTA Button -->
                  <div class="flex gap-3">
                    <Button
                      @click="navigateToApp"
                      class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/40 text-white border-0 transition-all"
                    >
                      Experimentar Agora
                      <ArrowRight class="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="getUpdatesFiltered().length === 0"
            class="text-center py-20"
          >
            <Star
              class="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"
            />
            <p class="text-muted-foreground font-body text-lg">
              Nenhuma atualização encontrada nesta categoria.
            </p>
          </div>
        </div>
      </section>

      <!-- Roadmap Section -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10"
        ></div>

        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <p
              class="text-sm font-semibold text-primary mb-4 font-body uppercase tracking-wider"
            >
              Próximas Novidades
            </p>
            <h2
              class="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Roadmap
              <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                >2026</span
              >
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Roadmap Item 1 -->
            <Card
              class="p-6 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-primary/50 transition-all"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  <Users class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-display text-xl font-bold text-foreground">
                    Multi-usuário
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Colaboração em tempo real
                  </p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground font-body">
                Sistema completo para equipes trabalharem juntas com permissões
                granulares e controle de acesso.
              </p>
            </Card>

            <!-- Roadmap Item 2 -->
            <Card
              class="p-6 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-accent/50 transition-all"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0"
                >
                  <Sparkles class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 class="font-display text-xl font-bold text-foreground">
                    IA Avançada
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Assistente inteligente 24/7
                  </p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground font-body">
                Chatbot com IA generativa para responder dúvidas sobre
                compatibilidade e recomendações de hardware.
              </p>
            </Card>

            <!-- Roadmap Item 3 -->
            <Card
              class="p-6 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-secondary/50 transition-all"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center flex-shrink-0"
                >
                  <Zap class="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 class="font-display text-xl font-bold text-foreground">
                    Mobile App
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    iOS e Android nativos
                  </p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground font-body">
                Aplicativos móveis com sincronização total e acesso offline
                completo aos dados.
              </p>
            </Card>

            <!-- Roadmap Item 4 -->
            <Card
              class="p-6 bg-gradient-to-br from-background to-background/50 border border-border/50 hover:border-primary/50 transition-all"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  <Star class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-display text-xl font-bold text-foreground">
                    Marketplace
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Extensões e plugins
                  </p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground font-body">
                Ecossistema de plugins que permitem estender funcionalidades do
                TechVerse.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-4xl mx-auto text-center">
          <h2
            class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6"
          >
            Pronto para usar
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
              >TechVerse</span
            >?
          </h2>
          <p
            class="text-xl text-muted-foreground mb-10 font-body max-w-2xl mx-auto"
          >
            Todas essas funcionalidades estão disponíveis gratuitamente. Comece
            agora.
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
    </main>

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
              <TechVerseLogo />
              <span class="font-display text-lg font-bold text-foreground"
                >TechVerse</span
              >
            </div>
            <p class="text-sm text-muted-foreground">
              Gerenciador completo para técnicos autônomos.
            </p>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Produto</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/landing" class="hover:text-primary transition-colors"
                  >Home</a
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
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Empresa</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/noticias" class="hover:text-primary transition-colors"
                  >Notícias</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Contato</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Status</a
                >
              </li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-foreground mb-3 text-sm">Legal</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Privacidade</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Termos</a
                >
              </li>
              <li>
                <a href="/donate" class="hover:text-primary transition-colors"
                  >Contribuir</a
                >
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
</style>

<script setup>
import { Users, Wand2, Blocks } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToApp = () => {
  router.push('/app')
}
</script>

<template>
  <div class="bg-background text-foreground">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div class="container flex h-14 items-center justify-between">
        <div class="mr-4 flex items-center">
          <a class="mr-6 flex items-center space-x-2" href="/">
            <span class="font-bold font-display text-lg">TechVerse</span>
          </a>
        </div>
        <nav class="flex items-center space-x-2">
          <Button @click="goToApp">Acessar App</Button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="h-screen flex items-center justify-center text-center">
        <div class="container">
          <h1 class="text-5xl font-bold font-display tracking-tighter">Seu Gerenciador de TI. Do Cliente ao Kit.</h1>
          <p class="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
            TechVerse é a ferramenta gratuita para técnicos autônomos gerenciarem clientes, inventário e montagens de PC. Tudo em um só lugar.
          </p>
          <div class="mt-6">
            <Button size="lg" @click="goToApp">Comece a Gerenciar Agora</Button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20">
        <div class="container">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold font-display">Sua Bancada de Trabalho Digital</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Feature Card 1 -->
            <Card class="text-center">
              <CardHeader>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users class="h-6 w-6" />
                </div>
                <CardTitle class="mt-4 font-display">Gestão de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Cadastre clientes e mantenha um histórico completo de todos os serviços prestados, de formatações a otimizações.
                </p>
              </CardContent>
            </Card>
            <!-- Feature Card 2 -->
            <Card class="text-center">
              <CardHeader>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wand2 class="h-6 w-6" />
                </div>
                <CardTitle class="mt-4 font-display">Cadastro Inteligente com IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Cole qualquer anúncio de PC (Facebook, WhatsApp) e nossa IA identifica, extrai e pré-cadastra as peças para você.
                </p>
              </CardContent>
            </Card>
            <!-- Feature Card 3 -->
            <Card class="text-center">
              <CardHeader>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Blocks class="h-6 w-6" />
                </div>
                <CardTitle class="mt-4 font-display">Canvas de Montagem</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Use nosso "Workbench" interativo. Arraste peças do seu inventário e monte múltiplos kits com lógica de compatibilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <!-- Monetization Section -->
      <section class="py-20">
        <div class="container">
          <div class="text-center">
             <Card class="max-w-2xl mx-auto border-primary">
                <CardHeader>
                    <CardTitle class="font-display text-3xl">🔥 Promoções Selecionadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <p class="text-muted-foreground">
                    O TechVerse é gratuito. Para manter o app, oferecemos um painel com as melhores promoções de hardware (AliExpress, etc.) com nossos links de afiliado.
                    </p>
                </CardContent>
             </Card>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t">
      <div class="container flex items-center justify-center py-6">
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} TechVerse. Desenvolvido por HugoBl4ck.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Applying 0px border-radius to shadcn-vue components */
:deep() {
  .rounded-md, .rounded-full, .rounded-lg {
    border-radius: 0px;
  }
}
</style>

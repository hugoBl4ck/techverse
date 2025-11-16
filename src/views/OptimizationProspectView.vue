<script setup>
import { ref } from 'vue'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "vue-router"
import TechVerseLogo from "@/components/TechVerseLogo.vue"

const router = useRouter()

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

// WhatsApp submission
const submitToWhatsApp = () => {
  const whatsappNumber = '+5577998267548'
  const message = `Olá! Gostaria de solicitar uma análise de otimização do meu PC.

Nome: ${form.value.name}
Email: ${form.value.email}
Telefone: ${form.value.phone}
Mensagem: ${form.value.message}

Anexei os prints do HWiNFO64 conforme o tutorial.`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/landing')">
          <TechVerseLogo />
          <span class="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            TechVerse
          </span>
        </div>
        <div class="flex items-center gap-3">
          <Button @click="router.push('/login')" variant="outline" class="font-body border border-primary/30 text-primary hover:bg-primary/5">
            Login
          </Button>
          <Button @click="router.push('/app/clientes')" class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white border-0">
            Acessar App
          </Button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-12">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h1 class="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Solicitar Análise de
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Otimização</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra como otimizar seu PC para o máximo desempenho. Envie seus dados via HWiNFO64 e receba uma análise personalizada.
        </p>
      </section>

      <!-- Tutorial Section -->
      <section class="mb-12">
        <Card class="mb-8">
          <CardHeader>
            <CardTitle class="text-2xl">Como Enviar os Dados Corretamente</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">1. Baixe o HWiNFO64</h3>
                <p class="text-muted-foreground mb-2">
                  Acesse o site oficial <a href="https://www.hwinfo.com/download/" target="_blank" class="text-primary hover:underline">hwinfo.com/download</a> e baixe a versão gratuita.
                </p>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">2. Execute o Programa</h3>
                <p class="text-muted-foreground mb-2">
                  Abra o HWiNFO64 como administrador. Na tela inicial, clique em "Run" para iniciar o monitoramento.
                </p>
                <img src="/hwinfo-start.png" alt="Tela inicial do HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">3. Verifique a Frequência do Processador</h3>
                <p class="text-muted-foreground mb-2">
                  Na seção "CPU" ou "Processor", localize "Core Clock" ou "CPU Clock". Tire print desta área mostrando a frequência atual.
                </p>
                <img src="/hwinfo-cpu.png" alt="Frequência do processador no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">4. Verifique se o Resize BAR está Ativo</h3>
                <p class="text-muted-foreground mb-2">
                  Procure por "Resizable BAR" ou "ReBAR" na seção de GPU/Placa de Vídeo. Deve mostrar "Enabled" ou "Supported".
                </p>
                <img src="/hwinfo-resize-bar.png" alt="Status do Resize BAR no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">5. Verifique a Frequência da Memória e XMP</h3>
                <p class="text-muted-foreground mb-2">
                  Na seção "Memory" ou "RAM", veja "DRAM Frequency" e se o XMP está ativo (XMP Profile).
                </p>
                <img src="/hwinfo-memory-xmp.png" alt="Frequência da memória e XMP no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">6. Tire os Prints e Envie</h3>
                <p class="text-muted-foreground">
                  Tire prints das áreas mencionadas e preencha o formulário abaixo. Os prints serão enviados diretamente para meu WhatsApp junto com seus dados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Registration Form -->
      <section>
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">Cadastro para Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitToWhatsApp" class="space-y-6">
              <div>
                <Label for="name">Nome Completo</Label>
                <Input id="name" v-model="form.name" required />
              </div>

              <div>
                <Label for="email">Email</Label>
                <Input id="email" type="email" v-model="form.email" required />
              </div>

              <div>
                <Label for="phone">Telefone</Label>
                <Input id="phone" v-model="form.phone" required />
              </div>

              <div>
                <Label for="message">Mensagem Adicional (opcional)</Label>
                <Textarea id="message" v-model="form.message" placeholder="Descreva qualquer problema específico ou expectativa..." />
              </div>

              <div class="text-sm text-muted-foreground">
                <p>Ao enviar, você será redirecionado para o WhatsApp com seus dados. Anexe os prints do HWiNFO64 na conversa.</p>
              </div>

              <Button type="submit" class="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                Enviar para WhatsApp
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border/30 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm py-8 px-4 mt-12">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} TechVerse. Desenvolvido com ❤️ por HugoBl4ck.
        </p>
      </div>
    </footer>
  </div>
</template>
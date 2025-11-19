<script setup>
import { ref } from 'vue'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "vue-router"
import TechVerseLogoSvg from "@/components/TechVerseLogoSvg.vue"
import { auth, db } from '@/firebase/config.js'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'vue-sonner'
import OptimizationSidebar from '@/components/OptimizationSidebar.vue'

// Import HWiNFO images
import hwinfoStart from '@/assets/images/hwinfo-tela-inicial.png'
import hwinfoCpu from '@/assets/images/hwinfo-cpu-frequencia.png'
import hwinfoResizeBar from '@/assets/images/hwinfo-resize-bar.png'
import hwinfoMemoryXmp from '@/assets/images/hwinfo-memoria-xmp.png'

// Gallery videos
const galleryVideos = [
  {
    title: 'PC Gamer RGB Montado',
    src: '/videos/otimizacaovideo1.webm'
  },
  {
    title: 'Workstation Profissional',
    src: '/videos/otimizacaovideo2.webm'
  },
  {
    title: 'PC Compacto High-End',
    src: '/videos/otimizacaovideo3.webm'
  }
]

// Video controls
const videoRefs = ref([])

const onVideoPlay = (index) => {
  // Pause other videos when one starts playing
  videoRefs.value.forEach((video, i) => {
    if (i !== index && video) {
      video.pause()
    }
  })
}

const onVideoPause = (index) => {
  // Video paused
}

const router = useRouter()

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  message: ''
})

const isRegistering = ref(false)
const isLoading = ref(false)

// Registration functions
const registerWithEmail = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    toast.error('Preencha todos os campos obrigatórios')
    return
  }

  isLoading.value = true
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    const user = userCredential.user

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      nome: form.value.name,
      email: form.value.email,
      telefone: form.value.phone,
      tipo: 'otimizacao', // Mark as optimization client
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    })

    // Create store document for the user
    const storeId = `store_${user.uid.slice(0, 8)}`
    await setDoc(doc(db, 'stores', storeId), {
      id: storeId,
      name: `${form.value.name} - Otimizações`,
      email: form.value.email,
      ownerId: user.uid,
      ownerName: form.value.name,
      tipo: 'otimizacao',
      createdAt: serverTimestamp()
    })

    // Update user with storeId
    await setDoc(doc(db, 'users', user.uid), {
      storeId: storeId
    }, { merge: true })

    toast.success('Conta criada com sucesso! Redirecionando...')

    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

  } catch (error) {
    console.error('Erro no registro:', error)
    if (error.code === 'auth/email-already-in-use') {
      toast.error('Este email já está cadastrado')
    } else if (error.code === 'auth/weak-password') {
      toast.error('A senha deve ter pelo menos 6 caracteres')
    } else {
      toast.error('Erro ao criar conta. Tente novamente.')
    }
  } finally {
    isLoading.value = false
  }
}

const registerWithGoogle = async () => {
  if (!form.value.name) {
    toast.error('Preencha o nome antes de continuar')
    return
  }

  isLoading.value = true
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      nome: form.value.name,
      email: user.email,
      telefone: form.value.phone,
      tipo: 'otimizacao', // Mark as optimization client
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    })

    // Create store document for the user
    const storeId = `store_${user.uid.slice(0, 8)}`
    await setDoc(doc(db, 'stores', storeId), {
      id: storeId,
      name: `${form.value.name} - Otimizações`,
      email: user.email,
      ownerId: user.uid,
      ownerName: form.value.name,
      tipo: 'otimizacao',
      createdAt: serverTimestamp()
    })

    // Update user with storeId
    await setDoc(doc(db, 'users', user.uid), {
      storeId: storeId
    }, { merge: true })

    toast.success('Conta criada com sucesso! Redirecionando...')

    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

  } catch (error) {
    console.error('Erro no registro com Google:', error)
    toast.error('Erro ao criar conta com Google. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

// WhatsApp submission (fallback)
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
        <div class="flex items-center cursor-pointer" @click="router.push('/landing')">
          <TechVerseLogoSvg />
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
                <img :src="hwinfoStart" alt="Tela inicial do HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">3. Verifique a Frequência do Processador</h3>
                <p class="text-muted-foreground mb-2">
                  Na seção "CPU" ou "Processor", localize "Core Clock" ou "CPU Clock". Tire print desta área mostrando a frequência atual.
                </p>
                <img :src="hwinfoCpu" alt="Frequência do processador no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">4. Verifique se o Resize BAR está Ativo</h3>
                <p class="text-muted-foreground mb-2">
                  Procure por "Resizable BAR" ou "ReBAR" na seção de GPU/Placa de Vídeo. Deve mostrar "Enabled" ou "Supported".
                </p>
                <img :src="hwinfoResizeBar" alt="Status do Resize BAR no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">5. Verifique a Frequência da Memória e XMP</h3>
                <p class="text-muted-foreground mb-2">
                  Na seção "Memory" ou "RAM", veja "DRAM Frequency" e se o XMP está ativo (XMP Profile).
                </p>
                <img :src="hwinfoMemoryXmp" alt="Frequência da memória e XMP no HWiNFO64" class="max-w-full h-auto rounded-lg shadow-lg" />
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

        <!-- FAQ Section -->
        <Card class="mb-8">
          <CardHeader>
            <CardTitle class="text-2xl">Perguntas Frequentes sobre Otimização</CardTitle>
            <p class="text-muted-foreground">Entenda melhor os conceitos técnicos envolvidos na otimização do seu PC</p>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">O que é XMP (Extreme Memory Profile)?</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    XMP é um perfil de overclocking criado pela Intel que permite que memórias RAM funcionem em suas frequências nominais de fábrica. Sem o XMP ativado, as memórias rodam em velocidades padrão mais baixas (geralmente 2133MHz ou 2400MHz), desperdiçando o potencial pago.
                  </p>
                  <p class="mb-3">
                    <strong>Por que é importante?</strong> Memórias que custam R$ 800 podem estar rodando a apenas 2400MHz em vez dos 3600MHz ou 4000MHz que você pagou. Isso afeta diretamente o desempenho em jogos, edição de vídeo e aplicações pesadas.
                  </p>
                  <p>
                    <strong>Riscos:</strong> Mínimos quando usado com memórias compatíveis. Sempre verifique a compatibilidade com sua placa-mãe antes de ativar.
                  </p>
                </div>
              </details>

              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">O que é Resize BAR (ReBAR)?</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    Resize BAR (Resizable BAR) é uma tecnologia que permite acesso direto à memória de vídeo completa da GPU, eliminando a limitação de 256MB que existia anteriormente. Com ReBAR ativo, jogos e aplicações podem acessar toda a VRAM disponível (4GB, 8GB, 12GB, etc.).
                  </p>
                  <p class="mb-3">
                    <strong>Por que é importante?</strong> GPUs modernas têm enormes quantidades de memória dedicada. Sem ReBAR, mesmo uma RTX 3080 com 10GB de VRAM fica limitada a usar apenas 256MB por vez, causando engasgos e quedas de FPS em jogos modernos.
                  </p>
                  <p>
                    <strong>Compatibilidade:</strong> Requer placa-mãe com chipset AMD B550/X570 ou Intel Z590/Z690+ com BIOS atualizada, e GPU AMD Radeon RX 6000+ ou NVIDIA RTX 30+.
                  </p>
                </div>
              </details>

              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">Por que verificar a temperatura é crucial?</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    A temperatura afeta diretamente a performance, estabilidade e vida útil dos componentes. Processadores e GPUs reduzem automaticamente sua frequência quando aquecem demais (thermal throttling), causando quedas de performance inexplicáveis.
                  </p>
                  <p class="mb-3">
                    <strong>Temperaturas ideais:</strong>
                  </p>
                  <ul class="list-disc list-inside mb-3 space-y-1">
                    <li><strong>CPU:</strong> Até 80°C em carga máxima (85°C aceitável)</li>
                    <li><strong>GPU:</strong> Até 85°C em jogos (90°C aceitável)</li>
                    <li><strong>SSD:</strong> Até 70°C (podem throttling acima disso)</li>
                  </ul>
                  <p class="mb-3">
                    <strong>Sintomas de superaquecimento:</strong> Travamentos, reinicializações, performance instável, ventoinhas em velocidade máxima constante.
                  </p>
                  <p>
                    <strong>Soluções comuns:</strong> Limpeza de poeira, pasta térmica nova, melhor fluxo de ar no gabinete, ajustes de curva de ventoinhas na BIOS.
                  </p>
                </div>
              </details>

              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">O que é Precision Boost Overdrive (PBO)?</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    PBO é uma tecnologia da AMD que permite overclock automático inteligente do processador Ryzen. O processador aumenta dinamicamente sua frequência e tensão baseado na carga de trabalho, temperatura e consumo de energia disponível.
                  </p>
                  <p class="mb-3">
                    <strong>Por que é importante?</strong> Processadores Ryzen modernos (3000/5000 series) podem ganhar 10-25% de performance em aplicações single-threaded e até 15% em jogos quando configurados corretamente.
                  </p>
                  <p class="mb-3">
                    <strong>Configuração:</strong> Requer ajustes cuidadosos na BIOS. Níveis muito agressivos podem causar instabilidade ou superaquecimento.
                  </p>
                  <p>
                    <strong>Compatibilidade:</strong> Apenas processadores AMD Ryzen 3000 series ou superiores com placa-mãe compatível (B450/B550/X570 com BIOS atualizada).
                  </p>
                </div>
              </details>

              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">Secure Boot e jogos modernos</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    Secure Boot é uma feature de segurança que verifica a integridade do sistema operacional durante o boot. Muitos jogos modernos (especialmente da Microsoft Store e alguns títulos AAA) exigem Secure Boot ativado para funcionar.
                  </p>
                  <p class="mb-3">
                    <strong>Por que é importante?</strong> Jogos como Forza Horizon, Gears 5, e títulos recentes podem simplesmente não iniciar sem Secure Boot. É especialmente comum em PCs que foram migrados de Windows antigo ou Linux.
                  </p>
                  <p class="mb-3">
                    <strong>Como ativar:</strong> Entre na BIOS (DEL/F2/F10), procure por "Secure Boot" na seção de segurança e ative. Pode ser necessário limpar chaves antigas primeiro.
                  </p>
                  <p>
                    <strong>Nota:</strong> Secure Boot é diferente de TPM. Ambos podem ser necessários para jogos modernos, mas são features separadas.
                  </p>
                </div>
              </details>

              <details class="group">
                <summary class="flex justify-between items-center cursor-pointer py-4 border-b border-border/50 group-open:border-primary/50 transition-colors">
                  <h3 class="text-lg font-semibold text-foreground">Diferença entre overclock e otimização</h3>
                  <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="pt-4 pb-6 text-muted-foreground">
                  <p class="mb-3">
                    <strong>Overclock:</strong> Forçar componentes além das especificações de fábrica (ex: CPU de 3.8GHz para 4.5GHz). Pode causar instabilidade, superaquecimento e void de garantia.
                  </p>
                  <p class="mb-3">
                    <strong>Otimização:</strong> Configurar componentes para funcionarem em suas especificações nominais de fábrica (ex: RAM em 3600MHz com XMP, PBO ativo). Geralmente seguro e recomendado.
                  </p>
                  <p class="mb-3">
                    <strong>Minha abordagem:</strong> Priorizo sempre otimização segura antes de qualquer overclock. Overclock só é recomendado para usuários experientes com resfriamento adequado.
                  </p>
                  <p>
                    <strong>Garantia:</strong> Otimizações geralmente não voidam garantia. Overclock sempre voida, mesmo que seja "leve".
                  </p>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Registration Form -->
      <section>
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">Cadastro para Análise de Otimização</CardTitle>
            <p class="text-muted-foreground">Crie sua conta para acessar o painel e acompanhar sua análise</p>
          </CardHeader>
          <CardContent>
            <!-- Registration Method Toggle -->
            <div class="flex gap-2 mb-6">
              <Button
                @click="isRegistering = true"
                :variant="isRegistering ? 'default' : 'outline'"
                class="flex-1"
              >
                Criar Conta
              </Button>
              <Button
                @click="isRegistering = false"
                :variant="!isRegistering ? 'default' : 'outline'"
                class="flex-1"
              >
                Apenas WhatsApp
              </Button>
            </div>

            <form v-if="isRegistering" @submit.prevent="registerWithEmail" class="space-y-6">
              <div>
                <Label for="name">Nome Completo *</Label>
                <Input id="name" v-model="form.name" required />
              </div>

              <div>
                <Label for="email">Email *</Label>
                <Input id="email" type="email" v-model="form.email" required />
              </div>

              <div>
                <Label for="password">Senha *</Label>
                <Input id="password" type="password" v-model="form.password" required minlength="6" />
              </div>

              <div>
                <Label for="phone">Telefone</Label>
                <Input id="phone" v-model="form.phone" />
              </div>

              <div>
                <Label for="message">Mensagem Adicional (opcional)</Label>
                <Textarea id="message" v-model="form.message" placeholder="Descreva qualquer problema específico ou expectativa..." />
              </div>

              <div class="space-y-3">
                <Button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                  <span v-if="isLoading">Criando conta...</span>
                  <span v-else>Criar Conta e Continuar</span>
                </Button>

                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t" />
                  </div>
                  <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-background px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                <Button @click="registerWithGoogle" :disabled="isLoading" variant="outline" class="w-full">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </Button>
              </div>

              <div class="text-sm text-muted-foreground">
                <p>Ao criar conta, você terá acesso ao painel TechVerse para acompanhar sua análise de otimização e outros serviços.</p>
              </div>
            </form>

            <div v-else class="space-y-6">
              <div class="text-center text-muted-foreground">
                <p class="mb-4">Se preferir não criar conta, podemos conversar diretamente pelo WhatsApp.</p>
                <p class="text-sm">Preencha os dados abaixo e você será redirecionado para o WhatsApp com suas informações.</p>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Galeria de PCs Montados -->
      <section class="mb-12">
        <Card>
          <CardHeader>
            <CardTitle class="text-2xl">Galeria de PCs Montados</CardTitle>
            <p class="text-muted-foreground">Veja exemplos de montagens realizadas e inspire-se para seu próximo PC</p>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(video, index) in galleryVideos"
                :key="index"
                class="aspect-video bg-muted rounded-lg overflow-hidden"
              >
                <video
                  :ref="el => videoRefs[index] = el"
                  :src="video.src"
                  :title="video.title"
                  class="w-full h-full object-cover rounded-lg"
                  preload="metadata"
                  controls
                  playsinline
                  @play="onVideoPlay(index)"
                  @pause="onVideoPause(index)"
                >
                  <p class="text-center text-muted-foreground p-4">
                    Vídeo não suportado pelo seu navegador
                  </p>
                </video>
              </div>
            </div>

            <div class="mt-6 text-center">
              <p class="text-sm text-muted-foreground mb-4">
                Gostou dos exemplos? Entre em contato para montar o seu PC personalizado!
              </p>
              <Button @click="submitToWhatsApp" variant="outline" class="bg-accent/10 hover:bg-accent/20">
                Solicitar Montagem Personalizada
              </Button>
            </div>
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

    <OptimizationSidebar />
  </div>
</template>
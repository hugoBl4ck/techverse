<script setup>
import { ref, onMounted } from 'vue'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
const optimizationStore = useOptimizationStore()

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

onMounted(() => {
  const { formData, pendingUploads: pending } = optimizationStore.restoreState()
  if (formData.name || formData.email) {
    form.value = { ...form.value, ...formData }
    if (formData.message) form.value.message = formData.message
  }
  
  if (pending && pending.length > 0) {
    toast.info(`Você tem ${pending.length} arquivo(s) pronto(s) para envio. Selecione-os novamente para confirmar.`)
  }
})

const handleLoginRedirect = () => {
  optimizationStore.saveState(form.value)
  router.push({ path: '/login', query: { redirect: '/otimizacao' } })
}

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
      window.location.reload()
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
      window.location.reload()
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

// Optimization Upload Logic
import { useCurrentStore } from '@/composables/useCurrentStore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'

const { currentUser } = useCurrentStore()
const uploadingFiles = ref([])

const handleOptimizationUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  if (!currentUser.value) {
    toast.info('Faça login para enviar seus arquivos. Seus dados serão salvos.')
    optimizationStore.saveState(form.value)
    optimizationStore.setPendingUploads(files)
    router.push({ path: '/login', query: { redirect: '/otimizacao' } })
    return
  }

  for (const file of files) {
    // Validate
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast.error(`Arquivo inválido: ${file.name} (Apenas imagens < 5MB)`)
      continue
    }

    const fileState = ref({ name: file.name, status: 'uploading' })
    uploadingFiles.value.push(fileState.value)

    try {
      const fileName = `optimization-uploads/${currentUser.value.uid}/${Date.now()}_${file.name}`
      const fileRef = storageRef(storage, fileName)
      const snapshot = await uploadBytes(fileRef, file)
      const downloadUrl = await getDownloadURL(snapshot.ref)

      // Save reference to Firestore
      await addDoc(collection(db, 'optimization_uploads'), {
        userId: currentUser.value.uid,
        userName: currentUser.value.nome || currentUser.value.email,
        imageUrl: downloadUrl,
        fileName: file.name,
        createdAt: serverTimestamp()
      })

      fileState.value.status = 'success'
      toast.success(`Upload concluído: ${file.name}`)
    } catch (error) {
      console.error('Upload error:', error)
      fileState.value.status = 'error'
      toast.error(`Erro ao enviar: ${file.name}`)
    }
  }

  // Clear input
  event.target.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center cursor-pointer" @click="router.push('/landing')">
          <TechVerseLogoSvg />
        </div>
        <div class="flex items-center gap-3">
          <Button @click="handleLoginRedirect" variant="outline"
            class="font-body border border-primary/30 text-primary hover:bg-primary/5">
            Login
          </Button>
          <Button @click="router.push('/app/clientes')"
            class="font-body bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white border-0">
            Acessar App
          </Button>
        </div>
      </div>
    </header>

    <main class="ml-0 lg:ml-80 max-w-[1800px] mx-auto px-4 py-8 lg:py-12">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h1 class="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Solicitar Análise de
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Otimização</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra como otimizar seu PC para o máximo desempenho. Envie seus dados via HWiNFO64 e receba uma análise
          personalizada.
        </p>
      </section>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        <!-- Column 1: Tutorial -->
        <div class="space-y-6">
          <Card class="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader class="bg-muted/30 pb-4">
              <CardTitle class="text-xl flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Tutorial de Envio
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-6">
              <div class="space-y-8">
                <div class="relative pl-4 border-l-2 border-primary/20">
                  <h3 class="text-base font-semibold mb-1">Baixe e Execute</h3>
                  <p class="text-sm text-muted-foreground mb-2">
                    Baixe o <a href="https://www.hwinfo.com/download/" target="_blank"
                      class="text-primary hover:underline">HWiNFO64</a> e execute como administrador.
                  </p>
                  <img :src="hwinfoStart" alt="Tela inicial"
                    class="w-full rounded-md border border-border/50 shadow-sm" />
                </div>

                <div class="relative pl-4 border-l-2 border-primary/20">
                  <h3 class="text-base font-semibold mb-1">Processador (CPU)</h3>
                  <p class="text-sm text-muted-foreground mb-2">
                    Localize "Core Clock" ou "CPU Clock".
                  </p>
                  <img :src="hwinfoCpu" alt="CPU Clock" class="w-full rounded-md border border-border/50 shadow-sm" />
                </div>

                <div class="relative pl-4 border-l-2 border-primary/20">
                  <h3 class="text-base font-semibold mb-1">Placa de Vídeo (GPU)</h3>
                  <p class="text-sm text-muted-foreground mb-2">
                    Verifique se "Resizable BAR" está Enabled.
                  </p>
                  <img :src="hwinfoResizeBar" alt="Resize BAR"
                    class="w-full rounded-md border border-border/50 shadow-sm" />
                </div>

                <div class="relative pl-4 border-l-2 border-primary/20">
                  <h3 class="text-base font-semibold mb-1">Memória RAM</h3>
                  <p class="text-sm text-muted-foreground mb-2">
                    Confira "DRAM Frequency" e XMP Profile.
                  </p>
                  <img :src="hwinfoMemoryXmp" alt="Memória XMP"
                    class="w-full rounded-md border border-border/50 shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Column 2: FAQ -->
        <div class="space-y-6">
          <Card class="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full">
            <CardHeader class="bg-muted/30 pb-4">
              <CardTitle class="text-xl flex items-center gap-2">
                <span
                  class="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Dúvidas Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-6">
              <div class="space-y-4">
                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">O que é XMP?</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <p>Perfil de overclock automático da Intel para memórias RAM funcionarem na velocidade anunciada
                      (ex: 3200MHz) ao invés do padrão (2133MHz).</p>
                  </div>
                </details>

                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">O que é Resize BAR?</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <p>Permite que o processador acesse toda a memória da placa de vídeo de uma vez, melhorando o
                      desempenho em jogos modernos.</p>
                  </div>
                </details>

                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">Temperaturas Ideais</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <ul class="list-disc list-inside space-y-1">
                      <li>CPU: Até 80°C (Jogando)</li>
                      <li>GPU: Até 85°C (Hotspot)</li>
                    </ul>
                    <p class="mt-2">Acima disso pode ocorrer perda de desempenho (throttling).</p>
                  </div>
                </details>

                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">O que é PBO (AMD)?</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <p>Precision Boost Overdrive: Tecnologia da AMD que extrai o máximo desempenho do processador de
                      forma segura, ajustando voltagens e frequências automaticamente.</p>
                  </div>
                </details>

                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">Secure Boot</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <p>Recurso de segurança exigido por jogos como Valorant e FIFA 23. Garante que o sistema não foi
                      modificado por malwares durante a inicialização.</p>
                  </div>
                </details>

                <details class="group bg-muted/20 rounded-lg border border-border/40 overflow-hidden">
                  <summary
                    class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted/40 transition-colors">
                    <h3 class="text-sm font-semibold text-foreground">Overclock vs Otimização</h3>
                    <span class="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-muted-foreground border-t border-border/40 pt-3">
                    <p><strong>Otimização:</strong> Ajuste fino para o hardware rodar no seu melhor potencial de fábrica
                      (Seguro).</p>
                    <p class="mt-1"><strong>Overclock:</strong> Forçar o hardware além do limite de fábrica (Risco de
                      instabilidade).</p>
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Column 3: Registration Form (Sticky) -->
        <div class="lg:sticky lg:top-24 space-y-6">
          <Card
            class="border-primary/20 shadow-xl shadow-primary/5 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
            <!-- Decorative gradient line -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

            <CardHeader class="pb-4">
              <CardTitle class="text-2xl flex items-center gap-2 text-primary">
                <span
                  class="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Solicitar Análise
              </CardTitle>
              <p class="text-sm text-muted-foreground">Preencha para receber sua análise personalizada.</p>
            </CardHeader>
            <CardContent>
              <!-- Registration Method Toggle -->
              <div class="flex p-1 bg-muted rounded-lg mb-6">
                <button @click="isRegistering = true"
                  class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
                  :class="isRegistering ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'">
                  Criar Conta
                </button>
                <button @click="isRegistering = false"
                  class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
                  :class="!isRegistering ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'">
                  WhatsApp
                </button>
              </div>

              <form v-if="isRegistering" @submit.prevent="registerWithEmail" class="space-y-4">
                <div class="space-y-2">
                  <Label for="name">Nome Completo</Label>
                  <Input id="name" v-model="form.name" required class="bg-background/50" />
                </div>

                <div class="space-y-2">
                  <Label for="email">Email</Label>
                  <Input id="email" type="email" v-model="form.email" required class="bg-background/50" />
                </div>

                <div class="space-y-2">
                  <Label for="password">Senha</Label>
                  <Input id="password" type="password" v-model="form.password" required minlength="6"
                    class="bg-background/50" />
                </div>

                <div class="space-y-2">
                  <Label for="phone">Telefone</Label>
                  <Input id="phone" v-model="form.phone" class="bg-background/50" />
                </div>

                <div class="space-y-2">
                  <Label for="message">Mensagem (Opcional)</Label>
                  <Textarea id="message" v-model="form.message" placeholder="Dúvidas específicas..."
                    class="bg-background/50 min-h-[80px]" />
                </div>

                <div class="space-y-2">
                  <Label for="upload">Imagens HWiNFO (Opcional)</Label>
                  <Input id="upload" type="file" multiple accept="image/*" @change="handleOptimizationUpload" class="bg-background/50" />
                  <p class="text-xs text-muted-foreground">Envie prints das telas do HWiNFO para análise.</p>
                </div>

                <Button type="submit" :disabled="isLoading"
                  class="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  <span v-if="isLoading">Criando conta...</span>
                  <span v-else>Criar Conta e Continuar</span>
                </Button>

                <div class="relative py-2">
                  <div class="absolute inset-0 flex items-center"><span class="w-full border-t border-border/50"></span>
                  </div>
                  <div class="relative flex justify-center text-xs uppercase"><span
                      class="bg-background px-2 text-muted-foreground">Ou</span></div>
                </div>

                <Button @click="registerWithGoogle" :disabled="isLoading" variant="outline"
                  class="w-full hover:bg-muted/50">
                  <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
              </form>

              <div v-else class="space-y-4">
                <div class="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p class="text-sm text-muted-foreground">Preencha os dados e você será redirecionado para o WhatsApp
                    já com a mensagem pronta.</p>
                </div>

                <form @submit.prevent="submitToWhatsApp" class="space-y-4">
                  <div class="space-y-2">
                    <Label for="name">Nome Completo</Label>
                    <Input id="name" v-model="form.name" required class="bg-background/50" />
                  </div>

                  <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input id="email" type="email" v-model="form.email" required class="bg-background/50" />
                  </div>

                  <div class="space-y-2">
                    <Label for="phone">Telefone</Label>
                    <Input id="phone" v-model="form.phone" required class="bg-background/50" />
                  </div>

                  <div class="space-y-2">
                    <Label for="message">Mensagem (Opcional)</Label>
                    <Textarea id="message" v-model="form.message" placeholder="Dúvidas específicas..."
                      class="bg-background/50 min-h-[80px]" />
                  </div>

                  <Button type="submit"
                    class="w-full bg-[#25D366] hover:bg-[#128C7E] text-white hover:shadow-lg transition-all duration-300">
                    Enviar para WhatsApp
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <!-- Gallery Section (Full Width) -->
      <section class="mt-16">
        <Card class="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle class="text-2xl">Galeria de PCs Montados</CardTitle>
            <p class="text-muted-foreground">Veja exemplos de montagens realizadas e inspire-se para seu próximo PC</p>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(video, index) in galleryVideos" :key="index"
                class="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                <video :ref="el => videoRefs[index] = el" :src="video.src" :title="video.title"
                  class="w-full h-full object-cover rounded-lg" preload="metadata" controls playsinline
                  @play="onVideoPlay(index)" @pause="onVideoPause(index)">
                  <p class="text-center text-muted-foreground p-4">
                    Vídeo não suportado pelo seu navegador
                  </p>
                </video>
              </div>
            </div>

            <div class="mt-8 text-center">
              <p class="text-sm text-muted-foreground mb-4">
                Gostou dos exemplos? Entre em contato para montar o seu PC personalizado!
              </p>
              <Button @click="submitToWhatsApp" variant="outline"
                class="bg-accent/10 hover:bg-accent/20 border-accent/20 text-accent-foreground">
                Solicitar Montagem Personalizada
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-border/30 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm py-8 px-4 mt-12">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-muted-foreground">
          © {{ new Date().getFullYear() }} TechVerse. Desenvolvido com ❤️ por HugoBl4ck.
        </p>
      </div>
    </footer>

    <OptimizationSidebar />
  </div>
</template>
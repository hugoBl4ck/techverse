<template>
    <Transition name="slide-up">
        <div v-if="showInstallPrompt"
            class="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <!-- Ícone e Mensagem -->
                    <div class="flex items-center gap-3 flex-1">
                        <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Download class="w-6 h-6" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-lg">Instalar TechVerse</h3>
                            <p class="text-sm text-white/90">
                                Adicione à tela inicial para acesso rápido e funcione offline!
                            </p>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex items-center gap-2">
                        <button @click="installPWA"
                            class="px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Instalar
                        </button>
                        <button @click="dismissPrompt"
                            class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
                            Agora não
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'

const showInstallPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
    // Verifica se já foi instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ PWA já está instalado')
        return
    }

    // Verifica se o usuário já dispensou o prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
        const dismissedDate = new Date(dismissed)
        const now = new Date()
        const daysSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60 * 24)

        // Mostra novamente após 7 dias
        if (daysSinceDismissed < 7) {
            return
        }
    }

    // Escuta o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('📱 PWA pode ser instalado!')
        e.preventDefault()
        deferredPrompt.value = e

        // Mostra o banner após 3 segundos
        setTimeout(() => {
            showInstallPrompt.value = true
        }, 3000)
    })

    // Escuta quando o app é instalado
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA foi instalado!')
        showInstallPrompt.value = false
        deferredPrompt.value = null
    })
})

const installPWA = async () => {
    if (!deferredPrompt.value) {
        console.warn('⚠️ Prompt de instalação não disponível')

        // Mostra instruções manuais
        showManualInstructions()
        return
    }

    // Mostra o prompt de instalação
    deferredPrompt.value.prompt()

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.value.userChoice
    console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`)

    if (outcome === 'accepted') {
        showInstallPrompt.value = false
    }

    deferredPrompt.value = null
}

const dismissPrompt = () => {
    showInstallPrompt.value = false
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
}

const showManualInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    let message = 'Para instalar o TechVerse:\n\n'

    if (isIOS) {
        message += '1. Toque no botão de compartilhar (□↑)\n'
        message += '2. Role para baixo e toque em "Adicionar à Tela de Início"\n'
        message += '3. Toque em "Adicionar"'
    } else if (isAndroid) {
        message += '1. Toque no menu (⋮) no canto superior\n'
        message += '2. Selecione "Adicionar à tela inicial"\n'
        message += '3. Confirme a instalação'
    } else {
        message += '1. Clique no ícone de instalação (⊕) na barra de endereço\n'
        message += '2. Clique em "Instalar"\n'
        message += '3. O app abrirá em uma janela separada'
    }

    alert(message)
    showInstallPrompt.value = false
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>

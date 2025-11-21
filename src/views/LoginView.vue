<template>
  <div class="relative bg-background overflow-hidden min-h-screen flex flex-col">
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
    <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-sm flex items-center justify-center">
            <span class="font-display text-lg font-bold text-white">T</span>
          </div>
          <span class="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            TechVerse
          </span>
        </router-link>
        <router-link to="/" class="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
          Voltar
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md">
        <!-- Form Card -->
        <div class="bg-gradient-to-br from-background to-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-2xl shadow-primary/10">
          <!-- Header -->
          <div class="text-center mb-8">
            <p class="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur text-sm font-body text-primary font-semibold mb-6">
              🔐 Acesso Seguro
            </p>
            <h1 class="font-display text-3xl font-bold text-foreground mb-2">
              {{ isLoginMode ? 'Bem-vindo' : 'Criar Conta' }}
            </h1>
            <p class="text-sm text-muted-foreground font-body">
              {{ isLoginMode ? 'Faça login para acessar sua bancada de trabalho' : 'Junte-se a técnicos que já usam TechVerse' }}
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-foreground mb-2 font-body">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="seu@email.com"
                class="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-foreground mb-2 font-body">Senha</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
              />
            </div>

            <!-- Extra Fields for Signup -->
            <div v-if="!isLoginMode" class="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div>
                <label for="storeName" class="block text-sm font-semibold text-foreground mb-2 font-body">Nome da Loja</label>
                <input
                  id="storeName"
                  v-model="storeName"
                  type="text"
                  required
                  placeholder="Minha Assistência Técnica"
                  class="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                />
              </div>
              <div>
                <label for="avatarUrl" class="block text-sm font-semibold text-foreground mb-2 font-body">Avatar URL (Opcional)</label>
                <input
                  id="avatarUrl"
                  v-model="avatarUrl"
                  type="url"
                  placeholder="https://exemplo.com/avatar.jpg"
                  class="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full px-4 py-3 h-12 font-body font-semibold text-white bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/40 border-0 rounded-lg transition-all group mt-6"
            >
              {{ isLoginMode ? 'Acessar' : 'Criar Conta' }}
              <span class="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border/30" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-gradient-to-br from-background to-background/50 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <!-- Google Login Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full px-4 py-3 h-12 font-body font-semibold text-foreground bg-background/50 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <!-- Toggle Login/Signup -->
          <div class="mt-6 text-center text-sm font-body">
            <p class="text-muted-foreground">
              {{ isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
              <a 
                @click.prevent="isLoginMode = !isLoginMode" 
                href="#" 
                class="font-semibold text-primary hover:text-accent transition-colors"
              >
                {{ isLoginMode ? 'Criar aqui' : 'Faça login' }}
              </a>
            </p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 text-center text-xs text-muted-foreground font-body">
          <p>TechVerse é <span class="text-foreground font-semibold">100% gratuito</span> para técnicos autônomos</p>
        </div>
      </div>
    </main>

    <footer class="relative z-10 border-t border-border/30 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-muted-foreground font-body">
          © {{ new Date().getFullYear() }} <span class="text-foreground font-semibold">TechVerse</span>. 
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">v1.2</span>
        </p>
        <!-- Debug Info -->
        <div v-if="currentUser" class="mt-2 text-xs text-muted-foreground/50 font-mono">
          Debug: {{ currentUser.email }} | Avatar: {{ currentUser.photoURL ? 'Sim' : 'Não' }} | Loja: {{ currentUser.storeName }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const router = useRouter()
const email = ref('')
const password = ref('')
const storeName = ref('')
const avatarUrl = ref('')
const error = ref(null)
const isLoginMode = ref(true)

const handleSubmit = async () => {
  if (isLoginMode.value) {
    await handleLogin()
  } else {
    await handleSignUp()
  }
}

const handleLogin = async () => {
  error.value = null
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}

const handleSignUp = async () => {
  error.value = null
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    
    // Criar documento do usuário em /users/{uid} com o storeId mapeado
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      storeId: user.uid, // Em multi-tenant, o storeId é igual ao uid
      storeName: storeName.value || 'Minha Loja',
      avatarUrl: avatarUrl.value || '',
      createdAt: new Date(),
    })
    
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}

const handleGoogleLogin = async () => {
  error.value = null
  try {
    const userCredential = await signInWithPopup(auth, new GoogleAuthProvider())
    const user = userCredential.user
    
    // Verificar se o documento do usuário já existe, se não, criar
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)
    
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        storeId: user.uid, // Em multi-tenant, o storeId é igual ao uid
        createdAt: new Date(),
      })
    }
    
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>

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

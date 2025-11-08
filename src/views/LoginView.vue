<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription class="text-center">
          Acesse sua conta para gerenciar sua loja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" v-model="email" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Senha</Label>
            <Input id="password" type="password" v-model="password" />
          </div>
          <Button @click="login" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </Button>
          <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const router = useRouter();
const auth = getAuth();

const login = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = 'Email ou senha inválidos.';
    console.error('Erro de login:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

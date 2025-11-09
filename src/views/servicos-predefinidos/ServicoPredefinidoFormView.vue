'''<script setup>
import { ref } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const router = useRouter();

const nome = ref('');
const descricao = ref('');
const preco = ref(0);
const isLoading = ref(false);

async function handleSubmit() {
  isLoading.value = true;
  try {
    await addDoc(collection(db, 'catalogo_servicos'), {
      nome: nome.value,
      descricao: descricao.value,
      preco: preco.value,
    });
    router.push('/servicos-predefinidos');
  } catch (error) {
    console.error('Erro ao salvar serviço predefinido: ', error);
    alert('Erro ao salvar serviço predefinido. Verifique o console para mais detalhes.');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle>Novo Serviço Predefinido</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="nome">Nome</Label>
            <Input id="nome" v-model="nome" type="text" />
          </div>
          <div class="grid gap-2">
            <Label for="descricao">Descrição</Label>
            <Textarea id="descricao" v-model="descricao" />
          </div>
          <div class="grid gap-2">
            <Label for="preco">Preço</Label>
            <Input id="preco" v-model.number="preco" type="number" />
          </div>
          <Button @click="handleSubmit" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Salvar' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
'''
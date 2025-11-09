<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase/config.js';
import { doc, getDoc } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const route = useRoute();


const client = ref(null);
const isLoading = ref(true);

const fetchClient = async () => {
  const clientId = route.params.id;
  if (!clientId) return;

  isLoading.value = true;
  try {
    const docRef = doc(db, 'clientes', clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      client.value = docSnap.data();
    } else {
      console.error('Cliente não encontrado.');
      // Assuming 'router' is imported and available for redirection
      // If not, this line might need adjustment or removal depending on desired behavior
      // router.push('/clientes');
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
  } finally {
    isLoading.value = false;
  }
};


</script>

<template>
  <div>
    <div v-if="isLoading" class="text-center p-8">
      <p>Carregando...</p>
    </div>
    <Card v-else-if="client">
      <CardHeader>
        <CardTitle>{{ client.nome }}</CardTitle>
        <CardDescription>Detalhes do Cliente</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-2">
        <div><strong>Email:</strong> {{ client.email || 'Não informado' }}</div>
        <div><strong>Telefone:</strong> {{ client.telefone || 'Não informado' }}</div>
      </CardContent>
    </Card>
    <div v-else class="text-center p-8">
      <p class="text-muted-foreground">Cliente não encontrado.</p>
    </div>
    <div class="mt-4">
      <router-link :to="`/clientes/${$route.params.id}/editar`">
        <Button variant="outline">Editar Cliente</Button>
      </router-link>
    </div>
  </div>
</template>

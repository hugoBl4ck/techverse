<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase/config.js';
import { doc, getDoc } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const route = useRoute();


const kit = ref(null);
const isLoading = ref(true);

const fetchKit = async () => {
  const kitId = route.params.id;
  if (!kitId) return;

  isLoading.value = true;
  try {
    const docRef = doc(db, 'kits', kitId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      kit.value = docSnap.data();
    } else {
      console.error('Kit não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao buscar kit:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchKit();
});


</script>

<template>
  <div>
    <div v-if="isLoading" class="text-center p-8">
      <p>Carregando...</p>
    </div>
    <Card v-else-if="kit">
      <CardHeader>
        <CardTitle>{{ kit.nome }}</CardTitle>
        <CardDescription>Detalhes do Kit</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <p>{{ kit.descricao || 'Sem descrição.' }}</p>
        <div v-if="kit.items && kit.items.length > 0">
          <h3 class="font-bold mt-4 mb-2">Itens no Kit:</h3>
          <ul>
            <li v-for="item in kit.items" :key="item.id" class="border-b py-2">
              {{ item.nome }} (Qtd: {{ item.quantidade }})
            </li>
          </ul>
        </div>
        <p v-else>Este kit não possui itens.</p>
      </CardContent>
    </Card>
    <div v-else class="text-center p-8">
      <p class="text-muted-foreground">Kit não encontrado.</p>
    </div>
  </div>
</template>

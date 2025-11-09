<script setup>
import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RouterLink } from 'vue-router';



const kits = ref([]);
const isLoading = ref(true);

const fetchKits = async () => {
  isLoading.value = true;
  try {
    const kitsCol = collection(db, 'kits');
    const kitsSnapshot = await getDocs(kitsCol);
    kits.value = kitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar kits:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchKits();
});


</script>

<template>
  <div class="p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Kits Salvos</h1>
      <RouterLink to="/kits/builder">
        <Button>Criar Novo Kit</Button>
      </RouterLink>
    </div>

    <div v-if="isLoading" class="text-center">
      <p>Carregando kits...</p>
    </div>

    <div v-else-if="kits.length === 0" class="text-center text-muted-foreground">
      <p>Nenhum kit salvo ainda.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="kit in kits" :key="kit.id">
        <CardHeader>
          <CardTitle>{{ kit.nome }}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{{ kit.descricao || 'Sem descrição.' }}</p>
          <div class="mt-4">
            <RouterLink :to="{ name: 'KitDetalhe', params: { id: kit.id } }">
              <Button variant="outline" class="w-full">Ver Detalhes</Button>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

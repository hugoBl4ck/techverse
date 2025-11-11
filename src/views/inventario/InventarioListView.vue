<script setup>
import { ref, watch, computed } from 'vue'
import { db } from '@/firebase/config.js'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { useCurrentStore } from '@/composables/useCurrentStore'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { Pencil, Package, PlusCircle, Trash2, List, Grid3X3, Circle } from 'lucide-vue-next'
import { Skeleton } from '@/components/ui/skeleton'

const { storeId } = useCurrentStore()
const items = ref([])
const isLoading = ref(true)
const viewMode = ref(localStorage.getItem('inventarioViewMode') || 'cards')

const colorMap = {
  cpu: { bg: 'bg-red-500', text: 'text-red-500' },
  'placa-mae': { bg: 'bg-blue-500', text: 'text-blue-500' },
  ram: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  gpu: { bg: 'bg-green-500', text: 'text-green-500' },
  armazenamento: { bg: 'bg-purple-500', text: 'text-purple-500' },
  fonte: { bg: 'bg-gray-500', text: 'text-gray-500' },
  gabinete: { bg: 'bg-indigo-500', text: 'text-indigo-500' },
  outro: { bg: 'bg-gray-300', text: 'text-gray-300' },
};

function getCategoryColors(item) {
  const tipo = item?.tipo || 'outro';
  return colorMap[tipo] || colorMap.outro;
}

// Função para determinar status do estoque baseado no campo status do item
function getStockStatus(itemStatus) {
  const statusMap = {
    'ativo': { color: 'text-green-500', label: 'Em Estoque', bgColor: 'bg-green-500' },
    'em_transito': { color: 'text-yellow-500', label: 'Em Trânsito', bgColor: 'bg-yellow-500' },
    'bloqueado': { color: 'text-red-500', label: 'Bloqueado', bgColor: 'bg-red-500' },
  };
  return statusMap[itemStatus] || statusMap['ativo'];
}

// Agrupa os itens por categoria
const itemsAgrupados = computed(() => {
  const agrupados = items.value.reduce((acc, item) => {
    const tipo = item.tipo || 'outro';
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(item);
    return acc;
  }, {});
  return agrupados;
});

// Mesma lógica do KitBuilder que funciona
const categoriaLabels = {
  'placa-mae': 'Placas-Mãe',
  cpu: 'CPUs',
  gpu: 'Placas de Vídeo',
  ram: 'Memórias RAM',
  armazenamento: 'Armazenamento',
  fonte: 'Fontes de Alimentação',
  gabinete: 'Gabinetes',
  watercooler: 'Watercoolers',
  aircooler: 'Air Coolers',
  ventoinhas: 'Ventoinhas',
  'pasta termica': 'Pasta Térmica',
  mouse: 'Mouses',
  teclado: 'Teclados',
  controle: 'Controles',
  controladoras: 'Controladoras',
  outro: 'Outros'
};

const groupedItems = computed(() => {
  const groups = Object.entries(categoriaLabels).reduce(
    (acc, [type, label]) => {
      acc[type] = { label, items: [] };
      return acc;
    },
    {}
  );

  items.value.forEach((item) => {
    const tipo = item.tipo || 'outro';
    if (groups[tipo]) {
      groups[tipo].items.push(item);
    } else {
      if (!groups[tipo]) {
        groups[tipo] = { label: tipo, items: [] };
      }
      groups[tipo].items.push(item);
    }
  });

  return Object.values(groups).filter((group) => group.items.length > 0);
});

async function fetchItems() {
  if (!storeId.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const itemsCol = collection(db, 'stores', storeId.value, 'itens');
    const querySnapshot = await getDocs(itemsCol);
    
    items.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao carregar inventário:', error);
    toast.error('Erro ao carregar inventário: ' + error.message);
  } finally {
    isLoading.value = false;
  }
}

async function deleteItem(itemId, itemName) {
  const confirmDelete = window.confirm(
    `Tem certeza que deseja deletar "${itemName}"?\n\nEsta ação não pode ser desfeita.`
  );

  if (!confirmDelete) return;

  if (!storeId.value) {
    toast.error('Erro: StoreId não disponível');
    return;
  }

  const toastId = toast.loading('Deletando item...');

  try {
    const itemDocRef = doc(db, 'stores', storeId.value, 'itens', itemId);
    await deleteDoc(itemDocRef);
    
    // Remove do array local
    items.value = items.value.filter(item => item.id !== itemId);
    
    toast.success('Item deletado com sucesso!', { id: toastId });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    toast.error('Erro ao deletar item: ' + error.message, { id: toastId });
  }
}

function changeViewMode(mode) {
  viewMode.value = mode;
  localStorage.setItem('inventarioViewMode', mode);
}

// Watch para quando storeId está pronto
watch(
  () => storeId.value,
  (newStoreId) => {
    if (newStoreId) {
      fetchItems();
    }
  },
  { immediate: true }
);



// Estilo para o padrão de pontos a ser injetado no head
const dotPatternStyle = `
  .pattern-dots {
    background-image: radial-gradient(currentColor 2px, transparent 2px);
    background-size: 16px 16px;
  }
`;

</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Injeta o estilo do padrão no head do documento -->
    <Teleport to="head">
      <style>{{ dotPatternStyle }}</style>
    </Teleport>

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Inventário de Itens</h1>
        <p class="text-sm text-muted-foreground mt-1">{{ items.length }} itens no inventário</p>
      </div>
      <div class="flex gap-2 items-center">
        <!-- View Mode Toggle -->
        <div class="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-background': viewMode === 'cards' }"
            @click="changeViewMode('cards')"
            title="Visualizar como cards"
          >
            <Grid3X3 class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-background': viewMode === 'list' }"
            @click="changeViewMode('list')"
            title="Visualizar como lista"
          >
            <List class="h-4 w-4" />
          </Button>
        </div>
        <RouterLink to="/inventario/novo">
          <Button>
            <PlusCircle class="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Loading State com Skeleton -->
    <div v-if="isLoading" class="space-y-8">
      <p class="text-muted-foreground">Carregando inventário...</p>
      <div v-for="i in 3" :key="i" class="space-y-4">
        <Skeleton height="2rem" width="30%" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton height="15rem" v-for="j in 4" :key="j" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-16 fade-in">
      <p class="text-muted-foreground mb-4">items.length: {{ items.length }}</p>
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
        <Package class="h-10 w-10 text-primary" />
      </div>
      <h3 class="text-xl font-semibold mb-2">Inventário vazio</h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        Adicione seus primeiros itens para começar a gerenciar seu estoque
      </p>
      <Button size="lg" as-child>
        <RouterLink to="/inventario/novo">
          <PlusCircle class="mr-2 h-5 w-5" />
          Adicionar Primeiro Item
        </RouterLink>
      </Button>
    </div>

    <!-- Seções de Categoria -->
    <div v-if="!isLoading && items.length > 0" class="space-y-10">
      <section v-for="group in groupedItems" :key="group.label">
        <h2 class="text-xl font-semibold mb-4 capitalize border-b pb-2">
          {{ group.label }} ({{ group.items.length }})
        </h2>

        <!-- CARDS VIEW -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(item, index) in group.items" 
            :key="item.id"
            :class="`fade-in fade-in-delay-${Math.min(index + 1, 5)} group rounded-lg overflow-hidden border bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col card-hover`"
          >
            <!-- Image Section -->
            <div class="h-36 relative">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.nome"
                   class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-muted flex items-center justify-center">
                <Package class="size-12 text-muted-foreground" />
              </div>
              <!-- Category Tag -->
              <span :class="[getCategoryColors(item).bg, 'absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full']">
                {{ item.tipo }}
              </span>
            </div>

            <!-- Content Section -->
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-bold text-base text-foreground truncate" :title="item.nome">{{ item.nome }}</h3>
                  <span 
                    :class="[
                      'inline-flex items-center text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ms-2',
                      (item.status || 'ativo') === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      (item.status || 'ativo') === 'em_transito' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    ]"
                  >
                    <span 
                      :class="[
                        'w-1.5 h-1.5 me-1 rounded-full',
                        (item.status || 'ativo') === 'ativo' ? 'bg-green-500' :
                        (item.status || 'ativo') === 'em_transito' ? 'bg-yellow-500' :
                        'bg-red-500'
                      ]"
                    ></span>
                  </span>
                </div>
                <div class="text-sm text-muted-foreground space-y-1">
                  <p><strong>Estoque:</strong> {{ item.quantidade }} unidades</p>
                  <p><strong>Preço:</strong> R$ {{ item.precoVenda?.toFixed(2) }}</p>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-2 mt-4">
                <RouterLink :to="`/inventario/${item.id}/editar`" class="flex-1">
                  <Button variant="outline" size="sm" class="w-full">
                    <Pencil class="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </RouterLink>
                <Button 
                  variant="destructive" 
                  size="sm"
                  @click="deleteItem(item.id, item.nome)"
                  title="Deletar item"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
         <div v-else>
           <ul role="list" class="space-y-4">
             <li 
               v-for="item in group.items"
               :key="item.id"
               class="p-4 bg-card border border-border/50 rounded-lg hover:shadow-md transition-all duration-200"
             >
               <div class="flex items-center space-x-4">
                 <!-- Imagem -->
                 <div class="shrink-0">
                   <div class="w-12 h-12 rounded border bg-muted flex items-center justify-center overflow-hidden">
                     <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.nome" class="h-full w-full object-cover">
                     <Package v-else class="h-6 w-6 text-muted-foreground" />
                   </div>
                 </div>

                 <!-- Nome e Tipo -->
                 <div class="flex-1 min-w-0">
                   <p class="text-sm font-semibold text-foreground truncate">
                     {{ item.nome }}
                   </p>
                   <div class="flex items-center gap-2 mt-1">
                     <span :class="[getCategoryColors(item).text, 'text-xs font-medium capitalize']">
                       {{ item.tipo }}
                     </span>
                     <span class="text-xs text-muted-foreground">•</span>
                     <span class="text-xs text-muted-foreground">
                       Estoque: {{ item.quantidade }} un. (Mín: {{ item.estoqueMinimo || 0 }})
                     </span>
                   </div>
                 </div>

                 <!-- Badge de Status -->
                 <div class="flex items-center gap-3">
                   <div>
                     <span 
                       :class="[
                         'inline-flex items-center text-xs font-medium px-3 py-1 rounded-full',
                         (item.status || 'ativo') === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                         (item.status || 'ativo') === 'em_transito' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                         'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                       ]"
                     >
                       <span 
                         :class="[
                           'w-2 h-2 me-1.5 rounded-full',
                           (item.status || 'ativo') === 'ativo' ? 'bg-green-500' :
                           (item.status || 'ativo') === 'em_transito' ? 'bg-yellow-500' :
                           'bg-red-500'
                         ]"
                       ></span>
                       {{ getStockStatus(item.status || 'ativo').label }}
                     </span>
                   </div>

                   <!-- Preços -->
                   <div class="text-right hidden sm:block">
                     <p class="text-xs text-muted-foreground">Custo</p>
                     <p class="text-sm font-semibold text-foreground">
                       {{ item.precoCusto ? `R$ ${item.precoCusto.toFixed(2)}` : '—' }}
                     </p>
                   </div>
                   <div class="text-right hidden sm:block">
                     <p class="text-xs text-muted-foreground">Venda</p>
                     <p class="text-sm font-semibold text-foreground">
                       R$ {{ item.precoVenda?.toFixed(2) }}
                     </p>
                   </div>

                   <!-- Ações -->
                   <div class="flex gap-2 flex-shrink-0">
                     <RouterLink :to="`/inventario/${item.id}/editar`">
                       <Button variant="outline" size="sm">
                         <Pencil class="h-4 w-4" />
                       </Button>
                     </RouterLink>
                     <Button 
                       variant="destructive" 
                       size="sm"
                       @click="deleteItem(item.id, item.nome)"
                     >
                       <Trash2 class="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
               </div>
             </li>
           </ul>
         </div>
      </section>
    </div>
    </div>
    </template>



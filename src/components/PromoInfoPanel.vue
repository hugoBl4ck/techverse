<template>
  <Card class="fade-in border-l-4 border-l-primary overflow-hidden">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Megaphone class="h-5 w-5 text-primary" />
          <CardTitle>📢 Promoções & Notícias</CardTitle>
        </div>
        <Badge variant="secondary" class="text-xs">{{ items.length }} ativo(s)</Badge>
      </div>
      <CardDescription>Gerencie promoções e notícias para todas as lojas</CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Tabs: Promoções e Notícias -->
      <div class="flex gap-2 border-b">
        <button
          @click="activeTab = 'promos'"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'promos'
              ? 'text-primary border-b-2 border-b-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          🎁 Promoções
        </button>
        <button
          @click="activeTab = 'news'"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'news'
              ? 'text-primary border-b-2 border-b-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          📰 Notícias
        </button>
        <button
          @click="activeTab = 'donations'"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'donations'
              ? 'text-primary border-b-2 border-b-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          💝 Doações
        </button>
      </div>

      <!-- Lista de Promoções -->
      <div v-if="activeTab === 'promos'" class="space-y-3">
        <div v-if="isLoading" class="space-y-2">
          <Skeleton height="5rem" />
          <Skeleton height="5rem" />
        </div>

        <div v-else-if="filteredPromos.length === 0" class="text-center py-6">
          <Gift class="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p class="text-sm text-muted-foreground">Nenhuma promoção ativa no momento</p>
          <Button @click="openFormModal('promo')" size="sm" class="mt-3">
            <PlusCircle class="mr-2 h-4 w-4" />
            Criar Promoção
          </Button>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="promo in filteredPromos"
            :key="promo.id"
            class="p-4 border rounded-lg bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex-1">
                <h4 class="font-semibold text-sm">{{ promo.titulo }}</h4>
                <p class="text-xs text-muted-foreground mt-1">{{ promo.descricao }}</p>
              </div>
              <Badge :variant="promo.ativo ? 'default' : 'secondary'" class="text-xs whitespace-nowrap">
                {{ promo.ativo ? '✓ Ativo' : '⊗ Inativo' }}
              </Badge>
            </div>

            <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
              <span v-if="promo.desconto">💰 Desconto: {{ promo.desconto }}%</span>
              <span v-if="promo.dataInicio">📅 {{ formatDate(promo.dataInicio) }}</span>
            </div>

            <div class="flex gap-2">
              <Button
                @click="editItem('promo', promo)"
                size="sm"
                variant="outline"
                class="h-8 text-xs"
              >
                <Edit2 class="mr-1 h-3 w-3" />
                Editar
              </Button>
              <Button
                @click="toggleStatus('promo', promo.id, !promo.ativo)"
                size="sm"
                variant="ghost"
                class="h-8 text-xs"
              >
                {{ promo.ativo ? '🔴 Desativar' : '🟢 Ativar' }}
              </Button>
              <Button
                @click="deleteItem('promo', promo.id)"
                size="sm"
                variant="ghost"
                class="h-8 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button
            @click="openFormModal('promo')"
            variant="outline"
            class="w-full mt-2"
            size="sm"
          >
            <PlusCircle class="mr-2 h-4 w-4" />
            Nova Promoção
          </Button>
        </div>
      </div>

      <!-- Lista de Notícias -->
      <div v-if="activeTab === 'news'" class="space-y-3">
        <div v-if="isLoading" class="space-y-2">
          <Skeleton height="5rem" />
          <Skeleton height="5rem" />
        </div>

        <div v-else-if="filteredNews.length === 0" class="text-center py-6">
          <Newspaper class="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p class="text-sm text-muted-foreground">Nenhuma notícia publicada</p>
          <Button @click="openFormModal('news')" size="sm" class="mt-3">
            <PlusCircle class="mr-2 h-4 w-4" />
            Publicar Notícia
          </Button>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in filteredNews"
            :key="item.id"
            class="p-4 border rounded-lg bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20 dark:to-transparent hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex-1">
                <h4 class="font-semibold text-sm">{{ item.titulo }}</h4>
                <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{{ item.conteudo }}</p>
              </div>
              <Badge :variant="item.ativo ? 'default' : 'secondary'" class="text-xs whitespace-nowrap">
                {{ item.ativo ? '✓ Publicada' : '⊗ Rascunho' }}
              </Badge>
            </div>

            <div class="text-xs text-muted-foreground mb-2">
              📅 {{ formatDate(item.dataPub) }}
            </div>

            <div class="flex gap-2">
              <Button
                @click="editItem('news', item)"
                size="sm"
                variant="outline"
                class="h-8 text-xs"
              >
                <Edit2 class="mr-1 h-3 w-3" />
                Editar
              </Button>
              <Button
                @click="toggleStatus('news', item.id, !item.ativo)"
                size="sm"
                variant="ghost"
                class="h-8 text-xs"
              >
                {{ item.ativo ? '🔴 Despublicar' : '🟢 Publicar' }}
              </Button>
              <Button
                @click="deleteItem('news', item.id)"
                size="sm"
                variant="ghost"
                class="h-8 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button
            @click="openFormModal('news')"
            variant="outline"
            class="w-full mt-2"
            size="sm"
          >
            <PlusCircle class="mr-2 h-4 w-4" />
            Nova Notícia
          </Button>
        </div>
      </div>

      <!-- Configurações de Doações -->
      <div v-if="activeTab === 'donations'" class="space-y-4">
        <div class="p-4 border rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
          <h4 class="font-semibold text-sm mb-3 flex items-center gap-2">
            <Heart class="h-4 w-4 text-red-500" />
            Sistema de Doações PIX
          </h4>

          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-xs font-medium">Chave PIX para Doações</label>
              <div class="flex gap-2">
                <Input
                  v-model="pixConfig.chave"
                  placeholder="Insira sua chave PIX (email, telefone, CPF ou aleatória)"
                  class="text-sm h-9"
                />
                <Button
                  @click="savePixConfig"
                  size="sm"
                  class="h-9"
                  :disabled="saving"
                >
                  {{ saving ? '💾...' : '💾 Salvar' }}
                </Button>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                A chave será usada para gerar QR codes de doação
              </p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium">Nome para Recebimento</label>
              <Input
                v-model="pixConfig.nomeRecebimento"
                placeholder="Nome ou nome da loja"
                class="text-sm h-9"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium">Chave PIX City (opcional)</label>
              <Input
                v-model="pixConfig.cidade"
                placeholder="Cidade"
                class="text-sm h-9"
              />
            </div>

            <Separator class="my-3" />

            <div class="space-y-2">
              <p class="text-xs font-medium">Página de Doações Pública</p>
              <div class="flex gap-2">
                <Input
                  :value="`${window.location.origin}/donate`"
                  readonly
                  class="text-xs h-9 bg-muted"
                  disabled
                />
                <Button
                  @click="copyToClipboard()"
                  size="sm"
                  variant="outline"
                  class="h-9"
                >
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Link público que você pode compartilhar com seus clientes
              </p>
            </div>

            <Button
              @click="previewDonationPage"
              variant="outline"
              class="w-full h-9 mt-2"
            >
              <Eye class="mr-2 h-4 w-4" />
              Preview Página de Doações
            </Button>
          </div>
        </div>

        <!-- Stats de Doações -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 border rounded-lg">
            <p class="text-xs text-muted-foreground mb-1">Total de Doações</p>
            <p class="text-2xl font-bold">{{ donationStats.total }}</p>
          </div>
          <div class="p-3 border rounded-lg">
            <p class="text-xs text-muted-foreground mb-1">Valor Total</p>
            <p class="text-2xl font-bold text-green-600">R$ {{ donationStats.amount }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Modal de Formulário -->
  <Dialog :open="showModal" @update:open="showModal = $event" class="z-50">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{ formMode === 'create' ? 'Nova ' : 'Editar ' }}{{ currentType === 'promo' ? 'Promoção' : 'Notícia' }}
        </DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Comum -->
        <div class="space-y-1">
          <label class="text-sm font-medium">Título</label>
          <Input v-model="formData.titulo" placeholder="Título" />
        </div>

        <!-- Promoção específico -->
        <div v-if="currentType === 'promo'" class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm font-medium">Descrição</label>
            <textarea
              v-model="formData.descricao"
              placeholder="Descreva a promoção"
              class="w-full p-2 text-sm border rounded-md resize-none h-20"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">Desconto (%)</label>
              <Input v-model.number="formData.desconto" type="number" placeholder="0" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">Data Início</label>
              <Input v-model="formData.dataInicio" type="date" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">Data Fim</label>
            <Input v-model="formData.dataFim" type="date" />
          </div>
        </div>

        <!-- Notícia específico -->
        <div v-if="currentType === 'news'" class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm font-medium">Conteúdo</label>
            <textarea
              v-model="formData.conteudo"
              placeholder="Conteúdo da notícia"
              class="w-full p-2 text-sm border rounded-md resize-none h-24"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">Data de Publicação</label>
            <Input v-model="formData.dataPub" type="date" />
          </div>
        </div>

        <!-- Status -->
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="formData.ativo"
            id="ativo"
            class="rounded"
          />
          <label for="ativo" class="text-sm font-medium cursor-pointer">
            {{ currentType === 'promo' ? 'Promoção Ativa' : 'Notícia Publicada' }}
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="showModal = false">
          Cancelar
        </Button>
        <Button @click="saveFormData" :disabled="saving">
          {{ saving ? '💾 Salvando...' : '💾 Salvar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Megaphone,
  Gift,
  Newspaper,
  PlusCircle,
  Edit2,
  Trash2,
  Heart,
  Copy,
  Eye
} from 'lucide-vue-next';
import { useFirestore } from '@/composables/useFirestore';

const { getPromos, savePromo, deletePromo, getNews, saveNews, deleteNews, getPixConfig, savePixConfig: savePixConfigToDb } = useFirestore();

const activeTab = ref('promos');
const showModal = ref(false);
const isLoading = ref(false);
const saving = ref(false);

const promos = ref([]);
const news = ref([]);
const pixConfig = ref({
  chave: '',
  nomeRecebimento: '',
  cidade: ''
});

const currentType = ref('promo');
const formMode = ref('create');
const formData = ref({
  titulo: '',
  descricao: '',
  conteudo: '',
  desconto: 0,
  dataInicio: '',
  dataFim: '',
  dataPub: '',
  ativo: true
});

const donationStats = ref({
  total: 0,
  amount: '0,00'
});

const filteredPromos = computed(() => promos.value);
const filteredNews = computed(() => news.value);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  isLoading.value = true;
  try {
    promos.value = await getPromos();
    news.value = await getNews();

    const config = await getPixConfig();
    if (config) {
      pixConfig.value = config;
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    toast.error('Erro ao carregar dados');
  } finally {
    isLoading.value = false;
  }
}

function openFormModal(type) {
  currentType.value = type;
  formMode.value = 'create';
  formData.value = {
    titulo: '',
    descricao: '',
    conteudo: '',
    desconto: 0,
    dataInicio: '',
    dataFim: '',
    dataPub: new Date().toISOString().split('T')[0],
    ativo: true
  };
  showModal.value = true;
}

function editItem(type, item) {
  currentType.value = type;
  formMode.value = 'edit';
  formData.value = { ...item };
  showModal.value = true;
}

async function saveFormData() {
  if (!formData.value.titulo) {
    toast.error('Preencha o título');
    return;
  }

  saving.value = true;
  try {
    if (currentType.value === 'promo') {
      await savePromo(formData.value);
      promos.value = await getPromos();
      toast.success(formMode.value === 'create' ? 'Promoção criada' : 'Promoção atualizada');
    } else {
      await saveNews(formData.value);
      news.value = await getNews();
      toast.success(formMode.value === 'create' ? 'Notícia publicada' : 'Notícia atualizada');
    }
    showModal.value = false;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    toast.error('Erro ao salvar item');
  } finally {
    saving.value = false;
  }
}

async function deleteItem(type, id) {
  if (!confirm('Tem certeza?')) return;

  try {
    if (type === 'promo') {
      await deletePromo(id);
      promos.value = await getPromos();
    } else {
      await deleteNews(id);
      news.value = await getNews();
    }
    toast.success('Item deletado');
  } catch (error) {
    console.error('Erro ao deletar:', error);
    toast.error('Erro ao deletar');
  }
}

async function toggleStatus(type, id, newStatus) {
  try {
    if (type === 'promo') {
      const promo = promos.value.find(p => p.id === id);
      if (promo) {
        await savePromo({ ...promo, ativo: newStatus });
        promos.value = await getPromos();
      }
    } else {
      const item = news.value.find(n => n.id === id);
      if (item) {
        await saveNews({ ...item, ativo: newStatus });
        news.value = await getNews();
      }
    }
    toast.success('Status atualizado');
  } catch (error) {
    console.error('Erro:', error);
    toast.error('Erro ao atualizar status');
  }
}

async function savePixConfig() {
  if (!pixConfig.value.chave) {
    toast.error('Insira uma chave PIX');
    return;
  }

  saving.value = true;
  try {
    await savePixConfigToDb(pixConfig.value);
    toast.success('Configuração de PIX salva');
  } catch (error) {
    console.error('Erro ao salvar PIX:', error);
    toast.error('Erro ao salvar configuração');
  } finally {
    saving.value = false;
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(`${window.location.origin}/donate`);
  toast.success('Link copiado!');
}

function previewDonationPage() {
  window.open('/donate', '_blank');
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}
</script>

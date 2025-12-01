<template>
  <div class="container mx-auto py-8 space-y-8">
    <div class="fade-in">
      <h1 class="text-3xl font-bold mb-2">🎨 Demonstração de Melhorias Visuais</h1>
      <p class="text-muted-foreground">Veja todas as melhorias visuais implementadas</p>
    </div>

    <!-- Toast Notifications Demo -->
    <Card class="fade-in fade-in-delay-1">
      <CardHeader>
        <CardTitle>🔔 Toast Notifications</CardTitle>
        <CardDescription>Substitui os alert() feios</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <Button @click="toast.success('Operação bem-sucedida!')" variant="default">
          Success Toast
        </Button>
        <Button @click="toast.error('Erro ao processar')" variant="destructive">
          Error Toast
        </Button>
        <Button @click="toast.info('Informação útil')" variant="secondary">
          Info Toast
        </Button>
        <Button @click="toast.warning('Atenção!')" variant="outline">
          Warning Toast
        </Button>
        <Button @click="showLoadingToast" variant="outline">
          Loading Toast
        </Button>
      </CardContent>
    </Card>

    <!-- Animações CSS -->
    <Card class="fade-in fade-in-delay-2">
      <CardHeader>
        <CardTitle>✨ Animações e Transições</CardTitle>
        <CardDescription>Elementos aparecem suavemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="fade-in fade-in-delay-1 p-4 border rounded-lg bg-primary/5">
            <p class="font-semibold">Delay 0.1s</p>
            <p class="text-sm text-muted-foreground">Aparece primeiro</p>
          </div>
          <div class="fade-in fade-in-delay-2 p-4 border rounded-lg bg-primary/5">
            <p class="font-semibold">Delay 0.2s</p>
            <p class="text-sm text-muted-foreground">Aparece depois</p>
          </div>
          <div class="fade-in fade-in-delay-3 p-4 border rounded-lg bg-primary/5">
            <p class="font-semibold">Delay 0.3s</p>
            <p class="text-sm text-muted-foreground">Aparece por último</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Hover Effects -->
    <Card class="fade-in fade-in-delay-3">
      <CardHeader>
        <CardTitle>🖱️ Hover Effects</CardTitle>
        <CardDescription>Passe o mouse nos cards</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card-hover p-6 border rounded-lg cursor-pointer">
            <h3 class="font-semibold mb-2">Card com Hover</h3>
            <p class="text-sm text-muted-foreground">Flutua quando passa o mouse</p>
          </div>
          <div class="card-hover p-6 border rounded-lg cursor-pointer bg-primary/5">
            <h3 class="font-semibold mb-2">Card Colorido</h3>
            <p class="text-sm text-muted-foreground">Também flutua!</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Skeleton Loaders -->
    <Card class="fade-in fade-in-delay-4">
      <CardHeader>
        <CardTitle>💀 Skeleton Loaders</CardTitle>
        <CardDescription>Estados de carregamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Skeleton height="2rem" width="60%" />
            <Skeleton height="1rem" width="80%" />
            <Skeleton height="1rem" width="70%" />
          </div>
          <Skeleton height="10rem" />
          <div class="grid grid-cols-3 gap-3">
            <Skeleton height="6rem" />
            <Skeleton height="6rem" />
            <Skeleton height="6rem" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Ícones Animados -->
    <Card class="fade-in fade-in-delay-5">
      <CardHeader>
        <CardTitle>🎬 Ícones Animados</CardTitle>
        <CardDescription>Feedback visual com ícones</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-6">
        <div class="text-center">
          <Loader2 class="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p class="text-xs text-muted-foreground">Loading</p>
        </div>
        <div class="text-center">
          <CheckCircle class="h-8 w-8 text-green-500 icon-pop mx-auto mb-2" />
          <p class="text-xs text-muted-foreground">Success</p>
        </div>
        <div class="text-center">
          <XCircle class="h-8 w-8 text-red-500 icon-pop mx-auto mb-2" />
          <p class="text-xs text-muted-foreground">Error</p>
        </div>
        <div class="text-center">
          <Bell class="h-8 w-8 text-orange-500 pulse-gentle mx-auto mb-2" />
          <p class="text-xs text-muted-foreground">Notification</p>
        </div>
      </CardContent>
    </Card>

    <!-- Botões com Estados -->
    <Card class="fade-in">
      <CardHeader>
        <CardTitle>🔘 Botões Interativos</CardTitle>
        <CardDescription>Diferentes estados visuais</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <Button>
          Normal Button
        </Button>
        <Button disabled>
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
        <Button variant="destructive">
          <Trash class="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button variant="outline">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="lg">
          <PlusCircle class="mr-2 h-5 w-5" />
          Criar Novo
        </Button>
      </CardContent>
    </Card>

    <!-- Background Gradiente -->
    <Card class="fade-in gradient-bg border-2">
      <CardHeader>
        <CardTitle>🌈 Background Gradiente</CardTitle>
        <CardDescription>Fundo sutil com gradiente</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Este card tem um background gradiente sutil. Troque para dark mode para ver a diferença!</p>
      </CardContent>
    </Card>

    <!-- Empty State Example -->
    <Card class="fade-in">
      <CardHeader>
        <CardTitle>📭 Empty State</CardTitle>
        <CardDescription>Quando não há dados</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package class="h-8 w-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
          <p class="text-muted-foreground mb-4 max-w-md mx-auto">
            Este é um exemplo de empty state bem feito
          </p>
          <Button>
            <PlusCircle class="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </CardContent>
    </Card>



  </div>
</template>

<script setup>
import { toast } from 'vue-sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Bell, 
  Trash, 
  Download, 
  PlusCircle,
  Package
} from 'lucide-vue-next';

async function showLoadingToast() {
  const loadingToast = toast.loading('Processando dados...');
  
  // Simula processo
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  toast.success('Processo concluído!', { id: loadingToast });
}
</script>

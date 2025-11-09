<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">📊 Exportador de Dados</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Exportar Clientes -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            Clientes
          </CardTitle>
          <CardDescription>
            Exporte todos os seus clientes cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>• Nome completo</p>
            <p>• Email</p>
            <p>• Telefone</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click="exportarClientes('xlsx')" :disabled="isExporting" class="w-full">
            <FileSpreadsheet class="mr-2 h-4 w-4" />
            Exportar Excel (.xlsx)
          </Button>
          <Button @click="exportarClientes('csv')" :disabled="isExporting" variant="outline" class="w-full">
            <FileText class="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button @click="exportarClientes('json')" :disabled="isExporting" variant="outline" class="w-full">
            <FileJson class="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </CardFooter>
      </Card>

      <!-- Exportar Ordens de Serviço -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ClipboardList class="h-5 w-5" />
            Ordens de Serviço
          </CardTitle>
          <CardDescription>
            Exporte todas as ordens de serviço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>• Cliente</p>
            <p>• Data</p>
            <p>• Valor total</p>
            <p>• Serviços realizados</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click="exportarOrdensServico('xlsx')" :disabled="isExporting" class="w-full">
            <FileSpreadsheet class="mr-2 h-4 w-4" />
            Exportar Excel (.xlsx)
          </Button>
          <Button @click="exportarOrdensServico('csv')" :disabled="isExporting" variant="outline" class="w-full">
            <FileText class="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button @click="exportarOrdensServico('json')" :disabled="isExporting" variant="outline" class="w-full">
            <FileJson class="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </CardFooter>
      </Card>

      <!-- Exportar Inventário -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Package class="h-5 w-5" />
            Inventário
          </CardTitle>
          <CardDescription>
            Exporte todo o inventário de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>• Nome do item</p>
            <p>• Tipo</p>
            <p>• Preço de custo</p>
            <p>• Preço de venda</p>
            <p>• Quantidade em estoque</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click="exportarInventario('xlsx')" :disabled="isExporting" class="w-full">
            <FileSpreadsheet class="mr-2 h-4 w-4" />
            Exportar Excel (.xlsx)
          </Button>
          <Button @click="exportarInventario('csv')" :disabled="isExporting" variant="outline" class="w-full">
            <FileText class="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button @click="exportarInventario('json')" :disabled="isExporting" variant="outline" class="w-full">
            <FileJson class="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </CardFooter>
      </Card>

      <!-- Exportar Catálogo de Serviços -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BookOpen class="h-5 w-5" />
            Catálogo de Serviços
          </CardTitle>
          <CardDescription>
            Exporte o catálogo de serviços predefinidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>• Nome do serviço</p>
            <p>• Descrição</p>
            <p>• Preço</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click="exportarCatalogo('xlsx')" :disabled="isExporting" class="w-full">
            <FileSpreadsheet class="mr-2 h-4 w-4" />
            Exportar Excel (.xlsx)
          </Button>
          <Button @click="exportarCatalogo('csv')" :disabled="isExporting" variant="outline" class="w-full">
            <FileText class="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button @click="exportarCatalogo('json')" :disabled="isExporting" variant="outline" class="w-full">
            <FileJson class="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </CardFooter>
      </Card>

      <!-- Exportação Completa -->
      <Card class="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Database class="h-5 w-5" />
            Backup Completo
          </CardTitle>
          <CardDescription>
            Exporte todos os dados de uma vez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>• Todos os clientes</p>
            <p>• Todas as ordens</p>
            <p>• Todo o inventário</p>
            <p>• Catálogo completo</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click="exportarTudo('xlsx')" :disabled="isExporting" class="w-full" variant="default">
            <Download class="mr-2 h-4 w-4" />
            Backup Completo (Excel)
          </Button>
          <Button @click="exportarTudo('json')" :disabled="isExporting" variant="outline" class="w-full">
            <Download class="mr-2 h-4 w-4" />
            Backup Completo (JSON)
          </Button>
        </CardFooter>
      </Card>

    </div>

    <!-- Status de Exportação -->
    <div v-if="isExporting" class="mt-8 p-4 bg-muted rounded-lg text-center">
      <Loader2 class="h-6 w-6 animate-spin mx-auto mb-2" />
      <p class="text-sm text-muted-foreground">Preparando exportação...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';
import { useCurrentStore } from '@/composables/useCurrentStore';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ClipboardList, 
  Package, 
  BookOpen, 
  Database,
  FileSpreadsheet, 
  FileText, 
  FileJson,
  Download,
  Loader2
} from 'lucide-vue-next';

const { storeId } = useCurrentStore();
const isExporting = ref(false);

// ============================================================================
// FUNÇÕES DE EXPORTAÇÃO POR TIPO
// ============================================================================

async function exportarClientes(formato) {
  if (!storeId.value) {
    alert('Erro: Usuário não autenticado');
    return;
  }

  isExporting.value = true;

  try {
    const col = collection(db, 'stores', storeId.value, 'clientes');
    const snapshot = await getDocs(col);
    
    const dados = snapshot.docs.map(doc => ({
      ID: doc.id,
      Nome: doc.data().nome || '',
      Email: doc.data().email || '',
      Telefone: doc.data().telefone || '',
    }));

    if (dados.length === 0) {
      alert('Nenhum cliente encontrado para exportar.');
      return;
    }

    exportar(dados, 'Clientes', formato);
  } catch (error) {
    console.error('Erro ao exportar clientes:', error);
    alert('Erro ao exportar clientes: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}

async function exportarOrdensServico(formato) {
  if (!storeId.value) {
    alert('Erro: Usuário não autenticado');
    return;
  }

  isExporting.value = true;

  try {
    const col = collection(db, 'stores', storeId.value, 'ordens_servico');
    const snapshot = await getDocs(col);
    
    const dados = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ID: doc.id,
        Cliente: data.customerName || '',
        Data: data.date?.toDate ? data.date.toDate().toLocaleDateString('pt-BR') : '',
        'Valor do Serviço': data.price || 0,
        'Valor Total': data.totalAmount || 0,
        'Observações': Array.isArray(data.observations) ? data.observations.join('; ') : data.observations || '',
        'Configuração do Equipamento': data.computerConfiguration || '',
      };
    });

    if (dados.length === 0) {
      alert('Nenhuma ordem de serviço encontrada para exportar.');
      return;
    }

    exportar(dados, 'Ordens_Servico', formato);
  } catch (error) {
    console.error('Erro ao exportar ordens:', error);
    alert('Erro ao exportar ordens de serviço: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}

async function exportarInventario(formato) {
  if (!storeId.value) {
    alert('Erro: Usuário não autenticado');
    return;
  }

  isExporting.value = true;

  try {
    const col = collection(db, 'stores', storeId.value, 'items');
    const snapshot = await getDocs(col);
    
    const dados = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ID: doc.id,
        Nome: data.nome || '',
        Tipo: data.tipo || '',
        'Preço de Custo': data.precoCusto || 0,
        'Preço de Venda': data.precoVenda || 0,
        Quantidade: data.quantidade || 0,
        Descrição: data.descricao || '',
      };
    });

    if (dados.length === 0) {
      alert('Nenhum item encontrado para exportar.');
      return;
    }

    exportar(dados, 'Inventario', formato);
  } catch (error) {
    console.error('Erro ao exportar inventário:', error);
    alert('Erro ao exportar inventário: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}

async function exportarCatalogo(formato) {
  if (!storeId.value) {
    alert('Erro: Usuário não autenticado');
    return;
  }

  isExporting.value = true;

  try {
    const col = collection(db, 'stores', storeId.value, 'catalogo_servicos');
    const snapshot = await getDocs(col);
    
    const dados = snapshot.docs.map(doc => ({
      ID: doc.id,
      Nome: doc.data().nome || '',
      Descrição: doc.data().descricao || '',
      Preço: doc.data().preco || 0,
    }));

    if (dados.length === 0) {
      alert('Nenhum serviço encontrado para exportar.');
      return;
    }

    exportar(dados, 'Catalogo_Servicos', formato);
  } catch (error) {
    console.error('Erro ao exportar catálogo:', error);
    alert('Erro ao exportar catálogo: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}

async function exportarTudo(formato) {
  if (!storeId.value) {
    alert('Erro: Usuário não autenticado');
    return;
  }

  isExporting.value = true;

  try {
    // Buscar todos os dados
    const [clientesSnap, ordensSnap, itemsSnap, catalogoSnap] = await Promise.all([
      getDocs(collection(db, 'stores', storeId.value, 'clientes')),
      getDocs(collection(db, 'stores', storeId.value, 'ordens_servico')),
      getDocs(collection(db, 'stores', storeId.value, 'items')),
      getDocs(collection(db, 'stores', storeId.value, 'catalogo_servicos')),
    ]);

    if (formato === 'json') {
      // Exportar como JSON completo
      const backup = {
        dataExportacao: new Date().toISOString(),
        storeId: storeId.value,
        clientes: clientesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ordensServico: ordensSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        inventario: itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        catalogoServicos: catalogoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      baixarArquivo(blob, `Backup_Completo_${getDataHora()}.json`);
    } else {
      // Exportar como Excel com múltiplas abas
      const wb = XLSX.utils.book_new();

      // Aba Clientes
      const clientesDados = clientesSnap.docs.map(doc => ({
        ID: doc.id,
        Nome: doc.data().nome || '',
        Email: doc.data().email || '',
        Telefone: doc.data().telefone || '',
      }));
      const wsClientes = XLSX.utils.json_to_sheet(clientesDados);
      XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

      // Aba Ordens de Serviço
      const ordensDados = ordensSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ID: doc.id,
          Cliente: data.customerName || '',
          Data: data.date?.toDate ? data.date.toDate().toLocaleDateString('pt-BR') : '',
          'Valor Total': data.totalAmount || 0,
        };
      });
      const wsOrdens = XLSX.utils.json_to_sheet(ordensDados);
      XLSX.utils.book_append_sheet(wb, wsOrdens, 'Ordens de Serviço');

      // Aba Inventário
      const inventarioDados = itemsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ID: doc.id,
          Nome: data.nome || '',
          Tipo: data.tipo || '',
          'Preço Custo': data.precoCusto || 0,
          'Preço Venda': data.precoVenda || 0,
          Quantidade: data.quantidade || 0,
        };
      });
      const wsInventario = XLSX.utils.json_to_sheet(inventarioDados);
      XLSX.utils.book_append_sheet(wb, wsInventario, 'Inventário');

      // Aba Catálogo
      const catalogoDados = catalogoSnap.docs.map(doc => ({
        ID: doc.id,
        Nome: doc.data().nome || '',
        Descrição: doc.data().descricao || '',
        Preço: doc.data().preco || 0,
      }));
      const wsCatalogo = XLSX.utils.json_to_sheet(catalogoDados);
      XLSX.utils.book_append_sheet(wb, wsCatalogo, 'Catálogo Serviços');

      XLSX.writeFile(wb, `Backup_Completo_${getDataHora()}.xlsx`);
    }

    alert('Backup completo exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar backup:', error);
    alert('Erro ao criar backup: ' + error.message);
  } finally {
    isExporting.value = false;
  }
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function exportar(dados, nomeArquivo, formato) {
  const dataHora = getDataHora();

  if (formato === 'xlsx') {
    exportarExcel(dados, `${nomeArquivo}_${dataHora}.xlsx`);
  } else if (formato === 'csv') {
    exportarCSV(dados, `${nomeArquivo}_${dataHora}.csv`);
  } else if (formato === 'json') {
    exportarJSON(dados, `${nomeArquivo}_${dataHora}.json`);
  }
}

function exportarExcel(dados, nomeArquivo) {
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, nomeArquivo);
}

function exportarCSV(dados, nomeArquivo) {
  const ws = XLSX.utils.json_to_sheet(dados);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  baixarArquivo(blob, nomeArquivo);
}

function exportarJSON(dados, nomeArquivo) {
  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  baixarArquivo(blob, nomeArquivo);
}

function baixarArquivo(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getDataHora() {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const dia = String(now.getDate()).padStart(2, '0');
  const hora = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${ano}${mes}${dia}_${hora}${min}`;
}
</script>

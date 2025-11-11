<template>
  <div class="min-h-screen bg-slate-950 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-2">Painel de Avisos para Lojas</h1>
      <p class="text-gray-400 mb-8">Sistema de notificações tipo ticker para compartilhar atualizações, promoções e alertas com todas as lojas</p>

      <!-- Painel de Avisos -->
      <div class="mb-8">
        <AvisosPanel />
      </div>

      <!-- Informações de uso -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div class="bg-slate-800 p-6 rounded-lg border border-blue-500">
          <h3 class="text-xl font-bold text-blue-400 mb-3">🎯 Funcionalidades</h3>
          <ul class="text-gray-300 text-sm space-y-2">
            <li>✓ Ticker dinâmico com scroll automático</li>
            <li>✓ Criar avisos por tipo (Info, Promoção, Alerta)</li>
            <li>✓ Selecionar lojas específicas ou todas</li>
            <li>✓ Pausar/Retomar animação</li>
            <li>✓ Deletar avisos em tempo real</li>
          </ul>
        </div>

        <div class="bg-slate-800 p-6 rounded-lg border border-green-500">
          <h3 class="text-xl font-bold text-green-400 mb-3">📊 Tipos de Avisos</h3>
          <ul class="text-gray-300 text-sm space-y-2">
            <li><span class="text-blue-400">ℹ️ Informação</span> - Notícias gerais</li>
            <li><span class="text-green-400">🎉 Promoção</span> - Ofertas especiais</li>
            <li><span class="text-red-400">⚠️ Alerta</span> - Avisos urgentes</li>
          </ul>
        </div>

        <div class="bg-slate-800 p-6 rounded-lg border border-yellow-500">
          <h3 class="text-xl font-bold text-yellow-400 mb-3">🚀 Próximas Melhorias</h3>
          <ul class="text-gray-300 text-sm space-y-2">
            <li>→ Persistência em Firebase</li>
            <li>→ Agendamento de avisos</li>
            <li>→ Notificações push</li>
            <li>→ Histórico de avisos</li>
            <li>→ Integração com Dashboard</li>
          </ul>
        </div>
      </div>

      <!-- Exemplos de uso -->
      <div class="mt-12 bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 class="text-xl font-bold text-white mb-4">💡 Exemplos de Avisos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-green-400 mb-2">Exemplo: Promoção</p>
            <p>"Black Friday: 50% em eletrônicos de 9-17h hoje!"</p>
          </div>
          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-red-400 mb-2">Exemplo: Alerta</p>
            <p>"Servidor em manutenção às 22h-23h. Sistema sairá do ar."</p>
          </div>
          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-blue-400 mb-2">Exemplo: Informação</p>
            <p>"Nova política de trocas implementada. Consulte gerente."</p>
          </div>
          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-yellow-400 mb-2">Exemplo: Operacional</p>
            <p>"Entrega de estoque: quadra A - 14h. Libere corredores!"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AvisosPanel from '@/components/AvisosPanel.vue'
</script>

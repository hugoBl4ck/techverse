<template>
  <div class="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
    <!-- Ticker Container -->
    <div class="relative h-16 flex items-center border-b-2 border-blue-500 shadow-lg">
      <!-- Label -->
      <div class="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center font-bold text-sm z-10 shadow-lg border-r-2 border-blue-500">
        AVISOS PARA LOJAS
      </div>

      <!-- Ticker Content -->
      <div class="w-full ml-40 flex items-center relative overflow-hidden">
        <div class="flex animate-scroll whitespace-nowrap">
          <div v-for="(aviso, index) in avisosDuplicated" :key="`${index}`" class="inline-flex items-center mx-8">
            <span class="text-blue-300 text-2xl mr-4">●</span>
            <span class="text-lg font-semibold">{{ aviso.titulo }}</span>
            <span class="mx-6 text-blue-400">|</span>
            <span class="text-sm text-gray-300">{{ aviso.mensagem }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
      <div class="flex gap-3">
        <button
          @click="pauseAnimation"
          :class="['px-4 py-2 rounded font-semibold transition', isPaused ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700']"
        >
          {{ isPaused ? '▶ Retomar' : '⏸ Pausar' }}
        </button>
        <button
          @click="showForm = true"
          class="px-4 py-2 rounded font-semibold bg-green-600 hover:bg-green-700 transition"
        >
          + Novo Aviso
        </button>
      </div>
      <div class="text-sm text-gray-400">
        {{ avisos.length }} aviso{{ avisos.length !== 1 ? 's' : '' }} ativo{{ avisos.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Lista de Avisos -->
    <div class="p-6 max-h-96 overflow-y-auto">
      <div v-if="avisos.length === 0" class="text-center text-gray-400 py-8">
        Nenhum aviso no momento
      </div>
      <div
        v-for="(aviso, index) in avisos"
        :key="aviso.id"
        class="mb-4 p-4 bg-slate-800 rounded border-l-4 flex justify-between items-start"
        :class="aviso.tipo === 'promocao' ? 'border-green-500' : aviso.tipo === 'alerta' ? 'border-red-500' : 'border-blue-500'"
      >
        <div class="flex-1">
          <h3 class="font-bold text-lg" :class="getTipoColor(aviso.tipo)">{{ aviso.titulo }}</h3>
          <p class="text-gray-300 text-sm mt-1">{{ aviso.mensagem }}</p>
          <p class="text-xs text-gray-500 mt-2">Lojas: {{ aviso.lojas.join(', ') }}</p>
        </div>
        <button
          @click="deleteAviso(index)"
          class="ml-4 text-red-400 hover:text-red-300 text-xl"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-slate-800 rounded-lg p-6 w-96 border border-blue-500">
        <h2 class="text-2xl font-bold text-blue-400 mb-4">Criar Novo Aviso</h2>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Tipo</label>
          <select v-model="formData.tipo" class="w-full p-2 rounded bg-slate-700 border border-blue-500 text-white">
            <option value="info">ℹ Informação</option>
            <option value="promocao">🎉 Promoção</option>
            <option value="alerta">⚠️ Alerta</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Título</label>
          <input v-model="formData.titulo" type="text" placeholder="Ex: Promoção de Black Friday" class="w-full p-2 rounded bg-slate-700 border border-blue-500 text-white" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Mensagem</label>
          <textarea v-model="formData.mensagem" placeholder="Ex: Desconto de 50% em produtos selecionados" class="w-full p-2 rounded bg-slate-700 border border-blue-500 text-white h-20 resize-none"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold mb-2">Selecionar Lojas</label>
          <div class="bg-slate-700 rounded p-3 border border-blue-500 max-h-40 overflow-y-auto">
            <label v-for="loja in lojas" :key="loja" class="flex items-center mb-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="formData.lojas.includes(loja)"
                @change="toggleLoja(loja)"
                class="mr-2"
              />
              <span>{{ loja }}</span>
            </label>
            <label class="flex items-center font-bold text-blue-400 mt-3 pt-3 border-t border-blue-500">
              <input
                type="checkbox"
                :checked="formData.lojas.length === lojas.length"
                @change="toggleAllLojas"
                class="mr-2"
              />
              <span>Selecionar Todas</span>
            </label>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="saveAviso"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition"
          >
            Salvar
          </button>
          <button
            @click="closeForm"
            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <style>
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      .animate-scroll {
        animation: scroll 20s linear infinite;
      }

      .animate-scroll:hover {
        animation-play-state: paused;
      }
    </style>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const showForm = ref(false)
const isPaused = ref(false)
const avisos = ref([
  {
    id: 1,
    titulo: 'Promoção Especial',
    mensagem: 'Desconto de 30% em eletrônicos! Válido até o final do mês.',
    tipo: 'promocao',
    lojas: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']
  },
  {
    id: 2,
    titulo: 'Atualização de Horário',
    mensagem: 'Nova loja aberta em Brasília. Horário: 9h-20h',
    tipo: 'info',
    lojas: ['Brasília', 'Goiânia']
  },
  {
    id: 3,
    titulo: 'Alerta de Estoque',
    mensagem: 'Reposição de produtos hoje à noite. Prepare os corredores!',
    tipo: 'alerta',
    lojas: ['Todas']
  }
])

const lojas = ref(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Goiânia', 'Salvador', 'Recife', 'Manaus'])

const formData = ref({
  titulo: '',
  mensagem: '',
  tipo: 'info',
  lojas: []
})

// Computed
const avisosDuplicated = computed(() => {
  // Duplica os avisos para efeito de ticker infinito
  return [...avisos.value, ...avisos.value]
})

// Methods
const pauseAnimation = () => {
  isPaused.value = !isPaused.value
  const element = document.querySelector('.animate-scroll')
  if (element) {
    if (isPaused.value) {
      element.style.animationPlayState = 'paused'
    } else {
      element.style.animationPlayState = 'running'
    }
  }
}

const deleteAviso = (index) => {
  avisos.value.splice(index, 1)
}

const toggleLoja = (loja) => {
  const idx = formData.value.lojas.indexOf(loja)
  if (idx > -1) {
    formData.value.lojas.splice(idx, 1)
  } else {
    formData.value.lojas.push(loja)
  }
}

const toggleAllLojas = () => {
  if (formData.value.lojas.length === lojas.value.length) {
    formData.value.lojas = []
  } else {
    formData.value.lojas = [...lojas.value]
  }
}

const saveAviso = () => {
  if (!formData.value.titulo || !formData.value.mensagem || formData.value.lojas.length === 0) {
    alert('Preencha todos os campos!')
    return
  }

  avisos.value.push({
    id: Date.now(),
    titulo: formData.value.titulo,
    mensagem: formData.value.mensagem,
    tipo: formData.value.tipo,
    lojas: formData.value.lojas
  })

  closeForm()
}

const closeForm = () => {
  showForm.value = false
  formData.value = {
    titulo: '',
    mensagem: '',
    tipo: 'info',
    lojas: []
  }
}

const getTipoColor = (tipo) => {
  if (tipo === 'promocao') return 'text-green-400'
  if (tipo === 'alerta') return 'text-red-400'
  return 'text-blue-400'
}
</script>

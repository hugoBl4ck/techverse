<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const inventario = ref([])

async function fetchPecas() {
  const pecasCol = collection(db, 'pecas')
  const pecasSnapshot = await getDocs(pecasCol)
  const pecasList = pecasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  inventario.value = pecasList
}

onMounted(() => {
  fetchPecas()
})

const cpus = computed(() => inventario.value.filter(p => p.tipo === 'cpu'))
const placasMae = computed(() => inventario.value.filter(p => p.tipo === 'placa-mae'))
const rams = computed(() => inventario.value.filter(p => p.tipo === 'ram'))
const gpus = computed(() => inventario.value.filter(p => p.tipo === 'gpu'))
const storages = computed(() => inventario.value.filter(p => p.tipo === 'armazenamento'))
const psus = computed(() => inventario.value.filter(p => p.tipo === 'fonte'))
const cases = computed(() => inventario.value.filter(p => p.tipo === 'gabinete'))

</script>

<template>
  <div class="grid grid-cols-2 gap-6 p-6">
    <!-- Coluna 1: Caixa de Lego (Inventário) -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Peças Disponíveis</h2>

      <div class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>CPUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="cpu in cpus" :key="cpu.id" class="mb-2">
              {{ cpu.nome }} (Estoque: {{ cpu.estoque }})
            </div>
            <div v-if="cpus.length === 0">Nenhuma CPU disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placas-Mãe</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="placa in placasMae" :key="placa.id" class="mb-2">
              {{ placa.nome }} (Estoque: {{ placa.estoque }})
            </div>
            <div v-if="placasMae.length === 0">Nenhuma Placa-Mãe disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memórias RAM</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="ram in rams" :key="ram.id" class="mb-2">
              {{ ram.nome }} (Estoque: {{ ram.estoque }})
            </div>
            <div v-if="rams.length === 0">Nenhuma Memória RAM disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GPUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="gpu in gpus" :key="gpu.id" class="mb-2">
              {{ gpu.nome }} (Estoque: {{ gpu.estoque }})
            </div>
            <div v-if="gpus.length === 0">Nenhuma GPU disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="storage in storages" :key="storage.id" class="mb-2">
              {{ storage.nome }} (Estoque: {{ storage.estoque }})
            </div>
            <div v-if="storages.length === 0">Nenhum Armazenamento disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fontes</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="psu in psus" :key="psu.id" class="mb-2">
              {{ psu.nome }} (Estoque: {{ psu.estoque }})
            </div>
            <div v-if="psus.length === 0">Nenhuma Fonte disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gabinetes</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="caseItem in cases" :key="caseItem.id" class="mb-2">
              {{ caseItem.nome }} (Estoque: {{ caseItem.estoque }})
            </div>
            <div v-if="cases.length === 0">Nenhum Gabinete disponível.</div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Coluna 2: Área de Montagem (Kit) -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Kit Atual</h2>

      <div class="space-y-4">
        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot Placa-Mãe</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Peça da Placa-Mãe arrastada aqui -->
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Peça da CPU arrastada aqui -->
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot RAM 1</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Peça da RAM arrastada aqui -->
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot RAM 2</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Peça da RAM arrastada aqui -->
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import draggable from 'vuedraggable'

const inventario = ref([])

// Refs para os slots do kit
const kitPlacaMae = ref([])
const kitCpu = ref([])
const kitRam1 = ref([])
const kitRam2 = ref([])
const kitGpu = ref([])
const kitStorage = ref([])
const kitPsu = ref([])
const kitCase = ref([])

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
            <draggable
              :list="cpus"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="cpus.length === 0">Nenhuma CPU disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placas-Mãe</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="placasMae"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="placasMae.length === 0">Nenhuma Placa-Mãe disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memórias RAM</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="rams"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="rams.length === 0">Nenhuma Memória RAM disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GPUs</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="gpus"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="gpus.length === 0">Nenhuma GPU disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="storages"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="storages.length === 0">Nenhum Armazenamento disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fontes</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="psus"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
            <div v-if="psus.length === 0">Nenhuma Fonte disponível.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gabinetes</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              :list="cases"
              :group="{ name: 'pecas', pull: 'clone', put: false }"
              item-key="id"
              class="min-h-[50px]"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }} (Estoque: {{ element.estoque }})
                </div>
              </template>
            </draggable>
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
            <draggable
              v-model="kitPlacaMae"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitCpu"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot RAM 1</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitRam1"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot RAM 2</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitRam2"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot GPU</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitGpu"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitStorage"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot Fonte</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitPsu"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>

        <Card class="min-h-[100px]">
          <CardHeader>
            <CardTitle>Slot Gabinete</CardTitle>
          </CardHeader>
          <CardContent>
            <draggable
              v-model="kitCase"
              group="pecas"
              item-key="id"
              class="min-h-[50px] p-2 border-dashed border-border rounded-md"
            >
              <template #item="{ element }">
                <div class="mb-2 p-2 border rounded-md bg-card">
                  {{ element.nome }}
                </div>
              </template>
            </draggable>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

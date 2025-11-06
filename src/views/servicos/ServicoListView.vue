<script setup>
import { ref, computed } from 'vue'
import Calendar from '@/components/ui/calendar/Calendar.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const selectedDate = ref(new Date())

const services = [
  {
    id: '1',
    client: 'John Doe',
    service: 'Troca de óleo',
    date: '2025-11-06'
  },
  {
    id: '2',
    client: 'Jane Smith',
    service: 'Alinhamento e balanceamento',
    date: '2025-11-06'
  },
  {
    id: '3',
    client: 'Peter Jones',
    service: 'Troca de pastilhas de freio',
    date: '2025-11-07'
  }
]

const filteredServices = computed(() => {
  return services.filter((service) => {
    const serviceDate = new Date(service.date)
    serviceDate.setUTCHours(0, 0, 0, 0)
    const selected = new Date(selectedDate.value)
    selected.setUTCHours(0, 0, 0, 0)
    return serviceDate.getTime() === selected.getTime()
  })
})
</script>

<template>
  <main class="flex-1 p-4 md:p-6">
    <div class="flex items-center mb-4">
      <h1 class="text-2xl font-bold">Agenda de Serviços</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="md:col-span-1">
        <CardHeader>
          <CardTitle>Selecione uma data</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar v-model="selectedDate" />
        </CardContent>
      </Card>
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Serviços para {{ selectedDate.toLocaleDateString() }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul v-if="filteredServices.length > 0" class="space-y-2">
            <li v-for="service in filteredServices" :key="service.id">
              <strong>{{ service.client }}</strong> - {{ service.service }}
            </li>
          </ul>
          <p v-else class="text-muted-foreground">Nenhum serviço agendado para esta data.</p>
        </CardContent>
      </Card>
      </div>
    </main>
</template>

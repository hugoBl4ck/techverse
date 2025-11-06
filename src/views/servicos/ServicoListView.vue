<script setup>
import { ref } from 'vue'
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
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Agenda de Serviços</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-1">
        <Calendar v-model="selectedDate" />
      </div>
      <div class="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Serviços para {{ selectedDate.toLocaleDateString() }}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul v-if="services.filter(s => {
                const serviceDate = new Date(s.date);
                serviceDate.setHours(0, 0, 0, 0);
                const selected = new Date(selectedDate);
                selected.setHours(0, 0, 0, 0);
                return serviceDate.getTime() === selected.getTime();
              }).length > 0">
              <li v-for="service in services.filter(s => {
                const serviceDate = new Date(s.date);
                serviceDate.setHours(0, 0, 0, 0);
                const selected = new Date(selectedDate);
                selected.setHours(0, 0, 0, 0);
                return serviceDate.getTime() === selected.getTime();
              })" :key="service.id">
                <strong>{{ service.client }}</strong> - {{ service.service }}</li>
            </ul>
            <p v-else>
              Nenhum serviço agendado para esta data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

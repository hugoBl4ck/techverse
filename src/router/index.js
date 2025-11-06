import { createRouter, createWebHistory } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'clientes',
        name: 'ClientesList',
        component: () => import('@/views/clientes/ClienteListView.vue'),
        meta: { title: 'Clientes' }
      },
      {
        path: 'clientes/novo',
        name: 'ClienteNovo',
        component: () => import('@/views/clientes/ClienteFormView.vue'),
        meta: { title: 'Novo Cliente' }
      },
      {
        path: 'clientes/:id',
        name: 'ClienteDetalhe',
        component: () => import('@/views/clientes/ClienteDetalheView.vue'),
        props: true,
        meta: { title: 'Detalhes do Cliente' }
      },
      {
        path: 'clientes/:id/editar',
        name: 'ClienteEditar',
        component: () => import('@/views/clientes/ClienteFormView.vue'),
        props: true,
        meta: { title: 'Editar Cliente' }
      },
      {
        path: 'servicos',
        name: 'ServicosList',
        component: () => import('@/views/servicos/ServicoListView.vue'),
        meta: { title: 'Todos os Serviços' }
      },
      {
        path: 'servicos/novo/:clienteId',
        name: 'ServicoNovo',
        component: () => import('@/views/servicos/ServicoFormView.vue'),
        props: true,
        meta: { title: 'Novo Serviço' }
      },
      {
        path: 'inventario',
        name: 'InventarioList',
        component: () => import('@/views/inventario/InventarioListView.vue'),
        meta: { title: 'Inventário' }
      },
      {
        path: 'inventario/novo',
        name: 'PecaNova',
        component: () => import('@/views/inventario/PecaFormView.vue'),
        meta: { title: 'Nova Peça' }
      },
      {
        path: 'inventario/:id/editar',
        name: 'PecaEditar',
        component: () => import('@/views/inventario/PecaFormView.vue'),
        props: true,
        meta: { title: 'Editar Peça' }
      },
      {
        path: 'kits',
        name: 'KitsList',
        component: () => import('@/views/kits/KitListView.vue'),
        meta: { title: 'Kits Salvos' }
      },
      {
        path: 'kits/builder',
        name: 'KitBuilder',
        component: () => import('@/views/kits/KitBuilderView.vue'),
        meta: { title: 'Montador de Kits' }
      },
      {
        path: 'kits/:id',
        name: 'KitDetalhe',
        component: () => import('@/views/kits/KitDetalheView.vue'),
        props: true,
        meta: { title: 'Detalhes do Kit' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `TechVerse - ${to.meta.title || 'Gestão'}`
  next()
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
  {
    path: '/admin',
    component: AppLayout, // Assuming admin panel uses the same layout
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('@/views/AdminView.vue'),
        meta: { title: 'Painel Administrativo', requiresAdmin: true }
      }
    ]
  },
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
        path: 'servicos/novo',
        name: 'ServicoNovo',
        component: () => import('@/views/servicos/ServicoFormView.vue'),
        meta: { title: 'Novo Serviço' }
      },
      {
        path: 'servicos/:id/editar',
        name: 'ServicoEditar',
        component: () => import('@/views/servicos/ServicoFormView.vue'),
        props: true,
        meta: { title: 'Editar Serviço' }
      },
      {
        path: 'servicos-predefinidos',
        name: 'ServicosPredefinidosList',
        component: () => import('@/views/servicos-predefinidos/ServicoPredefinidoListView.vue'),
        meta: { title: 'Serviços Predefinidos' }
      },
      {
        path: 'servicos-predefinidos/novo',
        name: 'ServicoPredefinidoNovo',
        component: () => import('@/views/servicos-predefinidos/ServicoPredefinidoFormView.vue'),
        meta: { title: 'Novo Serviço Predefinido' }
      },
      {
        path: 'inventario',
        name: 'InventarioList',
        component: () => import('@/views/inventario/InventarioListView.vue'),
        meta: { title: 'Inventário' }
      },
      {
        path: 'inventario/novo',
        name: 'ItemNovo',
        component: () => import('@/views/inventario/ItemFormView.vue'),
        meta: { title: 'Novo Item' }
      },
      {
        path: 'inventario/:id/editar',
        name: 'ItemEditar',
        component: () => import('@/views/inventario/ItemFormView.vue'),
        props: true,
        meta: { title: 'Editar Item' }
      },
      {
        path: '/inventario/importar-ia',
        name: 'InventarioImportarIA',
        component: () => import('@/views/inventario/ImportadorIAView.vue'),
        meta: { title: 'Importar com IA' }
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

router.beforeEach(async (to, from, next) => {
  document.title = `TechVerse - ${to.meta.title || 'Gestão'}`;
  next();
});

export default router


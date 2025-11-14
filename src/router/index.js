import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useCurrentStore } from "@/composables/useCurrentStore";

const routes = [
  {
    path: "/",
    redirect: "/landing",
  },
  {
    path: "/landing",
    name: "Landing",
    component: () => import("@/views/LandingView.vue"),
    meta: {
      title: "TechVerse - Gerenciador de TI para Técnicos",
      requiresAuth: false,
    },
  },
  {
    path: "/donate",
    name: "Donate",
    component: () => import("@/views/DonationPage.vue"),
    meta: { title: "Apoie o TechVerse", requiresAuth: false },
  },
  {
    path: "/noticias",
    name: "News",
    component: () => import("@/views/NewsPage.vue"),
    meta: { title: "Notícias TechVerse", requiresAuth: false },
  },
  {
    path: "/promocoes",
    name: "Promos",
    component: () => import("@/views/PromosPage.vue"),
    meta: { title: "Promoções TechVerse", requiresAuth: false },
  },
  {
    path: "/atualizacoes",
    name: "Updates",
    component: () => import("@/views/UpdatesPage.vue"),
    meta: { title: "Atualizações TechVerse", requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { title: "Login", requiresAuth: false },
  },
  {
    path: "/admin",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Admin",
        component: () => import("@/views/AdminView.vue"),
        meta: { title: "Painel Administrativo", requiresAdmin: true },
      },
    ],
  },
  {
    path: "/app",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: { title: "Dashboard" },
      },
      {
        path: "marketing",
        name: "Marketing",
        component: () => import("@/views/marketing/SalesCopyGeneratorView.vue"),
        meta: { title: "Assistente de Marketing" },
      },
      {
        path: "clientes",
        name: "ClientesList",
        component: () => import("@/views/clientes/ClienteListView.vue"),
        meta: { title: "Clientes" },
      },
      {
        path: "clientes/novo",
        name: "ClienteNovo",
        component: () => import("@/views/clientes/ClienteFormView.vue"),
        meta: { title: "Novo Cliente" },
      },
      {
        path: "clientes/:id",
        name: "ClienteDetalhe",
        component: () => import("@/views/clientes/ClienteDetalheView.vue"),
        props: true,
        meta: { title: "Detalhes do Cliente" },
      },
      {
        path: "clientes/:id/editar",
        name: "ClienteEditar",
        component: () => import("@/views/clientes/ClienteFormView.vue"),
        props: true,
        meta: { title: "Editar Cliente" },
      },
      {
        path: "ordens-servico",
        name: "OrdensServicoList",
        component: () =>
          import("@/views/ordens-servico/OrdemServicoListView.vue"),
        meta: { title: "Ordens de Serviço" },
      },
      {
        path: "ordens-servico/nova",
        name: "OrdemServicoNova",
        component: () =>
          import("@/views/ordens-servico/OrdemServicoFormView.vue"),
        meta: { title: "Nova Ordem de Serviço" },
      },
      {
        path: "ordens-servico/:id/editar",
        name: "OrdemServicoEditar",
        component: () =>
          import("@/views/ordens-servico/OrdemServicoFormView.vue"),
        props: true,
        meta: { title: "Editar Ordem de Serviço" },
      },
      {
        path: "catalogo-servicos",
        name: "CatalogoServicosList",
        component: () =>
          import(
            "@/views/servicos-predefinidos/ServicoPredefinidoListView.vue"
          ),
        meta: { title: "Catálogo de Serviços" },
      },
      {
        path: "catalogo-servicos/novo",
        name: "CatalogoServicosNovo",
        component: () =>
          import(
            "@/views/servicos-predefinidos/ServicoPredefinidoFormView.vue"
          ),
        meta: { title: "Novo Serviço do Catálogo" },
      },
      {
        path: "inventario",
        name: "InventarioList",
        component: () => import("@/views/inventario/InventarioListView.vue"),
        meta: { title: "Inventário" },
      },
      {
        path: "inventario/novo",
        name: "ItemNovo",
        component: () => import("@/views/inventario/ItemFormView.vue"),
        meta: { title: "Novo Item" },
      },
      {
        path: "inventario/:id/editar",
        name: "ItemEditar",
        component: () => import("@/views/inventario/ItemFormView.vue"),
        props: true,
        meta: { title: "Editar Item" },
      },
      {
        path: "inventario/importar-ia",
        name: "InventarioImportarIA",
        component: () => import("@/views/inventario/ImportadorIAView.vue"),
        meta: { title: "Importar com IA" },
      },
      {
        path: "kits",
        name: "KitsList",
        component: () => import("@/views/kits/KitListView.vue"),
        meta: { title: "Kits Salvos" },
      },
      {
        path: "kits/builder",
        name: "KitBuilder",
        component: () => import("@/views/kits/KitBuilderView.vue"),
        meta: { title: "Montador de Kits" },
      },
      {
        path: "kits/:id",
        name: "KitDetalhe",
        component: () => import("@/views/kits/KitDetalheView.vue"),
        props: true,
        meta: { title: "Detalhes do Kit" },
      },
      {
        path: "exportar-dados",
        name: "ExportarDados",
        component: () => import("@/views/ExportadorDadosView.vue"),
        meta: { title: "Exportar Dados" },
      },
      {
        path: "test-visuals",
        name: "TestVisuals",
        component: () => import("@/views/TestVisualsView.vue"),
        meta: { title: "Teste de Melhorias Visuais" },
      },
      {
        path: "financeiro",
        name: "DashboardFinanceiro",
        component: () =>
          import("@/views/financeiro/DashboardFinanceiroView.vue"),
        meta: { title: "Dashboard Financeiro" },
      },
      {
        path: "financeiro/produtos",
        name: "GerenciamentoProdutos",
        component: () =>
          import("@/views/financeiro/GerenciamentoProdutosView.vue"),
        meta: { title: "Gerenciamento de Produtos" },
      },
      {
        path: "financeiro/transacoes",
        name: "RegistroTransacoes",
        component: () =>
          import("@/views/financeiro/RegistroTransacoesView.vue"),
        meta: { title: "Registro de Transações" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Página Não Encontrada", requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { authReady, isAuthenticated } = useCurrentStore();

  // Wait for firebase auth to be ready
  await authReady;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  document.title = `TechVerse - ${
    to.meta.title || "Gestão"
  } | Criado por Hugo, BLK Studio`;

  if (requiresAuth && !isAuthenticated.value) {
    // This route requires auth, check if logged in
    // if not, redirect to login page.
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && isAuthenticated.value) {
    // If user is authenticated, redirect away from login page
    next({ name: "Dashboard" });
  } else {
    // make sure to always call next()!!!
    next();
  }
});

export default router;

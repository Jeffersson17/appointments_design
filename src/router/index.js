import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { canAccessRoute } from '@/utils/permissions'
import { getHomeRouteByRole, isClientRole, isStaffRole } from '@/utils/navigation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: 'Entrar' },
        },
      ],
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true, panelOnly: true },
      children: [
        {
          path: '',
          redirect: { name: 'dashboard' },
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'enterprises',
          name: 'enterprises',
          component: () => import('@/views/EnterprisesView.vue'),
          meta: { title: 'Empresas' },
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('@/views/ClientsView.vue'),
          meta: { title: 'Clientes' },
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
          meta: { title: 'Serviços' },
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('@/views/AppointmentsView.vue'),
          meta: { title: 'Agendamentos' },
        },
      ],
    },
    {
      path: '/cliente',
      component: () => import('@/layouts/ClientLayout.vue'),
      meta: { requiresAuth: true, clientOnly: true },
      children: [
        {
          path: '',
          redirect: { name: 'client-booking' },
        },
        {
          path: 'agendar',
          name: 'client-booking',
          component: () => import('@/views/client/BookingView.vue'),
          meta: { title: 'Agendar' },
        },
        {
          path: 'historico',
          name: 'client-history',
          component: () => import('@/views/client/HistoryView.vue'),
          meta: { title: 'Histórico' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * Guard preparado para autenticação JWT e permissões por perfil.
 * ADMIN / ENTERPRISE → painel (/app)
 * CLIENT → tela de agendamento (/cliente/agendar)
 */
router.beforeEach((to) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)
  const panelOnly = to.matched.some((record) => record.meta.panelOnly)
  const clientOnly = to.matched.some((record) => record.meta.clientOnly)

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (guestOnly && auth.isAuthenticated) {
    return getHomeRouteByRole(auth.role)
  }

  if (panelOnly && isClientRole(auth.role)) {
    return getHomeRouteByRole(auth.role)
  }

  if (clientOnly && isStaffRole(auth.role)) {
    return getHomeRouteByRole(auth.role)
  }

  if (requiresAuth && to.name && !canAccessRoute(auth.role, String(to.name))) {
    return getHomeRouteByRole(auth.role)
  }

  return true
})

router.afterEach((to) => {
  const pageTitle = to.meta.title
  document.title = pageTitle
    ? `${pageTitle} · Agenduo`
    : 'Agenduo'
})

export default router

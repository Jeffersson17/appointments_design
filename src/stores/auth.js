import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { resolveMockUserByEmail } from '@/mocks/user'
import { canAccessRoute, hasPermission } from '@/utils/permissions'
import { getHomeRouteByRole } from '@/utils/navigation'
// import { loginRequest, fetchCurrentUser, logoutRequest } from '@/api/auth'

const USER_STORAGE_KEY = 'auth_user'

const readStoredUser = () => {
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const storedUser = readStoredUser()
  const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated') === 'true')
  const accessToken = ref(sessionStorage.getItem('access_token'))
  const refreshToken = ref(sessionStorage.getItem('refresh_token'))
  const selectedEnterpriseId = ref(
    sessionStorage.getItem('selected_enterprise_id')
      ? Number(sessionStorage.getItem('selected_enterprise_id'))
      : null,
  )

  const user = ref(isAuthenticated.value && storedUser ? storedUser : null)

  const role = computed(() => user.value?.role ?? null)
  const userName = computed(() => user.value?.name ?? '')
  const userEmail = computed(() => user.value?.email ?? '')
  const homeRoute = computed(() => getHomeRouteByRole(role.value))

  /**
   * Login visual para desenvolvimento.
   * O e-mail define o perfil mockado (ADMIN / ENTERPRISE / CLIENT).
   * Futuramente: JWT + usuário da API Django.
   */
  const login = async (email, _password) => {
    // const { data } = await loginRequest({ email, password: _password })
    // accessToken.value = data.access
    // refreshToken.value = data.refresh
    // sessionStorage.setItem('access_token', data.access)
    // sessionStorage.setItem('refresh_token', data.refresh)
    // const me = await fetchCurrentUser()
    // user.value = me.data

    const nextUser = resolveMockUserByEmail(email)
    user.value = nextUser
    isAuthenticated.value = true
    selectedEnterpriseId.value = nextUser.enterpriseId ?? null

    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))

    if (nextUser.enterpriseId != null) {
      sessionStorage.setItem(
        'selected_enterprise_id',
        String(nextUser.enterpriseId),
      )
    } else {
      sessionStorage.removeItem('selected_enterprise_id')
    }

    if (!accessToken.value) {
      accessToken.value = 'mock-jwt-token'
      sessionStorage.setItem('access_token', accessToken.value)
    }

    return nextUser
  }

  const logout = async () => {
    // try { await logoutRequest() } catch (_) { /* ignore */ }

    user.value = null
    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    selectedEnterpriseId.value = null

    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')
    sessionStorage.removeItem('selected_enterprise_id')
    sessionStorage.removeItem(USER_STORAGE_KEY)
  }

  const setSelectedEnterprise = (enterpriseId) => {
    selectedEnterpriseId.value = enterpriseId
    if (enterpriseId == null) {
      sessionStorage.removeItem('selected_enterprise_id')
    } else {
      sessionStorage.setItem('selected_enterprise_id', String(enterpriseId))
    }
  }

  const can = (allowedRoles) => hasPermission(role.value, allowedRoles)

  const canViewRoute = (routeName) => canAccessRoute(role.value, routeName)

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    user,
    role,
    userName,
    userEmail,
    homeRoute,
    selectedEnterpriseId,
    login,
    logout,
    setSelectedEnterprise,
    can,
    canViewRoute,
  }
})

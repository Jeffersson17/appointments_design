import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginService, logout as logoutService } from '@/services/authService'
import { canAccessRoute, hasPermission } from '@/utils/permissions'
import { getHomeRouteByRole } from '@/utils/navigation'

const USER_STORAGE_KEY = 'auth_user'

const readStoredUser = () => {
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistSession = ({ user, accessToken, refreshToken }) => {
  sessionStorage.setItem('isAuthenticated', 'true')
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  sessionStorage.setItem('access_token', accessToken)

  if (refreshToken) {
    sessionStorage.setItem('refresh_token', refreshToken)
  } else {
    sessionStorage.removeItem('refresh_token')
  }

  if (user.enterpriseId != null) {
    sessionStorage.setItem('selected_enterprise_id', String(user.enterpriseId))
  } else {
    sessionStorage.removeItem('selected_enterprise_id')
  }
}

const clearSessionStorage = () => {
  sessionStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('selected_enterprise_id')
  sessionStorage.removeItem(USER_STORAGE_KEY)
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
   * Aceita login(email, password) ou login({ email, password }).
   */
  const login = async (emailOrCredentials, passwordArg) => {
    const credentials =
      typeof emailOrCredentials === 'object' && emailOrCredentials !== null
        ? {
            email: emailOrCredentials.email,
            password: emailOrCredentials.password,
          }
        : {
            email: emailOrCredentials,
            password: passwordArg,
          }

    const result = await loginService(credentials)

    user.value = result.user
    isAuthenticated.value = true
    accessToken.value = result.accessToken
    refreshToken.value = result.refreshToken
    selectedEnterpriseId.value = result.user.enterpriseId ?? null

    persistSession(result)
    return result.user
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch {
      /* ignora */
    }

    user.value = null
    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    selectedEnterpriseId.value = null
    clearSessionStorage()
  }

  const clearAuth = () => {
    user.value = null
    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    selectedEnterpriseId.value = null
    clearSessionStorage()
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
    clearAuth,
    setSelectedEnterprise,
    can,
    canViewRoute,
  }
})

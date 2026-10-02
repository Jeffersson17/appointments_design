import { ROLES } from '@/types/roles'

/**
 * Permissões por rota (nome da rota Vue Router).
 * Array vazio = qualquer usuário autenticado.
 */
export const ROUTE_PERMISSIONS = {
  dashboard: [ROLES.ADMIN, ROLES.ENTERPRISE],
  enterprises: [ROLES.ADMIN],
  clients: [ROLES.ADMIN, ROLES.ENTERPRISE],
  services: [ROLES.ADMIN, ROLES.ENTERPRISE],
  appointments: [ROLES.ADMIN, ROLES.ENTERPRISE],
  'client-booking': [ROLES.CLIENT],
  'client-history': [ROLES.CLIENT],
}

export const hasPermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false
  if (!allowedRoles.length) return true
  return allowedRoles.includes(userRole)
}

export const canAccessRoute = (userRole, routeName) => {
  const allowed = ROUTE_PERMISSIONS[routeName]
  if (allowed === undefined) return true
  return hasPermission(userRole, allowed)
}

import { ROLES } from '@/types/roles'

/**
 * Destino inicial após login, conforme o perfil do usuário.
 */
export const getHomeRouteByRole = (role) => {
  if (role === ROLES.CLIENT) {
    return { name: 'client-booking' }
  }
  return { name: 'dashboard' }
}

export const isClientRole = (role) => role === ROLES.CLIENT

export const isStaffRole = (role) =>
  role === ROLES.ADMIN || role === ROLES.ENTERPRISE

import { ROLES } from '@/types/roles'

/** Usuários mockados para desenvolvimento visual por perfil. */
export const mockUsers = {
  [ROLES.ADMIN]: {
    id: 1,
    name: 'João Silva',
    email: 'joao@agendapro.com',
    role: ROLES.ADMIN,
    avatarUrl: null,
    enterpriseId: null,
  },
  [ROLES.ENTERPRISE]: {
    id: 2,
    name: 'Carlos Mendes',
    email: 'empresa@agendapro.com',
    role: ROLES.ENTERPRISE,
    avatarUrl: null,
    enterpriseId: 1,
  },
  [ROLES.CLIENT]: {
    id: 3,
    name: 'Ricardo Oliveira',
    email: 'cliente@agendapro.com',
    role: ROLES.CLIENT,
    avatarUrl: null,
    enterpriseId: 1,
  },
}

/** Usuário padrão (painel administrativo). */
export const mockCurrentUser = mockUsers[ROLES.ADMIN]

/**
 * Resolve usuário mock pelo e-mail informado no login.
 * Útil para testar redirecionamento por ROLE sem API.
 */
export const resolveMockUserByEmail = (email = '') => {
  const normalized = email.trim().toLowerCase()
  const found = Object.values(mockUsers).find(
    (user) => user.email.toLowerCase() === normalized,
  )
  return found ? { ...found } : { ...mockCurrentUser }
}

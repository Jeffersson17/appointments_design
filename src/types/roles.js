/**
 * Perfis de acesso previstos para integração com a API Django.
 * Valores em maiúsculas para alinhar com o backend.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  ENTERPRISE: 'ENTERPRISE',
  CLIENT: 'CLIENT',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.ENTERPRISE]: 'Empresa',
  [ROLES.CLIENT]: 'Cliente',
}

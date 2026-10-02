import api from './client'

/**
 * Endpoints de autenticação JWT (Django REST Framework).
 * Preparados para uso futuro — não são chamados automaticamente.
 *
 * Exemplos esperados:
 *   POST /auth/login/
 *   POST /auth/refresh/
 *   GET  /auth/me/
 */

export const loginRequest = (credentials) =>
  api.post('/auth/login/', credentials)

export const refreshTokenRequest = (refresh) =>
  api.post('/auth/refresh/', { refresh })

export const fetchCurrentUser = () => api.get('/auth/me/')

export const logoutRequest = () => api.post('/auth/logout/')

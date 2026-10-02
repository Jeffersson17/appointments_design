import axios from 'axios'

/**
 * Cliente HTTP centralizado para a API Django REST Framework.
 * Base URL: VITE_API_URL (arquivo .env)
 *
 * Não chama endpoints automaticamente — apenas prepara o cliente.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      sessionStorage.removeItem('isAuthenticated')
    }
    return Promise.reject(error)
  },
)

export default api

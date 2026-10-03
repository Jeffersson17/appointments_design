import api from './client'

export const loginRequest = (credentials) =>
  api.post('/login/', credentials)

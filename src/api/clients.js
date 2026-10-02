import api from './client'

/**
 * Endpoints de clientes — prontos para a API Django.
 */

export const fetchClients = (params) => api.get('/clients/', { params })

export const fetchClient = (id) => api.get(`/clients/${id}/`)

export const createClient = (payload) => api.post('/clients/', payload)

export const updateClient = (id, payload) =>
  api.patch(`/clients/${id}/`, payload)

export const deleteClient = (id) => api.delete(`/clients/${id}/`)

import api from './client'

export const fetchServices = (params) => api.get('/services/', { params })
export const fetchService = (id) => api.get(`/services/${id}/`)
export const createService = (payload) => api.post('/services/', payload)
export const updateService = (id, payload) =>
  api.patch(`/services/${id}/`, payload)
export const deleteService = (id) => api.delete(`/services/${id}/`)

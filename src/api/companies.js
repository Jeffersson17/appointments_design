import api from './client'

export const fetchCompanies = (params) => api.get('/enterprises/', { params })
export const fetchCompany = (id) => api.get(`/enterprises/${id}/`)
export const createCompany = (payload) => api.post('/enterprises/', payload)
export const updateCompany = (id, payload) =>
  api.patch(`/enterprises/${id}/`, payload)
export const deleteCompany = (id) => api.delete(`/enterprises/${id}/`)

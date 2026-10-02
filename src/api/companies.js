import api from './client'

/**
 * Endpoints de empresas — prontos para a API Django.
 * Não são chamados automaticamente enquanto a API não existir.
 */

export const fetchCompanies = (params) => api.get('/companies/', { params })

export const fetchCompany = (id) => api.get(`/companies/${id}/`)

export const createCompany = (payload) => api.post('/companies/', payload)

export const updateCompany = (id, payload) =>
  api.patch(`/companies/${id}/`, payload)

export const deleteCompany = (id) => api.delete(`/companies/${id}/`)

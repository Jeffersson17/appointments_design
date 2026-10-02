import api from './client'

/**
 * Endpoints de agendamentos — prontos para a API Django.
 */

export const fetchAppointments = (params) =>
  api.get('/appointments/', { params })

export const fetchAppointment = (id) => api.get(`/appointments/${id}/`)

export const createAppointment = (payload) =>
  api.post('/appointments/', payload)

export const updateAppointment = (id, payload) =>
  api.patch(`/appointments/${id}/`, payload)

export const deleteAppointment = (id) => api.delete(`/appointments/${id}/`)

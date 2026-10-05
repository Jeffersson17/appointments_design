import api from './client'

export const fetchAppointments = (params) =>
  api.get('/appointments/', { params })
export const fetchAppointment = (id) => api.get(`/appointments/${id}/`)
export const createAppointment = (payload) =>
  api.post('/appointments/', payload)
export const updateAppointment = (id, payload) =>
  api.patch(`/appointments/${id}/`, payload)
export const deleteAppointment = (id) => api.delete(`/appointments/${id}/`)

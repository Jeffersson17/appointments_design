import {
  fetchServices,
  deleteService,
  createService as createServiceRequest,
  updateService as updateServiceRequest,
} from '@/api/services'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getServices = async () => {
  await delay()
  return (await fetchServices()).data
}

export const removeService = async (id) => {
  await delay()
  await deleteService(id)
}

export const createService = async (payload) => {
  await delay(250)
  return (await createServiceRequest(payload)).data
}

export const updateService = async (id, payload) => {
  await delay(250)
  return (await updateServiceRequest(id, payload)).data
}

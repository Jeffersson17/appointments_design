import { fetchServices, deleteService } from '@/api/services'

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
  const service = {
    id: Date.now(),
    name: payload.name.trim(),
    price: Number(payload.price),
    durationMinutes: Number(payload.durationMinutes),
  }
  services = [service, ...services]
  // return (await createServiceRequest(payload)).data
  return { ...service }
}

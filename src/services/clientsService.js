import { 
  fetchClients, 
  deleteClient,
  createClient as createClientRequest,
  updateClient as updateClientRequest
} from '@/api/clients'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getClients = async () => {
  await delay()
  return (await fetchClients()).data
}

export const removeClient = async (id) => {
  await delay()
  await deleteClient(id)
}

export const createClient = async (payload) => {
  await delay(250)
  return (await createClientRequest(payload)).data
}

export const updateClient = async (id, payload) => {
  await delay(250)
  return (await updateClientRequest(id, payload)).data
}

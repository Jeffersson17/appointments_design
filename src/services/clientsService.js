import { fetchClients, deleteClient } from '@/api/clients'
import { createClient as createClientRequest } from '@/api/clients'

let clients = []

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getClients = async () => {
  await delay()
  return (await fetchClients()).data
}

export const removeClient = async (id) => {
  await delay()
  clients = clients.filter((item) => item.id !== id)
  // await deleteClient(id)
}

export const createClient = async (payload) => {
  await delay(250)
  return (await createClientRequest(payload)).data
}

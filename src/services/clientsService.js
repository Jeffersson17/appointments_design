import { mockClients } from '@/mocks/clients'
// import { fetchClients, deleteClient } from '@/api/clients'

let clients = mockClients.map((item) => ({ ...item }))

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getClients = async () => {
  await delay()
  // return (await fetchClients()).data
  return clients.map((item) => ({ ...item }))
}

export const removeClient = async (id) => {
  await delay()
  clients = clients.filter((item) => item.id !== id)
  // await deleteClient(id)
}

export const createClient = async (payload) => {
  await delay(250)
  const client = {
    id: Date.now(),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    companyName: payload.companyName.trim(),
  }
  clients = [client, ...clients]
  // return (await createClientRequest(payload)).data
  return { ...client }
}

import { fetchCompanies, deleteCompany } from '@/api/companies'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getCompanies = async () => {
  await delay()
  return (await fetchCompanies()).data
}

export const toggleCompanyStatus = async (id) => {
  await delay()
  const company = companies.find((item) => item.id === id)
  if (!company) throw new Error('Empresa não encontrada')
  // await updateCompany(id, { status: company.status })
  return { ...company }
}

export const removeCompany = async (id) => {
  await delay()
  await deleteCompany(id)
}

export const createCompany = async (payload) => {
  await delay(250)
  const company = {
    id: Date.now(),
    name: payload.name.trim(),
    ownerName: payload.ownerName.trim(),
    status: payload.status,
    logoUrl: null,
  }
  companies = [company, ...companies]
  // return (await createCompanyRequest(payload)).data
  return { ...company }
}

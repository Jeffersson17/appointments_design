import { mockCompanies } from '@/mocks/companies'
import { COMPANY_STATUS } from '@/types/status'
// import { fetchCompanies, updateCompany, deleteCompany } from '@/api/companies'

/**
 * Camada de dados de empresas.
 * Hoje usa mocks; troque pelas chamadas Axios quando a API estiver pronta.
 */
let companies = mockCompanies.map((item) => ({ ...item }))

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getCompanies = async () => {
  await delay()
  // return (await fetchCompanies()).data
  return companies.map((item) => ({ ...item }))
}

export const toggleCompanyStatus = async (id) => {
  await delay()
  const company = companies.find((item) => item.id === id)
  if (!company) throw new Error('Empresa não encontrada')

  company.status =
    company.status === COMPANY_STATUS.ACTIVE
      ? COMPANY_STATUS.INACTIVE
      : COMPANY_STATUS.ACTIVE

  // await updateCompany(id, { status: company.status })
  return { ...company }
}

export const removeCompany = async (id) => {
  await delay()
  companies = companies.filter((item) => item.id !== id)
  // await deleteCompany(id)
}

export const createCompany = async (payload) => {
  await delay(250)
  const company = {
    id: Date.now(),
    name: payload.name.trim(),
    ownerName: payload.ownerName.trim(),
    status: payload.status || COMPANY_STATUS.ACTIVE,
    logoUrl: null,
  }
  companies = [company, ...companies]
  // return (await createCompanyRequest(payload)).data
  return { ...company }
}

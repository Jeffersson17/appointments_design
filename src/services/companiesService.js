import {
  fetchCompanies,
  deleteCompany,
  updateCompany as updateCompanyRequest,
} from '@/api/companies'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getCompanies = async () => {
  await delay()
  return (await fetchCompanies()).data
}

export const toggleCompanyStatus = async (id, company) => {
  await delay()
  return (
    await updateCompanyRequest(id, { is_active: !company.user.is_active })
  ).data
}

export const removeCompany = async (id) => {
  await delay()
  await deleteCompany(id)
}

export const updateCompany = async (id, payload) => {
  await delay()
  return (await updateCompanyRequest(id, payload)).data
}

export const createCompany = async (payload) => {
  await delay(250)
  const company = {
    id: Date.now(),
    name: payload.name.trim(),
    ownerName: payload.ownerName.trim(),
    status: payload.status,
    email: payload.email.trim(),
    logoUrl: null,
  }
  // return (await createCompanyRequest(payload)).data
  return { ...company }
}

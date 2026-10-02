/**
 * Camada de API — comunicação com Django REST Framework via Axios.
 *
 * Enquanto a API não estiver disponível, as views consomem
 * dados de src/mocks/ através de src/services/.
 *
 * Para migrar: troque as implementações em src/services/
 * para chamar os métodos exportados aqui.
 */

export { default as api } from './client'
export * from './auth'
export * from './companies'
export * from './clients'
export * from './services'
export * from './appointments'

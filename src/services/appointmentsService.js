import { mockAppointments } from '@/mocks/appointments'
// import { fetchAppointments, deleteAppointment } from '@/api/appointments'

let appointments = mockAppointments.map((item) => ({ ...item }))

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAppointments = async () => {
  await delay()
  // return (await fetchAppointments()).data
  return appointments.map((item) => ({ ...item }))
}

export const removeAppointment = async (id) => {
  await delay()
  appointments = appointments.filter((item) => item.id !== id)
  // await deleteAppointment(id)
}

export const createAppointment = async (payload) => {
  await delay(250)
  const appointment = {
    id: Date.now(),
    clientName: payload.clientName.trim(),
    serviceName: payload.serviceName.trim(),
    date: payload.date,
    time: payload.time,
  }
  appointments = [appointment, ...appointments]
  // return (await createAppointmentRequest(payload)).data
  return { ...appointment }
}

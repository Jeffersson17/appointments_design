import { fetchAppointments, deleteAppointment } from '@/api/appointments'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAppointments = async () => {
  await delay()
  return (await fetchAppointments()).data
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

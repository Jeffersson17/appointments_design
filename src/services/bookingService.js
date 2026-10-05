import { APPOINTMENT_STATUS } from '@/types/status'
// import { fetchAppointments, createAppointment } from '@/api/appointments'
import { fetchServices } from '@/api/services'

const STORAGE_KEY = 'client_bookings'
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const seedHistory = [
  {
    id: 1001,
    clientId: 3,
    clientName: 'Ricardo Oliveira',
    serviceId: 1,
    serviceName: 'Corte Masculino',
    date: '2026-09-12',
    time: '10:00',
    price: 45,
    durationMinutes: 30,
    status: APPOINTMENT_STATUS.COMPLETED,
  },
  {
    id: 1002,
    clientId: 3,
    clientName: 'Ricardo Oliveira',
    serviceId: 3,
    serviceName: 'Corte + Barba',
    date: '2026-09-20',
    time: '14:30',
    price: 70,
    durationMinutes: 50,
    status: APPOINTMENT_STATUS.CANCELLED,
  },
  {
    id: 1003,
    clientId: 3,
    clientName: 'Ricardo Oliveira',
    serviceId: 4,
    serviceName: 'Degradê',
    date: '2026-09-28',
    time: '09:30',
    price: 50,
    durationMinutes: 40,
    status: APPOINTMENT_STATUS.COMPLETED,
  },
]

const readBookings = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seedHistory))
  return [...seedHistory]
}

const writeBookings = (bookings) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

/**
 * Retorna horários disponíveis para uma data.
 * Hoje usa mock; depois pode consultar a API Django.
 */
export const getAvailableSlots = async (isoDate) => {
  await delay()
  if (!isoDate) return []

  const busy = new Set(getBusySlotIndexes(isoDate))
  return mockBaseSlots
    .map((time, index) => ({
      time,
      available: !busy.has(index),
    }))
    .filter((slot) => slot.available)
    .map((slot) => slot.time)
}

export const getBookingServices = async () => {
  await delay()
  return (await fetchServices()).data
}

export const getActiveBooking = async (clientId) => {
  await delay()
  if (!clientId) return null

  const bookings = readBookings()
  return (
    bookings.find(
      (item) =>
        item.clientId === clientId &&
        item.status === APPOINTMENT_STATUS.CONFIRMED,
    ) ?? null
  )
}

export const getBookingHistory = async (clientId) => {
  await delay()
  if (!clientId) return []

  return readBookings()
    .filter(
      (item) =>
        item.clientId === clientId &&
        item.status !== APPOINTMENT_STATUS.CONFIRMED,
    )
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date)
      if (byDate !== 0) return byDate
      return b.time.localeCompare(a.time)
    })
    .map((item) => ({ ...item }))
}

export const createBooking = async (payload) => {
  await delay(250)
  // return (await createAppointment(payload)).data

  const bookings = readBookings()
  const hasActive = bookings.some(
    (item) =>
      item.clientId === payload.clientId &&
      item.status === APPOINTMENT_STATUS.CONFIRMED,
  )

  if (hasActive) {
    throw new Error('ACTIVE_BOOKING_EXISTS')
  }

  const booking = {
    id: Date.now(),
    ...payload,
    status: APPOINTMENT_STATUS.CONFIRMED,
  }

  bookings.push(booking)
  writeBookings(bookings)
  return { ...booking }
}

export const completeBooking = async (bookingId, clientId) => {
  await delay(220)
  const bookings = readBookings()
  const index = bookings.findIndex(
    (item) =>
      item.id === bookingId &&
      item.clientId === clientId &&
      item.status === APPOINTMENT_STATUS.CONFIRMED,
  )

  if (index === -1) {
    throw new Error('BOOKING_NOT_FOUND')
  }

  bookings[index] = {
    ...bookings[index],
    status: APPOINTMENT_STATUS.COMPLETED,
  }
  writeBookings(bookings)
  return { ...bookings[index] }
}

export const cancelBooking = async (bookingId, clientId) => {
  await delay(220)
  const bookings = readBookings()
  const index = bookings.findIndex(
    (item) =>
      item.id === bookingId &&
      item.clientId === clientId &&
      item.status === APPOINTMENT_STATUS.CONFIRMED,
  )

  if (index === -1) {
    throw new Error('BOOKING_NOT_FOUND')
  }

  bookings[index] = {
    ...bookings[index],
    status: APPOINTMENT_STATUS.CANCELLED,
  }
  writeBookings(bookings)
  return { ...bookings[index] }
}

import { APPOINTMENT_STATUS } from '@/types/status'
import {
  createAppointment,
  fetchAppointments,
  updateAppointment,
} from '@/api/appointments'
import { fetchServices } from '@/api/services'
import { formatTimeBR } from '@/utils/format'

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const mockBaseSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
]

const getBusySlotIndexes = (isoDate = '') => {
  const day = Number(isoDate.split('-')[2] || 1)
  if (day % 2 === 0) return [1, 4, 7, 10, 14]
  return [0, 3, 6, 9, 12, 16]
}

const toList = (data) => (Array.isArray(data) ? data : data?.results ?? [])

const normalizeBooking = (item) => {
  const scheduledAt = item.scheduled_at ?? ''
  return {
    id: item.id,
    status: item.status,
    scheduled_at: scheduledAt,
    date: String(scheduledAt).slice(0, 10),
    time: formatTimeBR(scheduledAt),
    serviceName: item.service?.service_name ?? '',
    serviceId: item.service?.id ?? null,
    price: Number(item.service?.price ?? 0),
    duration: item.service?.duration ?? '00:00:00',
    clientId: item.client?.user?.id ?? item.client?.id ?? null,
    observation: item.observation ?? '',
  }
}

const normalizeService = (item) => ({
  id: item.id,
  name: item.service_name,
  price: Number(item.price),
  duration: item.duration,
})

const fetchClientBookings = async () => {
  const { data } = await fetchAppointments()
  return toList(data).map(normalizeBooking)
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
  const { data } = await fetchServices()
  return toList(data).map(normalizeService)
}

export const getActiveBooking = async (userId) => {
  if (!userId) return null

  const bookings = await fetchClientBookings()
  return (
    bookings.find(
      (item) =>
        item.status === APPOINTMENT_STATUS.SCHEDULED &&
        (!item.clientId || item.clientId === userId),
    ) ?? null
  )
}

export const getBookingHistory = async (userId) => {
  if (!userId) return []

  return (await fetchClientBookings())
    .filter(
      (item) =>
        item.status !== APPOINTMENT_STATUS.SCHEDULED &&
        (!item.clientId || item.clientId === userId),
    )
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date)
      if (byDate !== 0) return byDate
      return b.time.localeCompare(a.time)
    })
}

export const createBooking = async (payload) => {
  const scheduledAt = `${payload.date}T${payload.time}:00`

  try {
    const { data } = await createAppointment({
      scheduled_at: scheduledAt,
      service: payload.serviceId,
      observation: payload.observation ?? '',
    })
    return normalizeBooking(data)
  } catch (err) {
    const detail = err?.response?.data?.detail
    const message = Array.isArray(detail)
      ? detail[0]
      : typeof detail === 'object'
        ? detail?.detail
        : detail

    if (
      typeof message === 'string' &&
      message.toLowerCase().includes('agendamento ativo')
    ) {
      throw new Error('ACTIVE_BOOKING_EXISTS')
    }
    throw err
  }
}

export const completeBooking = async (bookingId) => {
  const { data } = await updateAppointment(bookingId, {
    status: APPOINTMENT_STATUS.COMPLETED,
  })
  return normalizeBooking(data)
}

export const cancelBooking = async (bookingId) => {
  const { data } = await updateAppointment(bookingId, {
    status: APPOINTMENT_STATUS.CANCELLED,
  })
  return normalizeBooking(data)
}

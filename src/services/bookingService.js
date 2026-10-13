import { APPOINTMENT_STATUS } from '@/types/status'
import {
  createAppointment,
  fetchAppointments,
  updateAppointment,
} from '@/api/appointments'
import { fetchServices } from '@/api/services'
import { formatTimeBR } from '@/utils/format'

const mockBaseSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
]

const toList = (data) => (Array.isArray(data) ? data : data?.results ?? [])

const getAppointmentDate = (scheduledAt = '') =>
  String(scheduledAt).slice(0, 10)

/** Extrai HH:mm de "2026-10-12T17:30:00-03:00". */
const getAppointmentTime = (scheduledAt = '') => {
  const match = String(scheduledAt).match(/T(\d{2}):(\d{2})/)
  if (match) return `${match[1]}:${match[2]}`
  return formatTimeBR(scheduledAt)
}

const normalizeBooking = (item) => {
  const scheduledAt = item.scheduled_at ?? ''
  return {
    id: item.id,
    status: item.status,
    scheduled_at: scheduledAt,
    date: getAppointmentDate(scheduledAt),
    time: getAppointmentTime(scheduledAt),
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
 * Bloqueia slots com status SCHEDULED da mesma empresa na data escolhida.
 * CANCELLED / COMPLETED não bloqueiam.
 */
export const getAvailableSlots = async (isoDate) => {
  if (!isoDate) return []

  const { data } = await fetchAppointments()
  const appointments = toList(data)

  const enterpriseId =
    appointments.find((item) => item.enterprise?.id != null)?.enterprise?.id ??
    null

  const busyTimes = new Set(
    appointments
      .filter((item) => {
        if (item.status !== APPOINTMENT_STATUS.SCHEDULED) return false
        if (getAppointmentDate(item.scheduled_at) !== isoDate) return false
        if (enterpriseId != null && item.enterprise?.id !== enterpriseId) {
          return false
        }
        return true
      })
      .map((item) => getAppointmentTime(item.scheduled_at)),
  )

  return mockBaseSlots.filter((time) => !busyTimes.has(time))
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

    if (typeof message === 'string') {
      const normalized = message.toLowerCase()
      if (normalized.includes('agendamento ativo')) {
        throw new Error('ACTIVE_BOOKING_EXISTS')
      }
      if (normalized.includes('já existe um agendamento')) {
        throw new Error('SLOT_ALREADY_TAKEN')
      }
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

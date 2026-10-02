/**
 * Horários base do dia.
 * Alguns serão marcados como indisponíveis conforme a data (mock).
 */
export const mockBaseSlots = [
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

/** Índices "ocupados" variam por dia para simular disponibilidade. */
export const getBusySlotIndexes = (isoDate = '') => {
  const day = Number(isoDate.split('-')[2] || 1)
  if (day % 2 === 0) return [1, 4, 7, 10, 14]
  return [0, 3, 6, 9, 12, 16]
}

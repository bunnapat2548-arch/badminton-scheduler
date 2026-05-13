import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { CLOSE_HOUR, OPEN_HOUR, SLOT_WIDTH, TOTAL_SLOTS } from './constants'
import type { Booking } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

dayjs.locale('th')

export function timeToSlot(time: string): number {
  const parts = time.split(':')
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  return (hours - OPEN_HOUR) * 2 + Math.floor(minutes / 30)
}

export function slotToTime(slot: number): string {
  const totalMinutes = slot * 30
  const hours = Math.floor(totalMinutes / 60) + OPEN_HOUR
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function timeToMinutes(time: string): number {
  const parts = time.split(':')
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

export function formatTime(time: string): string {
  const parts = time.split(':')
  return `${parts[0]}:${parts[1]}`
}

export function formatDateThai(date: string): string {
  return dayjs(date).locale('th').format('dddd D MMMM BBBB')
}

export function formatDateShort(date: string): string {
  return dayjs(date).locale('th').format('D MMM BB')
}

export function getDurationMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime)
}

export function getDurationHours(startTime: string, endTime: string): number {
  return getDurationMinutes(startTime, endTime) / 60
}

export function getBookingLeft(startTime: string): number {
  return timeToSlot(startTime) * SLOT_WIDTH
}

export function getBookingWidth(startTime: string, endTime: string): number {
  const startSlot = timeToSlot(startTime)
  const endSlot = timeToSlot(endTime)
  return (endSlot - startSlot) * SLOT_WIDTH
}

export function hasOverlap(
  bookings: Booking[],
  newStart: string,
  newEnd: string,
  courtNumber: number,
  bookingDate: string,
  excludeId?: string
): boolean {
  const newStartMin = timeToMinutes(newStart)
  const newEndMin = timeToMinutes(newEnd)

  return bookings.some((b) => {
    if (b.id === excludeId) return false
    if (b.court_number !== courtNumber) return false
    if (b.booking_date !== bookingDate) return false
    const existStart = timeToMinutes(b.start_time)
    const existEnd = timeToMinutes(b.end_time)
    return newStartMin < existEnd && newEndMin > existStart
  })
}

export function getCurrentTimeLeft(): number | null {
  const now = dayjs()
  const hours = now.hour()
  const minutes = now.minute()
  if (hours < OPEN_HOUR || hours >= CLOSE_HOUR) return null
  const totalMinutes = (hours - OPEN_HOUR) * 60 + minutes
  return (totalMinutes / 30) * SLOT_WIDTH
}

export function isSlotInDragRange(
  slot: number,
  startSlot: number,
  endSlot: number
): boolean {
  const min = Math.min(startSlot, endSlot)
  const max = Math.max(startSlot, endSlot)
  return slot >= min && slot <= max
}

export function generateTimeOptions(
  includeClosing = false
): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  // Slots 0..23 → 10:00..21:30; slot 24 → 22:00 (closing)
  const slotCount = includeClosing ? TOTAL_SLOTS + 1 : TOTAL_SLOTS
  for (let i = 0; i < slotCount; i++) {
    const time = slotToTime(i)
    options.push({ value: time, label: time })
  }
  return options
}

'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getBookingsByRange } from '@/lib/actions'
import { getDurationHours } from '@/lib/utils'
import { COURTS, VENUE_TOTAL_MINUTES_PER_DAY } from '@/lib/constants'
import type { CourtStat, DailyData, HourlyData, StatsPeriod } from '@/types'
import type { Booking } from '@/types'

function computeStats(bookings: Booking[], days: number): StatsPeriod {
  const totalHours = bookings.reduce(
    (sum, b) => sum + getDurationHours(b.start_time, b.end_time),
    0
  )
  const maxPossibleHours = (VENUE_TOTAL_MINUTES_PER_DAY / 60) * COURTS.length * days
  return {
    label: '',
    totalHours: Math.round(totalHours * 10) / 10,
    totalBookings: bookings.length,
    utilizationPercent: Math.round((totalHours / maxPossibleHours) * 1000) / 10,
  }
}

function computeCourtStats(bookings: Booking[], days: number): CourtStat[] {
  return COURTS.map((court) => {
    const courtBookings = bookings.filter(
      (b) => b.court_number === court.number
    )
    const totalHours = courtBookings.reduce(
      (sum, b) => sum + getDurationHours(b.start_time, b.end_time),
      0
    )
    const maxHours = (VENUE_TOTAL_MINUTES_PER_DAY / 60) * days
    return {
      courtNumber: court.number,
      name: court.name,
      totalHours: Math.round(totalHours * 10) / 10,
      totalBookings: courtBookings.length,
      utilizationPercent: Math.round((totalHours / maxHours) * 1000) / 10,
    }
  })
}

function computeDailyData(bookings: Booking[], days: number): DailyData[] {
  const result: DailyData[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    const label = dayjs().subtract(i, 'day').format('D/M')
    const dayBookings = bookings.filter((b) => b.booking_date === date)
    const hours = dayBookings.reduce(
      (sum, b) => sum + getDurationHours(b.start_time, b.end_time),
      0
    )
    result.push({
      date,
      label,
      hours: Math.round(hours * 10) / 10,
      bookings: dayBookings.length,
    })
  }
  return result
}

function computeHourlyData(bookings: Booking[]): HourlyData[] {
  const hourCounts: Record<string, number> = {}
  for (let h = 10; h < 22; h++) {
    hourCounts[`${h}:00`] = 0
  }
  bookings.forEach((b) => {
    const startHour = parseInt(b.start_time.split(':')[0], 10)
    const endHour = parseInt(b.end_time.split(':')[0], 10)
    for (let h = startHour; h < endHour; h++) {
      if (h >= 10 && h < 22) {
        hourCounts[`${h}:00`] = (hourCounts[`${h}:00`] ?? 0) + 1
      }
    }
  })
  return Object.entries(hourCounts).map(([hour, bookings]) => ({
    hour,
    bookings,
  }))
}

export function useStatistics() {
  const today = dayjs().format('YYYY-MM-DD')
  const monthStart = dayjs().startOf('month').format('YYYY-MM-DD')
  const thirtyDaysAgo = dayjs().subtract(29, 'day').format('YYYY-MM-DD')

  return useQuery({
    queryKey: ['statistics', today],
    queryFn: async () => {
      const bookings = await getBookingsByRange(thirtyDaysAgo, today)

      const todayBookings = bookings.filter((b) => b.booking_date === today)
      const weekStart = dayjs().startOf('week').format('YYYY-MM-DD')
      const weekBookings = bookings.filter(
        (b) => b.booking_date >= weekStart && b.booking_date <= today
      )
      const monthBookings = bookings.filter(
        (b) => b.booking_date >= monthStart && b.booking_date <= today
      )

      const daily = { ...computeStats(todayBookings, 1), label: 'วันนี้' }
      const weekly = {
        ...computeStats(weekBookings, dayjs().day() + 1),
        label: 'สัปดาห์นี้',
      }
      const monthly = {
        ...computeStats(monthBookings, dayjs().date()),
        label: 'เดือนนี้',
      }

      const courtStats = computeCourtStats(monthBookings, dayjs().date())
      const mostUsedCourt = [...courtStats].sort(
        (a, b) => b.totalHours - a.totalHours
      )[0]

      const dailyTrend = computeDailyData(bookings, 14)
      const hourlyDist = computeHourlyData(monthBookings)

      return {
        daily,
        weekly,
        monthly,
        courtStats,
        mostUsedCourt,
        dailyTrend,
        hourlyDist,
      }
    },
    staleTime: 5 * 60_000,
  })
}

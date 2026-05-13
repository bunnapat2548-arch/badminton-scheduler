'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { bookingKeys } from './useBookings'
import type { Booking } from '@/types'

// Stable singleton — recreating on every render breaks realtime channels
const supabase = createClient()

export function useRealtimeBookings(date: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`bookings:${date}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `booking_date=eq.${date}`,
        },
        (payload) => {
          const newBooking = payload.new as Booking
          queryClient.setQueryData<Booking[]>(bookingKeys.byDate(date), (old) => {
            if (!old) return [newBooking]
            if (old.some((b) => b.id === newBooking.id)) return old
            return [...old, newBooking]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `booking_date=eq.${date}`,
        },
        (payload) => {
          const updated = payload.new as Booking
          queryClient.setQueryData<Booking[]>(
            bookingKeys.byDate(date),
            (old) => old?.map((b) => (b.id === updated.id ? updated : b))
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          const deleted = payload.old as { id: string }
          queryClient.setQueryData<Booking[]>(
            bookingKeys.byDate(date),
            (old) => old?.filter((b) => b.id !== deleted.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [date, queryClient])
}

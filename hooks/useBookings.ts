'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBooking,
  deleteBooking,
  getBookingsByDate,
  updateBooking,
} from '@/lib/actions'
import type { Booking, BookingFormValues } from '@/types'
import { getRandomColorHex } from '@/lib/colors'
import { hasOverlap } from '@/lib/utils'

export const bookingKeys = {
  all: ['bookings'] as const,
  byDate: (date: string) => [...bookingKeys.all, date] as const,
}

export function useBookings(date: string) {
  return useQuery({
    queryKey: bookingKeys.byDate(date),
    queryFn: () => getBookingsByDate(date),
    staleTime: 30_000,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      values,
    }: {
      values: BookingFormValues
      date: string
    }) => {
      return createBooking({ ...values, color: getRandomColorHex() })
    },
    onMutate: async ({ values, date }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.byDate(date) })
      const previous = queryClient.getQueryData<Booking[]>(bookingKeys.byDate(date))

      const optimistic: Booking = {
        id: `temp-${Date.now()}`,
        ...values,
        note: values.note || null,
        color: getRandomColorHex(),
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Booking[]>(bookingKeys.byDate(date), (old) =>
        old ? [...old, optimistic] : [optimistic]
      )

      return { previous, date }
    },
    onError: (err, _, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookingKeys.byDate(context.date),
          context.previous
        )
      }
      toast.error(err instanceof Error ? err.message : 'ไม่สามารถสร้างการจองได้')
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byDate(date) })
      toast.success('สร้างการจองสำเร็จ')
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      values,
      color,
    }: {
      id: string
      values: BookingFormValues
      date: string
      color: string
    }) => {
      return updateBooking(id, { ...values, color })
    },
    onMutate: async ({ id, values, date }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.byDate(date) })
      const previous = queryClient.getQueryData<Booking[]>(bookingKeys.byDate(date))

      queryClient.setQueryData<Booking[]>(bookingKeys.byDate(date), (old) =>
        old?.map((b) =>
          b.id === id ? { ...b, ...values, note: values.note || null } : b
        )
      )

      return { previous, date }
    },
    onError: (err, _, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookingKeys.byDate(context.date),
          context.previous
        )
      }
      toast.error(err instanceof Error ? err.message : 'ไม่สามารถแก้ไขการจองได้')
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byDate(date) })
      toast.success('แก้ไขการจองสำเร็จ')
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => deleteBooking(id),
    onMutate: async ({ id, date }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.byDate(date) })
      const previous = queryClient.getQueryData<Booking[]>(bookingKeys.byDate(date))

      queryClient.setQueryData<Booking[]>(bookingKeys.byDate(date), (old) =>
        old?.filter((b) => b.id !== id)
      )

      return { previous, date }
    },
    onError: (err, _, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          bookingKeys.byDate(context.date),
          context.previous
        )
      }
      toast.error('ไม่สามารถลบการจองได้')
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byDate(date) })
      toast.success('ลบการจองสำเร็จ')
    },
  })
}

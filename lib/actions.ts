'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
import type { BookingFormValues } from '@/types'

export async function createBooking(
  values: BookingFormValues & { color: string }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: values.customer_name,
      court_number: values.court_number,
      booking_date: values.booking_date,
      start_time: values.start_time,
      end_time: values.end_time,
      note: values.note || null,
      color: values.color,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

export async function updateBooking(
  id: string,
  values: BookingFormValues & { color: string }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .update({
      customer_name: values.customer_name,
      court_number: values.court_number,
      booking_date: values.booking_date,
      start_time: values.start_time,
      end_time: values.end_time,
      note: values.note || null,
      color: values.color,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function getBookingsByDate(date: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', date)
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function getBookingsByRange(startDate: string, endDate: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('booking_date', startDate)
    .lte('booking_date', endDate)
    .order('booking_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

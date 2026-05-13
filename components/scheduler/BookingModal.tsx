'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useSchedulerStore } from '@/store/schedulerStore'
import { useCreateBooking, useDeleteBooking, useUpdateBooking, bookingKeys } from '@/hooks/useBookings'
import { COURTS } from '@/lib/constants'
import { generateTimeOptions, hasOverlap, timeToMinutes } from '@/lib/utils'
import type { Booking, BookingFormValues } from '@/types'

const bookingSchema = z
  .object({
    customer_name: z.string().min(1, 'กรุณากรอกชื่อลูกค้า'),
    court_number: z.coerce.number().min(1).max(6),
    booking_date: z.string().min(1, 'กรุณาเลือกวันที่'),
    start_time: z.string().min(1, 'กรุณาเลือกเวลาเริ่ม'),
    end_time: z.string().min(1, 'กรุณาเลือกเวลาสิ้นสุด'),
    note: z.string(),
  })
  .refine(
    (data) =>
      timeToMinutes(data.end_time) - timeToMinutes(data.start_time) >= 30,
    {
      message: 'ระยะเวลาต้องอย่างน้อย 30 นาที',
      path: ['end_time'],
    }
  )
  .refine((data) => timeToMinutes(data.end_time) > timeToMinutes(data.start_time), {
    message: 'เวลาสิ้นสุดต้องหลังเวลาเริ่ม',
    path: ['end_time'],
  })

const startTimeOptions = generateTimeOptions(false)
const endTimeOptions = generateTimeOptions(true).filter((o) => o.value !== '10:00')

export function BookingModal() {
  const { modal, closeModal, selectedDate } = useSchedulerStore()
  const queryClient = useQueryClient()
  const createBooking = useCreateBooking()
  const updateBooking = useUpdateBooking()
  const deleteBooking = useDeleteBooking()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      court_number: 1,
      booking_date: selectedDate,
      start_time: '10:00',
      end_time: '11:00',
      note: '',
    },
  })

  useEffect(() => {
    if (modal.isOpen) {
      if (modal.mode === 'edit' && modal.booking) {
        reset({
          customer_name: modal.booking.customer_name,
          court_number: modal.booking.court_number,
          booking_date: modal.booking.booking_date,
          start_time: modal.booking.start_time.slice(0, 5),
          end_time: modal.booking.end_time.slice(0, 5),
          note: modal.booking.note ?? '',
        })
      } else {
        reset({
          customer_name: '',
          court_number: modal.initialValues?.court_number ?? 1,
          booking_date: modal.initialValues?.booking_date ?? selectedDate,
          start_time: modal.initialValues?.start_time ?? '10:00',
          end_time: modal.initialValues?.end_time ?? '11:00',
          note: '',
        })
      }
    }
  }, [modal, selectedDate, reset])

  const onSubmit = async (values: BookingFormValues) => {
    const existing =
      (queryClient.getQueryData<Booking[]>(bookingKeys.byDate(values.booking_date)) ?? [])

    const overlapFound = hasOverlap(
      existing,
      values.start_time,
      values.end_time,
      values.court_number,
      values.booking_date,
      modal.booking?.id
    )

    if (overlapFound) {
      setError('end_time', { message: 'มีการจองทับซ้อนในคอร์ทและช่วงเวลานี้แล้ว' })
      return
    }

    try {
      if (modal.mode === 'create') {
        await createBooking.mutateAsync({ values, date: values.booking_date })
      } else if (modal.mode === 'edit' && modal.booking) {
        await updateBooking.mutateAsync({
          id: modal.booking.id,
          values,
          date: values.booking_date,
          color: modal.booking.color,
        })
      }
      closeModal()
    } catch {
      // errors handled in hooks via toast
    }
  }

  const handleDelete = async () => {
    if (modal.booking) {
      try {
        await deleteBooking.mutateAsync({
          id: modal.booking.id,
          date: modal.booking.booking_date,
        })
        closeModal()
      } catch {
        // handled in hook
      }
    }
  }

  const isLoading =
    createBooking.isPending || updateBooking.isPending || deleteBooking.isPending

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modal.mode === 'create' ? 'สร้างการจองใหม่' : 'แก้ไขการจอง'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="customer_name">ชื่อลูกค้า *</Label>
            <Input
              id="customer_name"
              placeholder="กรอกชื่อลูกค้า"
              {...register('customer_name')}
            />
            {errors.customer_name && (
              <p className="text-xs text-red-500">{errors.customer_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>คอร์ท *</Label>
              <Select
                value={watch('court_number')?.toString()}
                onValueChange={(v) => setValue('court_number', parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกคอร์ท" />
                </SelectTrigger>
                <SelectContent>
                  {COURTS.map((court) => (
                    <SelectItem key={court.number} value={court.number.toString()}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="booking_date">วันที่ *</Label>
              <Input
                id="booking_date"
                type="date"
                {...register('booking_date')}
              />
              {errors.booking_date && (
                <p className="text-xs text-red-500">{errors.booking_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>เวลาเริ่ม *</Label>
              <Select
                value={watch('start_time')}
                onValueChange={(v) => setValue('start_time', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {startTimeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>เวลาสิ้นสุด *</Label>
              <Select
                value={watch('end_time')}
                onValueChange={(v) => setValue('end_time', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {endTimeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.end_time && (
                <p className="text-xs text-red-500">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">หมายเหตุ</Label>
            <Textarea
              id="note"
              placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
              {...register('note')}
            />
          </div>

          <DialogFooter className="gap-2">
            {modal.mode === 'edit' && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto"
              >
                {deleteBooking.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                ลบการจอง
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {modal.mode === 'create' ? 'สร้างการจอง' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useCallback, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { useSchedulerStore } from '@/store/schedulerStore'
import { useBookings } from '@/hooks/useBookings'
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings'
import { BookingCard } from './BookingCard'
import { TimelineHeader } from './TimelineHeader'
import { BookingModal } from './BookingModal'
import { SchedulerSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import {
  COURTS,
  ROW_HEIGHT,
  SIDEBAR_WIDTH,
  SLOT_WIDTH,
  SLOTS,
  TOTAL_SLOTS,
} from '@/lib/constants'
import {
  cn,
  getCurrentTimeLeft,
  isSlotInDragRange,
  slotToTime,
} from '@/lib/utils'

import type { Booking } from '@/types'

interface SchedulerGridProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function SchedulerGrid({ containerRef }: SchedulerGridProps) {
  const { selectedDate, dragState, setDragState, resetDragState, openCreateModal, openEditModal } =
    useSchedulerStore()
  const { data: bookings, isLoading, isError, refetch } = useBookings(selectedDate)
  useRealtimeBookings(selectedDate)

  const isToday = selectedDate === dayjs().format('YYYY-MM-DD')

  // Refs updated synchronously so event handlers always have latest values
  const dragStateRef = useRef(dragState)
  const openCreateModalRef = useRef(openCreateModal)
  const resetDragStateRef = useRef(resetDragState)
  const selectedDateRef = useRef(selectedDate)
  const touchTapRef = useRef<{ courtIndex: number; slotIndex: number; startX: number; startY: number } | null>(null)

  openCreateModalRef.current = openCreateModal
  resetDragStateRef.current = resetDragState
  selectedDateRef.current = selectedDate

  // Scroll to current time on load
  useEffect(() => {
    if (isToday && containerRef.current) {
      const left = getCurrentTimeLeft()
      if (left !== null) {
        const scrollX = Math.max(0, SIDEBAR_WIDTH + left - containerRef.current.clientWidth / 2)
        containerRef.current.scrollLeft = scrollX
      }
    }
  }, [isToday, containerRef]) // eslint-disable-line react-hooks/exhaustive-deps

  // Global mouseup / touchend — reads latest state via refs (no stale closure)
  useEffect(() => {
    const handleMouseUp = () => {
      const ds = dragStateRef.current
      if (!ds.isActive) return

      const startSlot = Math.min(ds.startSlot, ds.endSlot)
      const endSlot = Math.max(ds.startSlot, ds.endSlot) + 1
      const clampedEnd = Math.min(endSlot, TOTAL_SLOTS)

      resetDragStateRef.current()

      if (clampedEnd > startSlot) {
        openCreateModalRef.current({
          court_number: ds.courtIndex + 1,
          booking_date: selectedDateRef.current,
          start_time: slotToTime(startSlot),
          end_time: slotToTime(clampedEnd),
        })
      }
    }

    // Touch tap-to-create: tap a slot → open modal with 1-hour default
    const handleTouchEnd = (e: TouchEvent) => {
      const tap = touchTapRef.current
      touchTapRef.current = null
      if (!tap) return
      const touch = e.changedTouches[0]
      const moved = Math.hypot(touch.clientX - tap.startX, touch.clientY - tap.startY)
      if (moved > 15) return // was a scroll, ignore
      openCreateModalRef.current({
        court_number: tap.courtIndex + 1,
        booking_date: selectedDateRef.current,
        start_time: slotToTime(tap.slotIndex),
        end_time: slotToTime(Math.min(tap.slotIndex + 2, TOTAL_SLOTS)),
      })
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, []) // runs once — refs always have latest values

  const handleSlotMouseDown = useCallback(
    (e: React.MouseEvent, courtIndex: number, slotIndex: number) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const next = { isActive: true, courtIndex, startSlot: slotIndex, endSlot: slotIndex }
      dragStateRef.current = next // sync update so mouseup sees it immediately
      setDragState(next)
    },
    [setDragState]
  )

  const handleSlotTouchStart = useCallback(
    (e: React.TouchEvent, courtIndex: number, slotIndex: number) => {
      touchTapRef.current = {
        courtIndex,
        slotIndex,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
      }
    },
    []
  )

  const handleSlotMouseEnter = useCallback(
    (courtIndex: number, slotIndex: number) => {
      const ds = dragStateRef.current
      if (!ds.isActive || ds.courtIndex !== courtIndex) return
      const next = { ...ds, endSlot: slotIndex }
      dragStateRef.current = next
      setDragState(next)
    },
    [setDragState]
  )

  const handleBookingClick = useCallback(
    (booking: Booking) => {
      openEditModal(booking)
    },
    [openEditModal]
  )

  if (isLoading) return <SchedulerSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const bookingsByCourt = (courtNumber: number) =>
    (bookings ?? []).filter((b) => b.court_number === courtNumber)

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-auto flex-1 select-none scheduler-container"
        style={{ cursor: dragState.isActive ? 'col-resize' : 'default' }}
      >
        <div
          data-export-content
          style={{ width: SIDEBAR_WIDTH + TOTAL_SLOTS * SLOT_WIDTH, minWidth: '100%' }}
          className="relative bg-white dark:bg-slate-900"
        >
          <TimelineHeader />

          {/* Court rows */}
          <div className="relative">

            {COURTS.map((court, courtIndex) => {
              const courtBookings = bookingsByCourt(court.number)
              const isDraggingHere =
                dragState.isActive && dragState.courtIndex === courtIndex

              return (
                <div
                  key={court.number}
                  className="flex relative border-b border-slate-100 dark:border-slate-800 group/row"
                  style={{ height: ROW_HEIGHT }}
                >
                  {/* Court label */}
                  <div
                    className="sticky left-0 z-10 flex items-center px-4 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 group-hover/row:bg-slate-50 dark:group-hover/row:bg-slate-800/50 transition-colors"
                    style={{ width: SIDEBAR_WIDTH }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {court.name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {courtBookings.length > 0
                          ? `${courtBookings.length} การจอง`
                          : 'ว่าง'}
                      </span>
                    </div>
                  </div>

                  {/* Slot area */}
                  <div
                    className="relative"
                    style={{ width: TOTAL_SLOTS * SLOT_WIDTH }}
                  >
                    {/* Slot cells */}
                    {SLOTS.map((slot) => {
                      const isInDrag = isDraggingHere
                        ? isSlotInDragRange(slot, dragState.startSlot, dragState.endSlot)
                        : false
                      const isHourBoundary = slot % 2 === 0

                      return (
                        <div
                          key={slot}
                          className={cn(
                            'absolute border-r transition-all',
                            isHourBoundary
                              ? 'border-slate-200 dark:border-slate-700'
                              : 'border-slate-100 dark:border-slate-800',
                            isInDrag
                              ? 'top-5 bottom-5 bg-blue-300 dark:bg-blue-700/70 rounded-md'
                              : 'top-0 bottom-0 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          )}
                          style={{ left: slot * SLOT_WIDTH, width: SLOT_WIDTH }}
                          onMouseDown={(e) => handleSlotMouseDown(e, courtIndex, slot)}
                          onMouseEnter={() => handleSlotMouseEnter(courtIndex, slot)}
                          onTouchStart={(e) => handleSlotTouchStart(e, courtIndex, slot)}
                        />
                      )
                    })}

                    {/* Booking cards */}
                    {courtBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onClick={handleBookingClick}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BookingModal />
    </>
  )
}

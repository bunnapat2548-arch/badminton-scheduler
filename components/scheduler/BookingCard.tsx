'use client'

import { useRef } from 'react'
import { Edit2 } from 'lucide-react'
import type { Booking } from '@/types'
import { formatTime, getBookingLeft, getBookingWidth } from '@/lib/utils'
import { getColorByBg } from '@/lib/colors'
import { ROW_HEIGHT } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: Booking
  onClick: (booking: Booking) => void
}

const CARD_PADDING = 10

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const clickedRef = useRef(false)
  const color = getColorByBg(booking.color)
  const left = getBookingLeft(booking.start_time) + CARD_PADDING
  const width = getBookingWidth(booking.start_time, booking.end_time) - CARD_PADDING * 2
  const top = CARD_PADDING + 1
  const height = ROW_HEIGHT - CARD_PADDING * 2 - 2

  if (width <= 0) return null

  const isNarrow = width < 100

  return (
    <div
      className="absolute group rounded-lg cursor-pointer transition-all duration-150 hover:brightness-95 hover:shadow-md active:scale-[0.98] overflow-hidden select-none"
      style={{
        left,
        width,
        top,
        height,
        backgroundColor: booking.color,
        borderLeft: `3px solid ${color.text}40`,
        zIndex: 10,
      }}
      onTouchEnd={(e) => {
        e.stopPropagation()
        e.preventDefault() // stops ghost mouse events on iOS
        onClick(booking)
      }}
      onMouseDown={(e) => {
        clickedRef.current = true
        e.stopPropagation()
      }}
      onMouseMove={() => {
        clickedRef.current = false
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (clickedRef.current) {
          onClick(booking)
          clickedRef.current = false
        }
      }}
    >
      <div className="h-full px-2.5 flex flex-col items-center justify-center gap-0.5 text-center">
        <div className="relative flex items-center justify-center w-full">
          <p
            className="font-semibold leading-tight text-2xl truncate text-center"
            style={{ color: color.text }}
          >
            {booking.customer_name}
          </p>
          <Edit2
            className="absolute right-0 h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
            style={{ color: color.text }}
          />
        </div>

        {!isNarrow && (
          <p
            className="text-xs leading-none font-medium opacity-70"
            style={{ color: color.text }}
          >
            {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
          </p>
        )}

        {!isNarrow && booking.note && (
          <p
            className="text-xs leading-tight opacity-55 truncate w-full"
            style={{ color: color.text }}
          >
            {booking.note}
          </p>
        )}
      </div>
    </div>
  )
}

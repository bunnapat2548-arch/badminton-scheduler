export interface Booking {
  id: string
  customer_name: string
  court_number: number
  booking_date: string
  start_time: string
  end_time: string
  note: string | null
  color: string
  created_at: string
}

export interface BookingFormValues {
  customer_name: string
  court_number: number
  booking_date: string
  start_time: string
  end_time: string
  note: string
}

export interface DragState {
  isActive: boolean
  courtIndex: number
  startSlot: number
  endSlot: number
}

export interface ModalState {
  isOpen: boolean
  mode: 'create' | 'edit'
  booking: Booking | null
  initialValues: Partial<BookingFormValues> | null
}

export interface CourtBookings {
  courtNumber: number
  bookings: Booking[]
}

export interface StatsPeriod {
  label: string
  totalHours: number
  totalBookings: number
  utilizationPercent: number
}

export interface CourtStat {
  courtNumber: number
  name: string
  totalHours: number
  totalBookings: number
  utilizationPercent: number
}

export interface DailyData {
  date: string
  label: string
  hours: number
  bookings: number
}

export interface HourlyData {
  hour: string
  bookings: number
}

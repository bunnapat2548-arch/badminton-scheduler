export interface BookingColor {
  bg: string
  text: string
  border: string
  darkBg: string
  darkText: string
}

export const BOOKING_COLORS: BookingColor[] = [
  { bg: '#93C5FD', text: '#1E3A8A', border: '#60A5FA', darkBg: '#1E3A5F', darkText: '#93C5FD' },
  { bg: '#6EE7B7', text: '#064E3B', border: '#34D399', darkBg: '#064E3B', darkText: '#6EE7B7' },
  { bg: '#FCD34D', text: '#78350F', border: '#FBBF24', darkBg: '#78350F', darkText: '#FCD34D' },
  { bg: '#F9A8D4', text: '#831843', border: '#F472B6', darkBg: '#831843', darkText: '#F9A8D4' },
  { bg: '#C4B5FD', text: '#3B0764', border: '#A78BFA', darkBg: '#3B0764', darkText: '#C4B5FD' },
  { bg: '#67E8F9', text: '#155E75', border: '#22D3EE', darkBg: '#164E63', darkText: '#67E8F9' },
  { bg: '#FCA5A5', text: '#7F1D1D', border: '#F87171', darkBg: '#7F1D1D', darkText: '#FCA5A5' },
  { bg: '#FDBA74', text: '#7C2D12', border: '#FB923C', darkBg: '#7C2D12', darkText: '#FDBA74' },
  { bg: '#86EFAC', text: '#14532D', border: '#4ADE80', darkBg: '#14532D', darkText: '#86EFAC' },
  { bg: '#7DD3FC', text: '#0C4A6E', border: '#38BDF8', darkBg: '#0C4A6E', darkText: '#7DD3FC' },
  { bg: '#F0ABFC', text: '#581C87', border: '#D946EF', darkBg: '#581C87', darkText: '#F0ABFC' },
  { bg: '#FDA4AF', text: '#881337', border: '#FB7185', darkBg: '#881337', darkText: '#FDA4AF' },
]

const colorIndex: Record<string, number> = {}
let nextColorIndex = 0

export function getColorForCustomer(customerName: string): BookingColor {
  if (!(customerName in colorIndex)) {
    colorIndex[customerName] = nextColorIndex % BOOKING_COLORS.length
    nextColorIndex++
  }
  return BOOKING_COLORS[colorIndex[customerName]]
}

export function getRandomColor(): BookingColor {
  return BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)]
}

export function getColorByBg(bg: string): BookingColor {
  return BOOKING_COLORS.find((c) => c.bg === bg) ?? BOOKING_COLORS[0]
}

export function getRandomColorHex(): string {
  return getRandomColor().bg
}

export const OPEN_HOUR = 10
export const CLOSE_HOUR = 23
export const TOTAL_SLOTS = (CLOSE_HOUR - OPEN_HOUR) * 2 // 24 half-hour slots
export const SLOT_WIDTH = 80 // px per 30-minute slot
export const ROW_HEIGHT = 80 // px per court row
export const SIDEBAR_WIDTH = 160 // px for court name column
export const HEADER_HEIGHT = 52 // px for time header

export const COURTS = [
  { number: 1, name: 'คอร์ท 1' },
  { number: 2, name: 'คอร์ท 2' },
  { number: 3, name: 'คอร์ท 3' },
  { number: 4, name: 'คอร์ท 4' },
  { number: 5, name: 'คอร์ท 5' },
  { number: 6, name: 'คอร์ท 6' },
]

export const SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, i) => i)

export const TOTAL_GRID_WIDTH = SIDEBAR_WIDTH + TOTAL_SLOTS * SLOT_WIDTH
export const TOTAL_GRID_HEIGHT = HEADER_HEIGHT + COURTS.length * ROW_HEIGHT

// Opening hours in minutes from midnight
export const OPEN_MINUTES = OPEN_HOUR * 60
export const CLOSE_MINUTES = CLOSE_HOUR * 60
export const VENUE_TOTAL_MINUTES_PER_DAY = CLOSE_MINUTES - OPEN_MINUTES // 720

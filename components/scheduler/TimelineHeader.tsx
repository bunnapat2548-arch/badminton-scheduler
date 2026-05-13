import { HEADER_HEIGHT, OPEN_HOUR, SIDEBAR_WIDTH, SLOT_WIDTH, TOTAL_SLOTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TimelineHeader() {
  const slots = Array.from({ length: TOTAL_SLOTS + 1 }, (_, i) => i)

  return (
    <div
      className="sticky top-0 z-30 flex border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 shrink-0"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* Corner */}
      <div
        className="sticky left-0 z-40 border-r border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 shrink-0 flex items-center justify-center"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          คอร์ท / เวลา
        </span>
      </div>

      {/* Time labels */}
      <div className="relative flex" style={{ width: TOTAL_SLOTS * SLOT_WIDTH }}>
        {slots.map((slot) => {
          const totalMinutes = slot * 30
          const hours = Math.floor(totalMinutes / 60) + OPEN_HOUR
          const minutes = totalMinutes % 60
          const isHour = minutes === 0
          const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

          // Final closing-time label (zero-width, right edge)
          if (slot === TOTAL_SLOTS) {
            return (
              <div key={slot} className="relative shrink-0" style={{ width: 0 }}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {time}
                  </span>
                </div>
              </div>
            )
          }

          return (
            <div
              key={slot}
              className="relative shrink-0 overflow-visible"
              style={{ width: SLOT_WIDTH }}
            >
              {/* Divider line — full height for :00, half height for :30 */}
              <div
                className={cn(
                  'absolute right-0 w-px bg-slate-200 dark:bg-slate-700',
                  isHour
                    ? 'top-0 bottom-0'          // full height
                    : 'top-1/4 bottom-0'        // bottom 3/4 only (half tick)
                )}
              />

              {/* Time label — centered in box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    'text-xs leading-none select-none',
                    isHour
                      ? 'font-semibold text-slate-600 dark:text-slate-300'
                      : 'font-normal text-slate-400 dark:text-slate-500'
                  )}
                >
                  {time}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

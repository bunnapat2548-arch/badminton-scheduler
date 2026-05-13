'use client'

import { useRef } from 'react'
import { SchedulerGrid } from '@/components/scheduler/SchedulerGrid'
import { DateNavigation } from '@/components/scheduler/DateNavigation'

export default function SchedulePage() {
  // exportRef wraps the full scheduler area for screenshot/print
  const exportRef = useRef<HTMLDivElement>(null)
  // scrollRef is the overflow-auto container used for scroll control
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="no-print">
        <DateNavigation schedulerRef={exportRef} />
      </div>
      <div
        ref={exportRef}
        className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900"
      >
        <SchedulerGrid containerRef={scrollRef} />
      </div>
    </div>
  )
}

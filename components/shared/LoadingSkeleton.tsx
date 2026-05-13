import { Skeleton } from '@/components/ui/skeleton'
import { COURTS, HEADER_HEIGHT, ROW_HEIGHT, SIDEBAR_WIDTH, SLOT_WIDTH, TOTAL_SLOTS } from '@/lib/constants'

export function SchedulerSkeleton() {
  return (
    <div className="overflow-hidden">
      <div
        style={{
          width: SIDEBAR_WIDTH + TOTAL_SLOTS * SLOT_WIDTH,
          minWidth: '100%',
        }}
      >
        {/* Header skeleton */}
        <div
          className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          style={{ height: HEADER_HEIGHT }}
        >
          <div
            className="border-r border-slate-200 dark:border-slate-700 shrink-0"
            style={{ width: SIDEBAR_WIDTH }}
          />
          <div className="flex items-center gap-4 px-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-10" />
            ))}
          </div>
        </div>

        {/* Row skeletons */}
        {COURTS.map((court) => (
          <div
            key={court.number}
            className="flex border-b border-slate-200 dark:border-slate-700"
            style={{ height: ROW_HEIGHT }}
          >
            <div
              className="flex items-center px-4 border-r border-slate-200 dark:border-slate-700 shrink-0"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

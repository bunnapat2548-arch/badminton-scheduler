import { CalendarX, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateBooking?: () => void
}

export function EmptyState({ onCreateBooking }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <CalendarX className="h-7 w-7 text-slate-400" />
      </div>
      <div>
        <p className="font-medium text-slate-700 dark:text-slate-300">
          ยังไม่มีการจองในวันนี้
        </p>
        <p className="text-sm text-slate-400 mt-1">
          คลิกบนตารางเพื่อสร้างการจองใหม่
        </p>
      </div>
      {onCreateBooking && (
        <Button size="sm" onClick={onCreateBooking} className="gap-2">
          <Plus className="h-4 w-4" />
          สร้างการจอง
        </Button>
      )}
    </div>
  )
}

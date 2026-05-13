import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{message}</p>
        <p className="text-sm text-slate-500 mt-1">กรุณาลองใหม่อีกครั้ง</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          ลองอีกครั้ง
        </Button>
      )}
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download, Plus, Printer, RotateCcw } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSchedulerStore } from '@/store/schedulerStore'
import { formatDateThai } from '@/lib/utils'
import { OPEN_HOUR, SIDEBAR_WIDTH, SLOT_WIDTH } from '@/lib/constants'
import { toPng } from 'html-to-image'
import { toast } from 'sonner'

interface DateNavigationProps {
  schedulerRef: React.RefObject<HTMLDivElement | null>
}

async function processImage(
  fullDataUrl: string,
  pixelRatio: number,
  startHour: number,
  gridScale = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const sidebarW = SIDEBAR_WIDTH * pixelRatio
      const startSlot = (startHour - OPEN_HOUR) * 2
      const sourceX = (SIDEBAR_WIDTH + startSlot * SLOT_WIDTH) * pixelRatio
      const sourceW = img.width - sourceX
      const destGridW = Math.round(sourceW * gridScale)

      const canvas = document.createElement('canvas')
      canvas.width = sidebarW + destGridW
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, sidebarW, img.height, 0, 0, sidebarW, img.height)
      ctx.drawImage(img, sourceX, 0, sourceW, img.height, sidebarW, 0, destGridW, img.height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = fullDataUrl
  })
}

export function DateNavigation({ schedulerRef }: DateNavigationProps) {
  const {
    selectedDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
    openCreateModal,
  } = useSchedulerStore()

  const isToday = selectedDate === dayjs().format('YYYY-MM-DD')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') goToPrevDay()
      if (e.key === 'ArrowRight') goToNextDay()
      if (e.key === 't' || e.key === 'T') goToToday()
      if (e.key === 'n' || e.key === 'N') openCreateModal()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPrevDay, goToNextDay, goToToday, openCreateModal])

  const handleExportImage = async (startHour: number) => {
    if (!schedulerRef.current) return
    const contentEl = schedulerRef.current.querySelector('[data-export-content]') as HTMLElement | null
    if (!contentEl) return
    try {
      const pixelRatio = 2
      const fullDataUrl = await toPng(contentEl, {
        backgroundColor: '#ffffff',
        pixelRatio,
      })

      const dataUrl = await processImage(fullDataUrl, pixelRatio, startHour, 1)

      const suffix = startHour === OPEN_HOUR ? '' : `-${startHour}00`
      const link = document.createElement('a')
      link.download = `schedule-${selectedDate}${suffix}.png`
      link.href = dataUrl
      link.click()
      toast.success('บันทึกรูปภาพสำเร็จ')
    } catch {
      toast.error('ไม่สามารถบันทึกรูปภาพได้')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevDay}
          className="h-8 w-8 p-0"
          title="วันก่อนหน้า (←)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant={isToday ? 'default' : 'outline'}
          size="sm"
          onClick={goToToday}
          className="h-8 px-3 gap-1.5 text-xs"
          title="วันนี้ (T)"
        >
          <RotateCcw className="h-3 w-3" />
          วันนี้
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextDay}
          className="h-8 w-8 p-0"
          title="วันถัดไป (→)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="ml-3">
          <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
            {formatDateThai(selectedDate)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 hidden lg:block">
          ← → วันก่อน/หน้า &nbsp;·&nbsp; T วันนี้ &nbsp;·&nbsp; N จองใหม่
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="h-8 gap-1.5 text-xs text-slate-500"
          title="พิมพ์"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:block">พิมพ์</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-slate-500"
              title="บันทึกเป็นรูปภาพ"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:block">บันทึกรูป</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExportImage(10)}>
              10:00 – 23:00 (ทั้งวัน)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportImage(15)}>
              15:00 – 23:00 (บ่าย)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="sm"
          onClick={() => openCreateModal({ booking_date: selectedDate })}
          className="h-8 gap-1.5 text-xs"
          title="สร้างการจองใหม่ (N)"
        >
          <Plus className="h-3.5 w-3.5" />
          จองใหม่
        </Button>
      </div>
    </div>
  )
}

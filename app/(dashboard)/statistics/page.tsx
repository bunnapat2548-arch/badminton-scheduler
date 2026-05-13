'use client'

import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
} from 'lucide-react'
import { useStatistics } from '@/hooks/useStatistics'
import { StatsCard } from '@/components/dashboard/StatsCard'
import {
  CourtBarChart,
  CourtUtilizationChart,
  DailyTrendChart,
  HourlyDistributionChart,
} from '@/components/dashboard/DashboardCharts'
import { StatsSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'

export default function StatisticsPage() {
  const { data, isLoading, isError, refetch } = useStatistics()

  if (isLoading) {
    return (
      <div className="overflow-auto h-full">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">สถิติการใช้งาน</h1>
            <p className="text-sm text-slate-500 mt-1">ภาพรวมการจองและการใช้งานคอร์ท</p>
          </div>
          <StatsSkeleton />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  const { daily, weekly, monthly, courtStats, mostUsedCourt, dailyTrend, hourlyDist } = data

  return (
    <div className="overflow-auto h-full">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            สถิติการใช้งาน
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ภาพรวมการจองและการใช้งานคอร์ทแบดมินตัน
          </p>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="ชั่วโมงวันนี้"
            value={`${daily.totalHours} ชม.`}
            subtitle={`${daily.totalBookings} การจอง`}
            icon={Clock}
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="ชั่วโมงสัปดาห์นี้"
            value={`${weekly.totalHours} ชม.`}
            subtitle={`${weekly.totalBookings} การจอง`}
            icon={Calendar}
            iconBg="bg-violet-50 dark:bg-violet-950"
            iconColor="text-violet-600 dark:text-violet-400"
          />
          <StatsCard
            title="ชั่วโมงเดือนนี้"
            value={`${monthly.totalHours} ชม.`}
            subtitle={`${monthly.totalBookings} การจอง`}
            icon={BarChart3}
            iconBg="bg-emerald-50 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatsCard
            title="อัตราการใช้งาน"
            value={`${monthly.utilizationPercent}%`}
            subtitle="เดือนนี้ (รวมทุกคอร์ท)"
            icon={Activity}
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Most Used Court Banner */}
        {mostUsedCourt && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
              <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                คอร์ทที่ใช้งานมากที่สุด
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                {mostUsedCourt.name} — {mostUsedCourt.totalHours} ชั่วโมง ({mostUsedCourt.utilizationPercent}% อัตราการใช้งาน)
              </p>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              #{mostUsedCourt.courtNumber}
            </div>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyTrendChart data={dailyTrend} />
          <CourtUtilizationChart data={courtStats} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HourlyDistributionChart data={hourlyDist} />
          <CourtBarChart data={courtStats} />
        </div>

        {/* Court Stats Table */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              รายละเอียดแต่ละคอร์ท (เดือนนี้)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    คอร์ท
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    จำนวนจอง
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ชั่วโมงรวม
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    อัตราใช้งาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {courtStats.map((court) => (
                  <tr
                    key={court.courtNumber}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                      {court.name}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {court.totalBookings}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {court.totalHours} ชม.
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      <span
                        className={
                          court.utilizationPercent >= 70
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : court.utilizationPercent >= 40
                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {court.utilizationPercent}%
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden w-full">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${Math.min(court.utilizationPercent, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}

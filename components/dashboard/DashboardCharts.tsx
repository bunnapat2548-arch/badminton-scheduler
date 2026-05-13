'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CourtStat, DailyData, HourlyData } from '@/types'
import { BOOKING_COLORS } from '@/lib/colors'

const CHART_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981',
]

interface DailyTrendChartProps {
  data: DailyData[]
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        ชั่วโมงการจอง (14 วันที่ผ่านมา)
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        จำนวนชั่วโมงรวมต่อวัน
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [`${value} ชม.`, 'ชั่วโมงจอง']}
          />
          <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CourtUtilizationChartProps {
  data: CourtStat[]
}

export function CourtUtilizationChart({ data }: CourtUtilizationChartProps) {
  const pieData = data.map((d, i) => ({
    name: d.name,
    value: d.totalHours,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        การใช้งานคอร์ท (เดือนนี้)
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        สัดส่วนชั่วโมงการใช้งานแต่ละคอร์ท
      </p>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} ชม.`]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((court, i) => (
            <div key={court.courtNumber} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">
                {court.name}
              </span>
              <span className="text-xs font-medium text-slate-900 dark:text-white tabular-nums">
                {court.utilizationPercent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface HourlyDistributionChartProps {
  data: HourlyData[]
}

export function HourlyDistributionChart({ data }: HourlyDistributionChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        ช่วงเวลายอดนิยม (เดือนนี้)
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        จำนวนการจองในแต่ละช่วงเวลา
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value} ครั้ง`, 'การจอง']}
          />
          <Bar dataKey="bookings" fill="#8B5CF6" radius={[3, 3, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CourtBarChartProps {
  data: CourtStat[]
}

export function CourtBarChart({ data }: CourtBarChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        การจองแต่ละคอร์ท (เดือนนี้)
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        จำนวนชั่วโมงและ % การใช้งาน
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data.map((d) => ({ ...d, name: d.name.replace('คอร์ท ', 'C') }))}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              name === 'totalHours' ? `${value} ชม.` : `${value} ครั้ง`,
              name === 'totalHours' ? 'ชั่วโมง' : 'การจอง',
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value) =>
              value === 'totalHours' ? 'ชั่วโมง' : 'จำนวนจอง'
            }
          />
          <Bar dataKey="totalHours" fill="#14B8A6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="totalBookings" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

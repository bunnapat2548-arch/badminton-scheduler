'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, CalendarDays, Moon, Sun, Volleyball } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'ตารางจอง', icon: CalendarDays },
  { href: '/statistics', label: 'สถิติ', icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex h-14 items-center px-4 gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
            <Volleyball className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
            BadmintonPro
          </span>
        </div>

        <nav className="flex items-center gap-1 ml-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 text-slate-600 dark:text-slate-400',
                  pathname === href &&
                    'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-slate-600 dark:text-slate-400"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

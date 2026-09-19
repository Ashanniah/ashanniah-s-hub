'use client'

import React from 'react'
import { Calendar as CalendarIcon, ShieldCheck } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export function Navbar() {
  const { getTotalNetWorth, dailyHealth } = useApp()

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Date badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <span>{todayStr}</span>
        </div>
      </div>

      {/* Top Header Summary Badges */}
      <div className="flex items-center gap-4">
        {/* Net Worth Summary Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
          <span className="text-xs text-slate-500">Net Worth:</span>
          <span className="text-xs font-bold text-emerald-600">
            ${getTotalNetWorth().toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Calories Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
          <span className="text-xs text-slate-500">Daily Calories:</span>
          <span className="text-xs font-bold text-amber-600">
            {dailyHealth.caloriesIn} / {dailyHealth.calorieGoal} kcal
          </span>
        </div>

        {/* Quick user avatar badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            AM
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800">Ashanniah M.</p>
            <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" /> Pro Active
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

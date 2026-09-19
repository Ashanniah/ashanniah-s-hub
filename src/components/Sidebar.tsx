'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Activity,
  Camera,
  Sparkles,
  Zap,
} from 'lucide-react'

const navItems = [
  {
    name: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Productivity & Tasks',
    href: '/productivity',
    icon: CheckSquare,
    badge: 'Tasks & Notes',
  },
  {
    name: 'Finance & Ledger',
    href: '/finance',
    icon: Wallet,
    badge: 'Accounts',
  },
  {
    name: 'Health & Fitness',
    href: '/health',
    icon: Activity,
    badge: 'AI Scan',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200 text-slate-700 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">
                Hub OS
              </h1>
              <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Productivity & Life
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Main Modules
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Quick AI Vision Scanner banner at bottom of sidebar */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-indigo-50/80 border border-pink-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-600">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">AI Vision Ready</span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          OpenRouter Vision powered calorie & meal tracker.
        </p>
        <Link
          href="/health"
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-all shadow-md shadow-pink-600/20"
        >
          <Camera className="w-3.5 h-3.5" /> Scan Meal
        </Link>
      </div>
    </aside>
  )
}

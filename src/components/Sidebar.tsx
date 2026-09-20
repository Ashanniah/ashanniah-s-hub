'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Activity,
  HeartPulse,
  Dumbbell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  Zap,
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  // Functional Collapse state
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Expandable Accordion for Health & Fitness
  const isHealthOrFitnessActive = pathname === '/health' || pathname === '/fitness'
  const [isHealthOpen, setIsHealthOpen] = useState(true)

  // Logout Modal Popup State
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64 md:w-72'
      } bg-white border-r border-slate-200/80 text-slate-800 flex flex-col justify-between hidden md:flex shrink-0 sticky top-0 h-screen overflow-y-auto p-4 transition-all duration-300 shadow-xs select-none z-30`}
    >
      <div className="space-y-6">
        {/* TOP SIDEBAR HEADER: LOGO + ASHANNIAH'S HUB + FUNCTIONAL MENU ICON */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-blue-500/20 shrink-0">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="font-extrabold text-base text-slate-900 tracking-tight truncate">
                Ashanniah&apos;s Hub
              </h1>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="space-y-1.5">
          {/* 1. DASHBOARD */}
          <Link
            href="/"
            className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
              pathname === '/'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </Link>

          {/* 2. PRODUCTIVITY & TASKS */}
          <Link
            href="/productivity"
            className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
              pathname === '/productivity'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Productivity & Tasks</span>}
          </Link>

          {/* 3. FINANCE & LEDGER */}
          <Link
            href="/finance"
            className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
              pathname === '/finance'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Wallet className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Finance & Ledger</span>}
          </Link>

          {/* 4. HEALTH & FITNESS (EXPANDABLE NESTED ACCORDION) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsHealthOpen(!isHealthOpen)}
              className={`w-full flex items-center justify-between py-3 px-3.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
                isHealthOrFitnessActive
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Activity className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">Health & Fitness</span>}
              </div>
              {!isCollapsed && (
                <div>
                  {isHealthOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* NESTED SUB-ITEMS WITH VERTICAL CONNECTOR LINE (Matching Reference Image 2 Snippet) */}
            {isHealthOpen && !isCollapsed && (
              <div className="pl-4 border-l-2 border-slate-200 ml-5 space-y-1.5 my-1.5">
                {/* Health Sub-Item */}
                <Link
                  href="/health"
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    pathname === '/health'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Health</span>
                </Link>

                {/* Fitness Sub-Item */}
                <Link
                  href="/fitness"
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    pathname === '/fitness'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Fitness</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* BOTTOM SECTION: SETTINGS + PROFILE & LOGOUT */}
      <div className="pt-3">
        {/* SETTINGS ITEM (ABOVE PROFILE) */}
        <Link
          href="/productivity"
          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <Settings className="w-4 h-4 text-slate-500 shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </Link>

        {/* SEPARATOR LINE */}
        <div className="border-t border-slate-200/60 my-2.5" />

        {/* BOTTOM PROFILE CARD WITH LOGOUT ICON BESIDE IT */}
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              AM
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-bold text-xs text-slate-900 leading-tight truncate">
                  Ashanniah M.
                </h2>
                <p className="text-[11px] text-slate-400 font-normal truncate">
                  ashanniah@hub.com
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CUSTOM LOGOUT CONFIRMATION POPUP MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-900">
                Log Out of Ashanniah&apos;s Hub?
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to log out? You will need to sign back in to access your dashboard and workspace.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false)
                  alert('Logged out successfully!')
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-600/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

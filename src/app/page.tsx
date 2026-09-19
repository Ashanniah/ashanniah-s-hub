'use client'

import React from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  Wallet,
  Sparkles,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Droplets,
  CheckCircle2,
  Circle,
  Camera,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function OverviewPage() {
  const {
    tasks,
    accounts,
    dailyHealth,
    toggleTask,
    getTotalNetWorth,
    getAccountBalance,
  } = useApp()

  const pendingTasks = tasks.filter((t) => !t.isCompleted)
  const completedTasks = tasks.filter((t) => t.isCompleted)

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Personal Hub Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, Ashanniah 👋
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-xl leading-relaxed">
              Track daily habits, manage multi-account ledger balances, monitor fitness goals, and scan meal calories with AI.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/health"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm transition shadow-md shadow-pink-500/30"
            >
              <Camera className="w-4 h-4" /> AI Food Scan
            </Link>
            <Link
              href="/productivity"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md font-semibold text-sm transition"
            >
              <Plus className="w-4 h-4" /> New Task
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Net Worth Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Net Worth
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              ${getTotalNetWorth().toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Across {accounts.length} active accounts</span>
            </p>
          </div>
        </div>

        {/* Tasks Progress Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily Tasks
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {completedTasks.length} / {tasks.length}{' '}
              <span className="text-xs font-normal text-slate-500">Completed</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: tasks.length ? `${(completedTasks.length / tasks.length) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Calorie Intake Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Calorie Budget
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {dailyHealth.caloriesIn}{' '}
              <span className="text-xs font-normal text-slate-500">/ {dailyHealth.calorieGoal} kcal</span>
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {dailyHealth.calorieGoal - dailyHealth.caloriesIn > 0
                ? `${dailyHealth.calorieGoal - dailyHealth.caloriesIn} kcal remaining`
                : 'Target achieved!'}
            </p>
          </div>
        </div>

        {/* Water Hydration Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hydration Log
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {(dailyHealth.waterIntakeMl / 1000).toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">/ 3.00 L</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (dailyHealth.waterIntakeMl / dailyHealth.waterGoalMl) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Tasks + Wallet Ledger Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" /> Pending Tasks & Habits
            </h2>
            <Link
              href="/productivity"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">All habits completed!</p>
                <p className="text-xs text-slate-500 mt-1">
                  Enjoy your day or add new scheduled tasks in Productivity.
                </p>
              </div>
            ) : (
              pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition flex items-center justify-between gap-4 group shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-slate-400 hover:text-indigo-600 transition"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 truncate transition">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-500 truncate">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'HIGH' || task.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Finance Snapshot Section (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" /> Accounts & Wallets
            </h2>
            <Link
              href="/finance"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {accounts.map((acc) => {
              const balance = getAccountBalance(acc.id)
              return (
                <div
                  key={acc.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: acc.color }}
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{acc.name}</h4>
                      <p className="text-[11px] text-slate-500">{acc.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

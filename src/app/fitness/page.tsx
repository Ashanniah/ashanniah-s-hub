'use client'

import React, { useState } from 'react'
import {
  Dumbbell,
  Footprints,
  Flame,
  Plus,
  Play,
  Timer,
  Heart,
  Zap,
  Activity,
  X,
  Trash2,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function FitnessPage() {
  const { exerciseLogs, addExerciseLog, deleteExerciseLog } = useApp()

  // Steps & Water Intake local tracking
  const [steps] = useState(9857)
  const [stepGoal] = useState(10000)
  const [caloriesBurnedGoal] = useState(650)

  // Exercise Form Modal State
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [exType, setExType] = useState('Upper Body Strength')
  const [exDuration, setExDuration] = useState('45')
  const [exCalories, setExCalories] = useState('320')

  const totalCaloriesBurned = exerciseLogs.reduce(
    (sum, ex) => sum + Number(ex.caloriesBurned),
    450
  )

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault()
    const dur = parseInt(exDuration) || 0
    const cal = parseInt(exCalories) || 0
    if (!exType.trim() || dur <= 0) return

    addExerciseLog({
      activityType: exType,
      durationMinutes: dur,
      caloriesBurned: cal,
    })

    setExType('Upper Body Strength')
    setExDuration('45')
    setExCalories('320')
    setShowExerciseModal(false)
  }

  // Preset Workout Routines
  const workoutRoutines = [
    {
      id: 'r1',
      title: 'Shoulder & Upper Body Press',
      category: 'Strength Training',
      duration: '34 Mins',
      calories: '340 kcal',
      level: 'Intermediate',
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 'r2',
      title: 'HIIT Cardio Burn & Core',
      category: 'Endurance',
      duration: '25 Mins',
      calories: '280 kcal',
      level: 'All Levels',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'r3',
      title: 'Leg Day & Squat Circuit',
      category: 'Hypertrophy',
      duration: '45 Mins',
      calories: '420 kcal',
      level: 'Advanced',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'r4',
      title: 'Full Body Mobility & Stretch',
      category: 'Recovery',
      duration: '20 Mins',
      calories: '120 kcal',
      level: 'Beginner',
      color: 'from-emerald-500 to-teal-600',
    },
  ]

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30">
            <Dumbbell className="w-3.5 h-3.5" /> Fitness & Workout Hub
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Daily Workout & Motion Tracker
          </h1>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Track your daily steps, active calorie burn, workout routines, and fitness milestones in real time.
          </p>
        </div>

        <button
          onClick={() => setShowExerciseModal(true)}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 shrink-0 z-10"
        >
          <Plus className="w-4 h-4" /> Log Custom Workout
        </button>

        {/* Decorative ambient background accent */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step Counter Card */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Daily Steps</span>
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
              <Footprints className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{steps.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Goal: {stepGoal.toLocaleString()} steps</p>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden pt-0.5">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (steps / stepGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* Calories Burned Card */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Burn</span>
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{totalCaloriesBurned} kcal</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Goal: {caloriesBurnedGoal} kcal</p>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCaloriesBurned / caloriesBurnedGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* Active Time Card */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Duration</span>
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-600">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">48 Mins</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Target: 60 mins today</p>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-[80%]" />
          </div>
        </div>

        {/* Heart Rate / Intensity Card */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">BPM / Intensity</span>
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">124 BPM</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Cardio Zone Active</p>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[68%]" />
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY LOGS GRID (TRANSFERRED FROM HEALTH PAGE) */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">Activity Logs & Exercises</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-semibold text-slate-500">Walking</span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">9,857 Steps</h4>
              <span className="text-[10px] text-slate-400 font-medium">Today 11:45 AM</span>
            </div>
            <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
              <Footprints className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-semibold text-slate-500">Strength Workout</span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">45 Minutes</h4>
              <span className="text-[10px] text-slate-400 font-medium">Today 8:00 PM</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
              <Dumbbell className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-semibold text-slate-500">Outdoor Cycling</span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">17 km</h4>
              <span className="text-[10px] text-slate-400 font-medium">Today 9:00 AM</span>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-600">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-semibold text-slate-500">Push-ups Reps</span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">230 Reps</h4>
              <span className="text-[10px] text-slate-400 font-medium">Today 8:00 AM</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* WORKOUT ROUTINES GRID */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Recommended Workout Routines</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a routine to begin your session</p>
          </div>
          <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View All Routines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workoutRoutines.map((routine) => (
            <div
              key={routine.id}
              className={`p-6 rounded-[32px] bg-gradient-to-r ${routine.color} text-white flex flex-col justify-between gap-6 shadow-md shadow-slate-200/50 hover:scale-[1.01] transition-transform`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-[10px] backdrop-blur-md">
                    {routine.level}
                  </span>
                  <span className="text-xs font-bold opacity-90">{routine.category}</span>
                </div>
                <h3 className="text-2xl font-black">{routine.title}</h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-white/90">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> {routine.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {routine.calories}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-xs font-bold text-white/80">16 Full Exercises Included</span>
                <button
                  onClick={() => setShowExerciseModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-900" /> Start Routine
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXERCISE HISTORY LOG TABLE */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Recorded Exercise Sessions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your workout history for today</p>
          </div>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Log
          </button>
        </div>

        {exerciseLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No workouts recorded yet. Click &quot;Log Custom Workout&quot; above!
          </p>
        ) : (
          <div className="space-y-3">
            {exerciseLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{log.activityType}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {log.durationMinutes} Minutes • Burned {log.caloriesBurned} kcal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs">
                    Completed
                  </span>
                  <button
                    onClick={() => deleteExerciseLog(log.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOG EXERCISE MODAL */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">Record Exercise Session</h3>
              </div>
              <button
                onClick={() => setShowExerciseModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workout / Activity Name</label>
                <input
                  type="text"
                  value={exType}
                  onChange={(e) => setExType(e.target.value)}
                  placeholder="e.g. Strength Training, Running"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={exDuration}
                    onChange={(e) => setExDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. Calories (kcal)</label>
                  <input
                    type="number"
                    value={exCalories}
                    onChange={(e) => setExCalories(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useRef } from 'react'
import {
  Activity,
  Flame,
  Droplets,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  CheckCircle2,
  Dumbbell,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { FoodScanResult } from '@/lib/types'

export default function HealthPage() {
  const {
    foodLogs,
    exerciseLogs,
    dailyHealth,
    addFoodLog,
    deleteFoodLog,
    addExerciseLog,
    deleteExerciseLog,
    updateWaterIntake,
  } = useApp()

  // Scanner States
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanNotice, setScanNotice] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

  // Editable Pre-fill Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmFoodItem, setConfirmFoodItem] = useState('')
  const [confirmCalories, setConfirmCalories] = useState(350)
  const [confirmProtein, setConfirmProtein] = useState(20)
  const [confirmCarbs, setConfirmCarbs] = useState(40)
  const [confirmFat, setConfirmFat] = useState(12)

  // Exercise Form State
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [exType, setExType] = useState('Weightlifting / Strength')
  const [exDuration, setExDuration] = useState('45')
  const [exCalories, setExCalories] = useState('320')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload / selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64Str = reader.result as string
      setSelectedImage(base64Str)
      setScanError(null)
    }
    reader.readAsDataURL(file)
  }

  // Execute AI Scan request to API route
  const handleScanImage = async () => {
    if (!selectedImage) return
    setIsScanning(true)
    setScanError(null)
    setScanNotice(null)

    try {
      const res = await fetch('/api/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      const scanResult: FoodScanResult = data.data
      if (data.notice) {
        setScanNotice(data.notice)
      }

      // Populate Editable Confirmation UI fields
      setConfirmFoodItem(scanResult.food_item)
      setConfirmCalories(scanResult.estimated_calories)
      setConfirmProtein(scanResult.protein_g)
      setConfirmCarbs(scanResult.carbs_g)
      setConfirmFat(scanResult.fat_g)
      setShowConfirmModal(true)
    } catch (err: unknown) {
      console.error('Scan error:', err)
      const msg = err instanceof Error ? err.message : 'Error scanning image'
      setScanError(msg)
    } finally {
      setIsScanning(false)
    }
  }

  // Save confirmed meal into food log
  const handleConfirmLogMeal = (e: React.FormEvent) => {
    e.preventDefault()
    addFoodLog({
      foodItem: confirmFoodItem,
      calories: confirmCalories,
      proteinG: confirmProtein,
      carbsG: confirmCarbs,
      fatG: confirmFat,
      imageUrl: selectedImage,
    })
    setShowConfirmModal(false)
    setSelectedImage(null)
  }

  // Handle exercise log submission
  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault()
    const dur = parseInt(exDuration) || 0
    const cal = parseInt(exCalories) || 0
    if (!exType.trim() || dur <= 0) return

    addExerciseLog({
      activityType: exType,
      durationMinutes: dur,
      caloriesBurned: cal,
    })

    setExType('Weightlifting / Strength')
    setExDuration('45')
    setExCalories('320')
    setShowExerciseModal(false)
  }

  // Compute Total Macros
  const totalProtein = foodLogs.reduce((sum, f) => sum + Number(f.proteinG), 0)
  const totalCarbs = foodLogs.reduce((sum, f) => sum + Number(f.carbsG), 0)
  const totalFat = foodLogs.reduce((sum, f) => sum + Number(f.fatG), 0)

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-pink-600" /> Health & AI Calorie Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            OpenRouter AI Vision meal scanner, macro breakdown, and exercise log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateWaterIntake(250)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition"
          >
            <Droplets className="w-4 h-4" /> +250ml Water
          </button>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs shadow-md shadow-pink-600/20 transition"
          >
            <Dumbbell className="w-4 h-4" /> Log Workout
          </button>
        </div>
      </div>

      {/* DASHBOARD GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calories In vs Out */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Calorie Balance
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {dailyHealth.netCalories}{' '}
              <span className="text-xs font-normal text-slate-500">Net kcal</span>
            </h3>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Food In: <strong className="text-amber-600">{dailyHealth.caloriesIn}</strong></span>
              <span>Burned Out: <strong className="text-pink-600">{dailyHealth.caloriesOut}</strong></span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Daily Macros Summary
          </span>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold">PROTEIN</span>
              <span className="text-base font-bold text-indigo-600">{totalProtein.toFixed(0)}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold">CARBS</span>
              <span className="text-base font-bold text-emerald-600">{totalCarbs.toFixed(0)}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold">FAT</span>
              <span className="text-base font-bold text-amber-600">{totalFat.toFixed(0)}g</span>
            </div>
          </div>
        </div>

        {/* Water Hydration */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hydration Level
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {(dailyHealth.waterIntakeMl / 1000).toFixed(2)} L
            </h3>
            <p className="text-xs text-sky-600 mt-1 font-semibold">
              Goal: {(dailyHealth.waterGoalMl / 1000).toFixed(1)} Liters per day
            </p>
          </div>
        </div>
      </div>

      {/* AI FOOD VISION SCANNER CONTAINER */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-pink-50/50 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              AI Food & Calorie Scanner <Sparkles className="w-4 h-4 text-pink-600" />
            </h2>
            <p className="text-xs text-slate-500">
              Upload or drop a food image. OpenRouter Vision will estimate calories and macros for confirmation.
            </p>
          </div>
        </div>

        {scanNotice && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{scanNotice}</span>
          </div>
        )}

        {scanError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}

        {/* Dropzone & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-pink-500 rounded-2xl p-8 text-center bg-white hover:bg-slate-50/80 transition cursor-pointer flex flex-col items-center justify-center min-h-[220px] shadow-xs"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {selectedImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={selectedImage}
                alt="Meal preview"
                className="max-h-44 object-contain rounded-xl shadow-md border border-slate-200"
              />
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-800">
                  Click or Drag &amp; Drop Food Image
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP</p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Once an image is uploaded, click <strong>Analyze Meal</strong>. The vision model will analyze ingredients, portion size, and compute calorie &amp; macro estimates.
            </p>

            <button
              onClick={handleScanImage}
              disabled={!selectedImage || isScanning}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-pink-600/20 transition flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Vision Model...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Analyze Meal &amp; Estimate Cal
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LOGGED MEALS & EXERCISES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Logs List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Today&apos;s Logged Meals ({foodLogs.length})
          </h3>
          <div className="space-y-3">
            {foodLogs.map((food) => (
              <div
                key={food.id}
                className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  {food.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={food.imageUrl}
                      alt={food.foodItem}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      Meal
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{food.foodItem}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      P: {food.proteinG}g | C: {food.carbsG}g | F: {food.fatG}g
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-600">{food.calories} kcal</span>
                  <button
                    onClick={() => deleteFoodLog(food.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Logs List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Today&apos;s Workouts ({exerciseLogs.length})
          </h3>
          <div className="space-y-3">
            {exerciseLogs.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{ex.activityType}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Duration: {ex.durationMinutes} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-pink-600">-{ex.caloriesBurned} kcal</span>
                  <button
                    onClick={() => deleteExerciseLog(ex.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDITABLE CONFIRMATION UI MODAL FOR AI SCAN RESULT */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Verify &amp; Confirm AI Scan Breakdown
            </div>
            <p className="text-xs text-slate-500">
              You can adjust any estimated calorie or macro values before logging into your health journal.
            </p>

            <form onSubmit={handleConfirmLogMeal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={confirmFoodItem}
                  onChange={(e) => setConfirmFoodItem(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Estimated Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={confirmCalories}
                    onChange={(e) => setConfirmCalories(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={confirmProtein}
                    onChange={(e) => setConfirmProtein(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Carbohydrates (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={confirmCarbs}
                    onChange={(e) => setConfirmCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={confirmFat}
                    onChange={(e) => setConfirmFat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                >
                  Save to Health Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EXERCISE MODAL */}
      {showExerciseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Log Exercise / Workout</h3>
            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Activity Type</label>
                <input
                  type="text"
                  required
                  value={exType}
                  onChange={(e) => setExType(e.target.value)}
                  placeholder="e.g. HIIT Workout, Running, Swimming"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={exDuration}
                    onChange={(e) => setExDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Estimated Calories Burned</label>
                  <input
                    type="number"
                    required
                    value={exCalories}
                    onChange={(e) => setExCalories(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white shadow-md"
                >
                  Record Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

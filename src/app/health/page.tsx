'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Flame,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Video,
  Utensils,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { FoodScanResult } from '@/lib/types'

export default function HealthPage() {
  const {
    foodLogs,
    exerciseLogs,
    addFoodLog,
    deleteFoodLog,
    updateWaterIntake,
  } = useApp()

  // Tab & Filter States
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeScannerTab, setActiveScannerTab] = useState<'upload' | 'camera'>('upload')

  // Live Camera Stream State
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  // Water Glass Count State (Default 12 glasses)
  const [waterGlasses, setWaterGlasses] = useState(12)
  const [stepCount, setStepCount] = useState(9857)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Stop camera stream on unmount or tab change
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    setCameraError(null)
    setIsCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err)
      setCameraError('Camera access denied or unavailable. Please use file upload.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const captureCameraPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setSelectedImage(dataUrl)
      stopCamera()
    }
  }

  // Handle image file upload
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

      // Populate Confirmation Modal UI fields
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

  // Compute Total Macros & Calories
  const totalCaloriesIn = foodLogs.reduce((sum, f) => sum + Number(f.calories), 0)
  const totalCaloriesOut = exerciseLogs.reduce((sum, e) => sum + Number(e.caloriesBurned), 0)
  const netCalories = totalCaloriesIn - totalCaloriesOut
  const targetCalories = 1920

  const totalProtein = foodLogs.reduce((sum, f) => sum + Number(f.proteinG), 0)
  const totalCarbs = foodLogs.reduce((sum, f) => sum + Number(f.carbsG), 0)
  const totalFat = foodLogs.reduce((sum, f) => sum + Number(f.fatG), 0)

  // Food Categories List (Image 1 & 3)
  const categoriesList = [
    { name: 'All', icon: '✨' },
    { name: 'Vegan', icon: '🥑' },
    { name: 'Carbs', icon: '🍞' },
    { name: 'Protein', icon: '🍗' },
    { name: 'Snacks', icon: '🥜' },
    { name: 'Drink', icon: '🧃' },
    { name: 'Keto', icon: '🥑' },
    { name: 'Paleo', icon: '🥩' },
    { name: 'Mediterranean', icon: '🍋' },
  ]

  // Pre-loaded Recommended Recipes (Image 1)
  const recommendedRecipes = [
    {
      id: 'rec-1',
      title: 'Grilled Chicken Salad',
      calories: 280,
      carbs: 48,
      protein: 160,
      fat: 72,
      score: '5/10',
      rating: '4.9k',
      category: 'Protein',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec-2',
      title: 'Herb Omelette & Vegetables',
      calories: 300,
      carbs: 12,
      protein: 24,
      fat: 18,
      score: '8/10',
      rating: '4.8k',
      category: 'Protein',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec-3',
      title: 'Avocado & Quinoa Bowl',
      calories: 420,
      carbs: 52,
      protein: 18,
      fat: 16,
      score: '9/10',
      rating: '4.7k',
      category: 'Vegan',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    },
  ]

  const filteredRecipes =
    activeCategory === 'All'
      ? recommendedRecipes
      : recommendedRecipes.filter((r) => r.category === activeCategory)

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto font-sans">
      {/* 1. TOP HERO GREETING & STREAK BANNER (IMAGE 5 & IMAGE 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Greeting & Daily Quick Metrics */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-700 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Calorie & Health Hub
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm">
                  AM
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, Ashanniah 👋
            </h1>
            <p className="text-emerald-100 text-sm mt-1.5 max-w-lg leading-relaxed">
              Track your daily meal calories, scan food with AI, monitor workouts, and keep your health streak active.
            </p>
          </div>

          {/* Activity Metric Pills (Image 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-100 font-semibold block">Steps Walked</span>
                <span className="text-xl font-extrabold text-white mt-0.5 block">{stepCount.toLocaleString()} steps</span>
              </div>
              <button
                onClick={() => setStepCount((prev) => prev + 500)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-white"
                title="Add 500 steps"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-100 font-semibold block">Drink Water</span>
                <span className="text-xl font-extrabold text-white mt-0.5 block">{waterGlasses} glasses</span>
              </div>
              <button
                onClick={() => {
                  setWaterGlasses((prev) => prev + 1)
                  updateWaterIntake(250)
                }}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-white"
                title="Add 1 glass"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-100 font-semibold block">Net Calories</span>
                <span className="text-xl font-extrabold text-white mt-0.5 block">{netCalories} Kcal</span>
              </div>
              <Flame className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
          </div>
        </div>

        {/* STREAK TRACKER CARD (IMAGE 5) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/15 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Streak Tracker</span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">14 Days Challenge</span>
          </div>

          <div className="my-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg mb-3 group hover:scale-105 transition duration-300">
              <Flame className="w-12 h-12 text-amber-200 fill-amber-200 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white">3 Days Streak!</h2>
            <p className="text-xs text-amber-100 font-semibold mt-1">You are on track! Day 8 of 14 completed.</p>
          </div>

          {/* Weekly Flames Row */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold pt-4 border-t border-white/20">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => {
              const isActive = i < 3
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition ${
                    isActive ? 'bg-white text-orange-600 font-extrabold shadow-sm' : 'bg-white/20 text-amber-100'
                  }`}
                >
                  <span className="text-[10px] uppercase">{day}</span>
                  <Flame className={`w-4 h-4 mt-1 ${isActive ? 'fill-orange-500 text-orange-500' : 'text-amber-200'}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. DUAL AI SCANNER & FOOD CATEGORIES BAR (IMAGE 1 & IMAGE 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DUAL AI SCANNER CARD (UPLOAD + LIVE WEB CAMERA) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-600" /> AI Food Scanner
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Scan your meal using Live Web Camera or Upload an image for instant calorie & macro analysis.
              </p>
            </div>

            {/* Scanner Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              <button
                onClick={() => {
                  stopCamera()
                  setActiveScannerTab('upload')
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeScannerTab === 'upload'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload Image
              </button>
              <button
                onClick={() => {
                  setActiveScannerTab('camera')
                  startCamera()
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeScannerTab === 'camera'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" /> Live Camera
              </button>
            </div>
          </div>

          {/* Scanner Area */}
          <div className="space-y-4">
            {activeScannerTab === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-[28px] p-8 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition cursor-pointer flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img src={selectedImage} alt="Selected meal" className="w-full h-48 object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedImage(null)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">Drop or Upload Meal Image</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Supports JPG, PNG, WEBP. Automatic recognition of calories, carbs, protein, and fats.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Live Camera Stream Container */
              <div className="rounded-[28px] border-2 border-slate-200 bg-slate-900 text-white p-4 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full max-w-md h-56 object-cover rounded-2xl border border-slate-700 ${
                    isCameraActive ? 'block' : 'hidden'
                  }`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="text-center space-y-3 p-6">
                    <Video className="w-12 h-12 text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-300 max-w-xs">{cameraError || 'Camera inactive.'}</p>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md"
                    >
                      Start Camera Feed
                    </button>
                  </div>
                )}

                {isCameraActive && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={captureCameraPhoto}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Snap & Scan Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Stop Camera
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Scan Action Button */}
            {selectedImage && (
              <button
                onClick={handleScanImage}
                disabled={isScanning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Food with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" /> Analyze Nutrition & Calorie Count
                  </>
                )}
              </button>
            )}

            {scanNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" /> {scanNotice}
              </div>
            )}

            {scanError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {scanError}
              </div>
            )}
          </div>
        </div>

        {/* FOOD CATEGORIES & QUICK MEAL SELECTOR (IMAGE 1 & IMAGE 3) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Food Categories</h2>
              <span className="text-xs font-semibold text-emerald-600">See all</span>
            </div>

            {/* Horizontal Categories Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeCategory === cat.name
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            {/* Recommended Recipes Cards (Image 1) */}
            <div className="space-y-4 mt-5">
              {filteredRecipes.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition shadow-2xs flex items-center justify-between gap-4 group bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <img src={rec.image} alt={rec.title} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">
                        {rec.title}
                      </h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px] mt-1">
                        {rec.calories} Kcal
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addFoodLog({
                        foodItem: rec.title,
                        calories: rec.calories,
                        proteinG: rec.protein,
                        carbsG: rec.carbs,
                        fatG: rec.fat,
                        imageUrl: rec.image,
                      })
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition shrink-0"
                  >
                    I Ate This!
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. NUTRITION ANALYTICS & WEEKLY CHARTS (IMAGE 2 & IMAGE 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* WEEKLY CALORIES BAR CHART CARD (IMAGE 2 & IMAGE 3) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Weekly Nutrition Overview</h3>
              <p className="text-xs text-slate-500 mt-1">Average daily intake: 1,900 Kcal</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs">
              Target: {targetCalories} Kcal
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {[
                { day: 'Mon', height: '44%', val: '1,250' },
                { day: 'Tue', height: '34%', val: '1,100' },
                { day: 'Wed', height: '95%', val: '1,920', peak: true },
                { day: 'Thu', height: '47%', val: '1,320' },
                { day: 'Fri', height: '32%', val: '980' },
                { day: 'Sat', height: '79%', val: '1,700' },
                { day: 'Sun', height: '24%', val: '850' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition">
                    {bar.val}
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className={`w-full rounded-2xl transition-all duration-300 ${
                      bar.peak
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/30'
                        : 'bg-emerald-100 hover:bg-emerald-200'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MACRO CONCENTRIC RINGS & GAUGE METER (IMAGE 3 & IMAGE 4) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Macro Breakdown
          </h3>

          <div className="space-y-4">
            {/* Carbs */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Carbohydrates</span>
                <span>{totalCarbs} / 225g</span>
              </div>
              <div className="w-full h-3 rounded-full bg-emerald-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalCarbs / 225) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span>Protein</span>
                <span>{totalProtein} / 112g</span>
              </div>
              <div className="w-full h-3 rounded-full bg-blue-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalProtein / 112) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Fats</span>
                <span>{totalFat} / 50g</span>
              </div>
              <div className="w-full h-3 rounded-full bg-amber-200 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalFat / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* 5. FOOD LOG HISTORY TABLE */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Logged Meals</h2>

        {foodLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No meals logged yet. Use the scanner above to add your first meal!</p>
        ) : (
          <div className="space-y-3">
            {foodLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {log.imageUrl ? (
                    <img src={log.imageUrl} alt={log.foodItem} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <Utensils className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{log.foodItem}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      P: {log.proteinG}g • C: {log.carbsG}g • F: {log.fatG}g
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs">
                    {log.calories} Kcal
                  </span>
                  <button
                    onClick={() => deleteFoodLog(log.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDITABLE CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Confirm AI Food Recognition</h3>
            <form onSubmit={handleConfirmLogMeal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={confirmFoodItem}
                  onChange={(e) => setConfirmFoodItem(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={confirmCalories}
                    onChange={(e) => setConfirmCalories(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    required
                    value={confirmProtein}
                    onChange={(e) => setConfirmProtein(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    value={confirmCarbs}
                    onChange={(e) => setConfirmCarbs(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    required
                    value={confirmFat}
                    onChange={(e) => setConfirmFat(Number(e.target.value))}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                >
                  Confirm & Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  )
}

'use client'

import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  CheckSquare,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Check,
  Trash2,
  SlidersHorizontal,
  Edit3,
  X,
  Type,
  Italic,
  Bold,
  Code,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Priority, Frequency, NoteItem, NoteStatus } from '@/lib/types'

// 3D Isometric Squircle Icon Component
function Note3DIcon({ type }: { type?: string }) {
  if (type === 'briefcase') {
    return (
      <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#dbeafe] to-[#c7d2fe] p-3 flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          <rect x="8" y="22" width="34" height="26" rx="6" fill="#818CF8" />
          <rect x="12" y="26" width="26" height="18" rx="4" fill="#6366F1" />
          <path d="M20 18C20 15.7909 21.7909 14 24 14H26C28.2091 14 30 15.7909 30 18V22H20V18Z" fill="#818CF8" />
          <circle cx="44" cy="38" r="14" fill="#312E81" />
          <circle cx="44" cy="38" r="10" fill="#EC4899" />
          <circle cx="44" cy="38" r="6" fill="#F472B6" />
          <circle cx="44" cy="38" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>
    )
  }
  if (type === 'design') {
    return (
      <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#fef3c7] to-[#fde68a] p-3 flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          <rect x="8" y="16" width="36" height="24" rx="5" fill="#3B82F6" />
          <rect x="12" y="20" width="28" height="16" rx="3" fill="#60A5FA" />
          <rect x="22" y="10" width="24" height="18" rx="4" fill="#F59E0B" />
          <rect x="26" y="14" width="16" height="10" rx="2" fill="#FBBF24" />
          <path d="M4 42H52L56 46H0L4 42Z" fill="#94A3B8" />
        </svg>
      </div>
    )
  }
  if (type === 'task') {
    return (
      <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe] p-3 flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          <rect x="10" y="12" width="32" height="42" rx="6" fill="#FFFFFF" />
          <rect x="20" y="8" width="12" height="6" rx="2" fill="#818CF8" />
          <rect x="16" y="22" width="20" height="3.5" rx="1.5" fill="#A5B4FC" />
          <rect x="16" y="30" width="16" height="3.5" rx="1.5" fill="#CBD5E1" />
          <rect x="16" y="38" width="12" height="3.5" rx="1.5" fill="#CBD5E1" />
          <circle cx="44" cy="38" r="13" fill="#C084FC" />
          <path d="M38 42L48 28L52 32L42 46H38V42Z" fill="#EC4899" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] p-3 flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
        <rect x="12" y="10" width="40" height="44" rx="6" fill="#FFFFFF" />
        <path d="M20 20H44M20 28H36M20 36H42" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function ProductivityPage() {
  const { tasks, notes, addTask, toggleTask, deleteTask, addNote, updateNote, deleteNote } = useApp()

  const [activeTab, setActiveTab] = useState<'calendar' | 'board' | 'tasks'>('calendar')
  const [calendarViewMode, setCalendarViewMode] = useState<'week' | 'month'>('week')

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)

  // Selected Note for detail popup
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editMins, setEditMins] = useState(4)

  // Event Form State
  const [eventTitle, setEventTitle] = useState('')
  const [eventColor, setEventColor] = useState<'purple' | 'indigo' | 'emerald' | 'amber' | 'rose'>('indigo')
  const [eventDate, setEventDate] = useState('2026-09-20')
  const [eventStartTime, setEventStartTime] = useState('09:00')
  const [eventEndTime, setEventEndTime] = useState('10:30')
  const [eventPlace, setEventPlace] = useState('')
  const [eventMembers, setEventMembers] = useState('Alex, Sarah')
  const [eventNotes, setEventNotes] = useState('')

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM')
  const [taskFrequency, setTaskFrequency] = useState<Frequency>('DAILY')
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0])
  const [taskMins, setTaskMins] = useState(15)

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('TODO')
  const [noteDate, setNoteDate] = useState('2026-09-20')
  const [isGeneralNote, setIsGeneralNote] = useState(true)
  const [noteTagsStr, setNoteTagsStr] = useState('design, project')
  const [noteMins, setNoteMins] = useState(5)
  const [noteTheme, setNoteTheme] = useState<'purple' | 'yellow' | 'blue'>('purple')
  const [noteIconType, setNoteIconType] = useState<'briefcase' | 'design' | 'task' | 'general'>('briefcase')

  // Sample tasks checklist for today
  const [todayTasksList, setTodayTasksList] = useState([
    { id: 'tt-1', time: '8:00 - 8:15', title: 'Physical workout routine', done: true },
    { id: 'tt-2', time: '8:30 - 9:00', title: 'Workspace cleanup', done: false },
    { id: 'tt-3', time: '9:20 - 10:00', title: 'Walk the dog', done: false },
    { id: 'tt-4', time: '10:00 - 10:30', title: 'Tea time break', done: false },
    { id: 'tt-5', time: '11:00 - 12:00', title: 'Massage session', done: false },
    { id: 'tt-6', time: '12:00 - 13:00', title: 'Call family', done: false },
    { id: 'tt-7', time: '13:00 - 13:30', title: 'Healthy lunch', done: false },
  ])

  const toggleTodayTask = (id: string) => {
    setTodayTasksList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) return
    addTask({
      title: taskTitle,
      description: taskDesc,
      isCompleted: false,
      dueDate: taskDueDate,
      frequency: taskFrequency,
      priority: taskPriority,
      category: 'General',
      estimatedMins: taskMins,
      bgTheme: 'purple',
      iconType: 'task',
      status: 'TODO',
    })
    setTaskTitle('')
    setTaskDesc('')
    setShowTaskModal(false)
  }

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteTitle.trim()) return
    addNote({
      title: noteTitle,
      content: noteContent,
      date: isGeneralNote ? '2026-09-20' : noteDate,
      isGeneral: isGeneralNote,
      tags: noteTagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      estimatedMins: noteMins,
      bgTheme: noteTheme,
      iconType: noteIconType,
      status: noteStatus,
    })
    setNoteTitle('')
    setNoteContent('')
    setShowNoteModal(false)
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim()) return
    addNote({
      title: eventTitle,
      content: eventNotes || 'Scheduled calendar event.',
      date: eventDate,
      isGeneral: false,
      tags: ['event', eventColor],
      estimatedMins: 60,
      bgTheme: 'blue',
      iconType: 'briefcase',
      status: 'IN_PROGRESS',
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventPlace,
      members: eventMembers.split(',').map((m) => m.trim()),
    })
    setEventTitle('')
    setEventPlace('')
    setShowEventModal(false)
  }

  const openNoteDetail = (note: NoteItem) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditMins(note.estimatedMins || 4)
    setIsEditingNote(false)
  }

  const handleSaveEditNote = () => {
    if (!selectedNote) return
    updateNote(selectedNote.id, {
      title: editTitle,
      content: editContent,
      estimatedMins: editMins,
    })
    setSelectedNote({
      ...selectedNote,
      title: editTitle,
      content: editContent,
      estimatedMins: editMins,
    })
    setIsEditingNote(false)
  }

  const moveNoteStatus = (note: NoteItem, newStatus: NoteStatus) => {
    updateNote(note.id, { status: newStatus })
  }

  const applyTextFormat = (wrapper: string) => {
    if (!isEditingNote) setIsEditingNote(true)
    setEditContent((prev) => `${prev} ${wrapper}highlighted text${wrapper}`)
  }

  // Week View Days
  const weekDaysList = [
    { dayName: 'Mon', dateNum: '14' },
    { dayName: 'Tue', dateNum: '15' },
    { dayName: 'Wed', dateNum: '16' },
    { dayName: 'Thu', dateNum: '17' },
    { dayName: 'Fri', dateNum: '18' },
    { dayName: 'Sat', dateNum: '19' },
    { dayName: 'Sun', dateNum: '20' },
  ]

  const hoursGrid = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]

  // Filter notes by status columns
  const todoNotes = notes.filter((n) => (n.status || 'TODO') === 'TODO')
  const inProgressNotes = notes.filter((n) => n.status === 'IN_PROGRESS')
  const completedNotes = notes.filter((n) => n.status === 'COMPLETED')

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Productivity Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Personal Schedule & Workspace
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-xl leading-relaxed">
              Manage time-blocked events, organize your 3-column task board, and stay focused.
            </p>
          </div>

          {/* Unified Tab Selector */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <CalendarIcon className="w-4 h-4" /> Calendar Schedule
            </button>
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'board'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" /> 3-Column Board ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Tasks List ({tasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CUSTOM PREMIUM CALENDAR SCHEDULE VIEW */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Toolbar & View Switcher */}
          <div className="p-5 rounded-[28px] bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition border border-indigo-100">
                Today
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                  September 20, 2026
                </span>
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher Pills */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
                <button
                  onClick={() => setCalendarViewMode('week')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    calendarViewMode === 'week'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Week Schedule
                </button>
                <button
                  onClick={() => setCalendarViewMode('month')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    calendarViewMode === 'month'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Month & Tasks
                </button>
              </div>

              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: WEEK SCHEDULE GRID */}
          {calendarViewMode === 'week' && (
            <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs overflow-x-auto">
              <div className="min-w-[900px] relative">
                {/* Red Glowing Current Time Indicator Line (e.g. at 09:30 AM position) */}
                <div className="absolute top-[165px] left-0 right-0 z-20 flex items-center pointer-events-none">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-200 shadow-md" />
                  <div className="h-[2.5px] w-full bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300" />
                </div>

                {/* Day Columns Header */}
                <div className="grid grid-cols-8 text-center text-xs font-bold border-b border-slate-100 pb-3 mb-3">
                  <div className="text-slate-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  {weekDaysList.map((d) => {
                    const isToday = d.dateNum === '20'
                    return (
                      <div
                        key={d.dayName}
                        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition ${
                          isToday ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-[11px] uppercase tracking-wider text-slate-400">{d.dayName}</span>
                        <span className={`text-base sm:text-lg font-extrabold mt-0.5 ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>
                          {d.dateNum}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Hourly Rows Grid */}
                <div className="space-y-3">
                  {hoursGrid.map((hour, hourIdx) => (
                    <div key={hour} className="grid grid-cols-8 gap-2 min-h-[56px] items-stretch">
                      <div className="text-xs font-bold text-slate-400 pt-2 text-center">
                        {hour}
                      </div>

                      {weekDaysList.map((d, colIdx) => (
                        <div
                          key={d.dayName}
                          onClick={() => {
                            setEventStartTime(hour)
                            setShowEventModal(true)
                          }}
                          className="border-b border-r border-slate-100/90 hover:bg-indigo-50/40 transition-colors p-1 rounded-xl min-h-[52px] cursor-pointer relative"
                        >
                          {/* Event 1: Shooting Stars */}
                          {colIdx === 0 && hourIdx === 1 && (
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs space-y-1 shadow-md">
                              <div className="flex gap-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">09:00 - 11:30</span>
                              </div>
                              <div className="font-extrabold truncate">Shooting Stars</div>
                              <div className="text-[10px] text-emerald-100 truncate">Night Photography Prep</div>
                            </div>
                          )}

                          {/* Event 2: The Amazing Hubble */}
                          {colIdx === 1 && hourIdx === 3 && (
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs space-y-1 shadow-md">
                              <div className="flex gap-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">11:00 - 12:30</span>
                              </div>
                              <div className="font-extrabold truncate">The Amazing Hubble</div>
                            </div>
                          )}

                          {/* Event 3: Cookware Set Review */}
                          {colIdx === 3 && hourIdx === 3 && (
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs space-y-1 shadow-md">
                              <div className="flex gap-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">11:00 - 12:30</span>
                              </div>
                              <div className="font-extrabold truncate">Cookware Set Review</div>
                            </div>
                          )}

                          {/* Event 4: Astronomy Binoculars */}
                          {colIdx === 4 && hourIdx === 3 && (
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs space-y-1 shadow-md">
                              <div className="flex gap-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">11:00 - 15:30</span>
                              </div>
                              <div className="font-extrabold truncate">Astronomy Binoculars</div>
                            </div>
                          )}

                          {/* Event 5: Q3 Financial Review */}
                          {colIdx === 6 && hourIdx === 1 && (
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs space-y-1 shadow-md">
                              <div className="flex gap-1 text-[10px]">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold">09:00 - 10:30</span>
                              </div>
                              <div className="font-extrabold truncate">Q3 Financial Review</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: MONTH & TASKS CHECKLIST */}
          {calendarViewMode === 'month' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mini Month Grid Card */}
              <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <button className="p-2 rounded-2xl hover:bg-slate-100 text-slate-600 transition">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-extrabold text-slate-900">September 2026</h3>
                  <button className="p-2 rounded-2xl hover:bg-slate-100 text-slate-600 transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
                  {[30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3].map(
                    (dayNum, i) => {
                      const isToday = dayNum === 20 && i >= 20 && i <= 22
                      const isMuted = i < 2 || i > 31

                      return (
                        <div
                          key={i}
                          className={`h-10 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${
                            isToday
                              ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                              : isMuted
                              ? 'text-slate-300'
                              : 'text-slate-800 hover:bg-indigo-50'
                          }`}
                        >
                          {dayNum}
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Tasks For Today Panel */}
              <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Daily Habits & Tasks</h3>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
                    Today
                  </span>
                </div>

                <div className="space-y-3">
                  {todayTasksList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleTodayTask(item.id)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/50 border border-slate-200/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 w-24">{item.time}</span>
                        <span className={`text-sm font-bold ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.title}
                        </span>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition ${
                          item.done
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 3-COLUMN KANBAN BOARD (TO DO | IN PROGRESS | COMPLETE) */}
      {activeTab === 'board' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              3-Column Board
            </h2>
            <button
              title="Filter"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <SlidersHorizontal className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* COLUMN 1: TO DO */}
            <div className="bg-slate-100/70 border border-slate-200/80 rounded-[28px] p-5 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-extrabold text-slate-800 text-base">To Do</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                    {todoNotes.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNoteStatus('TODO')
                    setShowNoteModal(true)
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {todoNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => openNoteDetail(note)}
                    className="cursor-pointer p-5 rounded-[24px] bg-[#eef2ff] border border-[#c7d2fe]/60 hover:border-indigo-400 transition-all shadow-2xs hover:shadow-md space-y-3 relative group"
                  >
                    <div className="flex items-start gap-3">
                      <Note3DIcon type={note.iconType || 'briefcase'} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition">
                          {note.title}
                        </h4>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-[#7c94ff] font-bold text-xs shadow-2xs border border-slate-100">
                        {note.estimatedMins || 4} mins
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveNoteStatus(note, 'IN_PROGRESS')
                        }}
                        className="p-1.5 rounded-xl bg-white/80 hover:bg-indigo-600 hover:text-white text-indigo-600 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                      >
                        In Progress <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className="bg-slate-100/70 border border-slate-200/80 rounded-[28px] p-5 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="font-extrabold text-slate-800 text-base">In Progress</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                    {inProgressNotes.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNoteStatus('IN_PROGRESS')
                    setShowNoteModal(true)
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {inProgressNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => openNoteDetail(note)}
                    className="cursor-pointer p-5 rounded-[24px] bg-[#fffbeb] border border-[#fde68a]/60 hover:border-amber-400 transition-all shadow-2xs hover:shadow-md space-y-3 relative group"
                  >
                    <div className="flex items-start gap-3">
                      <Note3DIcon type={note.iconType || 'design'} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-amber-600 transition">
                          {note.title}
                        </h4>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveNoteStatus(note, 'TODO')
                        }}
                        className="p-1.5 rounded-xl bg-white/80 hover:bg-slate-700 hover:text-white text-slate-600 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> To Do
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveNoteStatus(note, 'COMPLETED')
                        }}
                        className="p-1.5 rounded-xl bg-white/80 hover:bg-emerald-600 hover:text-white text-emerald-600 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                      >
                        Complete <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: COMPLETE */}
            <div className="bg-slate-100/70 border border-slate-200/80 rounded-[28px] p-5 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="font-extrabold text-slate-800 text-base">Complete</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {completedNotes.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNoteStatus('COMPLETED')
                    setShowNoteModal(true)
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {completedNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => openNoteDetail(note)}
                    className="cursor-pointer p-5 rounded-[24px] bg-[#f5f3ff] border border-[#ede9fe]/60 hover:border-purple-400 transition-all shadow-2xs hover:shadow-md space-y-3 relative group opacity-90 hover:opacity-100"
                  >
                    <div className="flex items-start gap-3">
                      <Note3DIcon type={note.iconType || 'task'} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1 line-through text-slate-500">
                          {note.title}
                        </h4>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveNoteStatus(note, 'IN_PROGRESS')
                        }}
                        className="p-1.5 rounded-xl bg-white/80 hover:bg-amber-600 hover:text-white text-amber-700 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Reopen
                      </button>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Done
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TASKS & HABITS HUB */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Action Items ({tasks.length})</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-6 rounded-[26px] border transition-all shadow-2xs flex items-center justify-between gap-4 ${
                  task.isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`transition shrink-0 ${
                      task.isCompleted ? 'text-emerald-600' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-100 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-base ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed truncate">{task.description}</p>
                    )}
                  </div>
                </div>

                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-rose-600 transition p-2 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING EVENT CREATOR MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event Title"
                  className="w-full text-xl font-extrabold text-slate-900 placeholder:text-slate-300 border-b border-slate-200 pb-2 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Tag Color:</span>
                {(['indigo', 'purple', 'emerald', 'amber', 'rose'] as const).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setEventColor(col)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      eventColor === col ? 'border-slate-800 scale-110' : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor:
                        col === 'indigo' ? '#4f46e5' : col === 'purple' ? '#9333ea' : col === 'emerald' ? '#10b981' : col === 'amber' ? '#f59e0b' : '#f43f5e',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={eventPlace}
                  onChange={(e) => setEventPlace(e.target.value)}
                  placeholder="Add Location / Virtual Link"
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Date"
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    placeholder="Start"
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    placeholder="End"
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <Users className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={eventMembers}
                  onChange={(e) => setEventMembers(e.target.value)}
                  placeholder="Add Members"
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <Edit3 className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  placeholder="Add Description / Agenda"
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTE DETAIL & EDIT MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-6 right-6 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between gap-4 pr-10">
              <div className="flex items-center gap-3 min-w-0">
                <Note3DIcon type={selectedNote.iconType || 'briefcase'} />
                {isEditingNote ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg sm:text-xl font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 focus:outline-none focus:border-indigo-600 w-full"
                  />
                ) : (
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                    {selectedNote.title}
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditingNote(!isEditingNote)}
                  className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> {isEditingNote ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => {
                    deleteNote(selectedNote.id)
                    setSelectedNote(null)
                  }}
                  className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-2xs"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
                {selectedNote.estimatedMins || 4} mins
              </div>
            </div>

            <div className="min-h-[160px] text-slate-700 text-sm sm:text-base leading-relaxed">
              {isEditingNote ? (
                <textarea
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              ) : (
                <div className="whitespace-pre-line text-slate-800 space-y-3">
                  <p>
                    {selectedNote.content.split('. ').map((sentence, idx) => {
                      const isHighlighted =
                        sentence.toLowerCase().includes('client is looking') ||
                        sentence.toLowerCase().includes('revamp') ||
                        sentence.toLowerCase().includes('e-commerce')
                      return (
                        <span
                          key={idx}
                          className={
                            isHighlighted
                              ? 'bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded-md font-semibold'
                              : ''
                          }
                        >
                          {sentence}{idx < selectedNote.content.split('. ').length - 1 ? '. ' : ''}
                        </span>
                      )
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-slate-600 font-bold text-sm">
                <button onClick={() => applyTextFormat('#')} title="Heading" className="hover:text-indigo-600 transition p-1">
                  <Type className="w-4 h-4" />
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => applyTextFormat('*')} title="Italic" className="hover:text-indigo-600 transition p-1">
                  <Italic className="w-4 h-4" />
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => applyTextFormat('**')} title="Bold" className="hover:text-indigo-600 transition p-1">
                  <Bold className="w-4 h-4" />
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => applyTextFormat('`')} title="Code" className="hover:text-indigo-600 transition p-1">
                  <Code className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleSaveEditNote}
                className="px-7 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Add New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Details"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Frequency</label>
                  <select
                    value={taskFrequency}
                    onChange={(e) => setTaskFrequency(e.target.value as Frequency)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="ONCE">Once</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={taskMins}
                    onChange={(e) => setTaskMins(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Create New Card</h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Salsile project brief"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Details..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Board Column</label>
                  <select
                    value={noteStatus}
                    onChange={(e) => setNoteStatus(e.target.value as NoteStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Complete</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Theme</label>
                  <select
                    value={noteTheme}
                    onChange={(e) => setNoteTheme(e.target.value as 'purple' | 'yellow' | 'blue')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="purple">Purple / Lavender</option>
                    <option value="yellow">Yellow / Cream</option>
                    <option value="blue">Blue / Ice</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Icon Type</label>
                  <select
                    value={noteIconType}
                    onChange={(e) =>
                      setNoteIconType(
                        e.target.value as 'briefcase' | 'design' | 'task' | 'general'
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="briefcase">Briefcase & Target (3D)</option>
                    <option value="design">Design & Laptop (3D)</option>
                    <option value="task">Task & Clipboard (3D)</option>
                    <option value="general">General Notebook (3D)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Est. Mins</label>
                  <input
                    type="number"
                    value={noteMins}
                    onChange={(e) => setNoteMins(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Date</label>
                  <input
                    type="text"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
                    placeholder="2026-09-20"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tags</label>
                  <input
                    type="text"
                    value={noteTagsStr}
                    onChange={(e) => setNoteTagsStr(e.target.value)}
                    placeholder="design, project"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isGeneralNote"
                  checked={isGeneralNote}
                  onChange={(e) => setIsGeneralNote(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-indigo-600"
                />
                <label htmlFor="isGeneralNote" className="text-xs font-medium text-slate-700">
                  General Note
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

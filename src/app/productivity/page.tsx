'use client'

import React, { useState } from 'react'
import {
  CheckSquare,
  FileText,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Priority, Frequency } from '@/lib/types'

export default function ProductivityPage() {
  const { tasks, notes, addTask, toggleTask, deleteTask, addNote, deleteNote } = useApp()

  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'calendar'>('tasks')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM')
  const [taskFrequency, setTaskFrequency] = useState<Frequency>('DAILY')
  const [taskCategory] = useState('General')
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0])

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0])
  const [isGeneralNote, setIsGeneralNote] = useState(false)
  const [noteTagsStr, setNoteTagsStr] = useState('focus, goals')

  // Selected date for calendar detail view
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    new Date().toISOString().split('T')[0]
  )

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
      category: taskCategory,
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
      date: isGeneralNote ? null : noteDate,
      isGeneral: isGeneralNote,
      tags: noteTagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    setNoteTitle('')
    setNoteContent('')
    setShowNoteModal(false)
  }

  // Calendar Helper functions
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const monthName = today.toLocaleString('default', { month: 'long' })

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`
    return {
      dayNum,
      dateStr,
    }
  })

  const tasksForSelectedDate = tasks.filter((t) => t.dueDate === selectedCalendarDate)
  const notesForSelectedDate = notes.filter((n) => n.date === selectedCalendarDate)

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-indigo-600" /> Productivity Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage daily habits, scheduled tasks, linked notes, and unified calendar.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Tasks & Habits
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Notes Board
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Calendar View
          </button>
        </div>
      </div>

      {/* TAB 1: TASKS & HABITS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Habits & Action Items ({tasks.length})
            </h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" /> Add New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all shadow-xs ${
                  task.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 transition ${
                        task.isCompleted ? 'text-emerald-600' : 'text-slate-400 hover:text-indigo-600'
                      }`}
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`font-semibold text-sm ${
                          task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                      {task.category || 'General'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                      {task.frequency}
                    </span>
                  </div>
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
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NOTES BOARD */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Notes & Knowledge Cards ({notes.length})
            </h2>
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" /> Add New Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900">{note.title}</h3>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {note.isGeneral ? 'General Note' : note.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UNIFIED CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid (2 Cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" /> {monthName} {currentYear}
              </h3>
              <span className="text-xs text-slate-500">Click a date to filter tasks & notes</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const dayTasks = tasks.filter((t) => t.dueDate === day.dateStr)
                const dayNotes = notes.filter((n) => n.date === day.dateStr)
                const isSelected = selectedCalendarDate === day.dateStr

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedCalendarDate(day.dateStr)}
                    className={`h-20 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-left">{day.dayNum}</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {dayTasks.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" title={`${dayTasks.length} tasks`} />
                      )}
                      {dayNotes.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${dayNotes.length} notes`} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Date Summary (1 Col) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Schedule for {selectedCalendarDate}
            </h3>

            {/* Scheduled Tasks for date */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                Tasks ({tasksForSelectedDate.length})
              </h4>
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tasks scheduled for this day.</p>
              ) : (
                <div className="space-y-2">
                  {tasksForSelectedDate.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-800">{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Notes for date */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
                Notes ({notesForSelectedDate.length})
              </h4>
              {notesForSelectedDate.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes created on this date.</p>
              ) : (
                <div className="space-y-2">
                  {notesForSelectedDate.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <h5 className="text-xs font-semibold text-slate-800">{n.title}</h5>
                      <p className="text-[11px] text-slate-500 truncate mt-1">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Scheduled Task / Habit</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Read 20 pages of Book"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Optional details or goal target"
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

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Note / Knowledge Card</h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Q3 Growth Strategy"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Note ideas, action points, or links..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isGeneral"
                  checked={isGeneralNote}
                  onChange={(e) => setIsGeneralNote(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isGeneral" className="text-xs font-medium text-slate-700">
                  General Note (Not tied to specific calendar date)
                </label>
              </div>

              {!isGeneralNote && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Calendar Date</label>
                  <input
                    type="date"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={noteTagsStr}
                  onChange={(e) => setNoteTagsStr(e.target.value)}
                  placeholder="goals, fitness, finance"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

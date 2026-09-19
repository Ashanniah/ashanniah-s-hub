'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  TaskItem,
  NoteItem,
  AccountItem,
  TransactionItem,
  FoodLogItem,
  ExerciseLogItem,
  DailyHealthSummary,
} from '@/lib/types'

// Default initial state for a vibrant first impression
const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    name: 'Cash wallet',
    type: 'CASH',
    initialBalance: 450.0,
    currency: 'USD',
    color: '#10b981', // Emerald
  },
  {
    id: 'acc-2',
    name: 'Chase Checking',
    type: 'BANK',
    initialBalance: 3850.5,
    currency: 'USD',
    accountNumber: '****4921',
    color: '#3b82f6', // Blue
  },
  {
    id: 'acc-3',
    name: 'PayPal / E-Wallet',
    type: 'EWALLET',
    initialBalance: 920.0,
    currency: 'USD',
    color: '#8b5cf6', // Violet
  },
]

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    type: 'INCOME',
    amount: 2800.0,
    category: 'Salary',
    description: 'Monthly Software Consulting Pay',
    date: new Date().toISOString().split('T')[0],
    accountId: 'acc-2',
    accountName: 'Chase Checking',
  },
  {
    id: 'tx-2',
    type: 'EXPENSE',
    amount: 145.5,
    category: 'Groceries',
    description: 'Weekly Organic Food & Meal Prep',
    date: new Date().toISOString().split('T')[0],
    accountId: 'acc-2',
    accountName: 'Chase Checking',
  },
  {
    id: 'tx-3',
    type: 'TRANSFER',
    amount: 200.0,
    category: 'Atm Withdrawal',
    description: 'Cash for weekly pocket expenses',
    date: new Date().toISOString().split('T')[0],
    accountId: 'acc-2',
    accountName: 'Chase Checking',
    toAccountId: 'acc-1',
    toAccountName: 'Cash wallet',
  },
]

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review Q3 Financial Ledger',
    description: 'Audit monthly savings goals and account balances.',
    isCompleted: true,
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'MONTHLY',
    priority: 'HIGH',
    category: 'Finance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: '30-Minute Morning Cardio Routine',
    description: 'Brisk jogging or indoor rowing workout session.',
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'DAILY',
    priority: 'HIGH',
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Prepare Weekly Meal Prep Ingredients',
    description: 'Chop vegetables, grill protein, and pre-portion meal boxes.',
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'WEEKLY',
    priority: 'MEDIUM',
    category: 'Wellness',
    createdAt: new Date().toISOString(),
  },
]

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Weekly Focus & Goals',
    content: '1. Maintain calorie deficit under 2,100 kcal.\n2. Complete 4 strength sessions.\n3. Deposit $500 to savings account.',
    date: new Date().toISOString().split('T')[0],
    isGeneral: false,
    tags: ['goals', 'productivity'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'High-Protein Smoothie Recipe',
    content: '- 1 scoop Whey Isolate\n- 250ml Almond Milk\n- 1 tbsp Peanut Butter\n- 1/2 frozen Banana\n\nTotal: 340 kcal (32g P, 25g C, 12g F)',
    isGeneral: true,
    tags: ['fitness', 'nutrition'],
    createdAt: new Date().toISOString(),
  },
]

const INITIAL_FOOD_LOGS: FoodLogItem[] = [
  {
    id: 'food-1',
    foodItem: 'Avocado Toast with Poached Eggs',
    calories: 410,
    proteinG: 18,
    carbsG: 32,
    fatG: 22,
    loggedAt: new Date().toISOString(),
  },
  {
    id: 'food-2',
    foodItem: 'Grilled Salmon with Roasted Asparagus',
    calories: 520,
    proteinG: 44,
    carbsG: 12,
    fatG: 28,
    loggedAt: new Date().toISOString(),
  },
]

const INITIAL_EXERCISE_LOGS: ExerciseLogItem[] = [
  {
    id: 'ex-1',
    activityType: 'Morning Running / Jogging',
    durationMinutes: 35,
    caloriesBurned: 380,
    loggedAt: new Date().toISOString(),
  },
]

interface AppContextType {
  tasks: TaskItem[]
  notes: NoteItem[]
  accounts: AccountItem[]
  transactions: TransactionItem[]
  foodLogs: FoodLogItem[]
  exerciseLogs: ExerciseLogItem[]
  dailyHealth: DailyHealthSummary
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void
  deleteNote: (id: string) => void
  addAccount: (account: Omit<AccountItem, 'id'>) => void
  deleteAccount: (id: string) => void
  addTransaction: (tx: Omit<TransactionItem, 'id'>) => void
  deleteTransaction: (id: string) => void
  addFoodLog: (food: Omit<FoodLogItem, 'id' | 'loggedAt'>) => void
  deleteFoodLog: (id: string) => void
  addExerciseLog: (ex: Omit<ExerciseLogItem, 'id' | 'loggedAt'>) => void
  deleteExerciseLog: (id: string) => void
  updateWaterIntake: (deltaMl: number) => void
  getAccountBalance: (accountId: string) => number
  getTotalNetWorth: () => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS)
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES)
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS)
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS)
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>(INITIAL_FOOD_LOGS)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogItem[]>(INITIAL_EXERCISE_LOGS)
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(1750)
  const [isLoaded, setIsLoaded] = useState(false)

  // Hydrate from localStorage if available
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('hub_tasks')
      const savedNotes = localStorage.getItem('hub_notes')
      const savedAccounts = localStorage.getItem('hub_accounts')
      const savedTransactions = localStorage.getItem('hub_txs')
      const savedFood = localStorage.getItem('hub_food')
      const savedExercise = localStorage.getItem('hub_exercise')
      const savedWater = localStorage.getItem('hub_water')

      if (savedTasks) setTasks(JSON.parse(savedTasks))
      if (savedNotes) setNotes(JSON.parse(savedNotes))
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts))
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
      if (savedFood) setFoodLogs(JSON.parse(savedFood))
      if (savedExercise) setExerciseLogs(JSON.parse(savedExercise))
      if (savedWater) setWaterIntakeMl(JSON.parse(savedWater))
    } catch (e) {
      console.error('LocalStorage hydration error:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('hub_tasks', JSON.stringify(tasks))
    localStorage.setItem('hub_notes', JSON.stringify(notes))
    localStorage.setItem('hub_accounts', JSON.stringify(accounts))
    localStorage.setItem('hub_txs', JSON.stringify(transactions))
    localStorage.setItem('hub_food', JSON.stringify(foodLogs))
    localStorage.setItem('hub_exercise', JSON.stringify(exerciseLogs))
    localStorage.setItem('hub_water', JSON.stringify(waterIntakeMl))
  }, [tasks, notes, accounts, transactions, foodLogs, exerciseLogs, waterIntakeMl, isLoaded])

  // Real-time calculation of account balance based on initial balance + transaction ledger
  const getAccountBalance = (accountId: string): number => {
    const acc = accounts.find((a) => a.id === accountId)
    if (!acc) return 0
    let balance = Number(acc.initialBalance) || 0

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0
      if (tx.type === 'INCOME' && tx.accountId === accountId) {
        balance += amt
      } else if (tx.type === 'EXPENSE' && tx.accountId === accountId) {
        balance -= amt
      } else if (tx.type === 'TRANSFER') {
        if (tx.accountId === accountId) {
          balance -= amt // Outgoing transfer
        }
        if (tx.toAccountId === accountId) {
          balance += amt // Incoming transfer
        }
      }
    })

    return balance
  }

  const getTotalNetWorth = (): number => {
    return accounts.reduce((acc, a) => acc + getAccountBalance(a.id), 0)
  }

  // Daily Health summary computations
  const totalCaloriesIn = foodLogs.reduce((sum, f) => sum + f.calories, 0)
  const totalCaloriesOut = exerciseLogs.reduce((sum, e) => sum + e.caloriesBurned, 0)

  const dailyHealth: DailyHealthSummary = {
    date: new Date().toISOString().split('T')[0],
    calorieGoal: 2200,
    caloriesIn: totalCaloriesIn,
    caloriesOut: totalCaloriesOut,
    netCalories: totalCaloriesIn - totalCaloriesOut,
    waterIntakeMl,
    waterGoalMl: 3000,
    weightKg: 74.5,
  }

  // Task Actions
  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // Note Actions
  const addNote = (noteData: Omit<NoteItem, 'id' | 'createdAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  // Finance Actions
  const addAccount = (accData: Omit<AccountItem, 'id'>) => {
    const newAcc: AccountItem = {
      ...accData,
      id: `acc-${Date.now()}`,
    }
    setAccounts((prev) => [...prev, newAcc])
  }

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const addTransaction = (txData: Omit<TransactionItem, 'id'>) => {
    const acc = accounts.find((a) => a.id === txData.accountId)
    const toAcc = accounts.find((a) => a.id === txData.toAccountId)
    const newTx: TransactionItem = {
      ...txData,
      id: `tx-${Date.now()}`,
      accountName: acc?.name,
      toAccountName: toAcc?.name,
    }
    setTransactions((prev) => [newTx, ...prev])
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Health Actions
  const addFoodLog = (foodData: Omit<FoodLogItem, 'id' | 'loggedAt'>) => {
    const newLog: FoodLogItem = {
      ...foodData,
      id: `food-${Date.now()}`,
      loggedAt: new Date().toISOString(),
    }
    setFoodLogs((prev) => [newLog, ...prev])
  }

  const deleteFoodLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((f) => f.id !== id))
  }

  const addExerciseLog = (exData: Omit<ExerciseLogItem, 'id' | 'loggedAt'>) => {
    const newLog: ExerciseLogItem = {
      ...exData,
      id: `ex-${Date.now()}`,
      loggedAt: new Date().toISOString(),
    }
    setExerciseLogs((prev) => [newLog, ...prev])
  }

  const deleteExerciseLog = (id: string) => {
    setExerciseLogs((prev) => prev.filter((e) => e.id !== id))
  }

  const updateWaterIntake = (deltaMl: number) => {
    setWaterIntakeMl((prev) => Math.max(0, prev + deltaMl))
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        notes,
        accounts,
        transactions,
        foodLogs,
        exerciseLogs,
        dailyHealth,
        addTask,
        toggleTask,
        deleteTask,
        addNote,
        deleteNote,
        addAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
        addFoodLog,
        deleteFoodLog,
        addExerciseLog,
        deleteExerciseLog,
        updateWaterIntake,
        getAccountBalance,
        getTotalNetWorth,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

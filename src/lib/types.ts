export type AccountType = 'CASH' | 'BANK' | 'EWALLET' | 'CREDIT_CARD' | 'INVESTMENT'

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type Frequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface TaskItem {
  id: string
  title: string
  description?: string | null
  isCompleted: boolean
  dueDate?: string | null
  frequency: Frequency
  priority: Priority
  category?: string | null
  createdAt: string
}

export interface NoteItem {
  id: string
  title: string
  content: string
  date?: string | null
  isGeneral: boolean
  tags: string[]
  createdAt: string
}

export interface AccountItem {
  id: string
  name: string
  type: AccountType
  initialBalance: number
  currency: string
  accountNumber?: string | null
  color: string
}

export interface TransactionItem {
  id: string
  type: TransactionType
  amount: number
  category: string
  description?: string | null
  date: string
  accountId: string
  accountName?: string
  toAccountId?: string | null
  toAccountName?: string | null
}

export interface FoodScanResult {
  food_item: string
  estimated_calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface FoodLogItem {
  id: string
  foodItem: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  imageUrl?: string | null
  loggedAt: string
}

export interface ExerciseLogItem {
  id: string
  activityType: string
  durationMinutes: number
  caloriesBurned: number
  loggedAt: string
}

export interface DailyHealthSummary {
  date: string
  calorieGoal: number
  caloriesIn: number
  caloriesOut: number
  netCalories: number
  waterIntakeMl: number
  waterGoalMl: number
  weightKg?: number | null
}

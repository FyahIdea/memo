/**
 * Object-based Data Model for OmniLife Studio
 * Predefined Object Types with fixed property schemas.
 */

export type ObjectType =
  | 'daily_note'
  | 'quick_note'
  | 'note'
  | 'task'
  | 'event'
  | 'box'
  | 'tag'
  | 'jar'
  | 'savings_goal'
  | 'big_purchase'
  | 'online_expense'
  | 'reward';

export interface BaseObject {
  id: string;
  type: ObjectType;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Box Object (Category context for Notes & Tasks)
export interface BoxObject extends BaseObject {
  type: 'box';
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Tag Object
export interface TagObject extends BaseObject {
  type: 'tag';
  name: string;
  color: string;
}

// Sub-item for checklist or nested items inside tasks and notes
export interface SubItem {
  id: string;
  title: string;
  isDone: boolean;
  type?: 'check' | 'bullet' | 'note';
}

// Quick Note Object
export interface QuickNoteObject extends BaseObject {
  type: 'quick_note';
  content: string;
  dayDateStr: string; // YYYY-MM-DD
}

// Note Object
export interface NoteObject extends BaseObject {
  type: 'note';
  title: string;
  content: string;
  boxId: string;
  tagIds: string[];
  dayDateStr?: string; // Optional linked day
  subItems?: SubItem[];
}

// Task Status for a specific day
export type TaskDayStatus = 'todo' | 'done' | 'in_progress' | 'cancelled';

export interface TaskDayConfig {
  status: TaskDayStatus;
  durationMinutes?: number; // Time blocking estimation in minutes (OPTIONAL)
  innerNote?: string; // Day-local note attached to task
}

export type TaskCategory = 'small' | 'short_term' | 'long_term';
export type TaskRecurring = 'none' | 'daily' | 'weekly' | 'monthly';

// Task Object
export interface TaskObject extends BaseObject {
  type: 'task';
  title: string;
  category: TaskCategory;
  isPinned?: boolean;
  points: number;
  rewardId?: string;
  recurring: TaskRecurring;
  deadline?: string;
  boxId?: string;
  tagIds?: string[];
  description?: string;
  subItems?: SubItem[];
  // Map of dateStr -> TaskDayConfig (many-to-many relationship with days)
  dayRelations: Record<string, TaskDayConfig>;
}

// Event Object
export interface EventObject extends BaseObject {
  type: 'event';
  title: string;
  timeStr: string; // e.g. "09:30 AM" or "14:00"
  dateStr: string; // YYYY-MM-DD
  location?: string;
  color?: string;
}

// Finance: Jar Object
export interface JarObject extends BaseObject {
  type: 'jar';
  name: string;
  color: string;
  monthlyBudget: number;
  currentSpent: number;
  isSavingsPiggyBank?: boolean;
}

// Finance: Savings Goal Object
export interface SavingsGoalObject extends BaseObject {
  type: 'savings_goal';
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  targetDate?: string;
}

// Finance: Big Purchase Object
export interface BigPurchaseObject extends BaseObject {
  type: 'big_purchase';
  title: string;
  cost: number;
  dateStr: string;
  rating: number; // 1 to 5 stars
  category: string;
  notes?: string;
}

// Finance: Online Service Expense Object
export interface OnlineExpenseObject extends BaseObject {
  type: 'online_expense';
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'one_off';
  category: string; // e.g., SaaS, Entertainment, Cloud
  nextRenewalDate?: string;
}

// Reward Object
export interface RewardObject extends BaseObject {
  type: 'reward';
  title: string;
  pointCost: number;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Daily Note Object (Container for a day)
export interface DailyNoteObject extends BaseObject {
  type: 'daily_note';
  dateStr: string; // YYYY-MM-DD
  mood?: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  highlight?: string;
}

// Gamification State
export interface GamificationState {
  points: number;
  streakDays: number;
  lastActiveDateStr: string;
  unlockedRewardsCount: number;
}

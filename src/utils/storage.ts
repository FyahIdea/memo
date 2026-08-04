import {
  BoxObject,
  TagObject,
  EventObject,
  TaskObject,
  QuickNoteObject,
  NoteObject,
  JarObject,
  SavingsGoalObject,
  BigPurchaseObject,
  OnlineExpenseObject,
  RewardObject,
  GamificationState,
} from '../types';

import {
  INITIAL_BOXES,
  INITIAL_TAGS,
  getInitialEvents,
  getInitialTasks,
  getInitialQuickNotes,
  getInitialNotes,
  INITIAL_JARS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BIG_PURCHASES,
  INITIAL_ONLINE_EXPENSES,
  INITIAL_REWARDS,
  INITIAL_GAMIFICATION,
} from '../data/initialData';

const STORAGE_KEYS = {
  BOXES: 'memo_boxes',
  TAGS: 'memo_tags',
  EVENTS: 'memo_events',
  TASKS: 'memo_tasks',
  QUICK_NOTES: 'memo_quick_notes',
  NOTES: 'memo_notes',
  JARS: 'memo_jars',
  SAVINGS_GOALS: 'memo_savings_goals',
  BIG_PURCHASES: 'memo_big_purchases',
  ONLINE_EXPENSES: 'memo_online_expenses',
  REWARDS: 'memo_rewards',
  GAMIFICATION: 'memo_gamification',
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to parse storage key ${key}:`, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to set storage key ${key}:`, e);
  }
}

export interface AppState {
  boxes: BoxObject[];
  tags: TagObject[];
  events: EventObject[];
  tasks: TaskObject[];
  quickNotes: QuickNoteObject[];
  notes: NoteObject[];
  jars: JarObject[];
  savingsGoals: SavingsGoalObject[];
  bigPurchases: BigPurchaseObject[];
  onlineExpenses: OnlineExpenseObject[];
  rewards: RewardObject[];
  gamification: GamificationState;
}

export function loadAppState(): AppState {
  return {
    boxes: safeGetItem(STORAGE_KEYS.BOXES, INITIAL_BOXES),
    tags: safeGetItem(STORAGE_KEYS.TAGS, INITIAL_TAGS),
    events: safeGetItem(STORAGE_KEYS.EVENTS, getInitialEvents()),
    tasks: safeGetItem(STORAGE_KEYS.TASKS, getInitialTasks()),
    quickNotes: safeGetItem(STORAGE_KEYS.QUICK_NOTES, getInitialQuickNotes()),
    notes: safeGetItem(STORAGE_KEYS.NOTES, getInitialNotes()),
    jars: safeGetItem(STORAGE_KEYS.JARS, INITIAL_JARS),
    savingsGoals: safeGetItem(STORAGE_KEYS.SAVINGS_GOALS, INITIAL_SAVINGS_GOALS),
    bigPurchases: safeGetItem(STORAGE_KEYS.BIG_PURCHASES, INITIAL_BIG_PURCHASES),
    onlineExpenses: safeGetItem(STORAGE_KEYS.ONLINE_EXPENSES, INITIAL_ONLINE_EXPENSES),
    rewards: safeGetItem(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
    gamification: safeGetItem(STORAGE_KEYS.GAMIFICATION, INITIAL_GAMIFICATION),
  };
}

export function saveAppState(state: AppState) {
  safeSetItem(STORAGE_KEYS.BOXES, state.boxes);
  safeSetItem(STORAGE_KEYS.TAGS, state.tags);
  safeSetItem(STORAGE_KEYS.EVENTS, state.events);
  safeSetItem(STORAGE_KEYS.TASKS, state.tasks);
  safeSetItem(STORAGE_KEYS.QUICK_NOTES, state.quickNotes);
  safeSetItem(STORAGE_KEYS.NOTES, state.notes);
  safeSetItem(STORAGE_KEYS.JARS, state.jars);
  safeSetItem(STORAGE_KEYS.SAVINGS_GOALS, state.savingsGoals);
  safeSetItem(STORAGE_KEYS.BIG_PURCHASES, state.bigPurchases);
  safeSetItem(STORAGE_KEYS.ONLINE_EXPENSES, state.onlineExpenses);
  safeSetItem(STORAGE_KEYS.REWARDS, state.rewards);
  safeSetItem(STORAGE_KEYS.GAMIFICATION, state.gamification);
}

export function resetAppState(): AppState {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
  const fresh: AppState = {
    boxes: INITIAL_BOXES,
    tags: INITIAL_TAGS,
    events: getInitialEvents(),
    tasks: getInitialTasks(),
    quickNotes: getInitialQuickNotes(),
    notes: getInitialNotes(),
    jars: INITIAL_JARS,
    savingsGoals: INITIAL_SAVINGS_GOALS,
    bigPurchases: INITIAL_BIG_PURCHASES,
    onlineExpenses: INITIAL_ONLINE_EXPENSES,
    rewards: INITIAL_REWARDS,
    gamification: INITIAL_GAMIFICATION,
  };
  saveAppState(fresh);
  return fresh;
}

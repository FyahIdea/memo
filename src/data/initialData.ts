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

export function getTodayStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function formatTimestamp(date = new Date()): string {
  return date.toISOString();
}

export const INITIAL_BOXES: BoxObject[] = [
  {
    id: 'box-1',
    type: 'box',
    name: 'Knowledge & Ideas',
    icon: 'Brain',
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300',
    description: 'Snippets learned, book notes, technical concepts',
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
  },
  {
    id: 'box-2',
    type: 'box',
    name: 'Mental Health & Venting',
    icon: 'HeartHandshake',
    color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300',
    description: 'Reflections, thoughts, mood logs & processing emotions',
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
  },
  {
    id: 'box-3',
    type: 'box',
    name: 'Memories & Fun Moments',
    icon: 'Sparkles',
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300',
    description: 'Highlights of the day, funny stories, special moments',
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
  },
  {
    id: 'box-4',
    type: 'box',
    name: 'Work & Projects',
    icon: 'Briefcase',
    color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300',
    description: 'Career growth, software projects, design systems',
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
  },
  {
    id: 'box-5',
    type: 'box',
    name: 'Physical Wellbeing',
    icon: 'Activity',
    color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300',
    description: 'Workouts, nutrition notes, energy levels & sleep',
    createdAt: formatTimestamp(),
    updatedAt: formatTimestamp(),
  },
];

export const INITIAL_TAGS: TagObject[] = [
  { id: 'tag-1', type: 'tag', name: 'tech', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-2', type: 'tag', name: 'habit', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-3', type: 'tag', name: 'reading', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-4', type: 'tag', name: 'reflection', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-5', type: 'tag', name: 'design', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-6', type: 'tag', name: 'finance', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-7', type: 'tag', name: 'data', color: 'bg-blue-100 text-blue-800', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-8', type: 'tag', name: 'DSCI101', color: 'bg-blue-100 text-blue-800', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'tag-9', type: 'tag', name: 'uni', color: 'bg-blue-100 text-blue-800', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export function getInitialEvents(): EventObject[] {
  const today = getTodayStr(0);
  const tomorrow = getTodayStr(1);
  return [
    {
      id: 'event-1',
      type: 'event',
      title: '☕ Deep Work & Architecture Session',
      timeStr: '09:00 AM',
      dateStr: today,
      location: 'Home Studio',
      color: 'border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'event-2',
      type: 'event',
      title: '🏃‍♂️ 30-min Outdoor Interval Run',
      timeStr: '05:30 PM',
      dateStr: today,
      location: 'City Park Trail',
      color: 'border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'event-3',
      type: 'event',
      title: '📚 Monthly Finance & Savings Review',
      timeStr: '11:00 AM',
      dateStr: tomorrow,
      location: 'Desk',
      color: 'border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
  ];
}

export function getInitialTasks(): TaskObject[] {
  const today = getTodayStr(0);
  const yesterday = getTodayStr(-1);
  const tomorrow = getTodayStr(1);

  return [
    {
      id: 'task-1',
      type: 'task',
      title: 'Refactor Object model state reducer for performance',
      category: 'short_term',
      isPinned: true,
      points: 25,
      rewardId: 'reward-1',
      recurring: 'none',
      deadline: today,
      dayRelations: {
        [today]: { status: 'done', durationMinutes: 45, innerNote: 'Completed clean state reducer with standard action payloads.' },
        [yesterday]: { status: 'in_progress', durationMinutes: 30 },
      },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'task-2',
      type: 'task',
      title: 'Audit monthly Jars & transfer surplus to Savings Piggy Bank',
      category: 'short_term',
      isPinned: true,
      points: 20,
      rewardId: 'reward-2',
      recurring: 'monthly',
      deadline: today,
      dayRelations: {
        [today]: { status: 'todo', durationMinutes: 20, innerNote: 'Check left-over budget in Dining Out Jar.' },
      },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'task-3',
      type: 'task',
      title: 'Water houseplants & wipe down desk setup',
      category: 'small',
      points: 5,
      recurring: 'weekly',
      dayRelations: {
        [today]: { status: 'done', durationMinutes: 10 },
      },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'task-4',
      type: 'task',
      title: 'Review 3 chapters of "Designing Data-Intensive Applications"',
      category: 'short_term',
      isPinned: false,
      points: 15,
      recurring: 'none',
      tagIds: ['tag-7', 'tag-8', 'tag-9', 'tag-3'],
      deadline: tomorrow,
      dayRelations: {
        [tomorrow]: { status: 'todo', durationMinutes: 60 },
      },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'task-5',
      type: 'task',
      title: 'Build custom keycap set for split ergonomic keyboard',
      category: 'long_term',
      points: 50,
      recurring: 'none',
      dayRelations: {},
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'task-6',
      type: 'task',
      title: 'Plan summer solo hiking trip itinerary',
      category: 'long_term',
      points: 40,
      recurring: 'none',
      dayRelations: {},
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
  ];
}

export function getInitialQuickNotes(): QuickNoteObject[] {
  const today = getTodayStr(0);
  const yesterday = getTodayStr(-1);

  return [
    {
      id: 'qn-1',
      type: 'quick_note',
      content: 'Remember: standardising layout spacing to 16px math creates an immediate sense of quiet order.',
      dayDateStr: today,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'qn-2',
      type: 'quick_note',
      content: 'Idea for financial habit: Move $5 into savings every time a non-essential craving is resisted.',
      dayDateStr: today,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'qn-3',
      type: 'quick_note',
      content: 'Loved the cold brew recipe today: 1:8 ratio, 18-hour slow steep in glass pitcher.',
      dayDateStr: yesterday,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
  ];
}

export function getInitialNotes(): NoteObject[] {
  const today = getTodayStr(0);

  return [
    {
      id: 'note-1',
      type: 'note',
      title: 'Principles of Zettelkasten Atomicity',
      content: 'Each note should contain one singular, well-articulated idea. Connecting ideas via tags and context boxes allows organic knowledge structure to emerge without rigid folder hierarchies.',
      boxId: 'box-1',
      tagIds: ['tag-1', 'tag-3'],
      dayDateStr: today,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
    {
      id: 'note-2',
      type: 'note',
      title: 'Evening Mind Dump & Energy Reflection',
      content: 'Felt highly energized during the morning focus session. The key was turning off notification sounds until noon. Need to maintain this boundary.',
      boxId: 'box-2',
      tagIds: ['tag-4', 'tag-2'],
      dayDateStr: today,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    },
  ];
}

export const INITIAL_JARS: JarObject[] = [
  { id: 'jar-savings', type: 'jar', name: '🐷 Savings Piggy Bank', color: 'bg-emerald-500', monthlyBudget: 600, currentSpent: 0, isSavingsPiggyBank: true, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'jar-1', type: 'jar', name: '🏠 Essentials & Bills', color: 'bg-blue-500', monthlyBudget: 1200, currentSpent: 840, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'jar-2', type: 'jar', name: '☕ Dining & Coffee Jots', color: 'bg-amber-500', monthlyBudget: 300, currentSpent: 210, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'jar-3', type: 'jar', name: '📖 Books & Learning', color: 'bg-purple-500', monthlyBudget: 150, currentSpent: 65, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'jar-4', type: 'jar', name: '🎮 Fun & Play', color: 'bg-pink-500', monthlyBudget: 200, currentSpent: 140, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoalObject[] = [
  { id: 'goal-1', type: 'savings_goal', title: 'Ergonomic Mechanical Keyboard', targetAmount: 220, currentAmount: 180, icon: 'Keyboard', targetDate: '2026-09-15', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'goal-2', type: 'savings_goal', title: 'Dual Monitor Arm Mount', targetAmount: 150, currentAmount: 95, icon: 'Monitor', targetDate: '2026-10-01', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'goal-3', type: 'savings_goal', title: 'Weekend Cabin Retreat', targetAmount: 600, currentAmount: 240, icon: 'Trees', targetDate: '2026-11-20', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export const INITIAL_BIG_PURCHASES: BigPurchaseObject[] = [
  { id: 'bp-1', type: 'big_purchase', title: '34" Curved Ultrawide Display', cost: 750, dateStr: '2026-06-12', rating: 5, category: 'Hardware', notes: 'Incredible for multi-window daily capture and coding.', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'bp-2', type: 'big_purchase', title: 'Herman Miller Embody Chair', cost: 1400, dateStr: '2026-03-04', rating: 5, category: 'Furniture', notes: 'Best investment for lower back health during long sessions.', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export const INITIAL_ONLINE_EXPENSES: OnlineExpenseObject[] = [
  { id: 'oe-1', type: 'online_expense', name: 'GitHub Copilot / AI Assistant', cost: 10, billingCycle: 'monthly', category: 'Dev Tools', nextRenewalDate: '2026-08-15', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'oe-2', type: 'online_expense', name: 'Fast Cloud VPS Server', cost: 15, billingCycle: 'monthly', category: 'Infrastructure', nextRenewalDate: '2026-08-20', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'oe-3', type: 'online_expense', name: 'Spotify Premium Music', cost: 11, billingCycle: 'monthly', category: 'Entertainment', nextRenewalDate: '2026-08-28', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'oe-4', type: 'online_expense', name: 'Domain Name Renewals (.dev)', cost: 45, billingCycle: 'yearly', category: 'Web', nextRenewalDate: '2027-02-10', createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export const INITIAL_REWARDS: RewardObject[] = [
  { id: 'reward-1', type: 'reward', title: '☕ Specialty Pour-over Coffee & Pastry', pointCost: 30, icon: 'Coffee', isUnlocked: true, unlockedAt: getTodayStr(0), createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'reward-2', type: 'reward', title: '🎮 2-Hour Gaming Session guilt-free', pointCost: 50, icon: 'Gamepad2', isUnlocked: false, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'reward-3', type: 'reward', title: '📚 Hardcover Hardback Tech Book', pointCost: 120, icon: 'BookOpen', isUnlocked: false, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
  { id: 'reward-4', type: 'reward', title: '🎧 Premium Noise Cancelling Headset Upgrade', pointCost: 350, icon: 'Headphones', isUnlocked: false, createdAt: formatTimestamp(), updatedAt: formatTimestamp() },
];

export const INITIAL_GAMIFICATION: GamificationState = {
  points: 110,
  streakDays: 5,
  lastActiveDateStr: getTodayStr(0),
  unlockedRewardsCount: 1,
};

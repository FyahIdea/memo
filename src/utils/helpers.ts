import { BoxObject, ObjectType, TaskCategory, TaskDayStatus } from '../types';

export function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (dateStr === todayStr) return `Today — ${weekday}, ${monthDay}`;
  if (dateStr === yesterdayStr) return `Yesterday — ${weekday}, ${monthDay}`;
  if (dateStr === tomorrowStr) return `Tomorrow — ${weekday}, ${monthDay}`;
  return `${weekday}, ${monthDay}`;
}

export function formatTimeOnly(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function getBoxColorClass(box?: BoxObject): string {
  if (!box) return 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border-gray-200 dark:border-zinc-700';
  return box.color;
}

export function getCategoryBadge(category: TaskCategory): { label: string; style: string } {
  switch (category) {
    case 'small':
      return { label: 'Small Task', style: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200' };
    case 'short_term':
      return { label: 'Short-Term Focus', style: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200' };
    case 'long_term':
      return { label: 'Long-Term Vision', style: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200' };
  }
}

export function getStatusStyle(status: TaskDayStatus): { label: string; icon: string; style: string } {
  switch (status) {
    case 'done':
      return { label: 'Done', icon: 'Check', style: 'text-emerald-600 dark:text-emerald-400 line-through opacity-80' };
    case 'in_progress':
      return { label: 'In Progress', icon: 'Minus', style: 'text-amber-600 dark:text-amber-400 font-medium' };
    case 'cancelled':
      return { label: 'Cancelled', icon: 'X', style: 'text-rose-500 line-through opacity-60' };
    case 'todo':
    default:
      return { label: 'To Do', icon: 'Square', style: 'text-gray-900 dark:text-gray-100' };
  }
}

export function getTypeBadge(type: ObjectType): { label: string; color: string } {
  switch (type) {
    case 'daily_note': return { label: 'Daily Note', color: 'bg-blue-500/10 text-blue-600' };
    case 'quick_note': return { label: 'Quick Note', color: 'bg-amber-500/10 text-amber-600' };
    case 'note': return { label: 'Structured Note', color: 'bg-emerald-500/10 text-emerald-600' };
    case 'task': return { label: 'Task Object', color: 'bg-indigo-500/10 text-indigo-600' };
    case 'event': return { label: 'Event', color: 'bg-violet-500/10 text-violet-600' };
    case 'box': return { label: 'Box Context', color: 'bg-pink-500/10 text-pink-600' };
    case 'tag': return { label: 'Tag', color: 'bg-cyan-500/10 text-cyan-600' };
    case 'jar': return { label: 'Finance Jar', color: 'bg-teal-500/10 text-teal-600' };
    case 'savings_goal': return { label: 'Savings Goal', color: 'bg-lime-500/10 text-lime-600' };
    case 'big_purchase': return { label: 'Big Purchase', color: 'bg-orange-500/10 text-orange-600' };
    case 'online_expense': return { label: 'Online Expense', color: 'bg-rose-500/10 text-rose-600' };
    case 'reward': return { label: 'Reward', color: 'bg-yellow-500/10 text-yellow-600' };
  }
}

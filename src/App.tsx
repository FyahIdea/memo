import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DayCard } from './components/DayCard';
import { TaskSidebarPanel } from './components/TaskSidebarPanel';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { NotesView } from './components/NotesView';
import { TasksView } from './components/TasksView';
import { FinanceView } from './components/FinanceView';
import { WeeklyCalendarView } from './components/WeeklyCalendarView';
import { ObjectDetailModal } from './components/ObjectDetailModal';

import { loadAppState, saveAppState, resetAppState, AppState } from './utils/storage';
import { setSoundEnabled, playCoin, playRewardChime, playTabSwitch, playPop } from './utils/sound';
import { getTodayStr, formatTimestamp } from './data/initialData';
import {
  TaskDayStatus,
  TaskCategory,
  QuickNoteObject,
  NoteObject,
  TaskObject,
  EventObject,
  SavingsGoalObject,
  BigPurchaseObject,
  OnlineExpenseObject,
} from './types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Flame,
  Star,
  Target,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  ArrowDown,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [soundOn, setSoundOn] = useState(true);

  // Modals & Panels
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isSidebarPanelOpen, setIsSidebarPanelOpen] = useState(false);
  const [inspectedObject, setInspectedObject] = useState<any | null>(null);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Timeline date range offsets (minOffset to maxOffset)
  const [minOffset, setMinOffset] = useState(-1);
  const [maxOffset, setMaxOffset] = useState(3);

  // Auto-save on state change
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Keyboard Shortcuts (Cmd+K to quick capture)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    playTabSwitch();
    setActiveTab(tab);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // --- Handlers: Quick Capture ---
  const handleAddQuickNote = (content: string, dateStr: string) => {
    const newQN: QuickNoteObject = {
      id: `qn-${Date.now()}`,
      type: 'quick_note',
      content,
      dayDateStr: dateStr,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playPop();

    setAppState((prev) => ({
      ...prev,
      quickNotes: [newQN, ...prev.quickNotes],
    }));
  };

  const handleAddNote = (
    title: string,
    content: string,
    boxId: string,
    tagIds: string[],
    dateStr?: string
  ) => {
    const newNote: NoteObject = {
      id: `note-${Date.now()}`,
      type: 'note',
      title,
      content,
      boxId,
      tagIds,
      dayDateStr: dateStr || getTodayStr(),
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playPop();

    setAppState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const handleAddTask = (
    title: string,
    category: TaskCategory,
    points: number,
    isPinned: boolean,
    deadline?: string,
    rewardId?: string,
    dateStr?: string
  ) => {
    const targetDate = dateStr || getTodayStr();
    const newTask: TaskObject = {
      id: `task-${Date.now()}`,
      type: 'task',
      title,
      category,
      points,
      isPinned,
      recurring: 'none',
      deadline,
      rewardId,
      dayRelations: {
        [targetDate]: { status: 'todo' },
      },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playPop();

    setAppState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleAddEvent = (title: string, timeStr: string, dateStr: string) => {
    const newEvt: EventObject = {
      id: `evt-${Date.now()}`,
      type: 'event',
      title,
      timeStr,
      dateStr,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playPop();

    setAppState((prev) => ({
      ...prev,
      events: [...prev.events, newEvt],
    }));
  };

  // --- Handlers: Task Operations ---
  const handleUpdateTaskStatus = (taskId: string, dateStr: string, nextStatus: TaskDayStatus) => {
    setAppState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const currentDayConfig = task.dayRelations[dateStr] || { status: 'todo' };
      const prevStatus = currentDayConfig.status;

      const updatedTask: TaskObject = {
        ...task,
        dayRelations: {
          ...task.dayRelations,
          [dateStr]: {
            ...currentDayConfig,
            status: nextStatus,
          },
        },
        updatedAt: formatTimestamp(),
      };

      let pointDelta = 0;
      if (nextStatus === 'done' && prevStatus !== 'done') {
        pointDelta = task.points;
      } else if (prevStatus === 'done' && nextStatus !== 'done') {
        pointDelta = -task.points;
      }

      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        gamification: {
          ...prev.gamification,
          points: Math.max(0, prev.gamification.points + pointDelta),
        },
      };
    });
  };

  const handleRemoveTaskFromDay = (taskId: string, dateStr: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const nextDayRelations = { ...t.dayRelations };
        delete nextDayRelations[dateStr];
        return {
          ...t,
          dayRelations: nextDayRelations,
          updatedAt: formatTimestamp(),
        };
      }),
    }));
  };

  const handleUpdateTaskDuration = (taskId: string, dateStr: string, minutes?: number) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const config = t.dayRelations[dateStr] || { status: 'todo' };
        return {
          ...t,
          dayRelations: {
            ...t.dayRelations,
            [dateStr]: { ...config, durationMinutes: minutes },
          },
        };
      }),
    }));
  };

  const handleAddTaskToDay = (taskId: string, dateStr: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        if (t.dayRelations[dateStr]) return t;
        return {
          ...t,
          dayRelations: {
            ...t.dayRelations,
            [dateStr]: { status: 'todo' },
          },
        };
      }),
    }));
    playPop();
  };

  const handleTogglePin = (taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, isPinned: !t.isPinned } : t)),
    }));
  };

  const handleLinkReward = (taskId: string, rewardId: string | undefined) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, rewardId } : t)),
    }));
  };

  // --- Handlers: Finance ---
  const handleAddDepositToGoal = (goalId: string, amount: number) => {
    setAppState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      ),
    }));
    playCoin();
  };

  const handleRolloverJarsToSavings = () => {
    setAppState((prev) => {
      let totalSurplus = 0;
      const updatedJars = prev.jars.map((j) => {
        if (j.isSavingsPiggyBank) return j;
        const surplus = Math.max(0, j.monthlyBudget - j.currentSpent);
        totalSurplus += surplus;
        return j;
      });

      return {
        ...prev,
        jars: updatedJars.map((j) =>
          j.isSavingsPiggyBank ? { ...j, currentSpent: j.currentSpent + totalSurplus } : j
        ),
      };
    });
    playCoin();
  };

  const handleUnlockReward = (rewardId: string) => {
    setAppState((prev) => {
      const reward = prev.rewards.find((r) => r.id === rewardId);
      if (!reward || reward.isUnlocked) return prev;
      if (prev.gamification.points < reward.pointCost) return prev;

      playRewardChime();
      return {
        ...prev,
        rewards: prev.rewards.map((r) =>
          r.id === rewardId ? { ...r, isUnlocked: true, unlockedAt: getTodayStr() } : r
        ),
        gamification: {
          ...prev.gamification,
          points: prev.gamification.points - reward.pointCost,
          unlockedRewardsCount: prev.gamification.unlockedRewardsCount + 1,
        },
      };
    });
  };

  const handleAddBigPurchase = (
    title: string,
    cost: number,
    rating: number,
    category: string,
    notes?: string
  ) => {
    const newBp: BigPurchaseObject = {
      id: `bp-${Date.now()}`,
      type: 'big_purchase',
      title,
      cost,
      dateStr: getTodayStr(),
      rating,
      category,
      notes,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playCoin();
    setAppState((prev) => ({
      ...prev,
      bigPurchases: [newBp, ...prev.bigPurchases],
    }));
  };

  const handleAddOnlineExpense = (
    name: string,
    cost: number,
    billingCycle: 'monthly' | 'yearly' | 'one_off',
    category: string
  ) => {
    const newOe: OnlineExpenseObject = {
      id: `oe-${Date.now()}`,
      type: 'online_expense',
      name,
      cost,
      billingCycle,
      category,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playCoin();
    setAppState((prev) => ({
      ...prev,
      onlineExpenses: [newOe, ...prev.onlineExpenses],
    }));
  };

  const handleAddSavingsGoal = (title: string, targetAmount: number, icon: string) => {
    const newGoal: SavingsGoalObject = {
      id: `goal-${Date.now()}`,
      type: 'savings_goal',
      title,
      targetAmount,
      currentAmount: 0,
      icon,
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playCoin();
    setAppState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal],
    }));
  };

  const handleUpdateObject = (updatedObj: any) => {
    if (!updatedObj || !updatedObj.id) return;
    setAppState((prev) => {
      const type = updatedObj.type;
      if (type === 'task') {
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === updatedObj.id ? updatedObj : t)),
        };
      }
      if (type === 'note') {
        return {
          ...prev,
          notes: prev.notes.map((n) => (n.id === updatedObj.id ? updatedObj : n)),
        };
      }
      if (type === 'quick_note') {
        return {
          ...prev,
          quickNotes: prev.quickNotes.map((qn) => (qn.id === updatedObj.id ? updatedObj : qn)),
        };
      }
      if (type === 'event') {
        return {
          ...prev,
          events: prev.events.map((e) => (e.id === updatedObj.id ? updatedObj : e)),
        };
      }
      if (type === 'savings_goal') {
        return {
          ...prev,
          savingsGoals: prev.savingsGoals.map((g) => (g.id === updatedObj.id ? updatedObj : g)),
        };
      }
      return prev;
    });
  };

  const handleDeleteObject = (obj: any) => {
    if (!obj || !obj.id) return;
    setAppState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== obj.id),
      quickNotes: prev.quickNotes.filter((qn) => qn.id !== obj.id),
      notes: prev.notes.filter((n) => n.id !== obj.id),
      tasks: prev.tasks.filter((t) => t.id !== obj.id),
      jars: prev.jars.filter((j) => j.id !== obj.id),
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== obj.id),
      bigPurchases: prev.bigPurchases.filter((bp) => bp.id !== obj.id),
      onlineExpenses: prev.onlineExpenses.filter((oe) => oe.id !== obj.id),
      rewards: prev.rewards.filter((r) => r.id !== obj.id),
    }));
  };

  const handleResetData = () => {
    if (window.confirm('Reset app data to default seed state?')) {
      const fresh = resetAppState();
      setAppState(fresh);
    }
  };

  // Generate date array for timeline view based on minOffset ... maxOffset
  const todayStr = getTodayStr();
  const getTimelineDates = () => {
    const dates: string[] = [];
    for (let i = minOffset; i <= maxOffset; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const timelineDates = getTimelineDates();
  const activePrimaryGoal = appState.savingsGoals[0];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-[#4285F4] selection:text-white">
      {/* Left Sidebar Navigation - CLEAN & SLIM */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6 overflow-y-auto">
        {/* TOP HEADER BAR: Holds Actions, Goals, Streak, Task Pool Toggle */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: Interactive Target Goal & Daily Streak Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Daily Streak Badge */}
            <button
              onClick={() => setShowStreakModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:scale-105 transition-all shadow-2xs"
              title="Click to inspect streak details"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{appState.gamification.streakDays} Day Streak</span>
            </button>

            {/* Target Savings Goal Badge */}
            {activePrimaryGoal && (
              <button
                onClick={() => handleTabChange('finance')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs font-extrabold text-[#4285F4] hover:scale-105 transition-all shadow-2xs"
                title="Click to view Target Goals in Finance"
              >
                <Target className="w-4 h-4 text-[#4285F4]" />
                <span className="hidden sm:inline">{activePrimaryGoal.title}:</span>
                <span className="font-mono">${activePrimaryGoal.currentAmount}/${activePrimaryGoal.targetAmount}</span>
              </button>
            )}

            {/* Points Badge */}
            <button
              onClick={() => handleTabChange('finance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:scale-105 transition-all shadow-2xs"
              title="Click to use points for rewards"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{appState.gamification.points} PTS</span>
            </button>
          </div>

          {/* Right: Actions (Task Pool, + Capture, Sound Toggle) */}
          <div className="flex items-center gap-2">
            {/* Task Pool Toggle */}
            <button
              onClick={() => setIsSidebarPanelOpen(!isSidebarPanelOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-xs font-extrabold transition-all ${
                isSidebarPanelOpen
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-[#4285F4] text-[#4285F4]'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-[#4285F4]" />
              <span className="hidden sm:inline">Task Pool</span>
            </button>

            {/* + Quick Capture Button */}
            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-[#4285F4] hover:bg-blue-600 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Capture</span>
              <kbd className="hidden lg:inline text-[10px] font-mono bg-blue-700/60 px-1.5 py-0.5 rounded text-white/90">
                ⌘K
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title={soundOn ? 'Sound FX On' : 'Sound Muted'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#34A853]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
          {/* VIEW 1: UNIFIED TIMELINE (HOME) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Timeline Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18181b] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <h2 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-[#4285F4]" />
                    <span>Daily Notes & Tasks Timeline</span>
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Focused Today's card with collapsible surrounding days and infinite scroll.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMinOffset(minOffset - 3)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    title="Load Earlier Days"
                  >
                    + Load Past Days
                  </button>

                  <button
                    onClick={() => {
                      setMinOffset(-1);
                      setMaxOffset(3);
                    }}
                    className="px-4 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-xs font-extrabold text-[#4285F4]"
                  >
                    Reset to Today
                  </button>
                </div>
              </div>

              {/* Load Earlier Days Trigger */}
              <div className="text-center">
                <button
                  onClick={() => setMinOffset(minOffset - 3)}
                  className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:border-[#4285F4] transition-all shadow-2xs inline-flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4 text-[#4285F4]" />
                  <span>Load Previous Days</span>
                </button>
              </div>

              {/* Stack of Day Cards */}
              <div className="space-y-4">
                {timelineDates.map((dateStr) => (
                  <DayCard
                    key={dateStr}
                    dateStr={dateStr}
                    isToday={dateStr === todayStr}
                    events={appState.events}
                    tasks={appState.tasks}
                    quickNotes={appState.quickNotes}
                    notes={appState.notes}
                    boxes={appState.boxes}
                    tags={appState.tags}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onUpdateTaskDuration={handleUpdateTaskDuration}
                    onRemoveTaskFromDay={handleRemoveTaskFromDay}
                    onAddEvent={handleAddEvent}
                    onAddQuickNote={handleAddQuickNote}
                    onAddTaskToDay={handleAddTaskToDay}
                    onAddInlineTask={(title, dStr) =>
                      handleAddTask(title, 'small', 5, false, undefined, undefined, dStr)
                    }
                    onSelectObject={setInspectedObject}
                  />
                ))}
              </div>

              {/* Infinite Scroll Prompt / Load More Days */}
              <div className="text-center pt-4 pb-8 border-t border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 mb-3">
                  Viewing {timelineDates.length} days. Would you like to load more future days?
                </p>
                <button
                  onClick={() => setMaxOffset(maxOffset + 3)}
                  className="px-5 py-2.5 rounded-2xl bg-[#4285F4] hover:bg-blue-600 text-white font-extrabold text-xs shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <ArrowDown className="w-4 h-4" />
                  <span>Scroll & Load More Days</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: NOTES MANAGEMENT */}
          {activeTab === 'notes' && (
            <NotesView
              quickNotes={appState.quickNotes}
              notes={appState.notes}
              boxes={appState.boxes}
              tags={appState.tags}
              onAddNote={handleAddNote}
              onAddQuickNote={handleAddQuickNote}
              onSelectObject={setInspectedObject}
            />
          )}

          {/* VIEW 3: TASKS MANAGEMENT */}
          {activeTab === 'tasks' && (
            <TasksView
              tasks={appState.tasks}
              rewards={appState.rewards}
              onAddTask={handleAddTask}
              onTogglePin={handleTogglePin}
              onLinkReward={handleLinkReward}
              onSelectTask={setInspectedObject}
              onOpenSidebarPanel={() => setIsSidebarPanelOpen(true)}
            />
          )}

          {/* VIEW 4: PERSONAL FINANCE */}
          {activeTab === 'finance' && (
            <FinanceView
              jars={appState.jars}
              savingsGoals={appState.savingsGoals}
              bigPurchases={appState.bigPurchases}
              onlineExpenses={appState.onlineExpenses}
              rewards={appState.rewards}
              gamification={appState.gamification}
              onAddDepositToGoal={handleAddDepositToGoal}
              onRolloverJarsToSavings={handleRolloverJarsToSavings}
              onUnlockReward={handleUnlockReward}
              onAddBigPurchase={handleAddBigPurchase}
              onAddOnlineExpense={handleAddOnlineExpense}
              onAddSavingsGoal={handleAddSavingsGoal}
              onSelectObject={setInspectedObject}
            />
          )}

          {/* VIEW 5: WEEKLY CALENDAR & TIME-BLOCKING */}
          {activeTab === 'weekly' && (
            <WeeklyCalendarView
              events={appState.events}
              tasks={appState.tasks}
              onSelectObject={setInspectedObject}
            />
          )}
        </main>

        {/* Global Reset State Footer */}
        <footer className="max-w-6xl w-full mx-auto px-6 mt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-4">
          <span className="font-extrabold text-slate-500">Memo • Personal Objects Studio</span>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 font-extrabold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed Data</span>
          </button>
        </footer>
      </div>

      {/* Interactive Daily Streak & Goals Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  Daily Streak & Gamification
                </h3>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900/60">
                <div className="font-extrabold text-base text-orange-600 dark:text-orange-300">
                  🔥 {appState.gamification.streakDays} Days Streak Active!
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  Complete at least one task or note every day to keep your momentum streak burning.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                <div className="font-extrabold text-base text-amber-600 dark:text-amber-300">
                  ⭐ Total Reward Points: {appState.gamification.points} PTS
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  Unlocked Rewards: {appState.gamification.unlockedRewardsCount} item(s).
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowStreakModal(false);
                  handleTabChange('finance');
                }}
                className="px-4 py-2 bg-[#4285F4] text-white rounded-xl text-xs font-extrabold"
              >
                Go to Finance & Rewards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Sidebar Drag-&-Drop Panel */}
      <TaskSidebarPanel
        tasks={appState.tasks}
        isOpen={isSidebarPanelOpen}
        onClose={() => setIsSidebarPanelOpen(false)}
        onAddTask={(title, cat, pts, pin) => handleAddTask(title, cat, pts, pin)}
        onTogglePin={handleTogglePin}
        onSelectTask={setInspectedObject}
      />

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        boxes={appState.boxes}
        tags={appState.tags}
        onAddQuickNote={handleAddQuickNote}
        onAddNote={handleAddNote}
        onAddTask={handleAddTask}
        onAddEvent={handleAddEvent}
      />

      {/* Object Inspector / Editor Modal */}
      <ObjectDetailModal
        object={inspectedObject}
        onClose={() => setInspectedObject(null)}
        onUpdateObject={handleUpdateObject}
        onDelete={handleDeleteObject}
      />
    </div>
  );
}

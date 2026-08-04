import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTab } from '../components/shared/Sidebar';
import { loadAppState, saveAppState, resetAppState, AppState } from '../utils/storage';
import { setSoundEnabled, playCoin, playRewardChime, playTabSwitch, playPop } from '../utils/sound';
import { getTodayStr, formatTimestamp } from '../data/initialData';
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
} from '../types';

// ─── Định nghĩa kiểu cho Context ─────────────────────────────────────────────

interface AppContextValue {
  // State chính
  appState: AppState;
  activeTab: ActiveTab;
  soundOn: boolean;

  // UI State
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (v: boolean) => void;
  isSidebarPanelOpen: boolean;
  setIsSidebarPanelOpen: (v: boolean) => void;
  inspectedObject: any | null;
  setInspectedObject: (obj: any | null) => void;
  showStreakModal: boolean;
  setShowStreakModal: (v: boolean) => void;

  // Timeline date range
  minOffset: number;
  maxOffset: number;
  setMinOffset: (v: number) => void;
  setMaxOffset: (v: number) => void;
  timelineDates: string[];
  todayStr: string;
  activePrimaryGoal: SavingsGoalObject | undefined;

  // Handlers: Navigation
  handleTabChange: (tab: ActiveTab) => void;
  handleToggleSound: () => void;

  // Handlers: Quick Capture / Add objects
  handleAddQuickNote: (content: string, dateStr: string) => void;
  handleAddNote: (title: string, content: string, boxId: string, tagIds: string[], dateStr?: string) => void;
  handleAddTask: (
    title: string,
    category: TaskCategory,
    points: number,
    isPinned: boolean,
    deadline?: string,
    rewardId?: string,
    dateStr?: string
  ) => void;
  handleAddEvent: (title: string, timeStr: string, dateStr: string) => void;

  // Handlers: Task operations
  handleUpdateTaskStatus: (taskId: string, dateStr: string, nextStatus: TaskDayStatus) => void;
  handleRemoveTaskFromDay: (taskId: string, dateStr: string) => void;
  handleUpdateTaskDuration: (taskId: string, dateStr: string, minutes?: number) => void;
  handleAddTaskToDay: (taskId: string, dateStr: string) => void;
  handleTogglePin: (taskId: string) => void;
  handleLinkReward: (taskId: string, rewardId: string | undefined) => void;

  // Handlers: Finance
  handleAddDepositToGoal: (goalId: string, amount: number) => void;
  handleRolloverJarsToSavings: () => void;
  handleUnlockReward: (rewardId: string) => void;
  handleAddBigPurchase: (title: string, cost: number, rating: number, category: string, notes?: string) => void;
  handleAddOnlineExpense: (name: string, cost: number, billingCycle: 'monthly' | 'yearly' | 'one_off', category: string) => void;
  handleAddSavingsGoal: (title: string, targetAmount: number, icon: string) => void;

  // Handlers: Generic object CRUD
  handleUpdateObject: (updatedObj: any) => void;
  handleDeleteObject: (obj: any) => void;
  handleResetData: () => void;
}

// ─── Tạo Context ─────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [soundOn, setSoundOn] = useState(true);

  // Modals & Panels
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isSidebarPanelOpen, setIsSidebarPanelOpen] = useState(false);
  const [inspectedObject, setInspectedObject] = useState<any | null>(null);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Timeline date range offsets
  const [minOffset, setMinOffset] = useState(-1);
  const [maxOffset, setMaxOffset] = useState(3);

  // Auto-save mỗi khi state thay đổi
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Keyboard shortcut: Cmd+K mở quick capture
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

  // Tính toán dữ liệu timeline
  const todayStr = getTodayStr();
  const timelineDates = (() => {
    const dates: string[] = [];
    for (let i = minOffset; i <= maxOffset; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  })();
  const activePrimaryGoal = appState.savingsGoals[0];

  // ─── Handlers: Navigation ──────────────────────────────────────────────────

  const handleTabChange = (tab: ActiveTab) => {
    playTabSwitch();
    setActiveTab(tab);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // ─── Handlers: Add objects ─────────────────────────────────────────────────

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
    setAppState((prev) => ({ ...prev, quickNotes: [newQN, ...prev.quickNotes] }));
  };

  const handleAddNote = (title: string, content: string, boxId: string, tagIds: string[], dateStr?: string) => {
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
    setAppState((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));
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
      dayRelations: { [targetDate]: { status: 'todo' } },
      createdAt: formatTimestamp(),
      updatedAt: formatTimestamp(),
    };
    playPop();
    setAppState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
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
    setAppState((prev) => ({ ...prev, events: [...prev.events, newEvt] }));
  };

  // ─── Handlers: Task operations ─────────────────────────────────────────────

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
          [dateStr]: { ...currentDayConfig, status: nextStatus },
        },
        updatedAt: formatTimestamp(),
      };

      let pointDelta = 0;
      if (nextStatus === 'done' && prevStatus !== 'done') pointDelta = task.points;
      else if (prevStatus === 'done' && nextStatus !== 'done') pointDelta = -task.points;

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
        return { ...t, dayRelations: nextDayRelations, updatedAt: formatTimestamp() };
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
          dayRelations: { ...t.dayRelations, [dateStr]: { ...config, durationMinutes: minutes } },
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
        return { ...t, dayRelations: { ...t.dayRelations, [dateStr]: { status: 'todo' } } };
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

  // ─── Handlers: Finance ─────────────────────────────────────────────────────

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

  const handleAddBigPurchase = (title: string, cost: number, rating: number, category: string, notes?: string) => {
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
    setAppState((prev) => ({ ...prev, bigPurchases: [newBp, ...prev.bigPurchases] }));
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
    setAppState((prev) => ({ ...prev, onlineExpenses: [newOe, ...prev.onlineExpenses] }));
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
    setAppState((prev) => ({ ...prev, savingsGoals: [...prev.savingsGoals, newGoal] }));
  };

  // ─── Handlers: Generic CRUD ────────────────────────────────────────────────

  const handleUpdateObject = (updatedObj: any) => {
    if (!updatedObj || !updatedObj.id) return;
    setAppState((prev) => {
      const type = updatedObj.type;
      if (type === 'task') return { ...prev, tasks: prev.tasks.map((t) => (t.id === updatedObj.id ? updatedObj : t)) };
      if (type === 'note') return { ...prev, notes: prev.notes.map((n) => (n.id === updatedObj.id ? updatedObj : n)) };
      if (type === 'quick_note') return { ...prev, quickNotes: prev.quickNotes.map((qn) => (qn.id === updatedObj.id ? updatedObj : qn)) };
      if (type === 'event') return { ...prev, events: prev.events.map((e) => (e.id === updatedObj.id ? updatedObj : e)) };
      if (type === 'savings_goal') return { ...prev, savingsGoals: prev.savingsGoals.map((g) => (g.id === updatedObj.id ? updatedObj : g)) };
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

  // ─── Context value ─────────────────────────────────────────────────────────

  const value: AppContextValue = {
    appState,
    activeTab,
    soundOn,
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    isSidebarPanelOpen,
    setIsSidebarPanelOpen,
    inspectedObject,
    setInspectedObject,
    showStreakModal,
    setShowStreakModal,
    minOffset,
    maxOffset,
    setMinOffset,
    setMaxOffset,
    timelineDates,
    todayStr,
    activePrimaryGoal,
    handleTabChange,
    handleToggleSound,
    handleAddQuickNote,
    handleAddNote,
    handleAddTask,
    handleAddEvent,
    handleUpdateTaskStatus,
    handleRemoveTaskFromDay,
    handleUpdateTaskDuration,
    handleAddTaskToDay,
    handleTogglePin,
    handleLinkReward,
    handleAddDepositToGoal,
    handleRolloverJarsToSavings,
    handleUnlockReward,
    handleAddBigPurchase,
    handleAddOnlineExpense,
    handleAddSavingsGoal,
    handleUpdateObject,
    handleDeleteObject,
    handleResetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Custom hook ──────────────────────────────────────────────────────────────

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp phải được dùng bên trong AppProvider');
  return ctx;
};

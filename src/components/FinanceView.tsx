import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  JarObject,
  SavingsGoalObject,
  BigPurchaseObject,
  OnlineExpenseObject,
  RewardObject,
  GamificationState,
} from '../types';
import { playCoin, playRewardChime } from '../utils/sound';
import {
  PiggyBank,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Gift,
  Plus,
  ArrowRight,
  Star,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Repeat,
} from 'lucide-react';

interface FinanceViewProps {
  jars: JarObject[];
  savingsGoals: SavingsGoalObject[];
  bigPurchases: BigPurchaseObject[];
  onlineExpenses: OnlineExpenseObject[];
  rewards: RewardObject[];
  gamification: GamificationState;
  onAddDepositToGoal: (goalId: string, amount: number) => void;
  onRolloverJarsToSavings: () => void;
  onUnlockReward: (rewardId: string) => void;
  onAddBigPurchase: (title: string, cost: number, rating: number, category: string, notes?: string) => void;
  onAddOnlineExpense: (name: string, cost: number, billingCycle: 'monthly' | 'yearly' | 'one_off', category: string) => void;
  onAddSavingsGoal: (title: string, targetAmount: number, icon: string) => void;
  onSelectObject: (obj: any) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  jars,
  savingsGoals,
  bigPurchases,
  onlineExpenses,
  rewards,
  gamification,
  onAddDepositToGoal,
  onRolloverJarsToSavings,
  onUnlockReward,
  onAddBigPurchase,
  onAddOnlineExpense,
  onAddSavingsGoal,
  onSelectObject,
}) => {
  const [activeTab, setActiveTab] = useState<'jars' | 'goals' | 'purchases' | 'online' | 'rewards'>('jars');

  // Deposit Goal modal state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(20);

  // New Big Purchase state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [bpTitle, setBpTitle] = useState('');
  const [bpCost, setBpCost] = useState<number>(100);
  const [bpRating, setBpRating] = useState<number>(5);
  const [bpCategory, setBpCategory] = useState('Hardware');
  const [bpNotes, setBpNotes] = useState('');

  // New Online Expense state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [oeName, setOeName] = useState('');
  const [oeCost, setOeCost] = useState<number>(15);
  const [oeCycle, setOeCycle] = useState<'monthly' | 'yearly' | 'one_off'>('monthly');
  const [oeCategory, setOeCategory] = useState('Dev Tools');

  // New Goal modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState<number>(200);

  const savingsPiggyBank = jars.find((j) => j.isSavingsPiggyBank) || jars[0];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || depositAmount <= 0) return;
    onAddDepositToGoal(depositGoalId, depositAmount);
    playCoin();
    setDepositGoalId(null);
  };

  const handleRollover = () => {
    onRolloverJarsToSavings();
    playCoin();
  };

  const handleRewardClick = (reward: RewardObject) => {
    if (reward.isUnlocked) return;
    if (gamification.points < reward.pointCost) return;

    onUnlockReward(reward.id);
    playRewardChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpTitle.trim()) return;
    onAddBigPurchase(bpTitle.trim(), bpCost, bpRating, bpCategory, bpNotes);
    setBpTitle('');
    setBpNotes('');
    setShowPurchaseModal(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oeName.trim()) return;
    onAddOnlineExpense(oeName.trim(), oeCost, oeCycle, oeCategory);
    setOeName('');
    setShowExpenseModal(false);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    onAddSavingsGoal(goalTitle.trim(), goalTarget, 'Target');
    setGoalTitle('');
    setShowGoalModal(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Finance Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            <span>Personal Finance & Gamified Rewards</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track monthly spending Jars, transfer surplus to Savings Piggy Bank, and redeem tasks points for treats!
          </p>
        </div>

        {/* Gamified Points Balance Badge */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <Gift className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <div>
            <div className="text-[10px] uppercase font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              Reward Balance
            </div>
            <div className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
              {gamification.points} Points
            </div>
          </div>
        </div>
      </div>

      {/* Finance Sub-Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-stone-100 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('jars')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'jars'
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          🫙 Spending Jars
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'goals'
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          🎯 Savings Goals
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'purchases'
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          🛍️ Big Purchases
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'online'
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          💳 Online Services
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'rewards'
              ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-400 font-bold shadow-2xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          🎁 Rewards Store
        </button>
      </div>

      {/* TAB 1: MONTHLY SPENDING JARS */}
      {activeTab === 'jars' && (
        <div className="flex flex-col gap-6">
          {/* Rollover Surplus Bar */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PiggyBank className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  End-of-Month Piggy Bank Rollover
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Automatically move all remaining budget surplus from monthly Jars straight into your Piggy Bank Savings!
                </p>
              </div>
            </div>

            <button
              onClick={handleRollover}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Transfer Surplus to Savings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jars Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jars.map((jar) => {
              const remaining = jar.monthlyBudget - jar.currentSpent;
              const percent = Math.min(100, Math.round((jar.currentSpent / jar.monthlyBudget) * 100));

              return (
                <div
                  key={jar.id}
                  onClick={() => onSelectObject(jar)}
                  className={`p-4 rounded-2xl border bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    jar.isSavingsPiggyBank
                      ? 'border-emerald-400 dark:border-emerald-800 ring-2 ring-emerald-400/30'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        {jar.name}
                      </h4>
                      {jar.isSavingsPiggyBank && (
                        <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Piggy Bank
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                      <span className="text-stone-500">Spent: ${jar.currentSpent}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        Budget: ${jar.monthlyBudget}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          jar.isSavingsPiggyBank
                            ? 'bg-emerald-500'
                            : percent > 90
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">Remaining Surplus:</span>
                    <span className={`font-mono font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${remaining}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SAVINGS GOALS */}
      {activeTab === 'goals' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Targeted Savings Goals ({savingsGoals.length})
            </h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>New Savings Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

              return (
                <div
                  key={goal.id}
                  onClick={() => onSelectObject(goal)}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        🎯 {goal.title}
                      </h4>
                      <span className="font-mono text-xs font-bold text-emerald-600">
                        {pct}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5">
                      <span>Saved: ${goal.currentAmount}</span>
                      <span>Target: ${goal.targetAmount}</span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] text-stone-400">Target Date: {goal.targetDate || 'Flexible'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDepositGoalId(goal.id);
                      }}
                      className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BIG PURCHASES */}
      {activeTab === 'purchases' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Big Purchases Log ({bigPurchases.length})
            </h3>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Record Purchase</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bigPurchases.map((bp) => (
              <div
                key={bp.id}
                onClick={() => onSelectObject(bp)}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {bp.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {bp.category} • {bp.dateStr}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                    ${bp.cost}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < bp.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 ml-1">
                    {bp.rating}/5
                  </span>
                </div>

                {bp.notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/40 p-2 rounded-lg">
                    "{bp.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ONLINE SERVICE EXPENSES */}
      {activeTab === 'online' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Online Service Expenses & Subscriptions ({onlineExpenses.length})
            </h3>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Online Expense</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineExpenses.map((oe) => (
              <div
                key={oe.id}
                onClick={() => onSelectObject(oe)}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {oe.name}
                    </h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {oe.billingCycle}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{oe.category}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-xs text-stone-500">Cost:</span>
                  <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                    ${oe.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GAMIFIED REWARDS STORE */}
      {activeTab === 'rewards' && (
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-300 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-indigo-600 shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  Gamified Points Rewards Store
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Earn points by completing tasks on your Daily Cards. Spend points to treat yourself!
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-stone-400 uppercase">Your Balance</div>
              <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {gamification.points} pts
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const canAfford = gamification.points >= reward.pointCost;

              return (
                <div
                  key={reward.id}
                  onClick={() => onSelectObject(reward)}
                  className={`p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between gap-3 ${
                    reward.isUnlocked
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : canAfford
                      ? 'bg-white dark:bg-stone-900 border-indigo-300 dark:border-indigo-700 hover:shadow-md'
                      : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {reward.title}
                      </h4>
                      <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {reward.pointCost} points required
                      </div>
                    </div>
                  </div>

                  <div>
                    {reward.isUnlocked ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-2xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRewardClick(reward);
                        }}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          canAfford
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        Redeem
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-xs rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Add Funds to Savings Goal
            </h3>

            <form onSubmit={handleDepositSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-stone-500 mb-1 block">Amount ($):</label>
                <input
                  type="number"
                  autoFocus
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono font-bold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Record Big Purchase
            </h3>

            <form onSubmit={handlePurchaseSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={bpTitle}
                onChange={(e) => setBpTitle(e.target.value)}
                placeholder="Item Title (e.g. 4K Monitor)..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Cost ($):</label>
                  <input
                    type="number"
                    value={bpCost}
                    onChange={(e) => setBpCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Rating (1-5):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={bpRating}
                    onChange={(e) => setBpRating(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                value={bpNotes}
                onChange={(e) => setBpNotes(e.target.value)}
                placeholder="Personal notes / value evaluation..."
                className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 resize-none"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 text-xs text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Online Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Add Online Service Expense
            </h3>

            <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={oeName}
                onChange={(e) => setOeName(e.target.value)}
                placeholder="Service Name (e.g. Spotify)..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Cost ($):</label>
                  <input
                    type="number"
                    value={oeCost}
                    onChange={(e) => setOeCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Billing Cycle:</label>
                  <select
                    value={oeCycle}
                    onChange={(e) => setOeCycle(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one_off">One-Off</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-xs text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Savings Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              New Savings Goal
            </h3>

            <form onSubmit={handleGoalSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Goal Target Name (e.g. Ergonomic Keyboard)..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100"
              />

              <div>
                <label className="text-xs text-stone-500 mb-1 block">Target Amount ($):</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-xs text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

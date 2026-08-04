import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';
import {
  JarObject,
  SavingsGoalObject,
  BigPurchaseObject,
  OnlineExpenseObject,
  RewardObject,
  GamificationState,
} from '../../types';
import { playCoin, playRewardChime } from '../../utils/sound';
import styles from './FinanceView.module.css';
import { Icon } from '../shared/Icon';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { InputField, TextareaField } from '../shared/Input';
import { Badge } from '../shared/Badge';

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
    <div className={styles.container}>
      {/* Finance Overview Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>
            <Icon name="savings" size="md" className={styles.headerTitleIcon} />
            <span>Personal Finance & Gamified Rewards</span>
          </h2>
          <p className={styles.headerDesc}>
            Track monthly spending Jars, transfer surplus to Savings Piggy Bank, and redeem tasks points for treats!
          </p>
        </div>

        {/* Gamified Points Balance Badge */}
        <div className={styles.pointsBadge}>
          <Icon name="featured_seasonal_and_gifts" size="md" className={styles.pointsBadgeIcon} />
          <div>
            <div className={styles.pointsBadgeLabel}>Reward Balance</div>
            <div className={styles.pointsBadgeValue}>{gamification.points} Points</div>
          </div>
        </div>
      </div>

      {/* Finance Sub-Tabs */}
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('jars')} className={clsx(styles.tabBtn, activeTab === 'jars' && styles['tabBtn--active'])}>
          🫙 Spending Jars
        </button>
        <button onClick={() => setActiveTab('goals')} className={clsx(styles.tabBtn, activeTab === 'goals' && styles['tabBtn--active'])}>
          🎯 Savings Goals
        </button>
        <button onClick={() => setActiveTab('purchases')} className={clsx(styles.tabBtn, activeTab === 'purchases' && styles['tabBtn--active'])}>
          🛍️ Big Purchases
        </button>
        <button onClick={() => setActiveTab('online')} className={clsx(styles.tabBtn, activeTab === 'online' && styles['tabBtn--active'])}>
          💳 Online Services
        </button>
        <button onClick={() => setActiveTab('rewards')} className={clsx(styles.tabBtn, styles['tabBtn--rewards'], activeTab === 'rewards' && styles['tabBtn--active'])}>
          🎁 Rewards Store
        </button>
      </div>

      {/* TAB 1: MONTHLY SPENDING JARS */}
      {activeTab === 'jars' && (
        <div className={styles.section}>
          <div className={styles.rolloverBanner}>
            <div className={styles.rolloverContent}>
              <Icon name="savings" size="lg" className={styles.rolloverIcon} />
              <div>
                <h3 className={styles.rolloverTitle}>End-of-Month Piggy Bank Rollover</h3>
                <p className={styles.rolloverDesc}>Automatically move all remaining budget surplus from monthly Jars straight into your Piggy Bank Savings!</p>
              </div>
            </div>
            <Button variant="primary" onClick={handleRollover} style={{ backgroundColor: 'var(--color-success)' }}>
              <span>Transfer Surplus to Savings</span>
              <Icon name="arrow_forward" size="sm" />
            </Button>
          </div>

          <div className={styles.grid3}>
            {jars.map((jar) => {
              const remaining = jar.monthlyBudget - jar.currentSpent;
              const percent = Math.min(100, Math.round((jar.currentSpent / jar.monthlyBudget) * 100));

              return (
                <div
                  key={jar.id}
                  onClick={() => onSelectObject(jar)}
                  className={styles.card}
                  style={jar.isSavingsPiggyBank ? { borderColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-success-soft)' } : {}}
                >
                  <div>
                    <div className={styles.cardHeader}>
                      <h4 className={styles.cardTitle}>{jar.name}</h4>
                      {jar.isSavingsPiggyBank && <Badge variant="success" size="sm">Piggy Bank</Badge>}
                    </div>

                    <div className={clsx(styles.cardHeader, styles.cardMeta)}>
                      <span>Spent: ${jar.currentSpent}</span>
                      <span className={styles.cardMetaBold}>Budget: ${jar.monthlyBudget}</span>
                    </div>

                    <div className={styles.progressWrap}>
                      <div
                        className={clsx(
                          styles.progressBar,
                          jar.isSavingsPiggyBank ? styles['progressBar--success'] : percent > 90 ? styles['progressBar--danger'] : styles['progressBar--accent']
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span>Remaining Surplus:</span>
                    <span className={clsx(styles.surplusValue, remaining >= 0 ? styles['surplusValue--positive'] : styles['surplusValue--negative'])}>
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
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Targeted Savings Goals ({savingsGoals.length})</h3>
            <Button variant="primary" size="sm" onClick={() => setShowGoalModal(true)} style={{ backgroundColor: 'var(--color-success)' }}>
              <Icon name="add" size="sm" /> New Savings Goal
            </Button>
          </div>

          <div className={styles.grid3}>
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

              return (
                <div key={goal.id} onClick={() => onSelectObject(goal)} className={styles.card}>
                  <div>
                    <div className={styles.cardHeader}>
                      <h4 className={styles.cardTitle}>🎯 {goal.title}</h4>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-success)' }}>{pct}%</span>
                    </div>

                    <div className={clsx(styles.cardHeader, styles.cardMeta)}>
                      <span>Saved: ${goal.currentAmount}</span>
                      <span>Target: ${goal.targetAmount}</span>
                    </div>

                    <div className={styles.progressWrap}>
                      <div className={clsx(styles.progressBar, styles['progressBar--success'])} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Target Date: {goal.targetDate || 'Flexible'}</span>
                    <Button
                      color="neutral"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDepositGoalId(goal.id);
                      }}
                      style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-success-soft)', border: '1px solid var(--color-success-border)' }}
                    >
                      + Add Funds
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BIG PURCHASES */}
      {activeTab === 'purchases' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Big Purchases Log ({bigPurchases.length})</h3>
            <Button variant="primary" size="sm" onClick={() => setShowPurchaseModal(true)} style={{ backgroundColor: 'var(--color-success)' }}>
              <Icon name="add" size="sm" /> Record Purchase
            </Button>
          </div>

          <div className={styles.grid2}>
            {bigPurchases.map((bp) => (
              <div key={bp.id} onClick={() => onSelectObject(bp)} className={styles.card}>
                <div className={styles.cardHeader} style={{ marginBottom: 0 }}>
                  <div>
                    <h4 className={styles.cardTitle}>{bp.title}</h4>
                    <span className={styles.cardMeta}>{bp.category} • {bp.dateStr}</span>
                  </div>
                  <span className={styles.cardMetaBold} style={{ fontSize: 'var(--text-sm)' }}>${bp.cost}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-warning)' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name={i < bp.rating ? 'star' : 'star_border'} size="sm" style={i < bp.rating ? {} : { color: 'var(--color-text-muted)' }} />
                  ))}
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-secondary)', marginLeft: '0.25rem' }}>{bp.rating}/5</span>
                </div>

                {bp.notes && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontStyle: 'italic', backgroundColor: 'var(--color-surface-alt)', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
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
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Online Service Expenses & Subscriptions ({onlineExpenses.length})</h3>
            <Button variant="primary" size="sm" onClick={() => setShowExpenseModal(true)} style={{ backgroundColor: 'var(--color-success)' }}>
              <Icon name="add" size="sm" /> Add Online Expense
            </Button>
          </div>

          <div className={styles.grid3}>
            {onlineExpenses.map((oe) => (
              <div key={oe.id} onClick={() => onSelectObject(oe)} className={styles.card}>
                <div>
                  <div className={styles.cardHeader} style={{ marginBottom: '0.25rem' }}>
                    <h4 className={styles.cardTitle}>{oe.name}</h4>
                    <Badge variant="accent" size="sm">{oe.billingCycle}</Badge>
                  </div>
                  <span className={styles.cardMeta}>{oe.category}</span>
                </div>

                <div className={styles.cardFooter}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cost:</span>
                  <span className={styles.cardMetaBold} style={{ fontSize: 'var(--text-sm)' }}>${oe.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GAMIFIED REWARDS STORE */}
      {activeTab === 'rewards' && (
        <div className={styles.section}>
          <div className={styles.rewardBanner}>
            <div className={styles.rolloverContent}>
              <Icon name="featured_seasonal_and_gifts" size="lg" className={styles.rolloverIcon} style={{ color: 'var(--color-accent)' }} />
              <div>
                <h3 className={styles.rolloverTitle}>Gamified Points Rewards Store</h3>
                <p className={styles.rolloverDesc}>Earn points by completing tasks on your Daily Cards. Spend points to treat yourself!</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Your Balance</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>{gamification.points} pts</div>
            </div>
          </div>

          <div className={styles.grid2}>
            {rewards.map((reward) => {
              const canAfford = gamification.points >= reward.pointCost;
              return (
                <div
                  key={reward.id}
                  onClick={() => onSelectObject(reward)}
                  className={clsx(
                    styles.rewardCard,
                    reward.isUnlocked ? styles['rewardCard--unlocked'] : canAfford ? styles['rewardCard--available'] : styles['rewardCard--locked']
                  )}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div className={styles.rewardIconWrap}>
                      <Icon name="featured_seasonal_and_gifts" size="sm" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 className={styles.cardTitle} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reward.title}</h4>
                      <div className={styles.rewardCost}>{reward.pointCost} points required</div>
                    </div>
                  </div>

                  <div>
                    {reward.isUnlocked ? (
                      <Badge variant="success" size="sm">
                        <Icon name="check_circle" size="sm" style={{ fontSize: '1em' }} /> Unlocked
                      </Badge>
                    ) : (
                      <Button
                        variant={canAfford ? 'primary' : 'ghost'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRewardClick(reward);
                        }}
                        disabled={!canAfford}
                        style={canAfford ? { backgroundColor: 'var(--color-accent)' } : {}}
                      >
                        Redeem
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      <Modal
        isOpen={!!depositGoalId}
        onClose={() => setDepositGoalId(null)}
        title="Add Funds to Savings Goal"
        footer={
          <>
            <Button color="neutral" variant="outline" onClick={() => setDepositGoalId(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleDepositSubmit} style={{ backgroundColor: 'var(--color-success)' }}>Deposit</Button>
          </>
        }
      >
        <form onSubmit={handleDepositSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Amount ($):</label>
            <InputField type="number" min={1} autoFocus value={depositAmount.toString()} onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} />
          </div>
        </form>
      </Modal>

      {/* New Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Record Big Purchase"
        footer={
          <>
            <Button color="neutral" variant="outline" onClick={() => setShowPurchaseModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handlePurchaseSubmit} style={{ backgroundColor: 'var(--color-success)' }}>Save Purchase</Button>
          </>
        }
      >
        <form onSubmit={handlePurchaseSubmit} className={styles.form}>
          <InputField autoFocus placeholder="Item Title (e.g. 4K Monitor)..." value={bpTitle} onChange={(e) => setBpTitle(e.target.value)} />
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Cost ($):</label>
              <input type="number" value={bpCost} onChange={(e) => setBpCost(parseFloat(e.target.value) || 0)} className={styles.fieldSelect} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Rating (1-5):</label>
              <input type="number" min="1" max="5" value={bpRating} onChange={(e) => setBpRating(parseInt(e.target.value) || 5)} className={styles.fieldSelect} />
            </div>
          </div>
          <TextareaField rows={2} placeholder="Personal notes / value evaluation..." value={bpNotes} onChange={(e) => setBpNotes(e.target.value)} />
        </form>
      </Modal>

      {/* New Online Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Online Service Expense"
        footer={
          <>
            <Button color="neutral" variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleExpenseSubmit} style={{ backgroundColor: 'var(--color-success)' }}>Save Service</Button>
          </>
        }
      >
        <form onSubmit={handleExpenseSubmit} className={styles.form}>
          <InputField autoFocus placeholder="Service Name (e.g. Spotify)..." value={oeName} onChange={(e) => setOeName(e.target.value)} />
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Cost ($):</label>
              <input type="number" value={oeCost} onChange={(e) => setOeCost(parseFloat(e.target.value) || 0)} className={styles.fieldSelect} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Billing Cycle:</label>
              <select value={oeCycle} onChange={(e) => setOeCycle(e.target.value as any)} className={styles.fieldSelect}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one_off">One-Off</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* New Savings Goal Modal */}
      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="New Savings Goal"
        footer={
          <>
            <Button color="neutral" variant="outline" onClick={() => setShowGoalModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleGoalSubmit} style={{ backgroundColor: 'var(--color-success)' }}>Save Goal</Button>
          </>
        }
      >
        <form onSubmit={handleGoalSubmit} className={styles.form}>
          <InputField autoFocus placeholder="Goal Target Name (e.g. Ergonomic Keyboard)..." value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Target Amount ($):</label>
            <input type="number" value={goalTarget} onChange={(e) => setGoalTarget(parseFloat(e.target.value) || 0)} className={styles.fieldSelect} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

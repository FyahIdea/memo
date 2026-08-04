import React, { useState } from 'react';
import clsx from 'clsx';
import { TaskObject, TaskCategory, RewardObject } from '../../types';
import styles from './TasksView.module.css';
import { Icon } from '../shared/Icon';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { InputField } from '../shared/Input';
import { Badge } from '../shared/Badge';

interface TasksViewProps {
  tasks: TaskObject[];
  rewards: RewardObject[];
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean, deadline?: string, rewardId?: string) => void;
  onTogglePin: (taskId: string) => void;
  onLinkReward: (taskId: string, rewardId: string | undefined) => void;
  onSelectTask: (task: TaskObject) => void;
  onOpenSidebarPanel: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  rewards,
  onAddTask,
  onTogglePin,
  onLinkReward,
  onSelectTask,
  onOpenSidebarPanel,
}) => {
  const [activeCategoryModal, setActiveCategoryModal] = useState<TaskCategory | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskRewardId, setTaskRewardId] = useState('');
  const [taskPinned, setTaskPinned] = useState(false);

  const smallTasks = tasks.filter((t) => t.category === 'small');
  const shortTermTasks = tasks.filter((t) => t.category === 'short_term');
  const longTermTasks = tasks.filter((t) => t.category === 'long_term');

  const pinnedShortTermCount = shortTermTasks.filter((t) => t.isPinned).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeCategoryModal) return;

    const points = activeCategoryModal === 'small' ? 5 : activeCategoryModal === 'short_term' ? 20 : 50;
    onAddTask(
      taskTitle.trim(),
      activeCategoryModal,
      points,
      taskPinned,
      taskDeadline || undefined,
      taskRewardId || undefined
    );

    setTaskTitle('');
    setTaskDeadline('');
    setTaskRewardId('');
    setTaskPinned(false);
    setActiveCategoryModal(null);
  };

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>
            <Icon name="check_box" size="md" className={styles.headerTitleIcon} />
            <span>Task Management & Focus Dashboard</span>
          </h2>
          <p className={styles.headerDesc}>
            Tasks can be linked to multiple days via drag-and-drop. Global status follows the status on the latest linked date.
          </p>
        </div>

        <Button variant="primary" onClick={onOpenSidebarPanel}>
          <Icon name="drag_indicator" size="sm" />
          <span>Open Drag-&-Drop Panel</span>
        </Button>
      </div>

      {/* 3 Columns Layout */}
      <div className={styles.grid}>
        {/* COLUMN 1: SMALL / MISC TASKS */}
        <div className={clsx(styles.col, styles['col--small'])}>
          <div className={styles.colHeader}>
            <div className={styles.colTitle}>
              <span className={clsx(styles.colDot, styles['colDot--small'])} />
              <span>Small / Misc Tasks</span>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-success)' }}>
              +5 pts
            </span>
          </div>
          <p className={styles.colDesc}>
            Quick daily to-dos & errands. Simple capture.
          </p>

          <button
            onClick={() => setActiveCategoryModal('small')}
            className={styles.addBtn}
          >
            <Icon name="add" size="sm" style={{ color: 'var(--color-success)' }} />
            <span>Add Small Task</span>
          </button>

          {/* List */}
          <div className={styles.taskList}>
            {smallTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className={styles.taskItem}
              >
                <div className={styles.taskItemTop}>
                  <span className={styles.taskItemTitle}>{t.title}</span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)', fontWeight: 'var(--weight-semibold)', flexShrink: 0 }}>
                    +5 pts
                  </span>
                </div>
                <div className={styles.taskItemMeta}>
                  <span>Linked days: {Object.keys(t.dayRelations).length}</span>
                  {t.recurring !== 'none' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)' }}>
                      <Icon name="autorenew" size="sm" style={{ fontSize: '1em' }} />
                      {t.recurring}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: SHORT-TERM FOCUS TASKS */}
        <div className={clsx(styles.col, styles['col--short'])}>
          <div className={styles.colHeader}>
            <div className={styles.colTitle}>
              <span className={clsx(styles.colDot, styles['colDot--short'])} />
              <span>Short-Term Focus</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)' }}>
              <Icon name="push_pin" size="sm" style={{ color: 'var(--color-warning)' }} />
              <span>Pinned ({pinnedShortTermCount}/5 max)</span>
            </div>
          </div>
          <p className={styles.colDesc}>
            High priority focus items. Tied to rewards & 15-25 pts.
          </p>

          <button
            onClick={() => setActiveCategoryModal('short_term')}
            className={styles.addBtn}
          >
            <Icon name="add" size="sm" style={{ color: 'var(--color-accent)' }} />
            <span>Add Short-Term Task</span>
          </button>

          {/* List */}
          <div className={styles.taskList}>
            {shortTermTasks.map((t) => {
              const linkedReward = rewards.find((r) => r.id === t.rewardId);

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className={clsx(styles.taskItem, t.isPinned && styles['taskItem--pinned'])}
                >
                  <div className={styles.taskItemTop}>
                    <span className={styles.taskItemTitle}>{t.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(t.id);
                      }}
                      className={clsx(styles.pinBtn, t.isPinned && styles['pinBtn--active'])}
                      title={t.isPinned ? 'Unpin Task' : 'Pin to Focus'}
                    >
                      <Icon name="push_pin" size="sm" />
                    </button>
                  </div>

                  {linkedReward && (
                    <Badge variant="accent" size="sm" style={{ alignSelf: 'flex-start' }}>
                      <Icon name="featured_seasonal_and_gifts" size="sm" style={{ fontSize: '1em' }} /> Reward: {linkedReward.title}
                    </Badge>
                  )}

                  <div className={styles.taskItemMeta} style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)' }}>
                      +{t.points} pts
                    </span>
                    {t.deadline && <span>Due {t.deadline}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: LONG-TERM TASKS */}
        <div className={clsx(styles.col, styles['col--long'])}>
          <div className={styles.colHeader}>
            <div className={styles.colTitle}>
              <span className={clsx(styles.colDot, styles['colDot--long'])} />
              <span>Long-Term Vision</span>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-warning)' }}>
              +50 pts
            </span>
          </div>
          <p className={styles.colDesc}>
            Future goals & multi-step projects. Major milestones.
          </p>

          <button
            onClick={() => setActiveCategoryModal('long_term')}
            className={styles.addBtn}
          >
            <Icon name="add" size="sm" style={{ color: 'var(--color-warning)' }} />
            <span>Add Long-Term Task</span>
          </button>

          {/* List */}
          <div className={styles.taskList}>
            {longTermTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className={styles.taskItem}
              >
                <div className={styles.taskItemTop}>
                  <span className={styles.taskItemTitle}>{t.title}</span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-warning)', fontWeight: 'var(--weight-semibold)', flexShrink: 0 }}>
                    +50 pts
                  </span>
                </div>
                <div className={styles.taskItemMeta}>
                  Linked days: {Object.keys(t.dayRelations).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Category Modal */}
      <Modal
        isOpen={!!activeCategoryModal}
        onClose={() => setActiveCategoryModal(null)}
        title={`Add New ${activeCategoryModal === 'small' ? 'Small Task' : activeCategoryModal === 'short_term' ? 'Short-Term Task' : 'Long-Term Task'}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActiveCategoryModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateSubmit}>Create Task</Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className={styles.form}>
          <InputField
            autoFocus
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          {activeCategoryModal === 'short_term' && (
            <>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={taskPinned}
                  onChange={(e) => setTaskPinned(e.target.checked)}
                />
                <span>Pin to focus list (Max 5 focus items)</span>
              </label>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Optional Linked Reward:</label>
                <select
                  value={taskRewardId}
                  onChange={(e) => setTaskRewardId(e.target.value)}
                  className={styles.fieldSelect}
                >
                  <option value="">No linked reward</option>
                  {rewards.map((r) => (
                    <option key={r.id} value={r.id}>
                      🎁 {r.title} ({r.pointCost} pts)
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className={styles.inlineField}>
            <span>Optional Deadline:</span>
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className={styles.fieldSelect}
              style={{ width: 'auto' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

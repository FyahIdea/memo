import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './TaskSidebarPanel.module.css';
import { TaskObject, TaskCategory } from '../../types';
import { playPop } from '../../utils/sound';
import { Icon } from '../shared/Icon';

interface TaskSidebarPanelProps {
  tasks: TaskObject[];
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean) => void;
  onTogglePin: (taskId: string) => void;
  onSelectTask?: (task: TaskObject) => void;
}

export const TaskSidebarPanel: React.FC<TaskSidebarPanelProps> = ({
  tasks,
  isOpen,
  onClose,
  onAddTask,
  onTogglePin,
  onSelectTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('short_term');
  const [filterCategory, setFilterCategory] = useState<'all' | TaskCategory>('all');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const points = newCategory === 'small' ? 5 : newCategory === 'short_term' ? 20 : 50;
    onAddTask(newTitle.trim(), newCategory, points, false);
    setNewTitle('');
    playPop();
  };

  const filteredTasks = tasks.filter((t) => filterCategory === 'all' || t.category === filterCategory);
  const pinnedTasks = filteredTasks.filter((t) => t.isPinned);
  const unpinnedTasks = filteredTasks.filter((t) => !t.isPinned);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('application/memo-task-id', taskId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <aside className={styles.panel}>
      {/* Panel Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Icon name="check_box" size="sm" style={{ color: 'var(--color-accent)' }} />
          <span>Task Sidebar Pool</span>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          <Icon name="close" size="sm" />
        </button>
      </div>

      <div className={styles.hint}>
        💡 Drag & drop tasks onto any day card in the timeline!
      </div>

      {/* Filter Tabs */}
      <div className={styles.filters}>
        <button
          onClick={() => setFilterCategory('all')}
          className={clsx(styles.filterBtn, filterCategory === 'all' && styles['filterBtn--active'])}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilterCategory('short_term')}
          className={clsx(styles.filterBtn, filterCategory === 'short_term' && styles['filterBtn--active'])}
        >
          Short
        </button>
        <button
          onClick={() => setFilterCategory('small')}
          className={clsx(styles.filterBtn, filterCategory === 'small' && styles['filterBtn--active'])}
        >
          Small
        </button>
        <button
          onClick={() => setFilterCategory('long_term')}
          className={clsx(styles.filterBtn, filterCategory === 'long_term' && styles['filterBtn--active'])}
        >
          Long
        </button>
      </div>

      {/* Fast Task Input */}
      <form onSubmit={handleAddSubmit} className={styles.addForm}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Quick add task..."
          className={styles.addInput}
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
          className={styles.addSelect}
        >
          <option value="short_term">Short</option>
          <option value="small">Small</option>
          <option value="long_term">Long</option>
        </select>
        <button type="submit" className={styles.addSubmit}>
          <Icon name="add" size="sm" />
        </button>
      </form>

      {/* Task List */}
      <div className={styles.taskList}>
        {/* Pinned Tasks */}
        {pinnedTasks.length > 0 && (
          <div className={styles.taskGroup}>
            <div className={styles.sectionHeader}>
              <Icon name="push_pin" size="sm" filled />
              <span>Pinned Focus Tasks ({pinnedTasks.length})</span>
            </div>
            {pinnedTasks.map((t) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) => handleDragStart(e, t.id)}
                onClick={() => onSelectTask?.(t)}
                className={clsx(styles.taskCard, styles['taskCard--pinned'])}
              >
                <div className={styles.taskCardBody}>
                  <Icon name="drag_indicator" size="sm" className={styles.dragHandle} />
                  <div className={styles.taskCardInfo}>
                    <p className={styles.taskCardTitle} title={t.title}>
                      {t.title}
                    </p>
                    <div className={styles.taskCardMeta}>
                      <span className={clsx(styles.taskCardPoints, styles['taskCardPoints--pinned'])}>
                        +{t.points} PTS
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(t.id);
                  }}
                  className={clsx(styles.pinBtn, styles['pinBtn--active'])}
                >
                  <Icon name="push_pin" size="sm" filled />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Regular Tasks */}
        <div className={styles.taskGroup}>
          <h4 className={clsx(styles.sectionHeader, styles.sectionHeaderDefault)}>
            Task Pool ({unpinnedTasks.length})
          </h4>
          {unpinnedTasks.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => handleDragStart(e, t.id)}
              onClick={() => onSelectTask?.(t)}
              className={styles.taskCard}
            >
              <div className={styles.taskCardBody}>
                <Icon name="drag_indicator" size="sm" className={styles.dragHandle} />
                <div className={styles.taskCardInfo}>
                  <p className={styles.taskCardTitle} title={t.title}>
                    {t.title}
                  </p>
                  <div className={styles.taskCardMeta}>
                    <span className={styles.taskCardCategory}>
                      {t.category === 'small' ? 'Small' : t.category === 'short_term' ? 'Short' : 'Long'}
                    </span>
                    <span className={styles.taskCardPoints}>
                      +{t.points} PTS
                    </span>
                  </div>
                </div>
              </div>

              {t.category === 'short_term' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(t.id);
                  }}
                  className={styles.pinBtn}
                >
                  <Icon name="push_pin" size="sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

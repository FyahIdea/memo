import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './QuickCaptureModal.module.css';
import { BoxObject, TagObject, TaskCategory } from '../../types';
import { getTodayStr } from '../../data/initialData';
import { playPop } from '../../utils/sound';
import { Modal } from '../../components/shared/Modal';
import { Button } from '../../components/shared/Button';
import { Icon } from '../../components/shared/Icon';
import { InputField, TextareaField } from '../../components/shared/Input';
import { Badge } from '../../components/shared/Badge';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxes: BoxObject[];
  tags: TagObject[];
  onAddQuickNote: (content: string, dateStr: string) => void;
  onAddNote: (title: string, content: string, boxId: string, tagIds: string[], dateStr?: string) => void;
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean, deadline?: string, dateStr?: string) => void;
  onAddEvent: (title: string, timeStr: string, dateStr: string) => void;
  targetDateStr?: string;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  boxes,
  tags,
  onAddQuickNote,
  onAddNote,
  onAddTask,
  onAddEvent,
  targetDateStr,
}) => {
  const [activeType, setActiveType] = useState<'quick_note' | 'note' | 'task' | 'event'>('quick_note');

  // Form states
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState(boxes[0]?.id || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('short_term');
  const [isPinned, setIsPinned] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [captureDate, setCaptureDate] = useState(targetDateStr || getTodayStr());

  if (!isOpen) return null;

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === 'quick_note') {
      if (!content.trim()) return;
      onAddQuickNote(content.trim(), captureDate);
    } else if (activeType === 'note') {
      if (!title.trim() && !content.trim()) return;
      onAddNote(
        title.trim() || 'Untitled Note',
        content.trim(),
        selectedBoxId || boxes[0]?.id || '',
        selectedTagIds,
        captureDate
      );
    } else if (activeType === 'task') {
      if (!title.trim()) return;
      const points = taskCategory === 'small' ? 5 : taskCategory === 'short_term' ? 20 : 50;
      onAddTask(title.trim(), taskCategory, points, isPinned, deadline || undefined, captureDate);
    } else if (activeType === 'event') {
      if (!title.trim()) return;
      onAddEvent(title.trim(), eventTime || '12:00 PM', captureDate);
    }

    playPop();
    setContent('');
    setTitle('');
    setSelectedTagIds([]);
    onClose();
  };

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span>Quick Capture</span>
      <Badge variant="default" size="sm">{captureDate}</Badge>
    </div>
  );

  const modalFooter = (
    <>
      <Button color="neutral" variant="outline" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>Save Object</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
    >
      {/* Object Type Picker */}
      <div className={styles.typePicker}>
        <button
          type="button"
          onClick={() => setActiveType('quick_note')}
          className={clsx(styles.typeBtn, styles['typeBtn--quickNote'], activeType === 'quick_note' && styles['typeBtn--active'])}
        >
          <Icon name="bolt" size="sm" className={styles.typeIcon} filled={activeType === 'quick_note'} />
          <span>Jot</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('note')}
          className={clsx(styles.typeBtn, styles['typeBtn--note'], activeType === 'note' && styles['typeBtn--active'])}
        >
          <Icon name="description" size="sm" className={styles.typeIcon} filled={activeType === 'note'} />
          <span>Note</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('task')}
          className={clsx(styles.typeBtn, styles['typeBtn--task'], activeType === 'task' && styles['typeBtn--active'])}
        >
          <Icon name="check_box" size="sm" className={styles.typeIcon} filled={activeType === 'task'} />
          <span>Task</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveType('event')}
          className={clsx(styles.typeBtn, styles['typeBtn--event'], activeType === 'event' && styles['typeBtn--active'])}
        >
          <Icon name="event" size="sm" className={styles.typeIcon} filled={activeType === 'event'} />
          <span>Event</span>
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className={styles.form} id="capture-form">
        {/* Target Date Selector */}
        <div className={styles.inlineRow}>
          <span className={styles.inlineLabel}>Target Date:</span>
          <input
            type="date"
            value={captureDate}
            onChange={(e) => setCaptureDate(e.target.value)}
            style={{
              padding: '0.25em 0.5em',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* Quick Note Form */}
        {activeType === 'quick_note' && (
          <TextareaField
            autoFocus
            label="Daily Log Note:"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Log a quick thought or observation..."
          />
        )}

        {/* Structured Note Form */}
        {activeType === 'note' && (
          <>
            <InputField
              autoFocus
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextareaField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed thought or description..."
            />

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>
                <Icon name="inbox" size="sm" />
                <span>Select Box:</span>
              </div>
              <div className={styles.chipList}>
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    type="button"
                    onClick={() => setSelectedBoxId(box.id)}
                    className={clsx(styles.chip, selectedBoxId === box.id && styles['chip--active'])}
                  >
                    {box.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>
                <Icon name="label" size="sm" />
                <span>Tags:</span>
              </div>
              <div className={styles.chipList}>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={clsx(styles.chip, selectedTagIds.includes(tag.id) && styles['chip--active'])}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Task Form */}
        {activeType === 'task' && (
          <>
            <InputField
              autoFocus
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Category & Points:</div>
              <div className={styles.taskCatGrid}>
                <button
                  type="button"
                  onClick={() => setTaskCategory('small')}
                  className={clsx(styles.taskCatBtn, taskCategory === 'small' && styles['taskCatBtn--active'])}
                >
                  <span className={styles.taskCatName}>Small Task</span>
                  <span className={styles.taskCatPoints}>+5 PTS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskCategory('short_term')}
                  className={clsx(styles.taskCatBtn, taskCategory === 'short_term' && styles['taskCatBtn--active'])}
                >
                  <span className={styles.taskCatName}>Short-Term</span>
                  <span className={styles.taskCatPoints}>+20 PTS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskCategory('long_term')}
                  className={clsx(styles.taskCatBtn, taskCategory === 'long_term' && styles['taskCatBtn--active'])}
                >
                  <span className={styles.taskCatName}>Long-Term</span>
                  <span className={styles.taskCatPoints}>+50 PTS</span>
                </button>
              </div>
            </div>

            {taskCategory === 'short_term' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <span>Pin task to focus pool</span>
              </label>
            )}

            <div className={styles.inlineRow}>
              <span className={styles.inlineLabel}>Optional Deadline:</span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{
                  padding: '0.25em 0.5em',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          </>
        )}

        {/* Event Form */}
        {activeType === 'event' && (
          <>
            <InputField
              autoFocus
              placeholder="Event Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.inlineRow}>
              <span className={styles.inlineLabel}>Time:</span>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="10:00 AM"
                style={{
                  padding: '0.25em 0.5em',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

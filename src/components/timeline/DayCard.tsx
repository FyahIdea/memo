import React, { useState } from 'react';
import clsx from 'clsx';
import {
  EventObject,
  TaskObject,
  QuickNoteObject,
  NoteObject,
  BoxObject,
  TagObject,
  TaskDayStatus,
  DailyNoteObject,
} from '../../types';
import { formatTimeOnly } from '../../utils/helpers';
import { playTaskDone, playTaskUncheck, playPop, playDeleteSound } from '../../utils/sound';
import { useDroppable } from '@dnd-kit/core';
import styles from './DayCard.module.css';
import { Icon } from '../shared/Icon';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';

interface DayCardProps {
  dateStr: string;
  isToday: boolean;
  events: EventObject[];
  tasks: TaskObject[];
  quickNotes: QuickNoteObject[];
  notes: NoteObject[];
  boxes: BoxObject[];
  tags: TagObject[];
  dailyNote?: DailyNoteObject;
  onUpdateTaskStatus: (taskId: string, dateStr: string, nextStatus: TaskDayStatus) => void;
  onUpdateTaskDuration: (taskId: string, dateStr: string, minutes?: number) => void;
  onRemoveTaskFromDay: (taskId: string, dateStr: string) => void;
  onAddEvent: (title: string, timeStr: string, dateStr: string) => void;
  onAddQuickNote: (content: string, dateStr: string) => void;
  onAddTaskToDay: (taskId: string, dateStr: string) => void;
  onAddInlineTask: (title: string, dateStr: string) => void;
  onSelectObject?: (obj: any) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  dateStr,
  isToday,
  events,
  tasks,
  quickNotes,
  notes,
  boxes,
  tags,
  dailyNote,
  onUpdateTaskStatus,
  onUpdateTaskDuration,
  onRemoveTaskFromDay,
  onAddEvent,
  onAddQuickNote,
  onAddTaskToDay,
  onAddInlineTask,
  onSelectObject,
}) => {
  const [showEventInput, setShowEventInput] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('09:00 AM');

  const [quickNoteText, setQuickNoteText] = useState('');
  const [inlineTaskText, setInlineTaskText] = useState('');

  const [isCollapsed, setIsCollapsed] = useState(!isToday);

  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = dateObj.getDate();

  const dayTasks = tasks.filter((t) => t.dayRelations[dateStr] !== undefined);
  const dayEvents = events.filter((e) => e.dateStr === dateStr);
  const dayQuickNotes = quickNotes.filter((qn) => qn.dayDateStr === dateStr);
  const dayNotes = notes.filter((n) => n.dayDateStr === dateStr);

  const doneTasksCount = dayTasks.filter((t) => t.dayRelations[dateStr]?.status === 'done').length;
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  });

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    onAddEvent(eventTitle.trim(), eventTime || '09:00 AM', dateStr);
    setEventTitle('');
    setShowEventInput(false);
  };

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    onAddQuickNote(quickNoteText.trim(), dateStr);
    setQuickNoteText('');
  };

  const handleInlineTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTaskText.trim()) return;
    onAddInlineTask(inlineTaskText.trim(), dateStr);
    setInlineTaskText('');
  };

  const handleTaskCheckboxClick = (t: TaskObject) => {
    const currentConfig = t.dayRelations[dateStr];
    const currentStatus = currentConfig?.status || 'todo';

    let nextStatus: TaskDayStatus = 'done';
    if (currentStatus === 'todo') {
      nextStatus = 'done';
      playTaskDone();
    } else {
      nextStatus = 'todo';
      playTaskUncheck();
    }

    onUpdateTaskStatus(t.id, dateStr, nextStatus);
  };

  return (
    <div
      ref={setNodeRef}
      id={`day-card-${dateStr}`}
      className={clsx(
        styles.card,
        isToday && styles['card--today'],
        isOver && styles['card--dragOver']
      )}
    >
      {/* Day Card Header Bar */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Apple Calendar Badge */}
          <div className={styles.dateBadge}>
            <div className={styles.dateBadgeMonth}>{dayName}</div>
            <div className={styles.dateBadgeDay}>{dayNum}</div>
          </div>

          <div className={styles.dateInfo}>
            <div className={styles.dateTitle}>
              <span>{monthName} {dayNum}, {dateObj.getFullYear()}</span>
              {isToday && <Badge variant="solid" size="sm">TODAY</Badge>}
            </div>

            {/* Quick Stat Tags */}
            <div className={styles.stats}>
              <Badge variant="warning" size="sm">
                <Icon name="check_box" size="sm" /> Tasks: {doneTasksCount}/{dayTasks.length}
              </Badge>

              {dayEvents.length > 0 && (
                <Badge variant="accent" size="sm">
                  <Icon name="calendar_month" size="sm" /> Events: {dayEvents.length}
                </Badge>
              )}

              {(dayNotes.length > 0 || dayQuickNotes.length > 0) && (
                <Badge variant="success" size="sm">
                  <Icon name="description" size="sm" /> Notes: {dayNotes.length + dayQuickNotes.length}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Expand / Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.toggleBtn}
        >
          <span>{isCollapsed ? 'Show Details' : 'Collapse'}</span>
          <Icon name={isCollapsed ? 'expand_more' : 'expand_less'} size="sm" />
        </button>
      </div>

      {/* Expanded Content View */}
      {!isCollapsed && (
        <div className={styles.content}>
          {/* 1. EVENTS SECTION */}
          {(dayEvents.length > 0 || showEventInput) && (
            <div className={styles.section}>
              <div className={clsx(styles.sectionHeader, styles['sectionHeader--events'])}>
                <div className={styles.sectionTitle}>
                  <Icon name="calendar_month" size="sm" />
                  <span>Scheduled Events ({dayEvents.length})</span>
                </div>
                <button
                  onClick={() => setShowEventInput(!showEventInput)}
                  style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', font: 'inherit' }}
                >
                  <Icon name="add" size="sm" /> Add Event
                </button>
              </div>

              {showEventInput && (
                <form onSubmit={handleEventSubmit} className={styles.inlineForm}>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title..."
                    className={styles.inlineInput}
                  />
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="09:00 AM"
                    className={clsx(styles.inlineInput, styles.inlineInputSmall)}
                  />
                  <Button type="submit" variant="primary" size="sm">Add</Button>
                </form>
              )}

              <div className={styles.eventsGrid}>
                {dayEvents.map((evt) => (
                  <div key={evt.id} onClick={() => onSelectObject?.(evt)} className={styles.eventItem}>
                    <span className={styles.eventTitle} title={evt.title}>{evt.title}</span>
                    <span className={styles.eventTime}>{evt.timeStr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. TASKS SECTION */}
          <div className={styles.section}>
            <div className={clsx(styles.sectionHeader, styles['sectionHeader--tasks'])}>
              <div className={styles.sectionTitle}>
                <Icon name="check_box" size="sm" />
                <span>Day Tasks ({dayTasks.length})</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Drag from pool or add below</span>
            </div>

            {dayTasks.length === 0 ? (
              <div className={styles.emptyState}>
                No tasks scheduled for this day yet.
              </div>
            ) : (
              <div className={styles.taskList}>
                {dayTasks.map((t) => {
                  const dayConfig = t.dayRelations[dateStr] || { status: 'todo' };
                  const isDone = dayConfig.status === 'done';

                  return (
                    <div
                      key={t.id}
                      className={clsx(styles.taskItem, isDone && styles['taskItem--done'])}
                    >
                      <div className={styles.taskItemLeft}>
                        <button
                          type="button"
                          onClick={() => handleTaskCheckboxClick(t)}
                          className={clsx(styles.taskCheckbox, isDone && styles['taskCheckbox--done'])}
                        >
                          {isDone && <Icon name="check" size="sm" />}
                        </button>
                        <div onClick={() => onSelectObject?.(t)} className={styles.taskContent}>
                          <span className={clsx(styles.taskTitle, isDone && styles['taskTitle--done'])}>
                            {t.title}
                          </span>
                          {t.subItems && t.subItems.length > 0 && (
                            <span className={styles.taskSubIndicator}>
                              ({t.subItems.filter((s) => s.isDone).length}/{t.subItems.length})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.taskRight}>
                        {t.deadline && (
                          <span className={clsx(styles.taskBadge, styles['taskBadge--due'])}>
                            <Icon name="event" size="sm" style={{ fontSize: '1em' }} /> Due {t.deadline}
                          </span>
                        )}
                        {dayConfig.durationMinutes ? (
                          <span className={clsx(styles.taskBadge, styles['taskBadge--duration'])}>
                            <Icon name="schedule" size="sm" style={{ fontSize: '1em' }} /> {dayConfig.durationMinutes}m
                          </span>
                        ) : null}
                        <Badge variant="warning" size="sm">+{t.points} PTS</Badge>
                        <button
                          onClick={() => {
                            playDeleteSound();
                            onRemoveTaskFromDay(t.id, dateStr);
                          }}
                          className={styles.taskRemoveBtn}
                          title="Remove task from this day"
                        >
                          <Icon name="close" size="sm" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleInlineTaskSubmit} className={styles.inlineForm}>
              <input
                type="text"
                value={inlineTaskText}
                onChange={(e) => setInlineTaskText(e.target.value)}
                placeholder="+ Add task to this day..."
                className={styles.inlineInput}
              />
              <Button type="submit" variant="primary" size="sm">Add Task</Button>
            </form>
          </div>

          {/* 3. NOTES & LOG SECTION */}
          <div className={styles.section} style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-soft)' }}>
            <div className={clsx(styles.sectionHeader, styles['sectionHeader--notes'])}>
              <div className={styles.sectionTitle}>
                <Icon name="description" size="sm" />
                <span>Day Notes & Log ({dayNotes.length + dayQuickNotes.length})</span>
              </div>
            </div>

            <form onSubmit={handleQuickNoteSubmit} className={styles.inlineForm}>
              <input
                type="text"
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Log a thought or quick note..."
                className={styles.inlineInput}
              />
              <Button type="submit" variant="primary" size="sm" style={{ backgroundColor: 'var(--color-success)' }}>
                <Icon name="bolt" size="sm" style={{ color: 'var(--color-warning)' }} /> Log Note
              </Button>
            </form>

            {dayQuickNotes.length > 0 && (
              <div className={styles.quickNotes}>
                {dayQuickNotes.map((qn) => (
                  <div key={qn.id} onClick={() => onSelectObject?.(qn)} className={styles.quickNoteItem}>
                    <span className={styles.quickNoteContent} title={qn.content}>{qn.content}</span>
                    <span className={styles.noteTime}>{formatTimeOnly(qn.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}

            {dayNotes.length > 0 && (
              <div className={styles.notesGrid}>
                {dayNotes.map((n) => {
                  const box = boxes.find((b) => b.id === n.boxId);
                  return (
                    <div key={n.id} onClick={() => onSelectObject?.(n)} className={styles.noteCard}>
                      <div className={styles.noteCardHeader}>
                        <span className={styles.noteCardBox}>{box?.name || 'Note'}</span>
                        <span className={styles.noteTime}>{formatTimeOnly(n.createdAt)}</span>
                      </div>
                      <h4 className={styles.noteCardTitle} title={n.title}>{n.title}</h4>
                      {n.content && (
                        <p className={styles.noteCardPreview}>{n.content}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

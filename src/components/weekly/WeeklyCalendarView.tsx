import React, { useState } from 'react';
import clsx from 'clsx';
import { EventObject, TaskObject } from '../../types';
import styles from './WeeklyCalendarView.module.css';
import { Icon } from '../shared/Icon';
import { Badge } from '../shared/Badge';

interface WeeklyCalendarViewProps {
  events: EventObject[];
  tasks: TaskObject[];
  onSelectObject: (obj: any) => void;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  events,
  tasks,
  onSelectObject,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate 7 days for the selected week starting from Monday
  const getWeekDates = (offset: number) => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
    const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distToMon + offset * 7);

    const weekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d.toISOString().split('T')[0]);
    }
    return weekDays;
  };

  const weekDates = getWeekDates(weekOffset);

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>
            <Icon name="event" size="md" className={styles.headerTitleIcon} />
            <span>Weekly Calendar Grid</span>
          </h2>
          <p className={styles.headerDesc}>
            Overview of scheduled events and time duration blocks across the week.
          </p>
        </div>

        {/* Week Navigator */}
        <div className={styles.nav}>
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className={styles.navBtn}
          >
            <Icon name="chevron_left" size="sm" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            style={{ padding: '0.4em 1em', borderRadius: 'var(--radius-lg)', background: 'var(--color-accent)', color: 'white', fontWeight: 'bold', fontSize: 'var(--text-xs)', border: 'none', cursor: 'pointer' }}
          >
            Current Week
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className={styles.navBtn}
          >
            <Icon name="chevron_right" size="sm" />
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className={styles.grid}>
        {weekDates.map((dateStr) => {
          const dayEvents = events.filter((e) => e.dateStr === dateStr);
          const dayTasks = tasks.filter((t) => t.dayRelations[dateStr] !== undefined);
          const todayStr = new Date().toISOString().split('T')[0];
          const isToday = dateStr === todayStr;

          const dateObj = new Date(dateStr.split('-').map(Number)[0], dateStr.split('-').map(Number)[1] - 1, dateStr.split('-').map(Number)[2]);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.getDate();

          return (
            <div
              key={dateStr}
              className={clsx(styles.dayCol, isToday && styles['dayCol--today'])}
            >
              {/* Day Column Header */}
              <div className={styles.dayHeader}>
                <div>
                  <div className={styles.dayName}>{dayName}</div>
                  <div className={styles.dayNum}>{dayNum}</div>
                </div>
                {isToday && <Badge variant="solid" size="sm">Today</Badge>}
              </div>

              {/* Scheduled Events Section */}
              <div className={styles.section}>
                <span className={clsx(styles.sectionHeader, styles['sectionHeader--events'])}>
                  Events ({dayEvents.length})
                </span>
                {dayEvents.length === 0 ? (
                  <span className={styles.emptyText}>None</span>
                ) : (
                  dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onSelectObject(evt)}
                      className={styles.eventItem}
                    >
                      <span className={styles.eventTitle} title={evt.title}>{evt.title}</span>
                      <span className={styles.eventTime}>{evt.timeStr}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Time-Blocked Tasks Section */}
              <div className={styles.section} style={{ flex: 1, marginTop: 'var(--space-2)' }}>
                <span className={clsx(styles.sectionHeader, styles['sectionHeader--tasks'])}>
                  Time Blocks ({dayTasks.length})
                </span>
                {dayTasks.length === 0 ? (
                  <span className={styles.emptyText}>No tasks</span>
                ) : (
                  dayTasks.map((t) => {
                    const dayConfig = t.dayRelations[dateStr];
                    const mins = dayConfig?.durationMinutes || 30;
                    const hours = (mins / 60).toFixed(1);
                    const isDone = dayConfig?.status === 'done';

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectObject(t)}
                        className={clsx(styles.taskBlock, isDone && styles['taskBlock--done'])}
                      >
                        <span className={styles.taskBlockTitle} title={t.title}>{t.title}</span>
                        <div className={styles.taskBlockMeta}>
                          <span className={styles.taskBlockDuration}>
                            <Icon name="schedule" size="sm" style={{ fontSize: '1em' }} />
                            {mins >= 60 ? `${hours}h` : `${mins}m`}
                          </span>
                          <span className={styles.taskBlockPoints}>+{t.points} PTS</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

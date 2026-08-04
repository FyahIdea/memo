import React from 'react';
import { DayCard } from '../../components/timeline/DayCard';
import { useApp } from '../../contexts/AppContext';
import styles from './TimelinePage.module.css';
import { Icon } from '../../components/shared/Icon';
import { Button } from '../../components/shared/Button';

// Trang Timeline: hiển thị danh sách DayCard theo khoảng ngày được chọn
const TimelinePage: React.FC = () => {
  const {
    appState,
    timelineDates,
    todayStr,
    minOffset,
    maxOffset,
    setMinOffset,
    setMaxOffset,
    setInspectedObject,
    handleAddEvent,
    handleAddQuickNote,
    handleAddTask,
    handleAddTaskToDay,
    handleUpdateTaskStatus,
    handleUpdateTaskDuration,
    handleRemoveTaskFromDay,
  } = useApp();

  return (
    <div className={styles.container}>
      {/* Header bar của Timeline */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>
            <Icon name="calendar_month" size="lg" className={styles.headerTitleIcon} />
            <span>Daily Notes & Tasks Timeline</span>
          </h2>
          <p className={styles.headerDesc}>
            Focused Today's card with collapsible surrounding days and infinite scroll.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            color="neutral"
            variant="outline"
            onClick={() => setMinOffset(minOffset - 3)}
            title="Tải thêm ngày trong quá khứ"
          >
            + Load Past Days
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setMinOffset(-1);
              setMaxOffset(3);
            }}
          >
            Reset to Today
          </Button>
        </div>
      </div>

      {/* Nút tải thêm ngày phía trên */}
      <div className={styles.loadPastContainer}>
        <Button
          color="neutral"
          variant="outline"
          onClick={() => setMinOffset(minOffset - 3)}
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 'var(--weight-bold)', boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)' }}
        >
          <Icon name="chevron_left" size="sm" style={{ color: 'var(--color-accent)' }} />
          <span>Load Previous Days</span>
        </Button>
      </div>

      {/* Stack các DayCard */}
      <div className={styles.timelineStack}>
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

      {/* Nút tải thêm ngày phía dưới */}
      <div className={styles.loadMoreFooter}>
        <p className={styles.loadMoreText}>
          Viewing {timelineDates.length} days. Would you like to load more future days?
        </p>
        <Button
          variant="primary"
          onClick={() => setMaxOffset(maxOffset + 3)}
          size="lg"
        >
          <Icon name="arrow_downward" size="sm" />
          <span>Scroll & Load More Days</span>
        </Button>
      </div>
    </div>
  );
};

export default TimelinePage;

import React, { useState } from 'react';
import styles from './MainLayout.module.css';
import { Sidebar } from '../../components/shared/Sidebar';
import { Icon } from '../../components/shared/Icon';
import { Modal } from '../../components/shared/Modal';
import { Button } from '../../components/shared/Button';
import { TaskPoolPanel } from '../../components/tasks/TaskPoolPanel';
import { QuickCaptureModal } from '../../pages/shared/QuickCaptureModal';
import { ObjectDetailModal } from '../../pages/shared/ObjectDetailModal';
import { useApp } from '../../contexts/AppContext';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent, defaultDropAnimationSideEffects, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { PoolTaskRow } from '../../components/tasks/TaskPoolPanel';
import { TaskObject } from '../../types';

// Layout bọc toàn bộ app: sidebar + header + main content + footer + modals toàn cục
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
    activePrimaryGoal,
    handleTabChange,
    handleToggleSound,
    handleAddQuickNote,
    handleAddNote,
    handleAddTask,
    handleAddEvent,
    handleTogglePin,
    handleUpdateObject,
    handleDeleteObject,
    handleResetData,
    handleAddTaskToDay,
  } = useApp();

  const [activeDragTask, setActiveDragTask] = useState<TaskObject | null>(null);
  const [isDragOverValid, setIsDragOverValid] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragOverValid(false);
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveDragTask(active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== 'Task') {
      setIsDragOverValid(false);
      return;
    }
    
    // Kiểm tra xem task đã có trong ngày này chưa
    const task = active.data.current.task as TaskObject;
    const dateStr = over.id as string;
    const alreadyInDay = !!task.dayRelations?.[dateStr];
    
    setIsDragOverValid(!alreadyInDay);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.data.current?.type === 'Task') {
      const taskId = active.data.current.task.id;
      const dateStr = over.id as string;
      handleAddTaskToDay(taskId, dateStr);
    }
    setActiveDragTask(null);
  };

  const dropAnimationConfig = {
    duration: isDragOverValid ? 0 : 250,
    easing: 'ease',
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.app}>
      {/* Sidebar điều hướng */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Cột nội dung chính */}
      <div className={styles.main}>
        {/* Header thanh công cụ */}
        <header className={styles.header}>
          {/* Nhóm bên trái: Streak + Goal + Points */}
          <div className={styles.headerLeft}>
            {/* Badge streak */}
            <button
              className={`${styles.statBadge} ${styles['statBadge--streak']}`}
              onClick={() => setShowStreakModal(true)}
              title="Xem chi tiết streak"
            >
              <Icon name="local_fire_department" size="sm" filled />
              <span>{appState.gamification.streakDays} Day Streak</span>
            </button>

            {/* Badge mục tiêu tiết kiệm */}
            {activePrimaryGoal && (
              <button
                className={`${styles.statBadge} ${styles['statBadge--goal']}`}
                onClick={() => handleTabChange('finance')}
                title="Xem Finance & Goals"
              >
                <Icon name="my_location" size="sm" />
                <span className={styles.goalTitle}>{activePrimaryGoal.title}:</span>
                <span className={styles.statBadgeNumber}>
                  ${activePrimaryGoal.currentAmount}/${activePrimaryGoal.targetAmount}
                </span>
              </button>
            )}

            {/* Badge điểm thưởng */}
            <button
              className={`${styles.statBadge} ${styles['statBadge--points']}`}
              onClick={() => handleTabChange('finance')}
              title="Dùng điểm để mở rewards"
            >
              <Icon name="star" size="sm" filled />
              <span className={styles.statBadgeNumber}>{appState.gamification.points} PTS</span>
            </button>
          </div>

          {/* Nhóm bên phải: actions */}
          <div className={styles.headerRight}>
            {/* Task Pool toggle */}
            <button
              className={`${styles.actionBtn} ${isSidebarPanelOpen ? styles['actionBtn--poolActive'] : ''}`}
              onClick={() => setIsSidebarPanelOpen(!isSidebarPanelOpen)}
            >
              <Icon name="layers" size="sm" />
              <span>Task Pool</span>
            </button>

            {/* Quick Capture */}
            <button
              className={styles.captureBtn}
              onClick={() => setIsQuickCaptureOpen(true)}
            >
              <Icon name="add" size="sm" />
              <span>Capture</span>
              <kbd className={styles.captureKbd}>⌘K</kbd>
            </button>

            {/* Sound toggle */}
            <button
              className={styles.soundBtn}
              onClick={handleToggleSound}
              title={soundOn ? 'Sound FX Bật' : 'Sound FX Tắt'}
            >
              <Icon name={soundOn ? 'volume_up' : 'volume_off'} size="sm" />
            </button>
          </div>
        </header>

        {/* Nội dung trang & Footer được bọc trong contentWrapper để tạo viền */}
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            {children}
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <span className={styles.footerBrand}>Memo · Personal Objects Studio</span>
            <button className={styles.footerReset} onClick={handleResetData}>
              <Icon name="history" size="sm" />
              <span>Reset Seed Data</span>
            </button>
          </footer>
        </div>
      </div>

      {/* Modal Streak & Gamification */}
      <Modal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        title={<><Icon name="local_fire_department" filled /> Daily Streak & Gamification</>}
        footer={
          <Button
            variant="primary"
            onClick={() => {
              setShowStreakModal(false);
              handleTabChange('finance');
            }}
          >
            Go to Finance & Rewards
          </Button>
        }
      >
        <div className={styles.streakSection}>
          <div className={`${styles.streakCard} ${styles['streakCard--fire']}`}>
            <div className={styles.streakCardTitle}>
              🔥 {appState.gamification.streakDays} Days Streak Active!
            </div>
            <p className={styles.streakCardDesc}>
              Complete at least one task or note every day to keep your momentum streak burning.
            </p>
          </div>
          <div className={`${styles.streakCard} ${styles['streakCard--points']}`}>
            <div className={`${styles.streakCardTitle} ${styles.streakCardPoints}`}>
              ⭐ Total Reward Points: {appState.gamification.points} PTS
            </div>
            <p className={styles.streakCardDesc}>
              Unlocked Rewards: {appState.gamification.unlockedRewardsCount} item(s).
            </p>
          </div>
        </div>
      </Modal>

      {/* Task Pool Panel — dạng push sidebar, nằm trong DOM flow của .app */}
      <TaskPoolPanel
        tasks={appState.tasks}
        isOpen={isSidebarPanelOpen}
        onClose={() => setIsSidebarPanelOpen(false)}
        onAddTask={(title, cat, pts, pin) => handleAddTask(title, cat, pts, pin)}
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

      {/* Object Inspector Modal */}
      <ObjectDetailModal
        object={inspectedObject}
        onClose={() => setInspectedObject(null)}
        onUpdateObject={handleUpdateObject}
        onDelete={handleDeleteObject}
      />

      {/* Drag Overlay cho hiệu ứng kéo thả mượt mà */}
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeDragTask ? (
          <div style={{ 
            opacity: 1, 
            transform: 'scale(1.05) rotate(3deg)', 
            border: '1.5px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
            padding: '0.35rem'
          }}>
            <PoolTaskRow
              task={activeDragTask}
              todayStr={new Date().toISOString().split('T')[0]}
              tagLookup={new Map()}
              onStatusChange={() => {}}
              isOverlay={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </div>
    </DndContext>
  );
};

export default MainLayout;

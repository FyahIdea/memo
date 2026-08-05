import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './TaskItem.module.css';
import { Icon } from '../shared/Icon';
import { Tooltip } from '../shared/Tooltip';
import { playTaskDone, playTaskUncheck, playTaskInProgress, playTaskCancelled, playDisabledClick } from '../../utils/sound';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskType = 'quick' | 'short_term' | 'long_term';

export interface TaskItemProps {
  id: string;
  title: string;
  status: TaskStatus;
  taskType?: TaskType; // Phân loại task (ảnh hưởng hình dáng checkbox)
  points?: number;
  reward?: string;
  rewardIcon?: string;
  rewardPrice?: string;
  deadline?: string;
  timeSpent?: string;
  progress?: number; // legacy percentage
  subtasks?: { completed: number; total: number }; // new subtasks format
  notes?: string;
  onStatusChange?: (status: TaskStatus) => void;
  onRemove?: () => void; // Bỏ khỏi ngày
  className?: string;
  disabled?: boolean;
}

/* Hook Long Press */
function useLongPress(callback: () => void, ms = 400) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (pressing) timerRef.current = setTimeout(callback, ms);
    else clearTimeout(timerRef.current);
    return () => clearTimeout(timerRef.current);
  }, [callback, ms, pressing]);

  return {
    onMouseDown: () => setPressing(true),
    onMouseUp:   () => setPressing(false),
    onMouseLeave:() => setPressing(false),
    onTouchStart:() => setPressing(true),
    onTouchEnd:  () => setPressing(false),
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  title,
  status,
  isPinned = false,
  taskType = 'quick',
  points,
  reward,
  rewardIcon = 'local_cafe',
  rewardPrice,
  deadline,
  timeSpent,
  progress,
  subtasks,
  notes,
  onStatusChange,
  onRemove,
  className,
  disabled = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const longPressProps = useLongPress(() => {
    if (!disabled) setShowMenu(true);
  }, 400);

  const handleToggle = () => {
    if (disabled) {
      playDisabledClick();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }
    if (showMenu) return;
    if (status === 'done') {
      playTaskUncheck();
      onStatusChange?.('todo');
    } else {
      playTaskDone();
      onStatusChange?.('done');
    }
  };

  const handleChangeStatus = (e: React.MouseEvent, next: TaskStatus) => {
    e.stopPropagation();
    setShowMenu(false);
    if (next === status) return;
    if (next === 'done')        playTaskDone();
    else if (next === 'todo')   playTaskUncheck();
    else if (next === 'in_progress') playTaskInProgress();
    else if (next === 'cancelled')   playTaskCancelled();
    onStatusChange?.(next);
  };

  const checkboxMap = {
    todo:        { icon: '',        cls: styles.boxTodo },
    done:        { icon: 'check',   cls: styles.boxDone },
    in_progress: { icon: 'schedule',cls: styles.boxInProgress },
    cancelled:   { icon: 'close',   cls: styles.boxCancelled },
  };
  const cbCfg = checkboxMap[status];
  
  // Xác định hình dáng checkbox
  const isSquareCheckbox = taskType === 'short_term' || taskType === 'long_term';

  const showProgressBar = subtasks !== undefined || progress !== undefined;
  let percent = 0;
  let subtaskText = '';
  if (subtasks) {
    percent = subtasks.total > 0 ? (subtasks.completed / subtasks.total) * 100 : 0;
    subtaskText = `${subtasks.completed}/${subtasks.total}`;
  } else if (progress !== undefined) {
    percent = progress;
    subtaskText = `${progress}%`;
  }

  const isDone      = status === 'done';
  const isCancelled = status === 'cancelled';
  const isFaded     = isDone || isCancelled;

  const hasMeta = deadline || timeSpent || points !== undefined || reward || notes;

  return (
    <div className={clsx(styles.taskItem, isFaded && styles.taskItemFaded, isShaking && 'shake-animation', className)}>

      {/* ─── Cột trái: Checkbox ─── */}
      <div className={styles.checkboxArea}>
        <button
          type="button"
          className={clsx(styles.checkbox, cbCfg.cls, isSquareCheckbox && styles.checkboxSquare)}
          onClick={handleToggle}
          {...longPressProps}
        >
          {cbCfg.icon && <Icon name={cbCfg.icon} size="sm" filled className={styles.checkIcon} />}
        </button>

        {/* Status Menu tuyệt đối không bị mờ */}
        {showMenu && (
          <>
            <div className={styles.menuBackdrop} onClick={() => setShowMenu(false)} />
            <div className={styles.statusMenu}>
              <button className={clsx(styles.menuItem, styles.menuDone)} onClick={e => handleChangeStatus(e, 'done')}>
                <Icon name="check_circle" filled size="md" /><span>Hoàn thành</span>
              </button>
              <button className={clsx(styles.menuItem, styles.menuInProgress)} onClick={e => handleChangeStatus(e, 'in_progress')}>
                <Icon name="schedule" filled size="md" /><span>Đang làm</span>
              </button>
              <button className={clsx(styles.menuItem, styles.menuCancelled)} onClick={e => handleChangeStatus(e, 'cancelled')}>
                <Icon name="cancel" filled size="md" /><span>Huỷ bỏ</span>
              </button>
              <div className={styles.menuDivider} />
              <button className={clsx(styles.menuItem, styles.menuTodo)} onClick={e => handleChangeStatus(e, 'todo')}>
                <Icon name="radio_button_unchecked" filled size="md" /><span>Đặt lại</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ─── Cột giữa: Nội dung ─── */}
      <div className={styles.mainContent}>
        
        {/* Tiêu đề + Ghi chú */}
        <div className={clsx(styles.titleWrapper, isDone && styles.titleDone, isCancelled && styles.titleCancelled)}>
          <span className={styles.title}>{title}</span>
          {notes && (
            <Tooltip 
              position="top" 
              className={styles.notesTooltip}
              noPadding
              content={
                <div className={styles.noteRichTooltip}>
                  <div className={styles.noteTooltipHeader}>
                    <Icon name="description" size="sm" filled className={styles.noteTooltipHeaderIcon} />
                    <span>Notes</span>
                  </div>
                  <div className={styles.noteTooltipBody}>
                    {notes}
                  </div>
                </div>
              }
            >
              <div className={styles.notesIconWrap}>
                <Icon name="description" size="sm" filled className={styles.notesIconGrey} />
              </div>
            </Tooltip>
          )}
        </div>

        {/* Thời gian, Meta & Progress chung 1 dòng */}
        {(showProgressBar || hasMeta) && (
          <div className={styles.metaRow}>
            {showProgressBar && (
              <div className={styles.progressGroup}>
                <div className={styles.progressBarWrap}>
                  <div className={styles.progressBarFill} style={{ width: `${percent}%` }} />
                </div>
                <span className={styles.progressText}>{subtaskText}</span>
              </div>
            )}
            
            {deadline && <span className={styles.metaText}>{deadline}</span>}
            {timeSpent && <span className={styles.metaText}>{timeSpent}</span>}
          </div>
        )}
      </div>

      {/* ─── Cột phải: Actions & Điểm/Quà ─── */}
      <div className={styles.rightActions}>
        {points !== undefined && (
          <div className={styles.pointsBadge}>
            <Icon name="stars" size="sm" filled /> {points}
          </div>
        )}

        {reward && (
          <Tooltip 
            noPadding
            position="top"
            content={
              <div className={styles.rewardRichTooltip}>
                <div className={styles.rewardCover}>
                  <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop" alt="Reward Cover" />
                </div>
                <div className={styles.rewardBody}>
                  <div className={styles.rewardAvatarBox}>
                    <Icon name={rewardIcon} size="md" filled />
                  </div>
                  <div className={styles.rewardHeaderRow}>
                    <span className={styles.rewardTitleText}>{reward}</span>
                    <span className={styles.rewardPrice}>{rewardPrice || `★${points || 50}`}</span>
                  </div>
                  <div className={styles.rewardLocation}>
                    <Icon name="storefront" size="sm" className={styles.storeIcon} />
                    <span>Convenience Store</span>
                  </div>
                </div>
              </div>
            }
          >
            <div className={styles.rewardBadge}>
              Reward
            </div>
          </Tooltip>
        )}

        {onRemove && (
          <Tooltip content="Remove task" position="top">
            <button type="button" className={styles.removeBtn} onClick={onRemove}>
              <Icon name="close" size="sm" filled />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

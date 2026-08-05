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
  onClick?: () => void; // Bấm vào task để xem chi tiết / cài đặt
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
  onClick,
  className,
  disabled = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Title editing state
  const [displayTitle, setDisplayTitle] = useState(title);

  useEffect(() => {
    setDisplayTitle(title);
  }, [title]);

  // Swipe-to-reveal state (Mobile only)
  const [translateX, setTranslateX] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartTranslateX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth > 600 || disabled || !onRemove) return;
    swipeStartX.current = e.touches[0].clientX;
    swipeStartTranslateX.current = translateX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swipeStartX.current === null) return;
    const diff = e.touches[0].clientX - swipeStartX.current;
    let newX = swipeStartTranslateX.current + diff;
    if (newX > 0) newX = 0;
    if (newX < -100) newX = -100;
    setTranslateX(newX);
  };

  const handleTouchEnd = () => {
    if (swipeStartX.current === null) return;
    if (translateX < -40) {
      setTranslateX(-80); // snap open
    } else {
      setTranslateX(0); // snap close
    }
    swipeStartX.current = null;
  };

  useEffect(() => {
    if (translateX === 0) return;
    const closeSwipe = () => setTranslateX(0);
    const timer = setTimeout(() => {
      document.addEventListener('touchstart', closeSwipe);
      document.addEventListener('mousedown', closeSwipe);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', closeSwipe);
      document.removeEventListener('mousedown', closeSwipe);
    };
  }, [translateX]);

  const renderNoteIcon = (customClass?: string) => {
    if (!notes) return null;
    return (
      <Tooltip 
        position="top" 
        className={clsx(styles.notesTooltip, customClass)}
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
    );
  };

  const renderPointsBadge = () => {
    if (points === undefined) return null;
    return (
      <Tooltip
        position="top"
        content={
          <div style={{ padding: '0.25rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-blue-primary)', marginBottom: '0.25rem' }}>
              Kho điểm: 1,250 <Icon name="stars" size="sm" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Hoàn thành task này để nhận thêm {points} điểm!
            </div>
          </div>
        }
      >
        <div className={styles.pointsBadge}>
          <Icon name="stars" size="sm" filled /> {points}
        </div>
      </Tooltip>
    );
  };

  const renderRewardIcon = () => {
    if (!reward) return null;
    return (
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
        <div className={styles.rewardIconWrap}>
          <Icon name={rewardIcon} size="sm" filled className={styles.rewardIcon} />
        </div>
      </Tooltip>
    );
  };

  const renderProgressBar = () => {
    if (!subtasks || subtasks.total === 0) return null;
    const { completed, total } = subtasks;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const remaining = total - completed;

    // SVG r=6, circumference = 2 * Math.PI * 6 = 37.69911
    const dashValue = (percent * 37.69911) / 100;

    return (
      <div className={styles.progressGroup}>
        <div className={styles.craftPieWrapper}>
          <svg className={styles.craftPieSvg} viewBox="0 0 32 32">
            {/* Outer circle */}
            <circle cx="16" cy="16" r="15" className={styles.craftPieTrack} />
            {/* Pie Fill */}
            <circle
              cx="16"
              cy="16"
              r="6"
              className={styles.craftPieFill}
              strokeDasharray={`${dashValue} 37.69911`}
            />
          </svg>
          {remaining > 0 && (
            <div className={styles.craftPieBadge}>{remaining}</div>
          )}
        </div>
      </div>
    );
  };

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
      import('../../utils/confetti').then(m => m.triggerTaskConfetti(taskType));
      playTaskDone();
      onStatusChange?.('done');
    }
  };

  const handleChangeStatus = (e: React.MouseEvent, next: TaskStatus) => {
    e.stopPropagation();
    setShowMenu(false);
    if (next === status) return;
    if (next === 'done') {
      import('../../utils/confetti').then(m => m.triggerTaskConfetti(taskType));
      playTaskDone();
    }
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

  const hasMeta = deadline || timeSpent;

  return (
    <div className={clsx(styles.swipeWrapper, className)}>
      {/* Background action (Delete) */}
      <div className={styles.swipeBackground}>
        {onRemove && (
          <button className={styles.swipeRemoveBtn} onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <Icon name="delete" filled />
          </button>
        )}
      </div>

      <div
        className={clsx(
          styles.taskItem,
          isFaded && styles.taskItemFaded,
          isShaking && 'shake-animation',
          className
        )}
        onClick={onClick}
        style={translateX !== 0 ? { transform: `translateX(${translateX}px)` } : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

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
          <span 
            className={styles.title}
            contentEditable={!disabled}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const newTitle = e.currentTarget.textContent || '';
              if (newTitle.trim()) {
                setDisplayTitle(newTitle.trim());
              } else {
                e.currentTarget.textContent = displayTitle; // revert visually
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
              if (e.key === 'Escape') {
                e.currentTarget.textContent = displayTitle;
                e.currentTarget.blur();
              }
            }}
          >
            {displayTitle}
          </span>
          
          <div className={styles.titleRightIcons}>
            {renderNoteIcon()}
            {renderRewardIcon()}
            {renderPointsBadge()}
          </div>
          
          {/* ─── Cột phải: Actions & Điểm/Quà ─── */}
          <div className={styles.rightActions}>
            {showProgressBar && renderProgressBar()}

            {onRemove && (
              <Tooltip content="Remove task" position="top">
                <button type="button" className={styles.removeBtn} onClick={onRemove}>
                  <Icon name="close" size="sm" filled />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Thời gian, Meta & Progress chung 1 dòng */}
        {/* Thời gian, Meta & Progress chung 1 dòng */}
        {hasMeta && (
          <div className={styles.metaRow}>
            {deadline && (
              <span className={styles.metaText}>
                {deadline}
              </span>
            )}
            {timeSpent && (
              <span className={styles.metaText}>
                {timeSpent}
              </span>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

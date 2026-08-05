import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './TaskPoolPanel.module.css';
import { TaskObject, TaskCategory } from '../../types';
import { TaskItem } from './TaskItem';
import { Icon } from '../shared/Icon';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { playPop } from '../../utils/sound';
import { useApp } from '../../contexts/AppContext';

// ─── Kiểu filter cho danh sách task ──────────────────────────
type FilterType = 'all' | TaskCategory;

interface TaskPoolPanelProps {
  tasks: TaskObject[];
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean) => void;
  onTogglePin: (taskId: string) => void;
  onSelectTask?: (task: TaskObject) => void;
}

export const TaskPoolPanel: React.FC<TaskPoolPanelProps> = ({
  tasks,
  isOpen,
  onClose,
  onAddTask,
  onTogglePin,
  onSelectTask,
}) => {
  const { handleUpdateTaskStatus, todayStr } = useApp();
  
  // ─── State nội bộ ─────────────────────────────────────────
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('short_term');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ─── State cho Custom Drag Layer ────────────────────────
  const [draggingTask, setDraggingTask] = useState<TaskObject | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ─── Lọc và phân nhóm task ────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchCategory = filter === 'all' || t.category === filter;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [tasks, filter, searchQuery]);

  const pinnedTasks = useMemo(
    () => filteredTasks.filter((t) => t.isPinned),
    [filteredTasks]
  );
  const regularTasks = useMemo(
    () => filteredTasks.filter((t) => !t.isPinned),
    [filteredTasks]
  );

  const handleDragStart = (e: React.DragEvent, task: TaskObject) => {
    e.dataTransfer.setData('application/memo-task-id', task.id);
    e.dataTransfer.effectAllowed = 'copyMove';
    
    // 1. Dùng ảnh trong suốt làm Ghost mặc định của hệ thống
    // Điều này sẽ xóa bỏ mọi bóng mờ (box-shadow) mặc định do OS sinh ra
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    
    // 2. Kích hoạt custom drag layer
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggingTask(task);
    setDragPos({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: offsetX, y: offsetY });
    
    // 3. Làm mờ task gốc bên trong danh sách
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.classList.add(styles.isDraggingSource);
    }, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    // Khi thả chuột, sự kiện cuối cùng thường bắn ra tọa độ 0, 0 nên bỏ qua
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingTask(null);
    const target = e.currentTarget as HTMLElement;
    target.classList.remove(styles.isDraggingSource);
  };

  // ─── Thêm task mới từ form nhanh ─────────────────────────
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const points =
      newCategory === 'small' ? 5 : newCategory === 'short_term' ? 20 : 50;
    onAddTask(newTitle.trim(), newCategory, points, false);
    setNewTitle('');
    playPop();
  };

  // ─── Map category → label hiển thị và Badge variant ──────
  const categoryConfig: Record<
    TaskCategory,
    { label: string; variant: 'warning' | 'primary' | 'success' }
  > = {
    small: { label: 'Lặt vặt', variant: 'success' },
    short_term: { label: 'Ngắn hạn', variant: 'warning' },
    long_term: { label: 'Dài hạn', variant: 'primary' },
  };

  // ─── Các filter pill ──────────────────────────────────────
  const filterOptions: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'Tất cả', count: tasks.length },
    {
      key: 'short_term',
      label: 'Ngắn hạn',
      count: tasks.filter((t) => t.category === 'short_term').length,
    },
    {
      key: 'small',
      label: 'Lặt vặt',
      count: tasks.filter((t) => t.category === 'small').length,
    },
    {
      key: 'long_term',
      label: 'Dài hạn',
      count: tasks.filter((t) => t.category === 'long_term').length,
    },
  ];

  return (
    <aside
      className={clsx(styles.panel, isOpen && styles['panel--open'])}
      aria-hidden={!isOpen}
    >
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Icon name="inventory_2" size="md" filled className={styles.headerIcon} />
          <span>Kho Task</span>
          <Badge variant="default" size="sm">{tasks.length}</Badge>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Đóng kho task"
        >
          <Icon name="close" size="md" className={styles.closeIcon} />
        </button>
      </div>



      {/* ─── Thanh tìm kiếm ──────────────────────────────────── */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <Icon name="search" size="md" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.searchClear}
              onClick={() => setSearchQuery('')}
              aria-label="Xoá tìm kiếm"
            >
              <Icon name="close" size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Filter pills ─────────────────────────────────────── */}
      <div className={styles.filters}>
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            className={clsx(
              styles.filterPill,
              filter === opt.key && styles['filterPill--active']
            )}
            onClick={() => setFilter(opt.key)}
          >
            {opt.label}
            <span className={styles.filterCount}>{opt.count}</span>
          </button>
        ))}
      </div>

      {/* ─── Danh sách task (scrollable) ─────────────────────── */}
      <div className={styles.taskList}>

        {/* Nhóm: Task ghim (Pinned) */}
        {pinnedTasks.length > 0 && (
          <div className={styles.taskGroup}>
            <div className={clsx(styles.sectionLabel, styles['sectionLabel--pinned'])}>
              <Icon name="push_pin" size="sm" filled />
              <span>Đang ghim</span>
              <span className={styles.sectionCount}>{pinnedTasks.length}</span>
            </div>
            {pinnedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <div
                  className={clsx(styles.taskWrapper, styles['taskWrapper--pinned'])}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  onClick={() => onSelectTask?.(task)}
                >
                  <div className={styles.dragHandle}>
                    <Icon name="drag_indicator" size="sm" className={styles.dragIcon} />
                  </div>
                  
                  <div className={styles.taskItemWrap}>
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      status={task.dayRelations[todayStr]?.status || 'todo'}
                      onStatusChange={(newStatus) => handleUpdateTaskStatus(task.id, todayStr, newStatus)}
                      taskType={task.category === 'small' ? 'quick' : task.category === 'short_term' ? 'short_term' : 'long_term'}
                      points={task.points}
                      notes={task.description}
                      deadline={task.deadline}
                      reward={task.rewardId}
                      className={styles.poolTaskItem}
                      disabled={false}
                      variant="pool"
                    />
                  </div>
                </div>
                <div className={styles.taskDivider} />
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Nhóm: Task thường */}
        <div className={styles.taskGroup}>
          {pinnedTasks.length > 0 && (
            <div className={styles.sectionLabel}>
              <Icon name="list_alt" size="sm" filled />
              <span>Task pool</span>
              <span className={styles.sectionCount}>{regularTasks.length}</span>
            </div>
          )}

          {regularTasks.length === 0 && pinnedTasks.length === 0 ? (
            /* Empty state khi không có task nào */
            <div className={styles.emptyState}>
              <Icon name="inventory_2" size="xl" className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>Kho trống</p>
              <p className={styles.emptyDesc}>
                {searchQuery
                  ? 'Không tìm thấy task phù hợp.'
                  : 'Thêm task mới bên dưới để bắt đầu.'}
              </p>
            </div>
          ) : regularTasks.length === 0 ? (
            /* Empty state chỉ khi nhóm regular trống */
            null
          ) : (
            regularTasks.map((task) => (
              <React.Fragment key={task.id}>
                <div
                  className={styles.taskWrapper}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  onClick={() => onSelectTask?.(task)}
                >
                  <div className={styles.dragHandle}>
                    <Icon name="drag_indicator" size="sm" className={styles.dragIcon} />
                  </div>

                  <div className={styles.taskItemWrap}>
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      status={task.dayRelations[todayStr]?.status || 'todo'}
                      onStatusChange={(newStatus) => handleUpdateTaskStatus(task.id, todayStr, newStatus)}
                      taskType={task.category === 'small' ? 'quick' : task.category === 'short_term' ? 'short_term' : 'long_term'}
                      points={task.points}
                      notes={task.description}
                      deadline={task.deadline}
                      reward={task.rewardId}
                      className={styles.poolTaskItem}
                      disabled={false}
                      variant="pool"
                    />
                  </div>
                </div>
                <div className={styles.taskDivider} />
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* ─── Form thêm task nhanh (footer) ───────────────────── */}
      <div className={styles.addFormWrapper}>
        <form onSubmit={handleAddSubmit} className={styles.addForm}>
          <input
            type="text"
            className={styles.addInput}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Thêm task mới..."
          />

          {/* Select loại task */}
          <select
            className={styles.addSelect}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
            aria-label="Loại task"
          >
            <option value="short_term">Ngắn hạn</option>
            <option value="small">Lặt vặt</option>
            <option value="long_term">Dài hạn</option>
          </select>

          {/* Nút submit */}
          <Button
            color="blue"
            variant="primary"
            size="sm"
            icon="add"
            iconOnly
            type="submit"
            disabled={!newTitle.trim()}
            aria-label="Thêm task"
          />
        </form>
      </div>

      {/* ─── Custom Drag Layer ────────────────────────────────── */}
      {draggingTask && document.body && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            transform: `translate(${dragPos.x - dragOffset.x}px, ${dragPos.y - dragOffset.y}px) rotate(3deg)`,
            transformOrigin: `${dragOffset.x}px ${dragOffset.y}px`, // Xoay quanh đúng điểm nắm
            pointerEvents: 'none',
            zIndex: 99999,
            width: '300px', // Chiều rộng cố định cho đẹp
            backgroundColor: 'var(--color-surface, #ffffff)',
            border: '1px solid var(--color-neutral-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'none', // Không đổ bóng như bạn muốn
            display: 'flex',
            alignItems: 'flex-start',
            padding: 0
          }}
        >
          <div className={styles.dragHandle} style={{ paddingTop: '0.875rem' }}>
            <Icon name="drag_indicator" size="sm" className={styles.dragIcon} />
          </div>
          
          <div className={styles.taskItemWrap}>
            <TaskItem
              id={draggingTask.id}
              title={draggingTask.title}
              status={draggingTask.dayRelations[todayStr]?.status || 'todo'}
              taskType={draggingTask.category === 'small' ? 'quick' : draggingTask.category === 'short_term' ? 'short_term' : 'long_term'}
              points={draggingTask.points}
              notes={draggingTask.description}
              deadline={draggingTask.deadline}
              reward={draggingTask.rewardId}
              className={styles.poolTaskItem}
              disabled={false}
              variant="pool"
            />
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
};

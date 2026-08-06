import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./TaskPoolPanel.module.css";
import {
  TaskObject,
  TaskCategory,
  TaskDayStatus,
  TaskRecurring,
  TaskDayConfig,
} from "../../types";
import { useDraggable } from "@dnd-kit/core";
import { Icon } from "../shared/Icon";
import { Button } from "../shared/Button";
import { Tooltip } from "../shared/Tooltip";
import { InputField } from "../shared/Input";
import {
  playPop,
  playTaskDone,
  playTaskUncheck,
  playTaskInProgress,
  playTaskCancelled,
} from "../../utils/sound";
import { useApp } from "../../contexts/AppContext";

// ─── Kiểu filter ─────────────────────────────────────────────
type FilterType = "all" | TaskCategory;

interface TaskPoolPanelProps {
  tasks: TaskObject[];
  isOpen: boolean;
  onClose: () => void;
  // recurring là tham số THỨ 7 (optional) — cần nối dây ở TasksView + handleAddTask
  // để lưu thật; nếu parent chưa dùng thì task vẫn tạo được nhưng recurring = 'none'.
  onAddTask: (
    title: string,
    category: TaskCategory,
    points: number,
    isPinned: boolean,
    deadline?: string,
    rewardId?: string,
    recurring?: TaskRecurring,
  ) => void;
  onTogglePin: (taskId: string) => void;
  onSelectTask?: (task: TaskObject) => void;
}

// ─── Cấu hình từng loại task theo ĐÚNG ảnh thiết kế ──────────
// Quick = VÀNG, Short-term = XANH LÁ, Long-term = ĐỎ
const CATEGORY_META: Record<
  TaskCategory,
  {
    label: string;
    squareCls: string;
    textCls: string;
    pillActiveCls: string;
    pillHoverCls: string;
  }
> = {
  small: {
    label: "Quick",
    squareCls: styles.catQuick,
    textCls: styles.catTextQuick,
    pillActiveCls: styles["pill--quick"],
    pillHoverCls: styles.pillHoverQuick,
  },
  short_term: {
    label: "Short-term",
    squareCls: styles.catShort,
    textCls: styles.catTextShort,
    pillActiveCls: styles["pill--short"],
    pillHoverCls: styles.pillHoverShort,
  },
  long_term: {
    label: "Long-term",
    squareCls: styles.catLong,
    textCls: styles.catTextLong,
    pillActiveCls: styles["pill--long"],
    pillHoverCls: styles.pillHoverLong,
  },
};

// Thứ tự loại trong dropdown thêm task và trong hàng filter
const CATEGORY_ORDER: TaskCategory[] = ["small", "short_term", "long_term"];

function pointsForCategory(cat: TaskCategory): number {
  return cat === "small" ? 5 : cat === "short_term" ? 20 : 50;
}

function formatDuration(min?: number): string | null {
  if (!min || min <= 0) return null;
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${m}m`;
}

function toConfettiType(
  cat: TaskCategory,
): "quick" | "short_term" | "long_term" {
  return cat === "small" ? "quick" : cat;
}

// ─── Hook Long Press (giống TaskItem) ────────────────────────
function useLongPress(callback: () => void, ms = 400) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (pressing) timerRef.current = setTimeout(callback, ms);
    else if (timerRef.current) clearTimeout(timerRef.current);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [callback, ms, pressing]);

  return {
    start: () => setPressing(true),
    stop: () => setPressing(false),
  };
}

// ─── Map trạng thái → icon + màu ô check (giống TaskItem) ────
const CHECKBOX_MAP: Record<TaskDayStatus, { icon: string; cls: string }> = {
  todo: { icon: "", cls: "" },
  done: { icon: "check", cls: styles.boxDone },
  in_progress: { icon: "schedule", cls: styles.boxInProgress },
  cancelled: { icon: "close", cls: styles.boxCancelled },
};

// ═════════════════════════════════════════════════════════════
// Một dòng task trong Task Pool
// ═════════════════════════════════════════════════════════════
export interface PoolTaskRowProps {
  task: TaskObject;
  todayStr: string;
  tagLookup: Map<string, string>;
  onStatusChange: (status: TaskDayStatus) => void;
  onSelect?: () => void;
  isOverlay?: boolean;
}

export const PoolTaskRow: React.FC<PoolTaskRowProps> = ({
  task,
  todayStr,
  tagLookup,
  onStatusChange,
  onSelect,
  isOverlay,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  // Cờ chặn cú click phát sinh ngay sau long-press (nguồn gốc bug mở modal)
  const longPressedRef = useRef(false);

  const status: TaskDayStatus = task.dayRelations[todayStr]?.status || "todo";
  const isDone = status === "done";
  const isCancelled = status === "cancelled";
  const cat = CATEGORY_META[task.category];
  const isRecurring = task.recurring !== "none";
  const isSquareCheckbox =
    task.category === "short_term" ||
    task.category === "long_term" ||
    (task.subItems && task.subItems.length > 0);
  const cb = CHECKBOX_MAP[status];

  const longPress = useLongPress(() => {
    longPressedRef.current = true;
    setShowMenu(true);
  }, 400);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Nuốt cú click sinh ra ngay sau khi long-press mở menu
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    if (showMenu) return;
    if (isDone) {
      playTaskUncheck();
      onStatusChange("todo");
    } else {
      import("../../utils/confetti").then((m) =>
        m.triggerTaskConfetti(toConfettiType(task.category)),
      );
      playTaskDone();
      onStatusChange("done");
    }
  };

  const handlePickStatus = (e: React.MouseEvent, next: TaskDayStatus) => {
    e.stopPropagation();
    setShowMenu(false);
    if (next === status) return;
    if (next === "done") {
      import("../../utils/confetti").then((m) =>
        m.triggerTaskConfetti(toConfettiType(task.category)),
      );
      playTaskDone();
    } else if (next === "todo") playTaskUncheck();
    else if (next === "in_progress") playTaskInProgress();
    else if (next === "cancelled") playTaskCancelled();
    onStatusChange(next);
  };

  // Thời lượng: ưu tiên hôm nay, nếu không lấy ngày đầu tiên có durationMinutes
  const relations = Object.values(task.dayRelations) as TaskDayConfig[];
  const durationMin =
    task.dayRelations[todayStr]?.durationMinutes ??
    relations.find((r) => r.durationMinutes)?.durationMinutes;
  const durationText = formatDuration(durationMin);

  const linkedDays = Object.keys(task.dayRelations).length;

  // Tag: map id → tên
  const tagNames = (task.tagIds || [])
    .map((id) => tagLookup.get(id))
    .filter((n): n is string => !!n);
  const shownTags = tagNames.slice(0, 4);
  const extraTags = tagNames.length - shownTags.length;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-task-${task.id}`,
    data: {
      type: 'Task',
      task: task,
    },
    disabled: isOverlay,
  });

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      className={clsx(
        styles.row,
        isDragging && styles["row--dragging"],
        isOverlay && styles["row--overlay"]
      )}
      onClick={() => {
        if (!showMenu) onSelect?.();
      }}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
    >
      {/* Tay nắm kéo */}
      <div className={styles.dragHandle}>
        <Icon name="drag_indicator" size="sm" className={styles.dragIcon} />
      </div>

      {/* Ô check — hoặc icon repeat nếu là task lặp lại (habit) */}
      {isRecurring ? (
        <Tooltip
          content="Task lặp lại"
          position="right"
        >
          <div className={styles.recurringMark}>
            <Icon name="sync" size="md" filled />
          </div>
        </Tooltip>
      ) : (
        <div
          className={styles.checkboxArea}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={clsx(styles.checkbox, cb.cls, isSquareCheckbox && styles.checkboxSquare)}
            onClick={handleToggle}
            onMouseDown={(e) => {
              e.stopPropagation();
              longPress.start();
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              longPress.stop();
            }}
            onMouseLeave={() => longPress.stop()}
            onTouchStart={() => longPress.start()}
            onTouchEnd={() => longPress.stop()}
            aria-label="Đổi trạng thái"
          >
            {cb.icon && (
              <Icon
                name={cb.icon}
                size="sm"
                filled
                className={styles.checkIcon}
              />
            )}
          </button>

          {showMenu && (
            <>
              <div
                className={styles.menuBackdrop}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              />
              <div
                className={styles.statusMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={clsx(styles.menuItem, styles.menuDone)}
                  onClick={(e) => handlePickStatus(e, "done")}
                >
                  <Icon name="check_circle" filled size="md" />
                  <span>Hoàn thành</span>
                </button>
                <button
                  className={clsx(styles.menuItem, styles.menuInProgress)}
                  onClick={(e) => handlePickStatus(e, "in_progress")}
                >
                  <Icon name="schedule" filled size="md" />
                  <span>Đang làm</span>
                </button>
                <button
                  className={clsx(styles.menuItem, styles.menuCancelled)}
                  onClick={(e) => handlePickStatus(e, "cancelled")}
                >
                  <Icon name="cancel" filled size="md" />
                  <span>Huỷ bỏ</span>
                </button>
                <div className={styles.menuDivider} />
                <button
                  className={clsx(styles.menuItem, styles.menuTodo)}
                  onClick={(e) => handlePickStatus(e, "todo")}
                >
                  <Icon name="radio_button_unchecked" filled size="md" />
                  <span>Đặt lại</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Nội dung */}
      <div className={styles.body}>
        <div
          className={clsx(
            styles.title,
            (isDone || isCancelled) && styles.titleDone,
          )}
        >
          {/* Ô vuông nhỏ chỉ loại task nằm inline ngay trong title */}
          <Tooltip content={`${cat.label} task`} position="top">
            <span className={clsx(styles.catSquare, cat.squareCls)} />
          </Tooltip>
          {task.title}
        </div>

        {(durationText || task.deadline) && (
          <div className={styles.metaRow}>
            {task.deadline && (
              <span className={styles.metaItem}>
                <Icon name="flag" size="sm" filled className={styles.metaIcon} />
                {task.deadline}
              </span>
            )}
            {durationText && (
              <span className={styles.metaItem}>
                <Icon name="schedule" size="sm" filled className={styles.metaIcon} />
                {durationText}
              </span>
            )}
          </div>
        )}

        {shownTags.length > 0 && (
          <div className={styles.tagRow}>
            {shownTags.map((name, i) => (
              <span key={i} className={styles.tag}>
                #{name}
              </span>
            ))}
            {extraTags > 0 && (
              <span className={styles.tagMore}>+{extraTags}</span>
            )}
          </div>
        )}
      </div>

      {/* Cột phải: điểm + số ngày + ghim */}
      <div className={styles.badges}>
        {task.points !== undefined && (
          <div className={clsx(styles.badge, styles.badgePoints)}>
            <Icon name="stars" size="sm" filled />
            <span>{task.points}</span>
          </div>
        )}
        <Tooltip content={`Đang gắn vào ${linkedDays} ngày`} position="left">
          <div className={clsx(styles.badge, styles.badgeDays)}>
            <Icon name="calendar_today" size="sm" />
            <span>{linkedDays}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// Task Pool Panel
// ═════════════════════════════════════════════════════════════
export const TaskPoolPanel: React.FC<TaskPoolPanelProps> = ({
  tasks,
  isOpen,
  onClose,
  onAddTask,
  onSelectTask,
}) => {
  const { appState, handleUpdateTaskStatus, todayStr } = useApp();

  // ─── State lọc ────────────────────────────────────────────
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recurringOnly, setRecurringOnly] = useState(false);

  // ─── State form thêm task ─────────────────────────────────
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("small");
  const [newRecurring, setNewRecurring] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newTitle]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newTitle.trim()) {
        handleAddSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  // ─── State custom drag layer ──────────────────────────────
  const [draggingTask, setDraggingTask] = useState<TaskObject | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ─── State cuộn hàng filter ───────────────────────────────
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Map id → tên tag (lấy từ AppContext)
  const tagLookup = useMemo(() => {
    const m = new Map<string, string>();
    (appState.tags || []).forEach((t) => m.set(t.id, t.name));
    return m;
  }, [appState.tags]);

  // ─── Lọc task ─────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchCat = filter === "all" || t.category === filter;
      const matchRecurring = !recurringOnly || t.recurring !== "none";
      const tagNames = (t.tagIds || []).map((id) =>
        (tagLookup.get(id) || "").toLowerCase(),
      );
      const matchSearch =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        tagNames.some((n) => n.includes(q));
      return matchCat && matchRecurring && matchSearch;
    });
  }, [tasks, filter, recurringOnly, searchQuery, tagLookup]);

  // Đếm số lượng cho từng filter pill
  const counts = useMemo(() => {
    const c: Record<FilterType, number> = {
      all: tasks.length,
      small: 0,
      short_term: 0,
      long_term: 0,
    };
    tasks.forEach((t) => {
      c[t.category] += 1;
    });
    return c;
  }, [tasks]);

  // ─── Custom drag layer ────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, task: TaskObject) => {
    e.dataTransfer.setData("application/memo-task-id", task.id);
    e.dataTransfer.effectAllowed = "copyMove";
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDraggingTask(task);
    setDragPos({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => target.classList.add(styles.isDraggingSource), 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingTask(null);
    (e.currentTarget as HTMLElement).classList.remove(styles.isDraggingSource);
  };

  // ─── Trạng thái cuộn của hàng filter ──────────────────────
  const updateScrollState = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, tasks.length, filter]);

  const scrollFilters = (dir: number) => {
    filterScrollRef.current?.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

  // ─── Thêm task ────────────────────────────────────────────
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(
      newTitle.trim(),
      newCategory,
      pointsForCategory(newCategory),
      false,
      undefined,
      undefined,
      newRecurring ? "daily" : "none",
    );
    setNewTitle("");
    setNewRecurring(false);
    setNewCategory("small");
    playPop();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const isFiltering =
    searchQuery.trim() !== "" || recurringOnly || filter !== "all";

  return (
    <aside
      className={clsx(styles.panel, isOpen && styles["panel--open"])}
      aria-hidden={!isOpen}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Icon name="inventory_2" size="md" filled />
          <span>Task Pool</span>
        </div>
        <Tooltip content="Thu gọn" position="left">
          <button
            className={styles.collapseBtn}
            onClick={onClose}
            aria-label="Thu gọn Task Pool"
          >
            <Icon name="right_panel_open" size="md" />
          </button>
        </Tooltip>
      </div>

      {/* ─── Thanh tìm kiếm + lọc lặp lại ───────────────────── */}
      <div className={styles.searchRow}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <InputField
            leftIcon="search"
            placeholder="Task name or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rightElement={
              searchQuery ? (
                <button
                  className={styles.searchClear}
                  onClick={() => setSearchQuery("")}
                  aria-label="Xoá tìm kiếm"
                >
                  <Icon name="close" size="sm" />
                </button>
              ) : undefined
            }
          />
        </div>
        <Tooltip content="Chỉ hiện task lặp lại" position="left" delay={800}>
          <button
            className={clsx(
              styles.iconToggle,
              recurringOnly && styles["iconToggle--active"],
            )}
            onClick={() => {
              playPop();
              setRecurringOnly((v) => !v);
            }}
            aria-pressed={recurringOnly}
          >
            <Icon name="autorenew" size="md" />
          </button>
        </Tooltip>
      </div>

      {/* ─── Filter pills (một hàng, cuộn ngang) ────────────── */}
      <div className={styles.filtersWrap}>
        {canScrollLeft && (
          <button
            className={clsx(styles.filterCaret, styles.filterCaretLeft)}
            onClick={() => scrollFilters(-1)}
            aria-label="Cuộn trái"
          >
            <Icon name="chevron_left" size="sm" />
          </button>
        )}
        <div
          className={clsx(
            styles.filterFade,
            styles.filterFadeLeft,
            canScrollLeft && styles["filterFade--on"],
          )}
        />

        <div
          className={styles.filtersScroll}
          ref={filterScrollRef}
          onScroll={updateScrollState}
        >
          <button
            className={clsx(
              styles.pill,
              styles.pillHoverAll,
              filter === "all" && styles["pill--activeAll"],
            )}
            onClick={() => setFilter("all")}
          >
            <span className={styles.pillLabel}>All</span>
            <span className={styles.pillCount}>({counts.all})</span>
          </button>

          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = filter === cat;
            return (
              <button
                key={cat}
                className={clsx(
                  styles.pill,
                  meta.pillHoverCls,
                  active && styles["pill--active"],
                  active && meta.pillActiveCls,
                )}
                onClick={() => setFilter(cat)}
              >
                <span className={clsx(styles.pillSquare, meta.squareCls)} />
                <span className={styles.pillLabel}>{meta.label}</span>
                <span className={styles.pillCount}>({counts[cat]})</span>
              </button>
            );
          })}
        </div>

        <div
          className={clsx(
            styles.filterFade,
            styles.filterFadeRight,
            canScrollRight && styles["filterFade--on"],
          )}
        />
        {canScrollRight && (
          <button
            className={clsx(styles.filterCaret, styles.filterCaretRight)}
            onClick={() => scrollFilters(1)}
            aria-label="Cuộn phải"
          >
            <Icon name="chevron_right" size="sm" />
          </button>
        )}
      </div>

      {/* ─── Danh sách task ─────────────────────────────────── */}
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <Icon name="inventory_2" size="xl" className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Không có task</p>
            <p className={styles.emptyDesc}>
              {isFiltering
                ? "Không tìm thấy task phù hợp."
                : "Thêm task mới bên dưới để bắt đầu."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <PoolTaskRow
              key={task.id}
              task={task}
              todayStr={todayStr}
              tagLookup={tagLookup}
              onStatusChange={(s) =>
                handleUpdateTaskStatus(task.id, todayStr, s)
              }
              onSelect={() => onSelectTask?.(task)}
            />
          ))
        )}
      </div>

      {/* ─── Form thêm task (footer) ────────────────────────── */}
      <div className={styles.addFormWrap}>
        <form className={styles.addForm} onSubmit={handleAddSubmit}>
          <div className={styles.addInputWrap}>
            <textarea
              ref={textareaRef}
              rows={1}
              className={styles.addInput}
              value={newTitle}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Thêm task mới"
            />

            <div className={styles.addToolsRow}>
              <div className={styles.addToolsLeft}>
                {/* Dropdown chọn loại task */}
                <div className={styles.addCatWrap}>
                  <button
                    type="button"
                    className={styles.addCatBtn}
                    onClick={() => setCatMenuOpen((v) => !v)}
                    aria-label="Chọn loại task"
                  >
                    <span
                      className={clsx(
                        styles.addCatSquare,
                        CATEGORY_META[newCategory].squareCls,
                      )}
                    />
                    <Icon
                      name="arrow_drop_down"
                      size="sm"
                      className={clsx(
                        styles.addCatCaret,
                        catMenuOpen && styles.addCatCaretOpen,
                      )}
                    />
                  </button>

                  {catMenuOpen && (
                    <>
                      <div
                        className={styles.menuBackdrop}
                        onClick={() => setCatMenuOpen(false)}
                      />
                      <div className={styles.addCatMenu}>
                        {CATEGORY_ORDER.map((cat) => {
                          const meta = CATEGORY_META[cat];
                          const active = newCategory === cat;
                          return (
                            <button
                              type="button"
                              key={cat}
                              className={clsx(
                                styles.addCatOption,
                                active && styles["addCatOption--active"],
                              )}
                              onClick={() => {
                                setNewCategory(cat);
                                setCatMenuOpen(false);
                              }}
                            >
                              <span
                                className={clsx(styles.addCatSquare, meta.squareCls)}
                              />
                              <span
                                className={clsx(styles.addCatLabel, active && styles.addCatLabelActive)}
                              >
                                {meta.label}
                              </span>
                              {active && (
                                <Icon
                                  name="check"
                                  size="sm"
                                  className={styles.addCatCheck}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.addToolsRight}>
                {/* Nút repeat */}
                <Tooltip content="Task lặp lại" position="top">
                  <button
                    type="button"
                    className={clsx(
                      styles.addRepeatBtn,
                      newRecurring && styles["addRepeatBtn--active"],
                    )}
                    onClick={() => setNewRecurring((v) => !v)}
                    aria-pressed={newRecurring}
                  >
                    <Icon name="autorenew" size="md" />
                  </button>
                </Tooltip>

                <Button
                  color="blue"
                  variant="primary"
                  size="sm"
                  icon="arrow_upward"
                  iconOnly
                  type="submit"
                  disabled={!newTitle.trim()}
                  aria-label="Thêm task"
                  className={styles.addSubmitBtn}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Custom Drag Layer ──────────────────────────────── */}
      {draggingTask &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.dragLayer}
            style={{
              transform: `translate(${dragPos.x - dragOffset.x}px, ${dragPos.y - dragOffset.y
                }px) rotate(2deg)`,
              transformOrigin: `${dragOffset.x}px ${dragOffset.y}px`,
            }}
          >
            <div className={styles.dragHandle}>
              <Icon
                name="drag_indicator"
                size="sm"
                className={styles.dragIcon}
              />
            </div>
            <span
              className={clsx(
                styles.catSquare,
                CATEGORY_META[draggingTask.category].squareCls,
              )}
            />
            <span className={styles.dragTitle}>{draggingTask.title}</span>
          </div>,
          document.body,
        )}
    </aside>
  );
};

import React, { useState } from 'react';
import {
  EventObject,
  TaskObject,
  QuickNoteObject,
  NoteObject,
  BoxObject,
  TagObject,
  TaskDayStatus,
  DailyNoteObject,
} from '../types';
import { formatTimeOnly } from '../utils/helpers';
import { playTaskDone, playTaskUncheck, playPop, playDeleteSound } from '../utils/sound';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  FileText,
  Plus,
  Zap,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CalendarDays,
} from 'lucide-react';

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [showEventInput, setShowEventInput] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('09:00 AM');

  const [quickNoteText, setQuickNoteText] = useState('');
  const [inlineTaskText, setInlineTaskText] = useState('');

  // Default Today to expanded, other days to collapsed
  const [isCollapsed, setIsCollapsed] = useState(!isToday);

  // Parse Date parts
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Mon
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }); // e.g. Aug
  const dayNum = dateObj.getDate(); // e.g. 3

  // Filter objects for this date
  const dayTasks = tasks.filter((t) => t.dayRelations[dateStr] !== undefined);
  const dayEvents = events.filter((e) => e.dateStr === dateStr);
  const dayQuickNotes = quickNotes.filter((qn) => qn.dayDateStr === dateStr);
  const dayNotes = notes.filter((n) => n.dayDateStr === dateStr);

  const doneTasksCount = dayTasks.filter((t) => t.dayRelations[dateStr]?.status === 'done').length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('application/omnilife-task-id');
    if (taskId) {
      onAddTaskToDay(taskId, dateStr);
    }
  };

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
      id={`day-card-${dateStr}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-3xl transition-all duration-200 overflow-hidden ${
        isToday
          ? 'bg-white dark:bg-[#18181b] border-2 border-[#4285F4] shadow-lg ring-4 ring-blue-100 dark:ring-blue-950/40'
          : 'bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300'
      } ${isDragOver ? 'ring-4 ring-blue-300 bg-blue-50/20' : ''}`}
    >
      {/* Day Card Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-4">
          {/* Apple Calendar Badge */}
          <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs flex flex-col overflow-hidden text-center shrink-0">
            <div className="bg-[#EA4335] text-white py-0.5 font-extrabold text-[10px] uppercase tracking-wider">
              {dayName}
            </div>
            <div className="flex-1 flex items-center justify-center font-black text-2xl text-slate-900 dark:text-slate-100 leading-none">
              {dayNum}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {monthName} {dayNum}, {dateObj.getFullYear()}
              </h3>
              {isToday && (
                <span className="px-3 py-0.5 rounded-full bg-[#4285F4] text-white text-[10px] font-extrabold shadow-2xs">
                  TODAY
                </span>
              )}
            </div>

            {/* Quick Stat Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                <CheckSquare className="w-3 h-3 text-amber-500" />
                <span>Tasks: {doneTasksCount}/{dayTasks.length}</span>
              </span>

              {dayEvents.length > 0 && (
                <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  <CalendarIcon className="w-3 h-3 text-[#4285F4]" />
                  <span>Events: {dayEvents.length}</span>
                </span>
              )}

              {(dayNotes.length > 0 || dayQuickNotes.length > 0) && (
                <span className="flex items-center gap-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-2.5 py-0.5 rounded-full border border-green-200/60">
                  <FileText className="w-3 h-3 text-[#34A853]" />
                  <span>Notes: {dayNotes.length + dayQuickNotes.length}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand / Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all"
        >
          <span>{isCollapsed ? 'Show Details' : 'Collapse'}</span>
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content View */}
      {!isCollapsed && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* 1. EVENTS SECTION */}
          {(dayEvents.length > 0 || showEventInput) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#4285F4]">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Scheduled Events ({dayEvents.length})</span>
                </span>
                <button
                  onClick={() => setShowEventInput(!showEventInput)}
                  className="text-xs font-extrabold text-[#4285F4] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
              </div>

              {showEventInput && (
                <form onSubmit={handleEventSubmit} className="flex gap-2 p-2.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title..."
                    className="flex-1 px-3 py-1.5 bg-white rounded-xl text-xs font-bold border border-slate-200 outline-none"
                  />
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-28 px-2.5 py-1.5 bg-white rounded-xl text-xs font-mono font-bold border border-slate-200 outline-none"
                  />
                  <button type="submit" className="px-4 py-1.5 bg-[#4285F4] text-white rounded-xl text-xs font-extrabold">
                    Add
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectObject?.(evt)}
                    className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs font-bold cursor-pointer hover:border-blue-300 transition-all"
                  >
                    <span className="text-blue-950 dark:text-blue-100 truncate">{evt.title}</span>
                    <span className="font-mono text-[11px] text-[#4285F4] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-blue-100">
                      {evt.timeStr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. TASKS SECTION (WITH DURATION & DEADLINE DISPLAY) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#FBBC05]">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>Day Tasks ({dayTasks.length})</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Drag from pool or add below
              </span>
            </div>

            {dayTasks.length === 0 ? (
              <div className="py-3 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs italic text-center bg-slate-50/50 dark:bg-slate-900/20">
                No tasks scheduled for this day yet.
              </div>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((t) => {
                  const dayConfig = t.dayRelations[dateStr] || { status: 'todo' };
                  const isDone = dayConfig.status === 'done';

                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                        isDone
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 text-slate-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox + Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleTaskCheckboxClick(t)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            isDone
                              ? 'bg-[#34A853] text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-[#34A853]'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div
                          onClick={() => onSelectObject?.(t)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <span className={`font-bold ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {t.title}
                          </span>

                          {/* Sub-Items indicator */}
                          {t.subItems && t.subItems.length > 0 && (
                            <span className="ml-2 text-[10px] text-slate-400 font-mono font-bold">
                              ({t.subItems.filter((s) => s.isDone).length}/{t.subItems.length})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Optional Task Badges: Deadline & Duration */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Optional Deadline Badge */}
                        {t.deadline && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-lg border border-red-200/60 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3 text-red-500" />
                            <span>Due {t.deadline}</span>
                          </span>
                        )}

                        {/* Optional Duration Badge */}
                        {dayConfig.durationMinutes ? (
                          <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{dayConfig.durationMinutes}m</span>
                          </span>
                        ) : null}

                        {/* Points badge */}
                        <span className="text-[10px] font-extrabold text-[#FBBC05] bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                          +{t.points} PTS
                        </span>

                        {/* Remove from day button */}
                        <button
                          onClick={() => {
                            playDeleteSound();
                            onRemoveTaskFromDay(t.id, dateStr);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#EA4335] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Remove task from this day"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Task Add */}
            <form onSubmit={handleInlineTaskSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={inlineTaskText}
                onChange={(e) => setInlineTaskText(e.target.value)}
                placeholder="+ Add task to this day..."
                className="flex-1 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#4285F4] focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#4285F4] hover:bg-blue-600 text-white font-extrabold rounded-2xl text-xs shadow-xs"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* 3. NOTES & LOG SECTION */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#34A853]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Day Notes & Log ({dayNotes.length + dayQuickNotes.length})</span>
              </span>
            </div>

            {/* Quick Note Input */}
            <form onSubmit={handleQuickNoteSubmit} className="flex gap-2">
              <input
                type="text"
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Log a thought or quick note..."
                className="flex-1 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#34A853] focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#34A853] hover:bg-green-600 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>Log Note</span>
              </button>
            </form>

            {/* Quick Notes Items */}
            {dayQuickNotes.length > 0 && (
              <div className="space-y-1.5">
                {dayQuickNotes.map((qn) => (
                  <div
                    key={qn.id}
                    onClick={() => onSelectObject?.(qn)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer hover:border-slate-300"
                  >
                    <span className="text-slate-800 dark:text-slate-200 truncate">{qn.content}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatTimeOnly(qn.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Notes */}
            {dayNotes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dayNotes.map((n) => {
                  const box = boxes.find((b) => b.id === n.boxId);
                  return (
                    <div
                      key={n.id}
                      onClick={() => onSelectObject?.(n)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between gap-2 cursor-pointer hover:border-[#34A853] transition-all shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-extrabold text-[#34A853]">{box?.name || 'Note'}</span>
                          <span className="font-mono">{formatTimeOnly(n.createdAt)}</span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                          {n.title}
                        </h4>
                        {n.content && (
                          <p className="text-[11px] font-medium text-slate-500 line-clamp-2 mt-0.5">
                            {n.content}
                          </p>
                        )}
                      </div>
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

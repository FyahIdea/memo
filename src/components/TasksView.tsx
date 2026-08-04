import React, { useState } from 'react';
import { TaskObject, TaskCategory, RewardObject } from '../types';
import { CheckSquare, Pin, Star, Plus, Gift, AlertCircle, GripVertical, Check, RefreshCw } from 'lucide-react';

interface TasksViewProps {
  tasks: TaskObject[];
  rewards: RewardObject[];
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean, deadline?: string, rewardId?: string) => void;
  onTogglePin: (taskId: string) => void;
  onLinkReward: (taskId: string, rewardId: string | undefined) => void;
  onSelectTask: (task: TaskObject) => void;
  onOpenSidebarPanel: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  rewards,
  onAddTask,
  onTogglePin,
  onLinkReward,
  onSelectTask,
  onOpenSidebarPanel,
}) => {
  const [activeCategoryModal, setActiveCategoryModal] = useState<TaskCategory | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskRewardId, setTaskRewardId] = useState('');
  const [taskPinned, setTaskPinned] = useState(false);

  const smallTasks = tasks.filter((t) => t.category === 'small');
  const shortTermTasks = tasks.filter((t) => t.category === 'short_term');
  const longTermTasks = tasks.filter((t) => t.category === 'long_term');

  const pinnedShortTermCount = shortTermTasks.filter((t) => t.isPinned).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeCategoryModal) return;

    const points = activeCategoryModal === 'small' ? 5 : activeCategoryModal === 'short_term' ? 20 : 50;
    onAddTask(
      taskTitle.trim(),
      activeCategoryModal,
      points,
      taskPinned,
      taskDeadline || undefined,
      taskRewardId || undefined
    );

    setTaskTitle('');
    setTaskDeadline('');
    setTaskRewardId('');
    setTaskPinned(false);
    setActiveCategoryModal(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <span>Task Management & Focus Dashboard</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tasks can be linked to multiple days via drag-and-drop. Global status follows the status on the latest linked date.
          </p>
        </div>

        <button
          onClick={onOpenSidebarPanel}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <GripVertical className="w-4 h-4" />
          <span>Open Drag-&-Drop Panel</span>
        </button>
      </div>

      {/* 3 Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* COLUMN 1: SMALL / MISC TASKS */}
        <div className="flex flex-col gap-3 bg-stone-100/60 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Small / Misc Tasks
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              +5 pts
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Quick daily to-dos & errands. Simple capture.
          </p>

          <button
            onClick={() => setActiveCategoryModal('small')}
            className="w-full py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Small Task</span>
          </button>

          {/* List */}
          <div className="flex flex-col gap-2 mt-1">
            {smallTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-stone-800 dark:text-stone-100">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold shrink-0">
                    +5 pts
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Linked days: {Object.keys(t.dayRelations).length}</span>
                  {t.recurring !== 'none' && (
                    <span className="flex items-center gap-1 text-indigo-500">
                      <RefreshCw className="w-3 h-3" />
                      {t.recurring}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: SHORT-TERM FOCUS TASKS */}
        <div className="flex flex-col gap-3 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Short-Term Focus
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300">
              <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                Pinned ({pinnedShortTermCount}/5 max)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500">
            High priority focus items. Tied to rewards & 15-25 pts.
          </p>

          <button
            onClick={() => setActiveCategoryModal('short_term')}
            className="w-full py-2 rounded-xl bg-white dark:bg-stone-800 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add Short-Term Task</span>
          </button>

          {/* List */}
          <div className="flex flex-col gap-2 mt-1">
            {shortTermTasks.map((t) => {
              const linkedReward = rewards.find((r) => r.id === t.rewardId);

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className={`p-3 rounded-xl bg-white dark:bg-stone-800 border shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-2 ${
                    t.isPinned
                      ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-300/50'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {t.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(t.id);
                      }}
                      className="p-1 text-stone-400 hover:text-amber-500"
                      title={t.isPinned ? 'Unpin Task' : 'Pin to Focus'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${t.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {linkedReward && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded border border-pink-200 dark:border-pink-900">
                      <Gift className="w-3 h-3 text-pink-500" />
                      <span>Reward: {linkedReward.title}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                    <span className="font-mono text-indigo-600 font-semibold">+{t.points} pts</span>
                    {t.deadline && <span>Due {t.deadline}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: LONG-TERM TASKS */}
        <div className="flex flex-col gap-3 bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200/80 dark:border-purple-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                Long-Term Vision
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300">
              +50 pts
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Future goals & multi-step projects. Major milestones.
          </p>

          <button
            onClick={() => setActiveCategoryModal('long_term')}
            className="w-full py-2 rounded-xl bg-white dark:bg-stone-800 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-purple-600" />
            <span>Add Long-Term Task</span>
          </button>

          {/* List */}
          <div className="flex flex-col gap-2 mt-1">
            {longTermTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-mono text-purple-600 font-semibold shrink-0">
                    +50 pts
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Linked days: {Object.keys(t.dayRelations).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Category Modal */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Add New {activeCategoryModal === 'small' ? 'Small Task' : activeCategoryModal === 'short_term' ? 'Short-Term Task' : 'Long-Term Task'}
            </h3>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100"
              />

              {activeCategoryModal === 'short_term' && (
                <>
                  <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={taskPinned}
                      onChange={(e) => setTaskPinned(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Pin to focus list (Max 5 focus items)</span>
                  </label>

                  <div>
                    <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 block">
                      Optional Linked Reward:
                    </label>
                    <select
                      value={taskRewardId}
                      onChange={(e) => setTaskRewardId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <option value="">No linked reward</option>
                      {rewards.map((r) => (
                        <option key={r.id} value={r.id}>
                          🎁 {r.title} ({r.pointCost} pts)
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>Optional Deadline:</span>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveCategoryModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

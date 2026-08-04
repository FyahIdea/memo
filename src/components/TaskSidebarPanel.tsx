import React, { useState } from 'react';
import { TaskObject, TaskCategory } from '../types';
import { playPop } from '../utils/sound';
import { CheckSquare, Pin, Plus, GripVertical, X } from 'lucide-react';

interface TaskSidebarPanelProps {
  tasks: TaskObject[];
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean) => void;
  onTogglePin: (taskId: string) => void;
  onSelectTask?: (task: TaskObject) => void;
}

export const TaskSidebarPanel: React.FC<TaskSidebarPanelProps> = ({
  tasks,
  isOpen,
  onClose,
  onAddTask,
  onTogglePin,
  onSelectTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('short_term');
  const [filterCategory, setFilterCategory] = useState<'all' | TaskCategory>('all');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const points = newCategory === 'small' ? 5 : newCategory === 'short_term' ? 20 : 50;
    onAddTask(newTitle.trim(), newCategory, points, false);
    setNewTitle('');
    playPop();
  };

  const filteredTasks = tasks.filter((t) => filterCategory === 'all' || t.category === filterCategory);

  const pinnedTasks = filteredTasks.filter((t) => t.isPinned);
  const unpinnedTasks = filteredTasks.filter((t) => !t.isPinned);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('application/omnilife-task-id', taskId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <aside className="fixed right-0 top-0 bottom-0 z-30 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#4285F4]" />
          <span className="font-bold text-base text-slate-900 dark:text-slate-100">
            Task Sidebar Pool
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 font-medium">
        💡 Drag & drop tasks onto any day card in the timeline!
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            filterCategory === 'all'
              ? 'bg-[#4285F4] text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilterCategory('short_term')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            filterCategory === 'short_term'
              ? 'bg-[#4285F4] text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Short
        </button>
        <button
          onClick={() => setFilterCategory('small')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            filterCategory === 'small'
              ? 'bg-[#4285F4] text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Small
        </button>
        <button
          onClick={() => setFilterCategory('long_term')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            filterCategory === 'long_term'
              ? 'bg-[#4285F4] text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Long
        </button>
      </div>

      {/* Fast Task Input */}
      <form onSubmit={handleAddSubmit} className="p-3 border-b border-slate-100 dark:border-slate-800 flex gap-2 bg-slate-50 dark:bg-slate-900">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Quick add task..."
          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#4285F4]"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
          className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
        >
          <option value="short_term">Short</option>
          <option value="small">Small</option>
          <option value="long_term">Long</option>
        </select>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-[#4285F4] text-white text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Pinned Tasks */}
        {pinnedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-2">
              <Pin className="w-3.5 h-3.5 fill-amber-500" />
              <span>Pinned Focus Tasks ({pinnedTasks.length})</span>
            </div>
            <div className="space-y-2">
              {pinnedTasks.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  onClick={() => onSelectTask?.(t)}
                  className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-2xs hover:border-[#4285F4] transition-all cursor-grab active:cursor-grabbing flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          +{t.points} PTS
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(t.id);
                    }}
                    className="p-1 rounded text-amber-500 hover:text-slate-400"
                  >
                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Tasks */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 mb-3">
            Task Pool ({unpinnedTasks.length})
          </h4>
          <div className="space-y-2">
            {unpinnedTasks.map((t) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) => handleDragStart(e, t.id)}
                onClick={() => onSelectTask?.(t)}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between group cursor-grab active:cursor-grabbing hover:border-[#4285F4] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t.category === 'small' ? 'Small' : t.category === 'short_term' ? 'Short' : 'Long'}
                      </span>
                      <span className="text-[10px] font-bold text-[#FBBC05] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        +{t.points} PTS
                      </span>
                    </div>
                  </div>
                </div>

                {t.category === 'short_term' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(t.id);
                    }}
                    className="p-1 rounded text-slate-300 hover:text-amber-500"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { X, Zap, FileText, CheckSquare, Calendar, Tag as TagIcon, Box as BoxIcon } from 'lucide-react';
import { BoxObject, TagObject, TaskCategory } from '../types';
import { getTodayStr } from '../data/initialData';
import { playPop } from '../utils/sound';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxes: BoxObject[];
  tags: TagObject[];
  onAddQuickNote: (content: string, dateStr: string) => void;
  onAddNote: (title: string, content: string, boxId: string, tagIds: string[], dateStr?: string) => void;
  onAddTask: (title: string, category: TaskCategory, points: number, isPinned: boolean, deadline?: string, dateStr?: string) => void;
  onAddEvent: (title: string, timeStr: string, dateStr: string) => void;
  targetDateStr?: string;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  boxes,
  tags,
  onAddQuickNote,
  onAddNote,
  onAddTask,
  onAddEvent,
  targetDateStr,
}) => {
  const [activeType, setActiveType] = useState<'quick_note' | 'note' | 'task' | 'event'>('quick_note');

  // Form states
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState(boxes[0]?.id || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('short_term');
  const [isPinned, setIsPinned] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [captureDate, setCaptureDate] = useState(targetDateStr || getTodayStr());

  if (!isOpen) return null;

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === 'quick_note') {
      if (!content.trim()) return;
      onAddQuickNote(content.trim(), captureDate);
    } else if (activeType === 'note') {
      if (!title.trim() && !content.trim()) return;
      onAddNote(
        title.trim() || 'Untitled Note',
        content.trim(),
        selectedBoxId || boxes[0]?.id || '',
        selectedTagIds,
        captureDate
      );
    } else if (activeType === 'task') {
      if (!title.trim()) return;
      const points = taskCategory === 'small' ? 5 : taskCategory === 'short_term' ? 20 : 50;
      onAddTask(title.trim(), taskCategory, points, isPinned, deadline || undefined, captureDate);
    } else if (activeType === 'event') {
      if (!title.trim()) return;
      onAddEvent(title.trim(), eventTime || '12:00 PM', captureDate);
    }

    playPop();
    setContent('');
    setTitle('');
    setSelectedTagIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
              Quick Capture
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {captureDate}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Object Type Picker */}
        <div className="grid grid-cols-4 gap-1.5 p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveType('quick_note')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeType === 'quick_note'
                ? 'bg-[#34A853] text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Jot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('note')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeType === 'note'
                ? 'bg-[#34A853] text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('task')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeType === 'task'
                ? 'bg-[#4285F4] text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('event')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeType === 'event'
                ? 'bg-[#EA4335] text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col gap-4">
          {/* Target Date Selector */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-bold">Target Date:</span>
            <input
              type="date"
              value={captureDate}
              onChange={(e) => setCaptureDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl text-slate-800 dark:text-slate-200 text-xs border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          {/* Quick Note Form */}
          {activeType === 'quick_note' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">
                Daily Log Note:
              </label>
              <textarea
                autoFocus
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Log a quick thought or observation..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#34A853] resize-none"
              />
            </div>
          )}

          {/* Structured Note Form */}
          {activeType === 'note' && (
            <div className="flex flex-col gap-3">
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#34A853]"
              />
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed thought or description..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none resize-none focus:border-[#34A853]"
              />

              {/* Box Context Single-Select */}
              <div>
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
                  <BoxIcon className="w-3.5 h-3.5" />
                  <span>Select Box:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {boxes.map((box) => (
                    <button
                      key={box.id}
                      type="button"
                      onClick={() => setSelectedBoxId(box.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedBoxId === box.id
                          ? 'bg-[#34A853] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {box.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Multi-Select */}
              <div>
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>Tags:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#4285F4] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Task Form */}
          {activeType === 'task' && (
            <div className="flex flex-col gap-3">
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#4285F4]"
              />

              {/* Task Category Picker */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">
                  Category & Points:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskCategory('small')}
                    className={`p-2.5 rounded-2xl text-left border text-xs transition-all ${
                      taskCategory === 'small'
                        ? 'bg-blue-50/60 border-[#4285F4] text-[#4285F4] font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Small Task</div>
                    <div className="text-[10px] text-amber-500 font-bold mt-0.5">+5 PTS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskCategory('short_term')}
                    className={`p-2.5 rounded-2xl text-left border text-xs transition-all ${
                      taskCategory === 'short_term'
                        ? 'bg-blue-50/60 border-[#4285F4] text-[#4285F4] font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Short-Term</div>
                    <div className="text-[10px] text-amber-500 font-bold mt-0.5">+20 PTS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskCategory('long_term')}
                    className={`p-2.5 rounded-2xl text-left border text-xs transition-all ${
                      taskCategory === 'long_term'
                        ? 'bg-blue-50/60 border-[#4285F4] text-[#4285F4] font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Long-Term</div>
                    <div className="text-[10px] text-amber-500 font-bold mt-0.5">+50 PTS</div>
                  </button>
                </div>
              </div>

              {/* Pin check for short-term */}
              {taskCategory === 'short_term' && (
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded text-[#4285F4]"
                  />
                  <span>Pin task to focus pool</span>
                </label>
              )}

              {/* Deadline */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">Optional Deadline:</span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl text-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
            </div>
          )}

          {/* Event Form */}
          {activeType === 'event' && (
            <div className="flex flex-col gap-3">
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title..."
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#EA4335]"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold">Time:</span>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4285F4] hover:bg-blue-600 text-white shadow-xs transition-all"
            >
              Save Object
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { getTypeBadge } from '../utils/helpers';
import { SubItem } from '../types';
import { playPop, playTaskDone, playDeleteSound } from '../utils/sound';
import {
  X,
  Trash2,
  Check,
  Plus,
  Save,
  Clock,
  Calendar,
  List,
} from 'lucide-react';

interface ObjectDetailModalProps {
  object: any | null;
  onClose: () => void;
  onUpdateObject?: (updatedObj: any) => void;
  onDelete?: (obj: any) => void;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({
  object,
  onClose,
  onUpdateObject,
  onDelete,
}) => {
  if (!object) return null;

  const [title, setTitle] = useState(object.title || object.name || object.content || '');
  const [content, setContent] = useState(object.content || object.description || '');
  const [points, setPoints] = useState(object.points ?? 5);
  const [category, setCategory] = useState(object.category || 'small');
  const [deadline, setDeadline] = useState(object.deadline || '');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(object.durationMinutes || 30);
  const [subItems, setSubItems] = useState<SubItem[]>(object.subItems || []);
  const [newSubTitle, setNewSubTitle] = useState('');

  useEffect(() => {
    setTitle(object.title || object.name || object.content || '');
    setContent(object.content || object.description || '');
    setPoints(object.points ?? 5);
    setCategory(object.category || 'small');
    setDeadline(object.deadline || '');
    setDurationMinutes(object.durationMinutes || 30);
    setSubItems(object.subItems || []);
  }, [object]);

  const badge = getTypeBadge(object.type);

  const handleSave = () => {
    if (!onUpdateObject) return;
    const updated = {
      ...object,
      title: title.trim(),
      name: object.type === 'box' || object.type === 'tag' ? title.trim() : object.name,
      content: object.type === 'quick_note' ? title.trim() : content,
      description: content,
      points: Number(points) || 0,
      category,
      deadline: deadline || undefined,
      durationMinutes: Number(durationMinutes) || undefined,
      subItems,
      updatedAt: new Date().toISOString(),
    };
    onUpdateObject(updated);
    playPop();
    onClose();
  };

  const handleAddSubItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTitle.trim()) return;
    const newItem: SubItem = {
      id: `sub-${Date.now()}`,
      title: newSubTitle.trim(),
      isDone: false,
    };
    setSubItems([...subItems, newItem]);
    setNewSubTitle('');
    playPop();
  };

  const handleToggleSubItem = (id: string) => {
    setSubItems(
      subItems.map((s) => {
        if (s.id === id) {
          if (!s.isDone) playTaskDone();
          return { ...s, isDone: !s.isDone };
        }
        return s;
      })
    );
  };

  const handleRemoveSubItem = (id: string) => {
    playDeleteSound();
    setSubItems(subItems.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">
              ID: {object.id.slice(0, 8)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="text-xs font-extrabold text-slate-500 mb-1 block">Title / Label</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-extrabold text-base text-slate-900 dark:text-slate-100 outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Details / Content */}
          <div>
            <label className="text-xs font-extrabold text-slate-500 mb-1 block">Content & Details</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add rich notes or details..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Task Metadata Fields: Points, Category, Optional Duration, Optional Deadline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/80">
            {object.type === 'task' && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">Points</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-amber-500 outline-none"
                />
              </div>
            )}

            {object.category !== undefined && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="small">Small Task</option>
                  <option value="short_term">Short Term</option>
                  <option value="long_term">Long Term</option>
                </select>
              </div>
            )}

            {/* Optional Duration Field */}
            {object.type === 'task' && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Duration (m)</span>
                </label>
                <input
                  type="number"
                  value={durationMinutes || ''}
                  onChange={(e) => setDurationMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="30"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}

            {/* Optional Deadline Date Field */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Deadline</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Sub-Items Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Sub-Items Checklist ({subItems.length})</span>
              </span>
            </div>

            {subItems.length > 0 && (
              <div className="space-y-1.5">
                {subItems.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-xs font-bold"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSubItem(sub.id)}
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          sub.isDone ? 'bg-[#34A853] text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {sub.isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span className={`truncate ${sub.isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubItem(sub.id)}
                      className="p-1 text-slate-400 hover:text-[#EA4335]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddSubItem} className="flex gap-2">
              <input
                type="text"
                value={newSubTitle}
                onChange={(e) => setNewSubTitle(e.target.value)}
                placeholder="+ Add sub-item..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#4285F4]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          {onDelete ? (
            <button
              onClick={() => {
                playDeleteSound();
                onDelete(object);
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-[#EA4335] hover:text-red-700 font-extrabold px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-extrabold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#4285F4] hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

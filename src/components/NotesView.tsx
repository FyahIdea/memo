import React, { useState } from 'react';
import { QuickNoteObject, NoteObject, BoxObject, TagObject } from '../types';
import { formatTimeOnly, getBoxColorClass } from '../utils/helpers';
import { FileText, Zap, Search, Plus, Filter, Tag as TagIcon, Box as BoxIcon, Calendar } from 'lucide-react';

interface NotesViewProps {
  quickNotes: QuickNoteObject[];
  notes: NoteObject[];
  boxes: BoxObject[];
  tags: TagObject[];
  onAddNote: (title: string, content: string, boxId: string, tagIds: string[]) => void;
  onAddQuickNote: (content: string, dateStr: string) => void;
  onSelectObject: (obj: any) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  quickNotes,
  notes,
  boxes,
  tags,
  onAddNote,
  onAddQuickNote,
  onSelectObject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<'all' | 'quick' | 'structured'>('all');

  // New Note Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newBoxId, setNewBoxId] = useState(boxes[0]?.id || '');
  const [newTagIds, setNewTagIds] = useState<string[]>([]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;
    onAddNote(
      newTitle.trim() || 'Untitled Note',
      newContent.trim(),
      newBoxId || boxes[0]?.id || '',
      newTagIds
    );
    setNewTitle('');
    setNewContent('');
    setNewTagIds([]);
    setShowNewModal(false);
  };

  const toggleTagSelection = (id: string) => {
    setNewTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  // Filter Structured Notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBox = selectedBoxFilter === 'all' || n.boxId === selectedBoxFilter;
    const matchesTag = selectedTagFilter === 'all' || n.tagIds.includes(selectedTagFilter);
    return matchesSearch && matchesBox && matchesTag;
  });

  // Filter Quick Notes
  const filteredQuickNotes = quickNotes.filter((qn) => {
    return qn.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Zettelkasten Notes Workspace</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Capture thoughts casually or deliberately. Filter by Box context & topical tags.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Structured Note</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-stone-100/60 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes content or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Kind Filter */}
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-medium"
          >
            <option value="all">All Note Kinds</option>
            <option value="structured">Structured Notes Only</option>
            <option value="quick">Quick Notes Only</option>
          </select>

          {/* Box Filter */}
          <select
            value={selectedBoxFilter}
            onChange={(e) => setSelectedBoxFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-medium"
          >
            <option value="all">All Boxes</option>
            {boxes.map((b) => (
              <option key={b.id} value={b.id}>
                📦 {b.name}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-medium"
          >
            <option value="all">All Tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Structured & Quick Notes */}
      <div className="flex flex-col gap-6">
        {/* Structured Notes Section */}
        {(kindFilter === 'all' || kindFilter === 'structured') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Structured Notes ({filteredNotes.length})
              </h3>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs border border-dashed rounded-2xl">
                No structured notes match your search filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((n) => {
                  const box = boxes.find((b) => b.id === n.boxId);
                  const noteTags = tags.filter((t) => n.tagIds.includes(t.id));

                  return (
                    <div
                      key={n.id}
                      onClick={() => onSelectObject(n)}
                      className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold border ${getBoxColorClass(
                              box
                            )}`}
                          >
                            {box?.name || 'Box'}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">
                            {n.createdAt.split('T')[0]}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                          {n.title}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 mt-1 leading-relaxed">
                          {n.content}
                        </p>
                      </div>

                      {noteTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                          {noteTags.map((t) => (
                            <span
                              key={t.id}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                            >
                              #{t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Notes Section */}
        {(kindFilter === 'all' || kindFilter === 'quick') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Quick Jots & Drafts ({filteredQuickNotes.length})
              </h3>
            </div>

            {filteredQuickNotes.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs border border-dashed rounded-2xl">
                No quick notes match your search filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredQuickNotes.map((qn) => (
                  <div
                    key={qn.id}
                    onClick={() => onSelectObject(qn)}
                    className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                        {qn.content}
                      </p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-stone-400 shrink-0">
                      <div>{qn.dayDateStr}</div>
                      <div>{formatTimeOnly(qn.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Structured Note Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Create Structured Note
            </h3>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />

              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your note content..."
                className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
              />

              {/* Box Selection */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5 block">
                  Select Box (Context Category):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {boxes.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setNewBoxId(b.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        newBoxId === b.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Selection */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5 block">
                  Select Tags:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => {
                    const isSelected = newTagIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTagSelection(t.id)}
                        className={`px-2 py-0.5 rounded text-xs font-mono border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        #{t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

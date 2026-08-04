import React, { useState } from 'react';
import clsx from 'clsx';
import { QuickNoteObject, NoteObject, BoxObject, TagObject } from '../../types';
import { formatTimeOnly } from '../../utils/helpers';
import styles from './NotesView.module.css';
import { Icon } from '../shared/Icon';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { InputField, TextareaField } from '../shared/Input';
import { Badge } from '../shared/Badge';

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

  // Convert old tailwind classes to Badge variants for Boxes
  // We can just use "success" for notes
  const getBoxBadgeVariant = (boxName: string) => {
    return 'success';
  };

  return (
    <div className={styles.container}>
      {/* Top Banner & Control Bar */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>
            <Icon name="description" size="md" className={styles.headerTitleIcon} />
            <span>Zettelkasten Notes Workspace</span>
          </h2>
          <p className={styles.headerDesc}>
            Capture thoughts casually or deliberately. Filter by Box context & topical tags.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowNewModal(true)} style={{ backgroundColor: 'var(--color-success)' }}>
          <Icon name="add" size="sm" />
          <span>New Structured Note</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.filtersBar}>
        {/* Search Input */}
        <div className={styles.searchBox}>
          <Icon name="search" size="sm" className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes content or tags..."
            className={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div className={styles.filterGroup}>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="all">All Note Kinds</option>
            <option value="structured">Structured Notes Only</option>
            <option value="quick">Quick Notes Only</option>
          </select>

          <select
            value={selectedBoxFilter}
            onChange={(e) => setSelectedBoxFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Boxes</option>
            {boxes.map((b) => (
              <option key={b.id} value={b.id}>
                📦 {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className={styles.filterSelect}
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
      <div className={styles.notesSection}>
        {/* Structured Notes Section */}
        {(kindFilter === 'all' || kindFilter === 'structured') && (
          <div>
            <h3 className={clsx(styles.sectionHeader, styles['sectionHeader--structured'])}>
              <Icon name="description" size="sm" />
              <span>Structured Notes ({filteredNotes.length})</span>
            </h3>

            {filteredNotes.length === 0 ? (
              <div className={styles.emptyState}>
                No structured notes match your search filters.
              </div>
            ) : (
              <div className={styles.structuredGrid}>
                {filteredNotes.map((n) => {
                  const box = boxes.find((b) => b.id === n.boxId);
                  const noteTags = tags.filter((t) => n.tagIds.includes(t.id));

                  return (
                    <div
                      key={n.id}
                      onClick={() => onSelectObject(n)}
                      className={styles.noteCard}
                    >
                      <div>
                        <div className={styles.noteCardHeader}>
                          <Badge variant={getBoxBadgeVariant(box?.name || '')} size="sm">
                            {box?.name || 'Box'}
                          </Badge>
                          <span className={styles.noteCardDate}>
                            {n.createdAt.split('T')[0]}
                          </span>
                        </div>
                        <div className={styles.noteCardBody}>
                          <h4 className={styles.noteCardTitle}>{n.title}</h4>
                          <p className={styles.noteCardContent}>{n.content}</p>
                        </div>
                      </div>

                      {noteTags.length > 0 && (
                        <div className={styles.noteCardTags}>
                          {noteTags.map((t) => (
                            <span key={t.id} className={styles.noteCardTag}>
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
            <h3 className={clsx(styles.sectionHeader, styles['sectionHeader--quick'])}>
              <Icon name="bolt" size="sm" />
              <span>Quick Jots & Drafts ({filteredQuickNotes.length})</span>
            </h3>

            {filteredQuickNotes.length === 0 ? (
              <div className={styles.emptyState}>
                No quick notes match your search filters.
              </div>
            ) : (
              <div className={styles.quickGrid}>
                {filteredQuickNotes.map((qn) => (
                  <div
                    key={qn.id}
                    onClick={() => onSelectObject(qn)}
                    className={styles.quickCard}
                  >
                    <div className={styles.quickCardContent}>
                      <Icon name="bolt" size="sm" className={styles.quickCardIcon} />
                      <p>{qn.content}</p>
                    </div>
                    <div className={styles.quickCardMeta}>
                      <span>{qn.dayDateStr}</span>
                      <span>{formatTimeOnly(qn.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Structured Note Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Create Structured Note"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateSubmit} style={{ backgroundColor: 'var(--color-success)' }}>
              Save Note
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className={styles.form}>
          <InputField
            autoFocus
            placeholder="Note Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <TextareaField
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your note content..."
          />

          {/* Box Selection */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Box (Context Category):</label>
            <div className={styles.chipList}>
              {boxes.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setNewBoxId(b.id)}
                  className={clsx(styles.chip, newBoxId === b.id && styles['chip--active'])}
                  style={newBoxId === b.id ? { backgroundColor: 'var(--color-success)', color: 'white' } : {}}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Selection */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Tags:</label>
            <div className={styles.chipList}>
              {tags.map((t) => {
                const isSelected = newTagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTagSelection(t.id)}
                    className={clsx(styles.chip, isSelected && styles['chip--active'])}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { getTypeBadge } from '../../utils/helpers';
import { SubItem } from '../../types';
import { playPop, playTaskDone, playDeleteSound } from '../../utils/sound';
import styles from './ObjectDetailModal.module.css';
import { Modal } from '../../components/shared/Modal';
import { Button } from '../../components/shared/Button';
import { Icon } from '../../components/shared/Icon';
import { InputField, TextareaField } from '../../components/shared/Input';
import { Badge } from '../../components/shared/Badge';

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [points, setPoints] = useState(5);
  const [category, setCategory] = useState('small');
  const [deadline, setDeadline] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(30);
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [newSubTitle, setNewSubTitle] = useState('');

  useEffect(() => {
    if (object) {
      setTitle(object.title || object.name || object.content || '');
      setContent(object.content || object.description || '');
      setPoints(object.points ?? 5);
      setCategory(object.category || 'small');
      setDeadline(object.deadline || '');
      setDurationMinutes(object.durationMinutes || 30);
      setSubItems(object.subItems || []);
    }
  }, [object]);

  if (!object) return null;

  const badgeObj = getTypeBadge(object.type);

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

  // Convert legacy Tailwind colors from getTypeBadge to our Badge variants
  const getBadgeVariant = (color: string) => {
    if (color.includes('amber')) return 'warning';
    if (color.includes('emerald')) return 'success';
    if (color.includes('rose')) return 'danger';
    if (color.includes('purple')) return 'accent';
    if (color.includes('blue')) return 'accent';
    return 'default';
  };

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <Badge variant={getBadgeVariant(badgeObj.color)}>{badgeObj.label}</Badge>
      <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
        ID: {object.id.slice(0, 8)}
      </span>
    </div>
  );

  const modalFooter = (
    <div className={styles.footerInner}>
      {onDelete ? (
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            playDeleteSound();
            onDelete(object);
            onClose();
          }}
        >
          <Icon name="delete" size="sm" />
          <span>Delete</span>
        </Button>
      ) : (
        <div />
      )}
      <div className={styles.footerActions}>
        <Button color="neutral" variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>
          <Icon name="save" size="sm" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={!!object}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
    >
      <div className={styles.form}>
        <InputField
          label="Title / Label"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
        />

        <TextareaField
          label="Content & Details"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add rich notes or details..."
          rows={3}
        />

        {/* Metadata Grid */}
        <div className={styles.metaGrid}>
          {object.type === 'task' && (
            <div className={styles.metaField}>
              <label className={styles.metaLabel}>Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                className={clsx(styles.metaInput, styles['metaInput--points'])}
              />
            </div>
          )}

          {object.category !== undefined && (
            <div className={styles.metaField}>
              <label className={styles.metaLabel}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.metaInput}
              >
                <option value="small">Small Task</option>
                <option value="short_term">Short Term</option>
                <option value="long_term">Long Term</option>
              </select>
            </div>
          )}

          {object.type === 'task' && (
            <div className={styles.metaField}>
              <label className={styles.metaLabel}>
                <Icon name="schedule" size="sm" /> Duration (m)
              </label>
              <input
                type="number"
                value={durationMinutes || ''}
                onChange={(e) => setDurationMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="30"
                className={styles.metaInput}
              />
            </div>
          )}

          <div className={styles.metaField}>
            <label className={styles.metaLabel}>
              <Icon name="event" size="sm" /> Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={clsx(styles.metaInput, styles['metaInput--date'])}
            />
          </div>
        </div>

        {/* Sub-items */}
        <div className={styles.subSection}>
          <div className={styles.subHeader}>
            <Icon name="list" size="sm" style={{ color: 'var(--color-accent)' }} />
            <span>Sub-Items Checklist ({subItems.length})</span>
          </div>

          {subItems.length > 0 && (
            <div className={styles.subList}>
              {subItems.map((sub) => (
                <div key={sub.id} className={styles.subItem}>
                  <div className={styles.subItemLeft}>
                    <button
                      type="button"
                      onClick={() => handleToggleSubItem(sub.id)}
                      className={clsx(styles.subCheckbox, sub.isDone && styles['subCheckbox--done'])}
                    >
                      {sub.isDone && <Icon name="check" size="sm" />}
                    </button>
                    <span className={clsx(styles.subText, sub.isDone && styles['subText--done'])}>
                      {sub.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubItem(sub.id)}
                    className={styles.subDeleteBtn}
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddSubItem} className={styles.addSubForm}>
            <input
              type="text"
              value={newSubTitle}
              onChange={(e) => setNewSubTitle(e.target.value)}
              placeholder="+ Add sub-item..."
              className={styles.addSubInput}
            />
            <Button type="submit" variant="primary" size="sm">
              <Icon name="add" size="sm" /> Add
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

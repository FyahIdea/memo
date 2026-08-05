import React, { useEffect } from 'react';
import clsx from 'clsx';
import styles from './Modal.module.css';
import { Button } from './Button';
import { Icon } from './Icon';

export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  /** Nội dung footer (thường là các nút hành động) */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Modal — base overlay dialog, dùng cho mọi loại popup trong app.
 * Tự đóng khi nhấn Escape.
 *
 * @example
 * <Modal isOpen={open} onClose={onClose} title="Add Task">
 *   <form>...</form>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  size = 'md',
  children,
  footer,
  className,
}) => {
  // Đóng modal khi nhấn Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={clsx(styles.dialog, styles[`dialog--${size}`], className)}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {icon && <Icon name={icon} className={styles.headerIcon} size="lg" />}
            <div className={styles.headerText}>
              {title && <span className={styles.title}>{title}</span>}
              {description && <span className={styles.description}>{description}</span>}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            <Icon name="close" size="md" className={styles.closeIcon} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Footer (tùy chọn) */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

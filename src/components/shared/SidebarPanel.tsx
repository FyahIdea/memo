import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './SidebarPanel.module.css';
import { Icon } from './Icon';

export type SidebarPanelWidth = 'sm' | 'md' | 'lg' | 'xl';

interface SidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: SidebarPanelWidth;
}

/**
 * SidebarPanel — component hiển thị dạng ngăn kéo trượt ra từ bên phải.
 * Thích hợp cho việc xem chi tiết, form nhập liệu hoặc cài đặt mà không rời trang.
 */
export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  className,
  width = 'md',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Xử lý hiệu ứng đóng
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 150); // Nhanh hơn: 150ms
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Đóng panel khi nhấn Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleClose = () => {
    import('../../utils/sound').then(({ playToggleOff }) => playToggleOff());
    onClose();
  };

  if (!isRendered) return null;

  return (
    <div 
      className={clsx(styles.overlay, isClosing && styles.closing)} 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        ref={panelRef}
        className={clsx(styles.panel, styles[`panel--${width}`], className, isClosing && styles.closing)}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleRow}>
              {icon && <Icon name={icon} className={styles.headerIcon} size="md" />}
              {title && <span className={styles.title}>{title}</span>}
            </div>
            {description && <span className={styles.description}>{description}</span>}
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Đóng panel">
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

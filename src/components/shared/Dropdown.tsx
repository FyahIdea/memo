import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.css';
import { Icon } from './Icon';
import { playPop, playButtonClick } from '../../utils/sound';

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface DropdownProps {
  /** Custom trigger nếu không muốn dùng giao diện mặc định */
  trigger?: React.ReactNode;
  /** Text hiển thị cho trigger mặc định */
  label?: string;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  /** Nút hiển thị có thể chiếm 100% width không */
  fullWidth?: boolean;
}

/**
 * Dropdown — hiển thị một danh sách các lựa chọn khi bấm vào trigger.
 * Sử dụng cho các menu hành động (actions) hoặc lựa chọn không quá phức tạp.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  label = 'Select option',
  items,
  align = 'left',
  className,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        playPop();
      }
      return nextState;
    });
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    // Đóng dropdown khi nhấn Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    playButtonClick();
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div 
      className={clsx(styles.container, fullWidth && styles['container--fullWidth'], className)} 
      ref={containerRef}
    >
      <div 
        className={clsx(styles.triggerWrapper, !trigger && styles.defaultTrigger)} 
        onClick={toggleDropdown}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger ? trigger : (
          <>
            <span className={styles.triggerLabel}>{label}</span>
            <Icon 
              name="expand_more" 
              className={clsx(styles.caret, isOpen && styles['caret--open'])} 
            />
          </>
        )}
      </div>

      {isOpen && (
        <div className={clsx(styles.menu, styles[`menu--align-${align}`])}>
          {items.map((item) => (
            <button
              key={item.id}
              className={clsx(
                styles.item, 
                item.danger && styles['item--danger'],
                item.disabled && styles['item--disabled']
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              type="button"
            >
              {item.icon && (
                <Icon 
                  name={item.icon} 
                  size="sm" 
                  className={styles.itemIcon} 
                />
              )}
              <span className={styles.itemLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

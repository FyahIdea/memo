import React from 'react';
import clsx from 'clsx';
import styles from './SegmentedControl.module.css';
import { Icon } from './Icon';
import { playSoftClick } from '../../utils/sound';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * SegmentedControl — cho phép người dùng chọn giữa một vài lựa chọn.
 * Giao diện theo phong cách iOS (viên thuốc/pill shape).
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
  size = 'md',
  fullWidth = false,
}) => {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div 
      className={clsx(
        styles.root, 
        styles[`root--${size}`], 
        fullWidth && styles['root--fullWidth'],
        className
      )}
      style={{
        '--count': options.length,
        '--active-index': activeIndex >= 0 ? activeIndex : 0,
      } as React.CSSProperties}
      role="radiogroup"
    >
      <div className={styles.activeBg} />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={clsx(styles.option, isActive && styles['option--active'])}
            onClick={() => {
              if (!isActive) {
                playSoftClick();
                onChange(option.value);
              }
            }}
          >
            {option.icon && (
              <Icon 
                name={option.icon} 
                size={size === 'lg' ? 'md' : 'sm'} 
                className={styles.icon}
                filled
              />
            )}
            <span className={styles.label} data-text={option.label}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

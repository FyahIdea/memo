import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'solid';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  opticalAlign?: boolean;
}

/**
 * Badge — label màu nhỏ dùng cho status, tag, category, streak...
 *
 * @example
 * <Badge variant="primary">Timeline</Badge>
 * <Badge variant="warning">+20 PTS</Badge>
 * <Badge variant="success" size="sm">Done</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  opticalAlign = false,
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[`badge--${variant}`],
        size === 'sm' && styles['badge--sm'],
        opticalAlign && 'opticalAlign',
        className,
      )}
    >
      {children}
    </span>
  );
};

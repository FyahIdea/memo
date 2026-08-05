import React from 'react';
import clsx from 'clsx';
import styles from './Alert.module.css';
import { Icon } from './Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertAppearance = 'soft' | 'outline';

interface AlertProps {
  variant?: AlertVariant;
  appearance?: AlertAppearance;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
  opticalAlign?: boolean;
}

const variantIcons: Record<AlertVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  appearance = 'soft',
  title,
  children,
  icon,
  action,
  className,
  opticalAlign = false,
}) => {
  const iconName = icon || variantIcons[variant];

  return (
    <div
      className={clsx(
        styles.alert,
        styles[`alert--${variant}`],
        styles[`alert--${appearance}`],
        opticalAlign && 'opticalAlign',
        className
      )}
      role="alert"
    >
      <div className={styles.iconWrapper}>
        <Icon name={iconName} size="md" className={styles.icon} />
      </div>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.message}>{children}</div>}
      </div>
      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}
    </div>
  );
};

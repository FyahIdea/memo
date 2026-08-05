import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';
import { Icon } from './Icon';
import { playButtonClick } from '../../utils/sound';

export type ButtonColor = 'blue' | 'green' | 'red' | 'yellow' | 'neutral';
export type ButtonVariant = 'primary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  opticalAlign?: boolean;
  children?: React.ReactNode;
}

/**
 * Button — Nút bấm 3D phong cách cute, bold với bảng màu Google.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  color = 'blue',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  opticalAlign = false,
  children,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const content = label || children;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playButtonClick();
    }
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={clsx(
        styles.btn,
        styles[variant],
        styles[color],
        styles[size],
        iconOnly && styles.iconOnly,
        opticalAlign && 'opticalAlign',
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={styles.iconWrapper}>
          <Icon name={icon} size={size} />
        </span>
      )}
      
      {!iconOnly && content && (
        <span className={styles.label}>{content}</span>
      )}

      {icon && iconPosition === 'right' && (
        <span className={styles.iconWrapper}>
          <Icon name={icon} size={size} />
        </span>
      )}
    </button>
  );
};

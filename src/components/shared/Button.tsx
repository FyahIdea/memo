import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Nút chỉ có icon, padding đều */
  iconOnly?: boolean;
  children: React.ReactNode;
}

/**
 * Button — nút bấm chuẩn với variants, sizes và states.
 *
 * @example
 * <Button variant="primary" onClick={...}>Capture</Button>
 * <Button variant="ghost" size="sm" iconOnly><Icon name="close" /></Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        iconOnly && styles['button--icon'],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

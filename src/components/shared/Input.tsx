import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';
import { Icon } from './Icon';

// ─── InputField ──────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  opticalAlign?: boolean;
}

/**
 * InputField — text input có label và helper text.
 *
 * @example
 * <InputField label="Tiêu đề" placeholder="Nhập tên task..." />
 * <InputField label="Email" type="email" error="Email không hợp lệ" />
 */
export const InputField: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  opticalAlign = false,
  id,
  className,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={clsx(styles.inputWrapper, opticalAlign && styles.opticalAlign)}>
        {leftIcon && (
          <span className={clsx(styles.icon, styles.iconLeft)}>
            <Icon name={leftIcon} size="md" />
          </span>
        )}
        <input
          id={inputId}
          className={clsx(
            styles.input,
            error && styles['input--error'],
            leftIcon && styles.hasLeftIcon,
            rightIcon && styles.hasRightIcon,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className={clsx(styles.icon, styles.iconRight)}>
            <Icon name={rightIcon} size="md" />
          </span>
        )}
      </div>
      {(helperText || error) && (
        <span className={clsx(styles.helper, error && styles.helperError)}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

// ─── Textarea ─────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  opticalAlign?: boolean;
}

export const TextareaField: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  opticalAlign = false,
  id,
  className,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={clsx(styles.inputWrapper, opticalAlign && styles.opticalAlign)}>
        <textarea
          id={inputId}
          className={clsx(styles.input, styles.textarea, error && styles['input--error'], className)}
          {...props}
        />
      </div>
      {(helperText || error) && (
        <span className={clsx(styles.helper, error && styles.helperError)}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

// ─── Select ───────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  opticalAlign?: boolean;
  children: React.ReactNode;
}

export const SelectField: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
  opticalAlign = false,
  id,
  children,
  className,
  ...props
}) => {
  const inputId = id || `select-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={clsx(styles.inputWrapper, opticalAlign && styles.opticalAlign)}>
        <select
          id={inputId}
          className={clsx(styles.input, styles.select, error && styles['input--error'], className)}
          {...props}
        >
          {children}
        </select>
      </div>
      {(helperText || error) && (
        <span className={clsx(styles.helper, error && styles.helperError)}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

// ─── InputField ──────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
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
      <input
        id={inputId}
        className={clsx(styles.input, error && styles['input--error'], className)}
        {...props}
      />
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
}

export const TextareaField: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
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
      <textarea
        id={inputId}
        className={clsx(styles.input, styles.textarea, error && styles['input--error'], className)}
        {...props}
      />
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
  children: React.ReactNode;
}

export const SelectField: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
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
      <select
        id={inputId}
        className={clsx(styles.input, styles.select, error && styles['input--error'], className)}
        {...props}
      >
        {children}
      </select>
      {(helperText || error) && (
        <span className={clsx(styles.helper, error && styles.helperError)}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

import React from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import { Icon } from './Icon';
import { playToggleOn, playToggleOff, playDisabledClick } from '../../utils/sound';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  opticalAlign?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  opticalAlign = false,
  className,
  id,
  onChange,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;
  
  const [isShaking, setIsShaking] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      playToggleOn();
    } else {
      playToggleOff();
    }
    if (onChange) onChange(e);
  };
  
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (props.disabled) {
      e.preventDefault();
      playDisabledClick();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };
  
  return (
    <div 
      className={clsx(styles.wrapper, opticalAlign && 'opticalAlign', className, isShaking && 'shake-animation', props.disabled && styles.wrapperDisabled)}
      onClick={handleWrapperClick}
    >
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          className={styles.input}
          onChange={handleChange}
          {...props}
        />
        <div className={styles.customCheckbox}>
          <Icon name="check" size="sm" className={styles.icon} />
        </div>
      </div>
      {(label || description) && (
        <div className={styles.textContainer}>
          {label && <label htmlFor={checkboxId} className={styles.label}>{label}</label>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      )}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

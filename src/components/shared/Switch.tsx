import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';
import { playToggleOn, playToggleOff, playDisabledClick } from '../../utils/sound';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  opticalAlign?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  description,
  opticalAlign = false,
  className,
  id,
  onChange,
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;
  
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
      <div className={styles.switchContainer}>
        <input
          type="checkbox"
          role="switch"
          id={switchId}
          ref={ref}
          className={styles.input}
          onChange={handleChange}
          {...props}
        />
        <div className={styles.track}>
          <div className={styles.thumb} />
        </div>
      </div>
      {(label || description) && (
        <div className={styles.textContainer}>
          {label && <label htmlFor={switchId} className={styles.label}>{label}</label>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      )}
    </div>
  );
});
Switch.displayName = 'Switch';

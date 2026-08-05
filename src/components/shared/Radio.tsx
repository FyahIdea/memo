import React from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';
import { playToggleOn, playDisabledClick } from '../../utils/sound';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  opticalAlign?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  opticalAlign = false,
  className,
  id,
  onChange,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).slice(2)}`;
  
  const [isShaking, setIsShaking] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      playToggleOn();
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
      <div className={styles.radioContainer}>
        <input
          type="radio"
          id={radioId}
          ref={ref}
          className={styles.input}
          onChange={handleChange}
          {...props}
        />
        <div className={styles.customRadio}>
          <div className={styles.dot} />
        </div>
      </div>
      {(label || description) && (
        <div className={styles.textContainer}>
          {label && <label htmlFor={radioId} className={styles.label}>{label}</label>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      )}
    </div>
  );
});
Radio.displayName = 'Radio';

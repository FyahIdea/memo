import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  textColor?: 'default' | 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
  noPadding?: boolean;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  textColor = 'default',
  className,
  noPadding = false,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!content) return <>{children}</>;

  const handleMouseEnter = () => {
    if (delay > 0) {
      timerRef.current = setTimeout(() => {
        setVisible(true);
      }, delay);
    } else {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  return (
    <div
      className={clsx(styles.wrapper, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className={clsx(styles.tooltip, styles[position], styles[`text-${textColor}`], noPadding && styles.noPadding)}>
          <div className={styles.content}>{content}</div>
        </div>
      )}
    </div>
  );
};

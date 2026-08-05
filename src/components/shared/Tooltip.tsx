import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  textColor?: 'default' | 'blue' | 'red' | 'yellow' | 'green';
  className?: string;
  noPadding?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  textColor = 'default',
  className,
  noPadding = false,
}) => {
  const [visible, setVisible] = useState(false);

  if (!content) return <>{children}</>;

  return (
    <div
      className={clsx(styles.wrapper, className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
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

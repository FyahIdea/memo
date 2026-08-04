import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'elevated' | 'ghost' | 'accent';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'md' | 'lg' | 'xl';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card — container nội dung với padding, radius, và style variants.
 *
 * @example
 * <Card padding="md">Nội dung</Card>
 * <Card variant="accent" padding="sm">Highlighted card</Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  children,
  className,
  onClick,
}) => {
  const padClass = `card--pad${padding.charAt(0).toUpperCase() + padding.slice(1)}`;
  const radiusClass = `card--radius${radius.charAt(0).toUpperCase() + radius.slice(1)}`;

  return (
    <div
      className={clsx(
        styles.card,
        styles[`card--${variant}`],
        styles[padClass],
        styles[radiusClass],
        className,
      )}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </div>
  );
};

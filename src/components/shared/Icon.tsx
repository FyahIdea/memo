import React from 'react';
import clsx from 'clsx';
import styles from './Icon.module.css';

// Kích cỡ icon tương ứng với class trong CSS module
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
  /** Tên icon từ Material Symbols — xem: https://fonts.google.com/icons */
  name: string;
  /** Kích cỡ: sm=18px, md=24px (mặc định), lg=32px, xl=40px */
  size?: IconSize;
  /** Bật biến thể filled (icon được tô màu). Mặc định là true theo ý thích user. */
  filled?: boolean;
  /** Class bổ sung nếu cần override */
  className?: string;
}

/**
 * Wrapper cho Google Material Symbols Rounded.
 * Dùng thay thế hoàn toàn cho lucide-react.
 *
 * @example
 * <Icon name="calendar_month" />
 * <Icon name="check_circle" filled size="lg" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  filled = true,
  className,
}) => {
  return (
    <span
      className={clsx(
        styles.icon,
        styles[`icon--${size}`],
        !filled && styles['icon--outline'],
        className,
      )}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

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
  /** Bật biến thể filled (icon được tô màu) */
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
  filled = false,
  className,
}) => {
  return (
    <span
      className={clsx(
        styles.icon,
        styles[`icon--${size}`],
        className,
      )}
      style={{
        // Điều chỉnh FILL axis của variable font để chuyển giữa outline và filled
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';
import { Icon } from './Icon';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}) => {
  const [error, setError] = useState(false);

  // Lấy 1-2 chữ cái đầu làm fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const renderFallback = () => {
    if (fallback) return <span className={styles.initials}>{getInitials(fallback)}</span>;
    return <Icon name="person" size={size === 'xl' ? 'lg' : 'md'} className={styles.fallbackIcon} />;
  };

  return (
    <div className={clsx(styles.avatar, styles[`avatar--${size}`], className)}>
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          onError={() => setError(true)}
        />
      ) : (
        <div className={styles.fallbackContainer}>
          {renderFallback()}
        </div>
      )}
    </div>
  );
};

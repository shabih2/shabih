import React from 'react';
import styles from './Card.module.css';
import Icon from './Icon';

interface CardProps {
  title?: string;
  icon?: string;
  variant?: 'glass' | 'surface';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  icon,
  variant = 'glass',
  children,
  className = '',
  onClick,
}: CardProps) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(title || icon) && (
        <div className={styles.header}>
          {icon && <Icon name={icon} size="md" />}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

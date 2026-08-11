import React from 'react';
import styles from './Card.module.css';
import Icon from './Icon';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: string;
  variant?: 'glass' | 'surface';
  glow?: boolean;
  children: React.ReactNode;
}

export default function Card({
  title,
  icon,
  variant = 'glass',
  glow = false,
  children,
  className = '',
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${onClick ? styles.clickable : ''} ${glow ? styles.glow : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
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

import React, { ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: 'card--default',
    elevated: 'card--elevated',
    outlined: 'card--outlined',
  };
  const paddingClasses = {
    none: 'card--padding-none',
    sm: 'card--padding-sm',
    md: 'card--padding-md',
    lg: 'card--padding-lg',
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverable ? 'card--hoverable' : '',
    onClick ? 'card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__header ${className}`}>{children}</div>;

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__body ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card__footer ${className}`}>{children}</div>;

export default Card;
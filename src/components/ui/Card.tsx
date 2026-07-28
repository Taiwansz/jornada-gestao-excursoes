import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  padding = 'md'
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={clsx(
      "bg-white rounded-xl border border-jornada-border/70 shadow-sm transition-all duration-150 overflow-hidden",
      className
    )}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-jornada-border/60 bg-jornada-ivory/20">
          <div>
            {title && (
              <h3 className="font-heading font-bold text-base text-jornada-navy tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-body text-xs text-jornada-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
};

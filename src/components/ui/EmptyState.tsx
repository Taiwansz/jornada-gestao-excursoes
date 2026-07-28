import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-jornada-border/80 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-jornada-ivory text-jornada-navy flex items-center justify-center mb-4 border border-jornada-border/60">
          {icon}
        </div>
      )}
      <h3 className="font-heading font-bold text-lg text-jornada-navy tracking-tight mb-1">
        {title}
      </h3>
      <p className="font-body text-sm text-jornada-muted max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { clsx } from 'clsx';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={clsx("animate-pulse bg-jornada-ivory/80 rounded-md", className)} />
  );
};

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-jornada-navy text-white hover:bg-jornada-navy/90 active:bg-jornada-navy/95 focus:ring-jornada-navy",
    secondary: "bg-white text-jornada-navy border border-jornada-border hover:bg-jornada-ivory/50 active:bg-jornada-ivory focus:ring-jornada-navy",
    accent: "bg-jornada-terracotta text-white hover:bg-jornada-terracotta/90 active:bg-jornada-terracotta/95 focus:ring-jornada-terracotta",
    success: "bg-jornada-green text-white hover:bg-jornada-green/90 active:bg-jornada-green/95 focus:ring-jornada-green",
    danger: "bg-jornada-red text-white hover:bg-jornada-red/90 active:bg-jornada-red/95 focus:ring-jornada-red",
    outline: "bg-transparent text-jornada-navy border border-jornada-border hover:bg-jornada-ivory/40 focus:ring-jornada-navy",
    ghost: "bg-transparent text-jornada-navy hover:bg-jornada-ivory/80 focus:ring-jornada-navy"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[34px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-base gap-2.5 min-h-[46px]"
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

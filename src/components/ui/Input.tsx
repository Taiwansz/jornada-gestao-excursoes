import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-heading font-medium text-xs text-jornada-navy flex items-center justify-between">
          <span>
            {label} {required && <span className="text-jornada-red">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-jornada-muted pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          className={clsx(
            "w-full bg-white text-jornada-navy text-sm rounded-lg border transition-colors duration-150 font-body placeholder:text-jornada-muted/60 focus:outline-none focus:ring-2 focus:ring-jornada-navy focus:border-transparent disabled:bg-jornada-ivory/50 disabled:cursor-not-allowed min-h-[40px]",
            leftIcon ? "pl-9" : "pl-3.5",
            rightIcon ? "pr-9" : "pr-3.5",
            error ? "border-jornada-red focus:ring-jornada-red" : "border-jornada-border hover:border-jornada-navy/40",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-jornada-muted">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <span className="font-body text-xs text-jornada-red font-medium">{error}</span>
      ) : helperText ? (
        <span className="font-body text-xs text-jornada-muted">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="font-heading font-medium text-xs text-jornada-navy">
          {label} {required && <span className="text-jornada-red">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        required={required}
        className={clsx(
          "w-full bg-white text-jornada-navy text-sm rounded-lg border transition-colors duration-150 font-body focus:outline-none focus:ring-2 focus:ring-jornada-navy focus:border-transparent disabled:bg-jornada-ivory/50 disabled:cursor-not-allowed min-h-[40px] px-3.5 py-2",
          error ? "border-jornada-red focus:ring-jornada-red" : "border-jornada-border hover:border-jornada-navy/40",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <span className="font-body text-xs text-jornada-red font-medium">{error}</span>
      ) : helperText ? (
        <span className="font-body text-xs text-jornada-muted">{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

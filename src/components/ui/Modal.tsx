import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jornada-navy/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div 
        className={`relative w-full ${widthClasses[maxWidth]} bg-white rounded-xl shadow-xl border border-jornada-border overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-jornada-border bg-jornada-ivory/40">
          <div>
            <h2 className="font-heading font-bold text-lg text-jornada-navy tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-xs text-jornada-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-jornada-muted hover:text-jornada-navy rounded-lg hover:bg-jornada-ivory transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto font-body text-sm text-jornada-navy">
          {children}
        </div>
      </div>
    </div>
  );
};

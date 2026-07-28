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
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-jornada-navy/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      {/* Bottom Sheet no Celular, Modal no Desktop */}
      <div 
        className={`relative w-full ${widthClasses[maxWidth]} bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-jornada-border overflow-hidden z-10 my-0 sm:my-8 flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-transform duration-200 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0`}
      >
        {/* Handle visual no topo do cel (Bottom Sheet Indicator) */}
        <div className="w-12 h-1 bg-jornada-border rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-jornada-border bg-jornada-ivory/40">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-jornada-navy tracking-tight">
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
            className="p-1.5 text-jornada-muted hover:text-jornada-navy rounded-lg hover:bg-jornada-ivory transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto font-body text-sm text-jornada-navy pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'symbol' | 'monochrome';
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoSymbol: React.FC<{ className?: string; size?: number; color?: string }> = ({ 
  className = '', 
  size = 36,
  color = '#172A3A'
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Círculo suave de fundo */}
      <rect width="48" height="48" rx="10" fill="#F6F2E9" />
      
      {/* Trajeto da linha que forma a letra 'J' */}
      <path 
        d="M28 12V28C28 32.4183 24.4183 36 20 36C15.5817 36 12 32.4183 12 28C12 26.5 12.5 25 13.5 23.8" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Ponto de Localização (Pin) na extremidade superior do 'J' */}
      <path 
        d="M28 8C25.7909 8 24 9.79086 24 12C24 15 28 19 28 19C28 19 32 15 32 12C32 9.79086 30.2091 8 28 8Z" 
        fill="#C45D3C" 
      />
      <circle cx="28" cy="11.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};

export const LogoHorizontal: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  className = '', 
  showSubtitle = true,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  if (variant === 'symbol') {
    return <LogoSymbol size={iconSize} className={className} />;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <LogoSymbol size={iconSize} color={variant === 'monochrome' ? '#000000' : '#172A3A'} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-heading font-bold tracking-tight text-jornada-navy ${textSize}`}>
            JORNADA
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-jornada-terracotta" />
        </div>
        {showSubtitle && (
          <span className={`font-body text-jornada-muted ${subtitleSize} font-medium tracking-wide -mt-0.5`}>
            Gestão de excursões da sua igreja
          </span>
        )}
      </div>
    </div>
  );
};

export const ChurchBrandHeader: React.FC<{ 
  churchName?: string; 
  churchLogo?: string | null; 
  title?: string;
  subtitle?: string;
}> = ({ churchName, churchLogo, title, subtitle }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-jornada-border">
      <LogoHorizontal size="sm" showSubtitle={false} />
      
      {(churchName || churchLogo) && (
        <div className="flex items-center gap-3 bg-jornada-ivory/60 px-3 py-1.5 rounded-lg border border-jornada-border/60">
          {churchLogo ? (
            <img src={churchLogo} alt={churchName || 'Igreja'} className="w-6 h-6 object-contain rounded" />
          ) : (
            <div className="w-6 h-6 rounded bg-jornada-navy text-white text-[10px] font-bold flex items-center justify-center font-heading">
              {churchName?.substring(0, 2).toUpperCase() || 'IG'}
            </div>
          )}
          <span className="font-heading font-semibold text-xs text-jornada-navy truncate max-w-[200px]">
            {churchName}
          </span>
        </div>
      )}
    </div>
  );
};

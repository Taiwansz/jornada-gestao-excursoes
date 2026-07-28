'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  Users, 
  DollarSign, 
  FileCheck, 
  Grid 
} from 'lucide-react';

interface MobileBottomBarProps {
  onOpenActionSheet: () => void;
  pendingReceiptsCount?: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ 
  onOpenActionSheet, 
  pendingReceiptsCount = 0 
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Painel', href: '/dashboard', icon: Home },
    { label: 'Excursões', href: '/excursoes', icon: Compass },
    { label: 'Passageiros', href: '/passageiros', icon: Users },
    { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { label: 'Comprovantes', href: '/comprovantes', icon: FileCheck, badge: pendingReceiptsCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 max-w-md mx-auto select-none pointer-events-auto">
      {/* Liquid Glass Capsule Dock (Liquid Glassmorphism + Refraction Specular Line) */}
      <nav className="relative bg-[#172A3A]/85 backdrop-blur-2xl backdrop-saturate-200 text-white border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.45)] rounded-full p-1.5 flex items-center justify-between gap-1 ring-1 ring-white/10 overflow-hidden">
        
        {/* Specular Top Reflection Highlight (Liquid Glass Effect) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 bg-jornada-terracotta text-white rounded-full px-3.5 py-1.5 font-heading text-[11px] font-bold shadow-md transition-all duration-200 shrink-0 border border-white/20"
              >
                <Icon className="w-4 h-4 stroke-[2.2px]" />
                <span className="tracking-tight">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 bg-white text-jornada-terracotta text-[9px] font-extrabold rounded-full flex items-center justify-center ml-0.5 shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative p-2 text-white/75 hover:text-white active:scale-90 transition-all rounded-full flex items-center justify-center shrink-0"
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.8px]" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-1 w-2 h-2 bg-jornada-terracotta rounded-full ring-2 ring-jornada-navy" />
              ) : null}
            </Link>
          );
        })}

        {/* Separador Sutil Vidro */}
        <div className="w-px h-4 bg-white/20 my-auto mx-0.5" />

        {/* Botão de Ações do App (Substitui menu lateral por Bottom Action Sheet) */}
        <button
          onClick={onOpenActionSheet}
          className="p-2 text-white/75 hover:text-white active:scale-90 transition-all rounded-full flex items-center justify-center shrink-0"
          title="Ações e Opções do App"
        >
          <Grid className="w-5 h-5 stroke-[1.8px]" />
        </button>
      </nav>
    </div>
  );
};

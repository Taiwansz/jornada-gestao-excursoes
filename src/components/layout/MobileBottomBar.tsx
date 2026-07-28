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
  Menu 
} from 'lucide-react';

interface MobileBottomBarProps {
  onOpenMenu: () => void;
  pendingReceiptsCount?: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ 
  onOpenMenu, 
  pendingReceiptsCount = 0 
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Excursões', href: '/excursoes', icon: Compass },
    { label: 'Passageiros', href: '/passageiros', icon: Users },
    { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { label: 'Comprovantes', href: '/comprovantes', icon: FileCheck, badge: pendingReceiptsCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 max-w-lg mx-auto select-none pointer-events-auto">
      {/* Floating Capsule Dock (Estilo Thallium) */}
      <nav className="bg-jornada-navy/95 backdrop-blur-xl text-white border border-white/15 shadow-2xl rounded-full p-1.5 flex items-center justify-between gap-1 ring-1 ring-black/20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 bg-jornada-terracotta text-white rounded-full px-3.5 py-2 font-heading text-xs font-bold shadow-md transition-all duration-200 scale-105 shrink-0"
              >
                <Icon className="w-4 h-4 stroke-[2.5px]" />
                <span className="tracking-tight">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 bg-white text-jornada-terracotta text-[9px] font-extrabold rounded-full flex items-center justify-center ml-0.5">
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
              className="relative p-2.5 text-white/70 hover:text-white active:scale-90 transition-all rounded-full flex items-center justify-center shrink-0"
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.8px]" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-1 w-2 h-2 bg-jornada-terracotta rounded-full ring-2 ring-jornada-navy" />
              ) : null}
            </Link>
          );
        })}

        {/* Separador Sutil */}
        <div className="w-px h-5 bg-white/20 my-auto mx-0.5" />

        {/* Botão de Menu Mais */}
        <button
          onClick={onOpenMenu}
          className="p-2.5 text-white/70 hover:text-white active:scale-90 transition-all rounded-full flex items-center justify-center shrink-0"
          title="Menu Principal"
        >
          <Menu className="w-5 h-5 stroke-[1.8px]" />
        </button>
      </nav>
    </div>
  );
};

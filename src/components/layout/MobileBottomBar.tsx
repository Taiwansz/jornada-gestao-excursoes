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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-jornada-border/80 shadow-lg px-2 py-1.5 pb-safe select-none">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-jornada-terracotta font-bold'
                  : 'text-jornada-navy/70 hover:text-jornada-navy font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-jornada-terracotta text-white font-heading text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="font-heading text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Botão de Menu Mais */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center w-14 py-1 text-jornada-navy/70 hover:text-jornada-navy active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5 stroke-[1.8px]" />
          <span className="font-heading text-[10px] mt-0.5 tracking-tight font-medium">
            Menu
          </span>
        </button>
      </nav>
    </div>
  );
};

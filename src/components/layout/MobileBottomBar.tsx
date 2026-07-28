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
    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 max-w-md mx-auto select-none pointer-events-auto">
      {/* Thallium Design System - Floating Capsule Dock (#09090b surface with #27272a border) */}
      <nav className="bg-[#09090b]/95 backdrop-blur-xl text-[#fafafa] border border-[#27272a] shadow-2xl rounded-full p-1.5 flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 bg-[#C45D3C] text-white rounded-full px-3.5 py-1.5 font-heading text-[11px] font-bold shadow-xs transition-all duration-200 shrink-0"
              >
                <Icon className="w-4 h-4 stroke-[2.2px]" />
                <span className="tracking-tight">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 bg-white text-[#C45D3C] text-[9px] font-extrabold rounded-full flex items-center justify-center ml-0.5">
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
              className="relative p-2 text-[#a1a1aa] hover:text-[#fafafa] active:scale-95 transition-all rounded-full flex items-center justify-center shrink-0"
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.75px]" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C45D3C] rounded-full ring-2 ring-[#09090b]" />
              ) : null}
            </Link>
          );
        })}

        {/* Separador Sutil Thallium (#27272a) */}
        <div className="w-px h-4 bg-[#27272a] my-auto mx-0.5" />

        {/* Botão de Menu Mais */}
        <button
          onClick={onOpenMenu}
          className="p-2 text-[#a1a1aa] hover:text-[#fafafa] active:scale-95 transition-all rounded-full flex items-center justify-center shrink-0"
          title="Menu Principal"
        >
          <Menu className="w-5 h-5 stroke-[1.75px]" />
        </button>
      </nav>
    </div>
  );
};

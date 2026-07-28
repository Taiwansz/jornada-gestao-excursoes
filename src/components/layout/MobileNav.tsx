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
  BarChart3, 
  Settings, 
  X,
  LogOut,
  UserCheck
} from 'lucide-react';
import { LogoHorizontal } from '../brand/Logo';
import { getCurrentUser } from '@/lib/store';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const user = getCurrentUser();

  if (!isOpen) return null;

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Excursões', href: '/excursoes', icon: Compass },
    { label: 'Passageiros', href: '/passageiros', icon: Users },
    { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { label: 'Comprovantes', href: '/comprovantes', icon: FileCheck },
    { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { label: 'Usuários & Acesso', href: '/usuarios', icon: UserCheck },
    { label: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-jornada-navy/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative flex-1 max-w-xs w-full bg-jornada-navy text-white flex flex-col h-full z-10 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/10">
          <LogoHorizontal size="sm" showSubtitle={false} variant="monochrome" className="text-white" />
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-lg font-heading text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-jornada-terracotta text-white shadow-xs'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-jornada-terracotta text-white flex items-center justify-center font-heading font-bold text-xs">
              {user?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col truncate">
              <span className="font-heading text-xs font-semibold text-white truncate">
                {user?.full_name || 'Administrador'}
              </span>
              <span className="font-body text-[10px] text-white/60 capitalize">
                {user?.role || 'Admin'}
              </span>
            </div>
          </div>
          <Link href="/login" onClick={onClose} className="p-2 text-white/60 hover:text-white">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

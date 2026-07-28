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
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { LogoHorizontal } from '../brand/Logo';
import { getCurrentUser } from '@/lib/store';

interface SidebarProps {
  currentPath?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const user = getCurrentUser();

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
    <aside className="hidden lg:flex flex-col w-64 bg-jornada-navy text-white min-h-screen fixed left-0 top-0 bottom-0 z-30 border-r border-jornada-navy/80 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 bg-black/10">
        <Link href="/" className="inline-block">
          <LogoHorizontal size="sm" showSubtitle={true} variant="monochrome" className="text-white" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-heading text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-jornada-terracotta text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info & Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-jornada-terracotta text-white flex items-center justify-center font-heading font-bold text-xs shrink-0">
              {user?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col truncate">
              <span className="font-heading text-xs font-semibold text-white truncate">
                {user?.full_name || 'Administrador'}
              </span>
              <span className="font-body text-[11px] text-white/60 capitalize truncate">
                {user?.role || 'Admin'}
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Sair da Conta"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

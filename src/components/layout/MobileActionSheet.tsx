'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  UserCheck, 
  Settings, 
  LogOut, 
  X, 
  Church, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { getCurrentUser, getInitialChurch } from '@/lib/store';

interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({ isOpen, onClose }) => {
  const user = getCurrentUser();
  const church = getInitialChurch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end select-none">
      {/* Backdrop com desfoque */}
      <div 
        className="fixed inset-0 bg-jornada-navy/60 backdrop-blur-sm transition-opacity duration-200" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Painel Nativo de Ações do App (Bottom Sheet) */}
      <div className="relative w-full bg-jornada-navy text-white rounded-t-3xl border-t border-white/20 shadow-2xl p-6 z-10 space-y-5 animate-in slide-in-from-bottom duration-250 pb-safe">
        {/* Handle visual do App (Drag Bar) */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto -mt-2 mb-2" />

        {/* Header do Perfil / Igreja */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-jornada-terracotta text-white flex items-center justify-center font-heading font-bold text-sm shadow-md">
              {user?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm text-white truncate max-w-[200px]">
                {user?.full_name || 'Administrador'}
              </span>
              <span className="font-body text-xs text-white/70 truncate max-w-[200px]">
                {church.name}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid de Opções Secundárias do App */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/relatorios"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 text-center space-y-1.5"
          >
            <BarChart3 className="w-6 h-6 text-jornada-terracotta" />
            <span className="font-heading text-xs font-semibold">Relatórios</span>
          </Link>

          <Link
            href="/usuarios"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 text-center space-y-1.5"
          >
            <UserCheck className="w-6 h-6 text-jornada-green" />
            <span className="font-heading text-xs font-semibold">Usuários</span>
          </Link>

          <Link
            href="/configuracoes"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 text-center space-y-1.5"
          >
            <Settings className="w-6 h-6 text-white" />
            <span className="font-heading text-xs font-semibold">Ajustes</span>
          </Link>
        </div>

        {/* Atalhos Rápidos da Igreja */}
        <div className="space-y-2 pt-1">
          <Link
            href="/configuracoes"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/10 text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <Church className="w-4 h-4 text-white/80" />
              <span className="font-heading text-xs font-semibold">Dados Bancários & Chave Pix</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 rounded-xl bg-jornada-red/20 hover:bg-jornada-red/30 border border-jornada-red/30 text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-jornada-red" />
              <span className="font-heading text-xs font-semibold text-white">Sair do Aplicativo</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </Link>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { MobileBottomBar } from './MobileBottomBar';
import { MobileActionSheet } from './MobileActionSheet';
import { getReceipts } from '@/lib/store';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingReceiptsCount, setPendingReceiptsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const recs = getReceipts().filter(r => r.review_status === 'pending');
    setPendingReceiptsCount(recs.length);
  }, []);

  // Rotas públicas que não exibem a estrutura interna administrativa
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/cadastro') ||
    pathname.startsWith('/recuperar-senha') ||
    pathname.startsWith('/i/') ||
    pathname.startsWith('/inscrever/') ||
    pathname.startsWith('/consulta/') ||
    pathname.startsWith('/recibo/');

  if (!mounted) {
    return <div className="min-h-screen bg-jornada-ivory" />;
  }

  if (isPublicRoute) {
    return (
      <main className="min-h-screen bg-jornada-ivory text-jornada-navy font-body antialiased">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-jornada-ivory text-jornada-navy font-body antialiased flex flex-col lg:flex-row select-none sm:select-text">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer (apenas acessado via topo se necessário) */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />

      {/* Mobile App Native Action Sheet */}
      <MobileActionSheet
        isOpen={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header onToggleMobileNav={() => setActionSheetOpen(true)} />

        {/* Page Body with Spacing for Liquid Glass Dock */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Liquid Glass Capsule Dock */}
      <MobileBottomBar 
        onOpenActionSheet={() => setActionSheetOpen(true)}
        pendingReceiptsCount={pendingReceiptsCount}
      />
    </div>
  );
};

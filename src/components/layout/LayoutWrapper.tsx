'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { MobileBottomBar } from './MobileBottomBar';
import { getReceipts } from '@/lib/store';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingReceiptsCount, setPendingReceiptsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const recs = getReceipts().filter(r => r.review_status === 'pending');
    setPendingReceiptsCount(recs.length);
  }, []);

  // Rotas públicas sem navegação do app
  const isPublicRoute = 
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

      {/* Mobile Navigation Drawer */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />

        {/* Page Body with Mobile Bottom Padding */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* App Mobile Bottom Bar */}
      <MobileBottomBar 
        onOpenMenu={() => setMobileNavOpen(true)}
        pendingReceiptsCount={pendingReceiptsCount}
      />
    </div>
  );
};

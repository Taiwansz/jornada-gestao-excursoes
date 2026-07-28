'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotas públicas que não exibem a estrutura com Sidebar/Header administrativo
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
    <div className="min-h-screen bg-jornada-ivory text-jornada-navy font-body antialiased flex flex-col lg:flex-row">
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

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

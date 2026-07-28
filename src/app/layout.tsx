import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'JORNADA - Gestão de Excursões da sua Igreja',
  description: 'Sistema administrativo profissional para organização e gestão de excursões de igrejas, congregações e ministérios.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JORNADA',
  },
};

export const viewport: Viewport = {
  themeColor: '#172A3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-jornada-ivory text-jornada-navy font-body antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

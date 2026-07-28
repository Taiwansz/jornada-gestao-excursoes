'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Church as ChurchIcon, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck,
  UserPlus,
  DollarSign
} from 'lucide-react';
import { getInitialChurch, getPassengers, getReceipts, getPayments, getExcursions, syncOfflineCheckins } from '@/lib/store';
import { Church, Passenger, Excursion, PaymentReceipt } from '@/types';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const router = useRouter();
  const [church, setChurch] = useState<Church | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineSyncedCount, setOfflineSyncedCount] = useState<number | null>(null);

  // Search results state
  const [searchPassengers, setSearchPassengers] = useState<Passenger[]>([]);
  const [searchExcursions, setSearchExcursions] = useState<Excursion[]>([]);

  // Notifications calculation
  const [pendingReceipts, setPendingReceipts] = useState<PaymentReceipt[]>([]);
  const [lateCount, setLateCount] = useState(0);

  useEffect(() => {
    setChurch(getInitialChurch());
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      const synced = syncOfflineCheckins();
      if (synced > 0) {
        setOfflineSyncedCount(synced);
        setTimeout(() => setOfflineSyncedCount(null), 4000);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar dados de notificação
    const recs = getReceipts().filter(r => r.review_status === 'pending');
    setPendingReceipts(recs);

    const pays = getPayments().filter(p => p.status === 'atrasado');
    setLateCount(pays.length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    const q = query.toLowerCase();
    const allPass = getPassengers();
    const matchedPass = allPass.filter(p => 
      p.full_name.toLowerCase().includes(q) || 
      p.phone.includes(q) || 
      (p.document_number && p.document_number.includes(q))
    ).slice(0, 5);

    const allExc = getExcursions();
    const matchedExc = allExc.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.destination.toLowerCase().includes(q) || 
      e.public_code.toLowerCase().includes(q)
    ).slice(0, 3);

    setSearchPassengers(matchedPass);
    setSearchExcursions(matchedExc);
    setShowSearchResults(true);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-jornada-border/70 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Church Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-jornada-navy hover:bg-jornada-ivory rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {church?.logo_url ? (
              <img src={church.logo_url} alt={church.name} className="w-7 h-7 object-contain rounded" />
            ) : (
              <div className="w-7 h-7 rounded bg-jornada-navy text-white text-xs font-bold font-heading flex items-center justify-center">
                {church?.name?.substring(0, 2).toUpperCase() || 'IG'}
              </div>
            )}
            <span className="font-heading font-bold text-sm text-jornada-navy truncate max-w-[150px] sm:max-w-[240px]">
              {church?.name || 'Igreja'}
            </span>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-jornada-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar passageiro, excursão, telefone, Pix ou veículo..."
              className="w-full bg-jornada-ivory/60 text-jornada-navy text-xs rounded-lg pl-9 pr-4 py-2 border border-jornada-border/70 font-body placeholder:text-jornada-muted/60 focus:outline-none focus:ring-2 focus:ring-jornada-navy focus:bg-white transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-jornada-border p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-jornada-border/60">
                <span className="font-heading text-xs font-semibold text-jornada-muted">Resultados da Busca</span>
                <button onClick={() => setShowSearchResults(false)} className="text-xs text-jornada-muted hover:text-jornada-navy">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {searchPassengers.length === 0 && searchExcursions.length === 0 ? (
                <div className="py-4 text-center text-xs text-jornada-muted font-body">
                  Nenhum registro encontrado para "{searchQuery}".
                </div>
              ) : (
                <div className="py-2 space-y-3 max-h-60 overflow-y-auto">
                  {searchExcursions.length > 0 && (
                    <div>
                      <span className="font-heading text-[10px] font-bold text-jornada-terracotta uppercase tracking-wider block mb-1">Excursões</span>
                      {searchExcursions.map(e => (
                        <div
                          key={e.id}
                          onClick={() => {
                            router.push(`/excursoes/${e.id}`);
                            setShowSearchResults(false);
                          }}
                          className="p-2 hover:bg-jornada-ivory rounded-md cursor-pointer text-xs font-heading font-medium text-jornada-navy flex justify-between"
                        >
                          <span>{e.name}</span>
                          <span className="text-jornada-muted text-[10px]">{e.destination}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchPassengers.length > 0 && (
                    <div>
                      <span className="font-heading text-[10px] font-bold text-jornada-navy uppercase tracking-wider block mb-1">Passageiros</span>
                      {searchPassengers.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            router.push(`/excursoes/${p.excursion_id}?tab=passageiros`);
                            setShowSearchResults(false);
                          }}
                          className="p-2 hover:bg-jornada-ivory rounded-md cursor-pointer text-xs font-body text-jornada-navy flex justify-between items-center"
                        >
                          <div>
                            <span className="font-semibold block">{p.full_name}</span>
                            <span className="text-[10px] text-jornada-muted">{p.phone}</span>
                          </div>
                          <span className="text-[10px] font-heading bg-jornada-ivory px-2 py-0.5 rounded border border-jornada-border">
                            {p.pickup_location}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Network Status Badge & Notifications */}
        <div className="flex items-center gap-3">
          {/* Offline/Online Indicator */}
          {!isOnline ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-semibold bg-jornada-red/10 text-jornada-red border border-jornada-red/20">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span>Modo Offline</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-heading text-jornada-green bg-jornada-green/10 border border-jornada-green/20">
              <Wifi className="w-3.5 h-3.5" />
              <span>Online</span>
            </span>
          )}

          {offlineSyncedCount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-jornada-green text-white animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{offlineSyncedCount} check-ins sincronizados!</span>
            </span>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-jornada-navy hover:bg-jornada-ivory rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              {(pendingReceipts.length > 0 || lateCount > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-jornada-terracotta rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-jornada-border p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-jornada-border">
                  <span className="font-heading font-bold text-xs text-jornada-navy">Central de Alertas</span>
                  <span className="text-[10px] font-heading bg-jornada-ivory px-2 py-0.5 rounded border border-jornada-border">
                    {pendingReceipts.length + lateCount} pendências
                  </span>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {pendingReceipts.length > 0 && (
                    <Link
                      href="/comprovantes"
                      onClick={() => setShowNotifications(false)}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FDF4E7] text-jornada-navy hover:bg-[#FCEAD2] transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-jornada-terracotta shrink-0 mt-0.5" />
                      <div>
                        <span className="font-heading font-semibold text-xs block text-jornada-navy">Comprovantes pendentes</span>
                        <span className="font-body text-[11px] text-jornada-muted">
                          {pendingReceipts.length} comprovante(s) aguardando sua análise.
                        </span>
                      </div>
                    </Link>
                  )}

                  {lateCount > 0 && (
                    <Link
                      href="/financeiro"
                      onClick={() => setShowNotifications(false)}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FCEBEB] text-jornada-navy hover:bg-[#F9D4D4] transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 text-jornada-red shrink-0 mt-0.5" />
                      <div>
                        <span className="font-heading font-semibold text-xs block text-jornada-red">Pagamentos atrasados</span>
                        <span className="font-body text-[11px] text-jornada-muted">
                          Existem {lateCount} parcela(s) com vencimento estourado.
                        </span>
                      </div>
                    </Link>
                  )}

                  {pendingReceipts.length === 0 && lateCount === 0 && (
                    <div className="py-4 text-center text-xs text-jornada-muted font-body">
                      Nenhum alerta pendente no momento!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, CheckCircle2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChurchBrandHeader } from '@/components/brand/Logo';
import { getPayments, getPassengers, getExcursions, getInitialChurch } from '@/lib/store';
import { Payment, Passenger, Excursion, Church } from '@/types';

export default function ReceiptPrintPage() {
  const params = useParams();
  const id = params?.id as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [church, setChurch] = useState<Church | null>(null);

  useEffect(() => {
    setChurch(getInitialChurch());
    if (id) {
      const pays = getPayments();
      const p = pays.find(pay => pay.id === id);
      if (p) {
        setPayment(p);
        const pass = getPassengers().find(pas => pas.id === p.passenger_id);
        setPassenger(pass || null);
        setExcursion(getExcursions().find(e => e.id === p.excursion_id) || null);
      }
    }
  }, [id]);

  if (!payment || !passenger || !excursion) {
    return (
      <div className="min-h-screen bg-jornada-ivory flex justify-center items-center p-4">
        <div className="text-center font-body text-jornada-muted text-xs">Recibo não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jornada-ivory py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="no-print flex justify-end">
          <Button variant="accent" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
            Imprimir Recibo
          </Button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-jornada-border shadow-md space-y-6 print-container">
          <ChurchBrandHeader churchName={church?.name} churchLogo={church?.logo_url} />

          <div className="text-center border-b border-jornada-border/80 pb-4">
            <h1 className="font-heading font-extrabold text-xl text-jornada-navy uppercase tracking-wider">
              Recibo de Pagamento
            </h1>
            <span className="font-heading text-xs text-jornada-muted block mt-0.5">
              Nº {payment.receipt_number || 'REC-1001'}
            </span>
          </div>

          <div className="p-4 bg-jornada-ivory/60 rounded-xl border border-jornada-border/60 text-center space-y-1">
            <span className="font-heading text-xs text-jornada-muted block">Valor Recebido</span>
            <span className="font-heading font-extrabold text-3xl text-jornada-green block">
              R$ {payment.amount.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3 font-body text-xs text-jornada-navy">
            <div className="flex justify-between border-b border-jornada-border/40 py-2">
              <span className="text-jornada-muted">Recebido de:</span>
              <strong className="font-heading text-sm">{passenger.full_name}</strong>
            </div>

            <div className="flex justify-between border-b border-jornada-border/40 py-2">
              <span className="text-jornada-muted">Referente à Excursão:</span>
              <strong>{excursion.name} ({excursion.destination})</strong>
            </div>

            <div className="flex justify-between border-b border-jornada-border/40 py-2">
              <span className="text-jornada-muted">Forma de Pagamento:</span>
              <strong>{payment.payment_method}</strong>
            </div>

            <div className="flex justify-between border-b border-jornada-border/40 py-2">
              <span className="text-jornada-muted">Data do Recebimento:</span>
              <strong>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</strong>
            </div>
          </div>

          <div className="pt-8 text-center space-y-4">
            <div className="w-48 border-t border-jornada-navy mx-auto pt-1 font-heading text-xs font-bold text-jornada-navy">
              {church?.name}
            </div>
            <p className="font-body text-[10px] text-jornada-muted">
              Comprovante emitido eletronicamente via sistema JORNADA • Gestão de Excursões
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  QrCode, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  Calendar 
} from 'lucide-react';

import { LogoHorizontal, ChurchBrandHeader } from '@/components/brand/Logo';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import { 
  getPassengerByToken, 
  getExcursionById, 
  getPaymentsByPassenger, 
  getReceipts, 
  saveReceipt, 
  getInitialChurch 
} from '@/lib/store';

import { Passenger, Excursion, Payment, PaymentReceipt, Church } from '@/types';

export default function PublicPassengerLookupPage() {
  const params = useParams();
  const token = params?.token as string;

  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [church, setChurch] = useState<Church | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setChurch(getInitialChurch());
    if (token) {
      const p = getPassengerByToken(token);
      if (p) {
        setPassenger(p);
        setExcursion(getExcursionById(p.excursion_id));
        setPayments(getPaymentsByPassenger(p.id));
        setReceipts(getReceipts().filter(r => r.passenger_id === p.id));
      }
    }
  }, [token]);

  const handleUploadReceipt = (paymentId: string) => {
    if (!file || !passenger || !excursion) return;

    saveReceipt({
      payment_id: paymentId,
      passenger_id: passenger.id,
      excursion_id: excursion.id,
      storage_path: `receipts/${passenger.id}/${file.name}`,
      file_name: file.name,
      file_type: file.type || 'image/png',
      file_size: file.size,
      uploaded_by: passenger.full_name,
      review_status: 'pending'
    });

    setUploadSuccess(true);
    setFile(null);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  if (!passenger || !excursion) {
    return (
      <div className="min-h-screen bg-jornada-ivory flex justify-center items-center p-4">
        <Card className="max-w-md text-center p-8">
          <LogoHorizontal size="md" className="justify-center mb-4" />
          <h2 className="font-heading font-bold text-lg text-jornada-navy">Consulta não encontrada</h2>
          <p className="font-body text-xs text-jornada-muted mt-1">
            Verifique o código informado pelo organizador da excursão.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jornada-ivory py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-center">
          <LogoHorizontal size="lg" />
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <ChurchBrandHeader churchName={church?.name} churchLogo={church?.logo_url} />

          <div className="border-b border-jornada-border pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-heading text-xs text-jornada-muted block">Passageiro</span>
                <h1 className="font-heading font-extrabold text-xl text-jornada-navy">{passenger.full_name}</h1>
              </div>
              <Badge status={passenger.status} />
            </div>

            <div className="mt-3 font-body text-xs text-jornada-muted space-y-1">
              <div>Excursão: <strong className="text-jornada-navy">{excursion.name}</strong> ({excursion.destination})</div>
              <div>Embarque: <strong className="text-jornada-navy">{passenger.pickup_location}</strong></div>
              <div>Data da Viagem: <strong className="text-jornada-navy">{new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</strong></div>
            </div>
          </div>

          {/* Dados para Pagamento Pix */}
          {church?.pix_key && (
            <div className="p-4 bg-jornada-ivory rounded-xl border border-jornada-border space-y-2">
              <span className="font-heading text-xs font-bold text-jornada-navy block">Chave Pix para Pagamento</span>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-jornada-border/80">
                <code className="font-heading text-xs font-bold text-jornada-navy select-all">{church.pix_key}</code>
                <span className="text-[10px] font-body text-jornada-muted">{church.pix_favored}</span>
              </div>
            </div>
          )}

          {/* Situação dos Pagamentos */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-jornada-navy">Situação dos Pagamentos</h3>

            {payments.map(pay => (
              <div key={pay.id} className="p-4 bg-white rounded-xl border border-jornada-border/80 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-heading font-bold text-base text-jornada-green">R$ {pay.amount.toFixed(2)}</span>
                    <span className="font-body text-xs text-jornada-muted block">Vencimento: {pay.due_date ? new Date(pay.due_date).toLocaleDateString('pt-BR') : 'A definir'}</span>
                  </div>
                  <Badge status={pay.status} />
                </div>

                {/* Upload de Comprovante */}
                {pay.status !== 'pago' && (
                  <div className="pt-3 border-t border-jornada-border/60 space-y-2">
                    <label className="font-heading text-xs font-semibold text-jornada-navy block">
                      Anexar Comprovante de Pagamento (Pix / Transferência)
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="text-xs font-body text-jornada-navy file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-heading file:bg-jornada-navy file:text-white"
                      />
                      {file && (
                        <Button
                          variant="accent"
                          size="sm"
                          icon={<Upload className="w-3.5 h-3.5" />}
                          onClick={() => handleUploadReceipt(pay.id)}
                        >
                          Enviar Comprovante
                        </Button>
                      )}
                    </div>

                    {uploadSuccess && (
                      <span className="font-body text-xs text-jornada-green font-semibold block">
                        Comprovante enviado! Aguardando análise da organização.
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

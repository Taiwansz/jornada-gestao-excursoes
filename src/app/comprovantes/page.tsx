'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Clock, 
  AlertTriangle,
  ZoomIn,
  FileText,
  UserCheck
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

import { 
  getReceipts, 
  getPassengers, 
  getExcursions, 
  getPayments, 
  reviewReceipt, 
  deleteReceipt,
  getCurrentUser 
} from '@/lib/store';

import { PaymentReceipt, Passenger, Excursion, Payment } from '@/types';

export default function ReceiptsAnalysisPage() {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [statusFilter, setStatusFilter] = useState('pending');
  const [excursionFilter, setExcursionFilter] = useState('all');

  // Modal de Análise
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReceipts(getReceipts());
    setPassengers(getPassengers());
    setExcursions(getExcursions());
    setPayments(getPayments());
  };

  const handleApprove = (receiptId: string) => {
    const user = getCurrentUser();
    reviewReceipt(receiptId, 'approved', undefined, user?.full_name || 'Financeiro');
    setSelectedReceipt(null);
    loadData();
  };

  const handleReject = (receiptId: string) => {
    if (!rejectReason.trim()) {
      setRejectionError('É obrigatório informar uma observação para a rejeição do comprovante.');
      return;
    }

    const user = getCurrentUser();
    reviewReceipt(receiptId, 'rejected', rejectReason, user?.full_name || 'Financeiro');
    setSelectedReceipt(null);
    setRejectReason('');
    setRejectionError('');
    loadData();
  };

  const filteredReceipts = receipts.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.review_status === statusFilter;
    const matchesExcursion = excursionFilter === 'all' || r.excursion_id === excursionFilter;
    return matchesStatus && matchesExcursion;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Análise e Galeria de Comprovantes
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Validação de comprovantes de Pix e transferências enviados pelos passageiros ou organizadores.
          </p>
        </div>

        <Badge variant="warning" size="md">
          {receipts.filter(r => r.review_status === 'pending').length} pendente(s) de análise
        </Badge>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-60">
          <Select
            label="Situação da Análise"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Aguardando Análise (Pendentes)', value: 'pending' },
              { label: 'Aprovados', value: 'approved' },
              { label: 'Rejeitados', value: 'rejected' },
              { label: 'Todos os Comprovantes', value: 'all' }
            ]}
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            label="Excursão"
            value={excursionFilter}
            onChange={(e) => setExcursionFilter(e.target.value)}
            options={[
              { label: 'Todas as Excursões', value: 'all' },
              ...excursions.map(e => ({ label: e.name, value: e.id }))
            ]}
          />
        </div>
      </div>

      {/* Lista / Galeria */}
      {filteredReceipts.length === 0 ? (
        <EmptyState
          icon={<FileCheck className="w-8 h-8 text-jornada-terracotta" />}
          title="Nenhum comprovante encontrado"
          description="Nenhum registro corresponde aos filtros selecionados."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceipts.map(r => {
            const passenger = passengers.find(p => p.id === r.passenger_id);
            const excursion = excursions.find(e => e.id === r.excursion_id);
            const payment = payments.find(p => p.id === r.payment_id);

            return (
              <Card key={r.id} padding="sm" className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-heading font-bold text-sm text-jornada-navy block">
                      {passenger?.full_name || 'Passageiro'}
                    </span>
                    <span className="font-body text-xs text-jornada-muted block">
                      {excursion?.name}
                    </span>
                  </div>
                  <Badge status={r.review_status} />
                </div>

                <div className="p-3 bg-jornada-ivory/60 rounded-lg border border-jornada-border/60 text-xs font-body space-y-1">
                  <div className="flex justify-between">
                    <span>Valor do Pagamento:</span>
                    <strong className="text-jornada-green font-heading">R$ {payment?.amount.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Data do Envio:</span>
                    <span className="text-jornada-navy">{new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arquivo:</span>
                    <span className="text-jornada-muted truncate max-w-[120px]">{r.file_name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-jornada-border/60">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedReceipt(r);
                      setRejectReason('');
                      setRejectionError('');
                    }}
                  >
                    Analisar Comprovante
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Análise Detalhada */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Análise de Comprovante"
          subtitle="Confira o arquivo e valide o recebimento do pagamento."
          maxWidth="xl"
        >
          <div className="space-y-5">
            {/* Visualizador Simulado de Arquivo/Imagem */}
            <div className="p-6 bg-jornada-navy/5 rounded-xl border border-jornada-border flex flex-col items-center justify-center min-h-[220px]">
              <FileText className="w-12 h-12 text-jornada-navy/40 mb-2" />
              <span className="font-heading font-bold text-sm text-jornada-navy">{selectedReceipt.file_name}</span>
              <span className="font-body text-xs text-jornada-muted">
                Tamanho: {(selectedReceipt.file_size / 1024).toFixed(1)} KB • Formato: {selectedReceipt.file_type}
              </span>
              <div className="mt-3">
                <Badge status={selectedReceipt.review_status} />
              </div>
            </div>

            {rejectionError && (
              <div className="p-3 bg-jornada-red/10 border border-jornada-red/20 text-jornada-red text-xs font-body rounded-lg">
                {rejectionError}
              </div>
            )}

            {/* Campo de Observação para Rejeição */}
            <div>
              <Input
                label="Observação / Motivo (Obrigatório em caso de Rejeição)"
                placeholder="Ex: Valor incorreto no comprovante ou imagem ilegível..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>

            {/* Ações */}
            <div className="flex justify-between items-center pt-4 border-t border-jornada-border">
              <Button
                variant="danger"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => handleReject(selectedReceipt.id)}
              >
                Rejeitar Comprovante
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSelectedReceipt(null)}>
                  Fechar
                </Button>
                <Button
                  variant="success"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleApprove(selectedReceipt.id)}
                >
                  Aprovar Pagamento
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

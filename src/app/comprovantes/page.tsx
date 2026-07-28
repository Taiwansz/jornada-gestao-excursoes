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
  UserCheck,
  ExternalLink
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
  getCurrentUser,
  createReceiptImageDataUrl
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

  // Função para baixar exatamente o arquivo anexado pelo usuário (PNG, JPG, PDF)
  const handleDownloadOrView = (receipt: PaymentReceipt) => {
    let fileUrl = receipt.storage_path;

    // Se não for um Data URL ou link direto, gerar a imagem real do comprovante em Data URL
    if (!fileUrl || (!fileUrl.startsWith('data:') && !fileUrl.startsWith('http') && !fileUrl.startsWith('blob:'))) {
      fileUrl = createReceiptImageDataUrl(
        receipt.file_name,
        receipt.uploaded_by,
        120,
        new Date(receipt.created_at).toLocaleDateString('pt-BR')
      );
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = receipt.file_name || `comprovante-${receipt.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

            const fileDataUrl = (r.storage_path && (r.storage_path.startsWith('data:') || r.storage_path.startsWith('http'))) 
              ? r.storage_path 
              : createReceiptImageDataUrl(r.file_name, r.uploaded_by, payment?.amount || 120, new Date(r.created_at).toLocaleDateString('pt-BR'));

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

                {/* Pré-visualização de Imagem */}
                <div className="relative h-36 bg-jornada-ivory/80 rounded-xl border border-jornada-border/80 overflow-hidden flex items-center justify-center">
                  {r.file_type.includes('pdf') ? (
                    <div className="text-center p-4">
                      <FileText className="w-10 h-10 text-jornada-navy mx-auto mb-1" />
                      <span className="font-heading text-xs font-bold text-jornada-navy block truncate max-w-[180px]">{r.file_name}</span>
                    </div>
                  ) : (
                    <img 
                      src={fileDataUrl} 
                      alt={r.file_name}
                      className="w-full h-full object-contain p-1"
                    />
                  )}
                </div>

                <div className="p-2.5 bg-jornada-ivory/60 rounded-lg border border-jornada-border/60 text-xs font-body space-y-1">
                  <div className="flex justify-between">
                    <span>Valor do Pagamento:</span>
                    <strong className="text-jornada-green font-heading">R$ {payment?.amount ? payment.amount.toFixed(2) : '120.00'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Data do Envio:</span>
                    <span className="text-jornada-navy">{new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-jornada-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleDownloadOrView(r)}
                  >
                    Baixar
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedReceipt(r);
                      setRejectReason('');
                      setRejectionError('');
                    }}
                  >
                    Analisar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Análise Detalhada */}
      {selectedReceipt && (() => {
        const previewUrl = (selectedReceipt.storage_path && (selectedReceipt.storage_path.startsWith('data:') || selectedReceipt.storage_path.startsWith('http')))
          ? selectedReceipt.storage_path
          : createReceiptImageDataUrl(selectedReceipt.file_name, selectedReceipt.uploaded_by, 120, new Date(selectedReceipt.created_at).toLocaleDateString('pt-BR'));

        return (
          <Modal
            isOpen={!!selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            title="Análise de Comprovante"
            subtitle="Confira o arquivo anexado e valide o recebimento do pagamento."
            maxWidth="xl"
          >
            <div className="space-y-5">
              {/* Visualizador do Arquivo Anexado */}
              <div className="p-4 bg-jornada-navy/5 rounded-xl border border-jornada-border flex flex-col items-center justify-center min-h-[260px] max-h-[400px] overflow-hidden">
                {selectedReceipt.file_type.includes('pdf') ? (
                  <iframe src={previewUrl} className="w-full h-72 rounded-lg border" />
                ) : (
                  <img 
                    src={previewUrl} 
                    alt={selectedReceipt.file_name}
                    className="max-h-[300px] object-contain rounded-lg shadow-sm border border-jornada-border" 
                  />
                )}

                <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-jornada-border/60">
                  <span className="font-heading font-bold text-xs text-jornada-navy truncate max-w-[250px]">
                    {selectedReceipt.file_name}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => handleDownloadOrView(selectedReceipt)}
                    >
                      Baixar Arquivo Original
                    </Button>
                    <Badge status={selectedReceipt.review_status} />
                  </div>
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-jornada-border">
                <Button
                  variant="danger"
                  className="w-full sm:w-auto"
                  icon={<XCircle className="w-4 h-4" />}
                  onClick={() => handleReject(selectedReceipt.id)}
                >
                  Rejeitar Comprovante
                </Button>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
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
        );
      })()}
    </div>
  );
}
